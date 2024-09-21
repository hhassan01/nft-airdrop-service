import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MoralisService } from '../moralis/moralis.service';
import { ConfigModule } from '@nestjs/config';

const mockUserRepository = {
  findOneBy: jest.fn(),
};

const mockMoralisService = {
  getWalletNFTs: jest.fn(),
};

const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockUserRepository),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        UserService,
        { provide: 'USERS_SOURCE', useValue: mockDataSource },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: MoralisService, useValue: mockMoralisService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUserByWalletAddress', () => {
    it('should return a user by wallet address', async () => {
      const user = { id: '1', walletAddress: '0x1234' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await userService.getUserByWalletAddress('0x1234');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await userService.getUserByWalletAddress('0x1234');
      expect(result).toBeNull();
    });
  });

  describe('getUserHoldings', () => {
    it('should return NFT holdings for a user', async () => {
      const nfts = [
        { contractAddress: '0xabc', tokenId: '1', balance: 1 },
        { contractAddress: '0xdef', tokenId: '2', balance: 2 },
      ];

      mockMoralisService.getWalletNFTs.mockResolvedValue(nfts);

      const result = await userService.getUserHoldings('0x1234');
      expect(result).toEqual({
        userAddress: '0x1234',
        nfts,
        nftCount: nfts.length,
        totalBalance: 3,
      });
    });

    it('should return empty holdings if no NFTs found', async () => {
      mockMoralisService.getWalletNFTs.mockResolvedValue([]);

      const result = await userService.getUserHoldings('0x1234');
      expect(result).toEqual({
        userAddress: '0x1234',
        nfts: [],
        nftCount: 0,
        totalBalance: 0,
      });
    });
  });
});
