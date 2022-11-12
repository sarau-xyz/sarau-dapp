import { CallReturnContext } from "ethereum-multicall";
import { ethers } from "ethers";

export const parseMultiCall = <T = any>(
  callsReturnContext: CallReturnContext[]
) => {
  const data = {} as T;

  callsReturnContext.forEach((res) => {
    data[res.reference as keyof T] = Array.isArray(res.returnValues)
      ? res.returnValues[0].type === "BigNumber"
        ? ethers.BigNumber.from(res.returnValues[0])
        : res.returnValues[0]
      : res.returnValues;
  });

  return data;
};
