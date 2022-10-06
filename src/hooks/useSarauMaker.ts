import { useMemo } from "react";
import { useAccount, useContract } from "wagmi";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARA_MAKER_ADDRESSES";
import { abi } from "../static/abis/SarauMaker.json";

export const useSarauMaker = () => {
  const { isConnected, connector } = useAccount();

  const sarauMaker = useMemo(() => {
    if (connector && SARAU_MAKER_ADDRESSES[connector.id]) {
      return useContract({
        addressOrName: SARAU_MAKER_ADDRESSES[connector.id],
        contractInterface: abi,
      });
    }
    return null;
  }, [isConnected, connector]);

  return sarauMaker;
};
