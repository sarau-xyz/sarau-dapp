import { Chain } from "wagmi";

export const CUSTOM_CHAINS: {
  [chain: string]: Chain;
} = {
  alfajores: {
    id: 44787,
    name: "Celo (Alfajores Testnet)",
    network: "alfajores",
    nativeCurrency: {
      decimals: 18,
      name: "Celo",
      symbol: "CELO",
    },
    rpcUrls: {
      // default: "https://celo-hackathon.lavanet.xyz/celo-alfajores/http",
      default: "https://alfajores-forno.celo-testnet.org/",
    },
    blockExplorers: {
      default: { name: "CeloScan", url: "https://alfajores.celoscan.io/" },
    },
    testnet: true,
  },
  celo: {
    id: 42220,
    name: "Celo (Mainnet)",
    network: "celo",
    nativeCurrency: {
      decimals: 18,
      name: "Celo",
      symbol: "CELO",
    },
    rpcUrls: {
      // default: "https://celo-hackathon.lavanet.xyz/celo/http",
      default: "https://forno.celo.org/",
    },
    blockExplorers: {
      default: { name: "CeloScan", url: "https://celoscan.io/" },
    },
    testnet: false,
  },
};

export const DEFAULT_CHAIN_ID = CUSTOM_CHAINS.alfajores.id;