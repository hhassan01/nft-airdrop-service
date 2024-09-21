import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Contract } from 'ethers';
import { AirdropService } from './airdrop.service';

jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers');
  return {
    ...originalModule,
    Contract: jest.fn().mockImplementation(() => ({
      transfer: jest.fn().mockResolvedValue({ wait: jest.fn() }),
      balanceOf: jest.fn().mockResolvedValue(BigInt('100000000000000000000')),
    })),
    Wallet: jest.fn().mockImplementation(() => ({})),
    JsonRpcProvider: jest.fn().mockImplementation(() => ({})),
  };
});

describe('AirdropService', () => {
  let service: AirdropService;
  let contract: Contract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirdropService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'ETHEREUM_RPC_URL':
                  return 'http://localhost:8545';
                case 'WALLET_PRIVATE_KEY':
                  return '0x123';
                case 'ERC20_CONTRACT_ADDRESS':
                  return '0x456';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AirdropService>(AirdropService);
    contract = service['erc20Contract'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should airdrop tokens successfully', async () => {
    const walletAddress = '0x789';
    const txResult = await service.airdropTokens(walletAddress);
    expect(contract.transfer).toHaveBeenCalledWith(
      walletAddress,
      expect.any(BigInt),
    );
    expect(txResult).toBe(`Airdropped 100 tokens to ${walletAddress}`);
  });

  it('should throw an error if insufficient balance', async () => {
    jest.spyOn(service, 'getWalletBalance').mockResolvedValueOnce('99');

    await expect(service.airdropTokens('0x789')).rejects.toThrow(
      'Insufficient tokens in the wallet to perform the airdrop.',
    );
  });

  it('should get wallet balance', async () => {
    const balance = await service.getWalletBalance('0x123');
    expect(balance).toBe('100.0');
  });
});
