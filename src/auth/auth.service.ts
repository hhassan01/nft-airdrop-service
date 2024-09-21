import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { UserService } from '../users/users.service';
import { SignatureInput } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  verifySignature({
    message,
    domain,
    types,
    signature,
    expectedWallet,
  }: SignatureInput): boolean {
    const recoveredAddress = ethers.verifyTypedData(
      domain,
      types,
      message,
      signature,
    );
    return recoveredAddress.toLowerCase() === expectedWallet.toLowerCase();
  }

  async isUserInDatabase(walletAddress: string): Promise<boolean> {
    const user = await this.userService.getUserByWalletAddress(walletAddress);

    return !!user;
  }
}
