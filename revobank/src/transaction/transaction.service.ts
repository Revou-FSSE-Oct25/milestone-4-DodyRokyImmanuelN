import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // cek kepemilikan akun
  private async verifyAccountOwnership(accountId: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('Access denied');
    return account;
  }

  async deposit(userId: string, dto: DepositDto) {
    const account = await this.verifyAccountOwnership(dto.accountId, userId);

    // Prisma transaction 
    const [updatedAccount, transaction] = await this.prisma.$transaction([
      // Update balance
      this.prisma.account.update({
        where: { id: dto.accountId },
        data: { balance: { increment: dto.amount } },
      }),
      // Catat transaksi
      this.prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          amount: dto.amount,
          description: dto.description,
          toAccountId: dto.accountId,
        },
      }),
    ]);

    return {
      message: 'Deposit successful',
      newBalance: updatedAccount.balance,
      transaction,
    };
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const account = await this.verifyAccountOwnership(dto.accountId, userId);

    // Cek saldo cukup
    if (account.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const [updatedAccount, transaction] = await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: dto.accountId },
        data: { balance: { decrement: dto.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          amount: dto.amount,
          description: dto.description,
          fromAccountId: dto.accountId,
        },
      }),
    ]);

    return {
      message: 'Withdrawal successful',
      newBalance: updatedAccount.balance,
      transaction,
    };
  }

  async transfer(userId: string, dto: TransferDto) {
    // Validasi account 
    const fromAccount = await this.verifyAccountOwnership(dto.fromAccountId, userId);

    // Validasi account penerima ada atau tidak
    const toAccount = await this.prisma.account.findUnique({
      where: { id: dto.toAccountId },
    });
    if (!toAccount) throw new NotFoundException('Destination account not found');

    // Tidak boleh transfer ke account sendiri
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    // Cek saldo cukup
    if (fromAccount.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const [, , transaction] = await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: dto.fromAccountId },
        data: { balance: { decrement: dto.amount } },
      }),
      this.prisma.account.update({
        where: { id: dto.toAccountId },
        data: { balance: { increment: dto.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'TRANSFER',
          amount: dto.amount,
          description: dto.description,
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
        },
      }),
    ]);

    return {
      message: 'Transfer successful',
      transaction,
    };
  }

  async findAll(userId: string) {
    // Ambil semua transaksi yang berkaitan dengan account milik user ini
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: { in: accountIds } },
          { toAccountId: { in: accountIds } },
        ],
      },
      include: {
        fromAccount: { select: { accountNumber: true } },
        toAccount: { select: { accountNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, transactionId: string) {
    const userAccounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = userAccounts.map((a) => a.id);

    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        OR: [
          { fromAccountId: { in: accountIds } },
          { toAccountId: { in: accountIds } },
        ],
      },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }
}