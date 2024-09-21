import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';
import { NftOwnershipGuard } from 'src/auth/guards/nftOwnership.guard';
import { MoralisService } from 'src/moralis/moralis.service';

@Module({
  controllers: [AirdropController],
  providers: [AirdropService, NftOwnershipGuard, MoralisService],
})
export class AirdropModule {}
