export interface NftHolding {
  contractAddress: string;
  tokenId: string | number;
  balance: number;
}

export type nftHoldings = {
  userAddress: string;
  nfts: NftHolding[];
  nftCount: number;
  totalBalance: number;
};
