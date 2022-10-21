import { useState } from "react";
import { DEFAULT_CHAIN_ID } from "../constants/CUSTOM_CHAINS";
import { ChainIdContext } from "../hooks/useChainId";

export const ChainIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);

  return (
    <ChainIdContext.Provider value={{ chainId, setChainId }}>
      {children}
    </ChainIdContext.Provider>
  );
};
