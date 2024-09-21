import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { SignatureGuard } from '../auth/guards/signature.guard';
import { AuthService } from '../auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { ExecutionContext, BadRequestException } from '@nestjs/common';

const mockUserService = {
  getUserHoldings: jest.fn(),
};

const mockAuthService = {
  verifySignature: jest.fn(),
  isUserInDatabase: jest.fn(),
};

const createMockSignatureGuard = (shouldAddWalletAddress = true) => ({
  canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (shouldAddWalletAddress) {
      request['_signatureGuardData'] = { walletAddress: '0x1234' };
    }
    return true;
  }),
});

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(SignatureGuard)
      .useValue(createMockSignatureGuard())
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('userHoldings', () => {
    it('should return NFT holdings for a user', async () => {
      const nfts = [
        { contractAddress: '0xabc', tokenId: '1', balance: 1 },
        { contractAddress: '0xdef', tokenId: '2', balance: 2 },
      ];

      const expectedResponse = {
        userAddress: '0x1234',
        nfts,
        nftCount: nfts.length,
        totalBalance: 3,
      };

      mockUserService.getUserHoldings.mockResolvedValue(expectedResponse);

      const request: any = {
        _signatureGuardData: { walletAddress: '0x1234' },
      };

      const result = await controller.userHoldings(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if walletAddress is not found in request', async () => {
      // Override guard to not add walletAddress to the request
      const module: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true })],
        controllers: [UserController],
        providers: [
          { provide: UserService, useValue: mockUserService },
          { provide: AuthService, useValue: mockAuthService },
        ],
      })
        .overrideGuard(SignatureGuard)
        .useValue(createMockSignatureGuard(false))
        .compile();

      const controller = module.get<UserController>(UserController);

      const request: any = {};

      await expect(controller.userHoldings(request)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
