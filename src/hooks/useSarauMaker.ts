import { ethers } from "ethers";
import { useMemo } from "react";
import { useSigner } from "wagmi";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARA_MAKER_ADDRESSES";
import abi from "../static/abis/SarauMaker.json";
import { useChainId } from "./useChainId";
import { WrapperBuilder } from "redstone-evm-connector";

export const useSarauMaker = () => {
  const { data: signer } = useSigner();
  const chainId = useChainId();

  // const sarauMaker = useContract({addressOrName: SARAU_MAKER_ADDRESSES[connector.id], contractInterface: abi.abi})

  const sarauMaker = useMemo(() => {
    // console.log(chainId);
    if (chainId && signer && SARAU_MAKER_ADDRESSES[chainId]) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, signer)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, signer]);

  return sarauMaker;
};
