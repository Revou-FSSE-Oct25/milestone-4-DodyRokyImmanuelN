import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank account' })
  create(@CurrentUser() user: any, @Body() dto: CreateAccountDto) {
    return this.accountService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all accounts for current user' })
  findAll(@CurrentUser() user: any) {
    return this.accountService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific account by ID' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.accountService.remove(user.id, id);
  }
}