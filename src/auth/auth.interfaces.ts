import { TypedDataDomain, TypedDataField } from 'ethers';

export interface SignatureInput {
  message: Record<string, any>;
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  signature: string;
  expectedWallet: string;
}
