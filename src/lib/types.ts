export interface Token {
  symbol: string;
  name: string;
  address: string;
  chainKey: string;
  decimals: number;
  isBridgeable: boolean;
  price?: {
    usd: number;
  };
}

export interface Chain {
  chainKey: string;
  chainId: number;
  chainType: string;
  name: string;
  shortName: string;
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: number;
  };
}

export interface BridgeRoute {
  token: Token;
  destinationChain: Chain;
}

export interface GroupedToken {
  symbol: string;
  name: string;
  chains: {
    chainKey: string;
    address: string;
    decimals: number;
  }[];
}
