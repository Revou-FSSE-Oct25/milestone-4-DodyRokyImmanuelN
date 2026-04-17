import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 'account-id-here' })
  @IsString()
  accountId!: string;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Setoran tunai' })
  @IsOptional()
  @IsString()
  description?: string;
}