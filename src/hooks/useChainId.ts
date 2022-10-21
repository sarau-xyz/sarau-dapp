import { useMemo } from "react";
import { useNetwork } from "wagmi";

export const useChainId = () => {
  const { chain, chains } = useNetwork();

  const chainId = useMemo(() => {
    console.log(chain, "chain");
    console.log(chains, "chains");
    return 44787; // todo get this from context
  }, [chain]);

  return chainId;
};
