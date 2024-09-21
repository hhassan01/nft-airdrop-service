import {
  Controller,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { SignatureGuard } from './guards/signature.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/signature')
  @UseGuards(SignatureGuard)
  async authorizeSignature(@Req() request: Request): Promise<User> {
    const guardData = request['_signatureGuardData'];

    const user = await this.userService.getUserByWalletAddress(
      guardData.walletAddress, // should have put a safe calling here. or fallback value for guardData above
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
