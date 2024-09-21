import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { nftHoldings } from './users.interfaces';
import { MoralisService } from '../moralis/moralis.service';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor(
    @Inject('USERS_SOURCE') private dataSource: DataSource,
    private moralisService: MoralisService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  public async getUser(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  public async getUserByWalletAddress(walletAddress: string): Promise<User> {
    return this.userRepository.findOneBy({ walletAddress });
  }

  public async getUserHoldings(walletAddress: string): Promise<nftHoldings> {
    const nfts = await this.moralisService.getWalletNFTs(walletAddress);
    const totalBalance = nfts.reduce((sum, nft) => sum + nft.balance, 0);

    return {
      userAddress: walletAddress,
      nfts,
      nftCount: nfts.length,
      totalBalance,
    };
  }
}
