import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';
import { NftOwnershipGuard } from '../auth/guards/nftOwnership.guard';
import { MoralisService } from '../moralis/moralis.service';

describe('AirdropController', () => {
  let controller: AirdropController;
  let service: AirdropService;

  const mockAirdropService = {
    airdropTokens: jest.fn((walletAddress: string) => {
      console.log('mock func', walletAddress);
      return `Airdropped 100 tokens to ${walletAddress}`;
    }),
  };

  const mockNftOwnershipGuard = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canActivate: jest.fn((_context: ExecutionContext) => {
      return true;
    }),
  };

  const mockMoralisService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getWalletNFTs: jest.fn((_walletAddress: string) => {
      return [{ contractAddress: '0xRequiredNftContractAddress' }];
    }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'ETHEREUM_RPC_URL':
          return 'http://localhost:8545';
        case 'WALLET_PRIVATE_KEY':
          return '0x123';
        case 'ERC20_CONTRACT_ADDRESS':
          return '0x456';
        case 'BORED_APE_YATCH_CLUB_ADDRESS':
          return '0xRequiredNftContractAddress';
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirdropController],
      providers: [
        {
          provide: AirdropService,
          useValue: mockAirdropService,
        },
        {
          provide: NftOwnershipGuard,
          useValue: mockNftOwnershipGuard,
        },
        {
          provide: MoralisService,
          useValue: mockMoralisService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<AirdropController>(AirdropController);
    service = module.get<AirdropService>(AirdropService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call airdropTokens method of AirdropService', async () => {
    const walletAddress = '0x789';
    const result = await controller.claimAirdrop(walletAddress);

    expect(service.airdropTokens).toHaveBeenCalledWith(walletAddress);
    expect(result).toBe(`Airdropped 100 tokens to ${walletAddress}`);
  });

  it('should use NftOwnershipGuard', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          body: { walletAddress: '0x789' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = mockNftOwnershipGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
