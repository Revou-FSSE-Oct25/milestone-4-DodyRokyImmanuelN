import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ example: 'account-id-here' })
  @IsString()
  accountId!: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Penarikan ATM' })
  @IsOptional()
  @IsString()
  description?: string;
}