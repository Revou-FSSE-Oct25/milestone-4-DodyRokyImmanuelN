import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({ example: 'from-account-id' })
  @IsString()
  fromAccountId!: string;

  @ApiProperty({ example: 'to-account-id' })
  @IsString()
  toAccountId!: string;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Transfer ke teman' })
  @IsOptional()
  @IsString()
  description?: string;
}