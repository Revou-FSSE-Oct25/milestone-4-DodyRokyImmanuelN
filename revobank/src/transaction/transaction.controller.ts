import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit money to account' })
  deposit(@CurrentUser() user: any, @Body() dto: DepositDto) {
    return this.transactionService.deposit(user.id, dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw money from account' })
  withdraw(@CurrentUser() user: any, @Body() dto: WithdrawDto) {
    return this.transactionService.withdraw(user.id, dto);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money between accounts' })
  transfer(@CurrentUser() user: any, @Body() dto: TransferDto) {
    return this.transactionService.transfer(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for current user' })
  findAll(@CurrentUser() user: any) {
    return this.transactionService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific transaction detail' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.transactionService.findOne(user.id, id);
  }
}