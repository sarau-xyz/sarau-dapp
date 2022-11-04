import { ethers } from "ethers";
import {
  createContext,
  useContext,
} from "react";

type SarauMakerContextProps = {
  readContract: ethers.Contract | null;
  writeContract: ethers.Contract | null;
  getSarauCreationEtherFee: () => void;
  etherFee: ethers.BigNumber;
  usdFee: ethers.BigNumber;
  isAdmin: boolean;
  updateCeloPrice: () => void;
};

export const SarauMakerContext = createContext({} as SarauMakerContextProps);

export const useSarauMaker = () => {
  const ctx = useContext(SarauMakerContext);

  return ctx;
};
