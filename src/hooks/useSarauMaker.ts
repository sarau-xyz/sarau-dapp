import { ethers } from "ethers";
import { useMemo } from "react";
import { useProvider, useSigner } from "wagmi";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARAU_MAKER_ADDRESSES";
import abi from "../static/abis/SarauMaker.json";
import { useChainId } from "./useChainId";
import { WrapperBuilder } from "redstone-evm-connector";

export const useSarauMaker = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { chainId } = useChainId();

  const writeContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId] && signer) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, signer)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, signer, provider]);

  const readContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId]) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, provider)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, signer, provider]);

  return { readContract, writeContract };
};
