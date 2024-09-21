import { Injectable } from '@nestjs/common';
import { Contract, ethers, JsonRpcProvider, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';
import erc20Abi from '../../abi/erc20.json';

@Injectable()
export class AirdropService {
  private readonly provider: JsonRpcProvider;
  private readonly wallet: Wallet;
  private readonly erc20Contract: Contract;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('ETHEREUM_RPC_URL');
    const privateKey = this.configService.get<string>('WALLET_PRIVATE_KEY');
    const erc20ContractAddress = this.configService.get<string>(
      'ERC20_CONTRACT_ADDRESS',
    );

    this.provider = new JsonRpcProvider(rpcUrl);
    this.wallet = new Wallet(privateKey, this.provider);
    this.erc20Contract = new Contract(
      erc20ContractAddress,
      erc20Abi,
      this.wallet,
    );
  }

  async airdropTokens(walletAddress: string): Promise<string> {
    const balance = await this.getWalletBalance(this.wallet.address);
    console.log(`Wallet balance: ${balance} tokens`);

    if (parseFloat(balance) < 100) {
      throw new Error(
        'Insufficient tokens in the wallet to perform the airdrop.',
      );
    }

    const tx = await this.erc20Contract.transfer(
      walletAddress,
      ethers.parseUnits('100', 18),
    );
    await tx?.wait();

    return `Airdropped 100 tokens to ${walletAddress}`;
  }

  async getWalletBalance(walletAddress: string): Promise<string> {
    const balance = await this.erc20Contract.balanceOf(walletAddress);
    return ethers.formatUnits(balance, 18);
  }
}
