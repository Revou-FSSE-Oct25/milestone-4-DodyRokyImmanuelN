import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  account: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('withdraw', () => {
    it('should throw BadRequestException if balance is insufficient', async () => {
      mockPrismaService.account.findUnique.mockResolvedValue({
        id: 'acc1', userId: 'user1', balance: 100,
      });

      await expect(
        service.withdraw('user1', { accountId: 'acc1', amount: 500 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('transfer', () => {
    it('should throw BadRequestException if transferring to same account', async () => {
      mockPrismaService.account.findUnique.mockResolvedValue({
        id: 'acc1', userId: 'user1', balance: 1000,
      });

      await expect(
        service.transfer('user1', {
          fromAccountId: 'acc1',
          toAccountId: 'acc1',
          amount: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});