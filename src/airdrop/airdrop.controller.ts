import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AirdropService } from './airdrop.service';
import { NftOwnershipGuard } from '../auth/guards/nftOwnership.guard';

@Controller('airdrop')
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  @Post('/claim')
  @UseGuards(NftOwnershipGuard)
  async claimAirdrop(
    @Body('validatedWalletAddress') walletAddress: string,
  ): Promise<string> {
    return this.airdropService.airdropTokens(walletAddress);
  }
}
