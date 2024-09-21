import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '../entities/user.entity';
import { nftHoldings } from './users.interfaces';
import { SignatureGuard } from '../auth/guards/signature.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post('/nfts')
  @UseGuards(SignatureGuard)
  async userHoldings(@Req() request: Request): Promise<nftHoldings> {
    const walletAddress = request['_signatureGuardData']?.walletAddress;
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is missing');
    }

    return this.userService.getUserHoldings(walletAddress);
  }
}
