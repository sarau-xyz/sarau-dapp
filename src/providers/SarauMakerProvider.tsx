import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from "ethereum-multicall";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WrapperBuilder } from "redstone-evm-connector";
import { useSigner, useAccount, useProvider, chain } from "wagmi";
import { MULTICALL_ADDRESSES } from "../constants/MULTICALL_ADDRESSES";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARAU_MAKER_ADDRESSES";
import { useChainId } from "../hooks/useChainId";
import { SarauMakerContext } from "../hooks/useSarauMaker";
import abi from "../static/abis/SarauMaker.json";
import { parseMultiCall } from "../utils/parseMulticall";

export interface ISarauMakerData {
  creationUSDFee: ethers.BigNumber;
  creationEtherFee: ethers.BigNumber;
  getNumberOfMints: ethers.BigNumber;
  getNumberOfSaraus: ethers.BigNumber;
  isAdmin: string;
}

const wrapContract = (
  addressOrName: string,
  contractInterface: ethers.ContractInterface,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider | undefined
) =>
  WrapperBuilder.wrapLite(
    new ethers.Contract(addressOrName, contractInterface, signerOrProvider)
  ).usingPriceFeed("redstone", { asset: "CELO" });

export const SarauMakerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: signer } = useSigner();
  const account = useAccount();
  const provider = useProvider();
  const { chainId } = useChainId();
  const [data, setData] = useState<ISarauMakerData>({
    creationEtherFee: ethers.BigNumber.from("0"),
    creationUSDFee: ethers.BigNumber.from("0"),
    isAdmin: "0",
  } as ISarauMakerData);

  const sarauMakerAddress = useMemo(
    () => SARAU_MAKER_ADDRESSES[chainId],
    [chainId]
  );

  const multicall = useMemo(
    () =>
      new Multicall({
        ethersProvider: provider,
        tryAggregate: false,
        multicallCustomContractAddress: MULTICALL_ADDRESSES[chainId] ?? "", // multicall CELO and alfajores addr
      }),
    [provider, chainId]
  );

  const writeContract = useMemo(() => {
    if (chainId && sarauMakerAddress && signer) {
      return wrapContract(sarauMakerAddress, abi.abi, signer);
    }
    return null;
  }, [chainId, signer]);

  const readContract = useMemo(() => {
    if (chainId && sarauMakerAddress) {
      return wrapContract(sarauMakerAddress, abi.abi, provider);
    }
    return null;
  }, [chainId, provider]);

  const getDetails = useCallback(async () => {
    if (readContract && multicall) {
      const contractCallContext: ContractCallContext[] = [
        {
          reference: "maker",
          contractAddress: SARAU_MAKER_ADDRESSES[chainId],
          abi: abi.abi,
          calls: [
            {
              reference: "creationEtherFee",
              methodName: "creationEtherFee()",
              methodParameters: [],
            },
            {
              reference: "creationUSDFee",
              methodName: "creationUSDFee()",
              methodParameters: [],
            },
            {
              reference: "getNumberOfMints",
              methodName: "getNumberOfMints()",
              methodParameters: [],
            },
            {
              reference: "getNumberOfSaraus",
              methodName: "getNumberOfSaraus()",
              methodParameters: [],
            },
            {
              reference: "isAdmin",
              methodName: "hasRole(bytes32, address)",
              methodParameters: [
                ethers.utils.formatBytes32String(""),
                account.address,
              ],
            },
          ],
        },
      ];

      const results: ContractCallResults = await multicall.call(
        contractCallContext
      );

      const data = parseMultiCall<ISarauMakerData>(
        results.results.maker.callsReturnContext
      );

      if (data.isAdmin.includes("1")) {
        data.isAdmin = "1";
      }

      setData(data);
    }
  }, [readContract, multicall, account]);

  useEffect(() => {
    getDetails();
  }, [chainId, account.address]);

  const updateCeloPrice = useCallback(async () => {
    if (writeContract) {
      await writeContract.updateEtherPrice();
    }
  }, [writeContract]);

  return (
    <SarauMakerContext.Provider
      value={{
        readContract,
        writeContract,
        data,
        updateCeloPrice,
      }}
    >
      {children}
    </SarauMakerContext.Provider>
  );
};
