import { Test, TestingModule } from '@nestjs/testing';
import { TypedDataDomain, TypedDataField } from 'ethers';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { UserModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByWalletAddress: jest.fn().mockResolvedValue({
              wallet_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should verify the signature correctly', () => {
    const message = { contents: 'Enter your MML space here!' };
    const domain: TypedDataDomain = {
      name: 'Airdrops!',
      version: '1',
      chainId: 11155111,
    };
    const types: Record<string, TypedDataField[]> = {
      Message: [{ name: 'contents', type: 'string' }],
    };
    const signature =
      '0x510b43199699994167271a76d28c21b996e7679d7eec51245328502b3e8df26b719f7672f1cf521f87d97f7b6ebb6585c7794af38863954f56302d05986fe5291b';
    const expectedWallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

    const result = service.verifySignature({
      message,
      domain,
      types,
      signature,
      expectedWallet,
    });
    expect(result).toBe(true);
  });

  it('should check if user is in database', async () => {
    const walletAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const result = await service.isUserInDatabase(walletAddress);
    expect(result).toBe(true);
  });

  it('should fail to verify the signature with an incorrect signature', () => {
    const message = { contents: 'Enter your MML space here!' };
    const domain: TypedDataDomain = {
      name: 'Airdrops!',
      version: '1',
      chainId: 11155111,
    };
    const types: Record<string, TypedDataField[]> = {
      Message: [{ name: 'contents', type: 'string' }],
    };
    const invalidSignature =
      '0x510b43199699994167271a76d28c21b996e7679d7eec51245328502b3e8df26b719f7672f1cf521f87d97f7b6ebb6585c7794af38863954f56302d05986fe5291c';
    const expectedWallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

    const result = service.verifySignature({
      message,
      domain,
      types,
      signature: invalidSignature,
      expectedWallet,
    });
    expect(result).toBe(false);
  });

  it('should fail to verify the signature with an incorrect wallet address', () => {
    const message = { contents: 'Enter your MML space here!' };
    const domain: TypedDataDomain = {
      name: 'Airdrops!',
      version: '1',
      chainId: 11155111,
    };
    const types: Record<string, TypedDataField[]> = {
      Message: [{ name: 'contents', type: 'string' }],
    };
    const signature =
      '0x510b43199699994167271a76d28c21b996e7679d7eec51245328502b3e8df26b719f7672f1cf521f87d97f7b6ebb6585c7794af38863954f56302d05986fe5291b';
    const incorrectWallet = '0x0000000000000000000000000000000000000000';

    const result = service.verifySignature({
      message,
      domain,
      types,
      signature,
      expectedWallet: incorrectWallet,
    });
    expect(result).toBe(false);
  });
});
