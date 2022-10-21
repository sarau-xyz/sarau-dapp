import { createContext, useContext } from "react";

type ChainIdContextProps = {
  chainId: number;
  setChainId: (num: number) => void;
};

export const ChainIdContext = createContext({} as ChainIdContextProps);

export const useChainId = () => {
  const ctx = useContext(ChainIdContext);

  return ctx;
};
