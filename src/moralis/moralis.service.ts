import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService implements OnModuleInit {
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MORALIS_API_KEY');
  }

  async onModuleInit() {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({ apiKey: this.apiKey });
    }
  }

  // @todo: Add query params (ex. allowed contract adddresses) to make it extendable
  async getWalletNFTs(address: string) {
    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({ address });
      return response.result.map((nft) => ({
        contractAddress: nft.tokenAddress.checksum,
        tokenId: nft.tokenId,
        balance: Number(nft.amount),
      }));
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw new Error('Could not fetch NFTs');
    }
  }
}
