import { Chain } from "wagmi";

type CHAIN_NAME = "alfajores" | "celo";

export const CUSTOM_CHAINS: {
  [chain in CHAIN_NAME]: Chain;
} = {
  // hardhat: {
  //   id: 31337,
  //   name: "Hardhat (Localhost)",
  //   network: "hardhat",
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: "ETH",
  //     symbol: "ETH",
  //   },
  //   rpcUrls: {
  //     default: "http://127.0.0.1:8545",
  //   },
  //   testnet: true,
  // },
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
      default: "https://celo-hackathon.lavanet.xyz/celo/http",
      public: "https://forno.celo.org/",
    },
    blockExplorers: {
      default: { name: "CeloScan", url: "https://celoscan.io/" },
    },
    testnet: false,
  },
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
      default: "https://celo-hackathon.lavanet.xyz/celo-alfajores/http",
      public: "https://alfajores-forno.celo-testnet.org/",
    },
    blockExplorers: {
      default: { name: "CeloScan", url: "https://alfajores.celoscan.io/" },
    },
    testnet: true,
  },
};

export const DEFAULT_CHAIN_ID = CUSTOM_CHAINS.alfajores.id;
