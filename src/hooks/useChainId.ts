import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useChainId = () => {
  const { connector } = useAccount();
  const [chainId, setChainId] = useState(0);

  useEffect(() => {
    if (connector) {
      connector.getChainId().then((res) => setChainId(res));
    }
  }, [connector]);

  return chainId;
};
