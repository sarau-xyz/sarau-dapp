import { ethers } from "ethers";
import { createContext, useContext } from "react";
import { ISarauMakerData } from "../providers/SarauMakerProvider";

type SarauMakerContextProps = {
  readContract: ethers.Contract | null;
  writeContract: ethers.Contract | null;
  data: ISarauMakerData;
  updateCeloPrice: () => void;
};

export const SarauMakerContext = createContext({} as SarauMakerContextProps);

export const useSarauMaker = () => {
  const ctx = useContext(SarauMakerContext);

  return ctx;
};
