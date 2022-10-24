import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARAU_MAKER_ADDRESSES";
import abi from "../static/abis/SarauMaker.json";
import { useChainId } from "./useChainId";
import { WrapperBuilder } from "redstone-evm-connector";

export const useSarauMaker = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { chainId } = useChainId();
  const [etherFee, setEtherFee] = useState(ethers.BigNumber.from("0"));

  const writeContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId] && signer) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, signer)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, signer]);

  const readContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId]) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, provider)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, provider]);

  const getSarauCreationEtherFee = useCallback(async () => {
    const etherFee =
      (await readContract?.callStatic.creationEtherFee()) as ethers.BigNumber;

    console.log(etherFee, "usdFee");

    setEtherFee(etherFee);
  }, [readContract]);

  useEffect(() => {
    getSarauCreationEtherFee();
  }, [getSarauCreationEtherFee]);

  return { readContract, writeContract, getSarauCreationEtherFee, etherFee };
};
