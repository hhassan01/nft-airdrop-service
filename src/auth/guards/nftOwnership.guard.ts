import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { MoralisService } from '../../moralis/moralis.service';

@Injectable()
export class NftOwnershipGuard implements CanActivate {
  private readonly requiredNftContractAddress: string;

  constructor(
    private readonly moralisService: MoralisService,
    private readonly configService: ConfigService,
  ) {
    this.requiredNftContractAddress = this.configService.get<string>(
      'BORED_APE_YATCH_CLUB_ADDRESS',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const walletAddress = request.body.walletAddress;

    if (!walletAddress) {
      throw new BadRequestException('Wallet address is missing');
    }

    const nfts = await this.moralisService.getWalletNFTs(walletAddress);
    const hasRequiredNFT = nfts.some(
      (nft) => nft.contractAddress === this.requiredNftContractAddress,
    );

    if (!hasRequiredNFT) {
      throw new BadRequestException('User does not have the required NFTs.');
    }

    request.body.validatedWalletAddress = walletAddress;
    return true;
  }
}
