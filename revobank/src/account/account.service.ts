import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

//generate nomor rekening unik
function generateAccountNumber(): string {
  return '8' + Date.now().toString().slice(-9);
}

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAccountDto) {
    const account = await this.prisma.account.create({
      data: {
        accountNumber: generateAccountNumber(),
        type: dto.type,
        currency: dto.currency ?? 'IDR',
        userId,
      },
    });
    return account;
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('Access denied');
    return account;
  }

  async update(userId: string, accountId: string, dto: UpdateAccountDto) {
    await this.findOne(userId, accountId); 
    return this.prisma.account.update({
      where: { id: accountId },
      data: dto,
    });
  }

  async remove(userId: string, accountId: string) {
    await this.findOne(userId, accountId); 
    await this.prisma.account.delete({ where: { id: accountId } });
    return { message: 'Account deleted successfully' };
  }
}