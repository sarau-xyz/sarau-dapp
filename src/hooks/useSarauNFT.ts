import { ethers } from "ethers";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { useSarauMaker } from "./useSarauMaker";
import abi from "../static/abis/SarauNFT.json";
import { isAfter, isBefore, fromUnixTime } from "date-fns";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import { MULTICALL_ADDRESSES } from "../constants/MULTICALL_ADDRESSES";
import { useChainId } from "./useChainId";
import { parseMultiCall } from "../utils/parseMulticall";

interface INFTData {
  name: string;
  symbol: string;
  maxMint: ethers.BigNumber;
  totalSupply: ethers.BigNumber;
  startDate: ethers.BigNumber;
  endDate: ethers.BigNumber;
  homepage: string;
  tokenURI: string;
  isAdmin: string;
}

export const useSarauNFT = (sarauId: string | null) => {
  const sarauMaker = useSarauMaker();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();
  const [nftAddress, setNftAddress] = useState<string>();
  const [nftData, setNftData] = useState<INFTData>();
  const [dateNow, setDateNow] = useState(new Date());
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const { chainId } = useChainId();

  const multicall = useMemo(
    () =>
      new Multicall({
        ethersProvider: provider,
        tryAggregate: false,
        multicallCustomContractAddress: MULTICALL_ADDRESSES[chainId] ?? "", // multicall CELO and alfajores addr
      }),
    [provider, chainId]
  );

  const readContract = useMemo(() => {
    if (sarauId && nftAddress) {
      return new ethers.Contract(nftAddress, abi.abi, provider);
    } else {
      return null;
    }
  }, [sarauId, nftAddress, provider]);

  const writeContract = useMemo(() => {
    if (sarauId && nftAddress && signer) {
      return new ethers.Contract(nftAddress, abi.abi, signer);
    } else {
      return null;
    }
  }, [sarauId, nftAddress, signer]);

  const getSarauNFTAddress = useCallback(async () => {
    const res = await sarauMaker.readContract!.callStatic.getSarauAddress(
      sarauId
    );
    setNftAddress(res);
  }, [sarauMaker, sarauId]);

  const editSarauNFTCode = useCallback(
    async (newCode: string) => {
      await writeContract!.setCode(newCode);
    },
    [writeContract]
  );

  const getSarauNFTInfos = useCallback(async () => {
    if (readContract) {
      const contractCallContext: ContractCallContext[] = [
        {
          reference: "nft",
          contractAddress: nftAddress!,
          abi: abi.abi,
          calls: [
            { reference: "name", methodName: "name()", methodParameters: [] },

            {
              reference: "symbol",
              methodName: "symbol()",
              methodParameters: [],
            },
            {
              reference: "maxMint",
              methodName: "maxMint()",
              methodParameters: [],
            },
            {
              reference: "totalSupply",
              methodName: "totalSupply()",
              methodParameters: [],
            },
            {
              reference: "startDate",
              methodName: "startDate()",
              methodParameters: [],
            },
            {
              reference: "endDate",
              methodName: "endDate()",
              methodParameters: [],
            },
            {
              reference: "homepage",
              methodName: "homepage()",
              methodParameters: [],
            },
            {
              reference: "tokenURI",
              methodName: "tokenURI(uint256)",
              methodParameters: [1],
            },
            {
              reference: "isAdmin",
              methodName: "hasRole(bytes32, address)",
              methodParameters: [
                ethers.utils.formatBytes32String(""),
                account.isConnected
                  ? account.address
                  : ethers.constants.AddressZero,
              ],
            },
          ],
        },
      ];

      const results: ContractCallResults = await multicall.call(
        contractCallContext
      );

      const data = parseMultiCall<INFTData>(results.results.nft.callsReturnContext);

      if (data.isAdmin.includes("1")) {
        data.isAdmin = "1";
      }

      setNftData(data);
    }
  }, [readContract, multicall, account]);

  useEffect(() => {
    getSarauNFTInfos();
  }, [readContract, account.address]);

  useEffect(() => {
    getSarauNFTAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAfterStart = useMemo(
    () =>
      nftData
        ? isAfter(dateNow, fromUnixTime(nftData.startDate.toNumber()))
        : false,
    [nftData, dateNow]
  );

  const isBeforeEnd = useMemo(
    () =>
      nftData
        ? isBefore(dateNow, fromUnixTime(nftData.endDate.toNumber()))
        : false,
    [nftData, dateNow]
  );

  const isOnMintWindow = useMemo(
    () => isAfterStart && isBeforeEnd,
    [isAfterStart, isBeforeEnd]
  );

  useEffect(() => {
    const tickInterval = setInterval(() => {
      setDateNow(new Date());
    }, 1000);

    return () => clearInterval(tickInterval);
  }, []);

  const getHasNft = useCallback(async () => {
    if (readContract && account.address) {
      const has = await readContract?.callStatic.balanceOf(account.address);

      setAlreadyMinted(
        ethers.BigNumber.from(has).eq(ethers.BigNumber.from("1"))
      );
    }
  }, [readContract, account.address]);

  useEffect(() => {
    getHasNft();
  }, [getHasNft, account.address]);

  return {
    nftAddress,
    nftData,
    readContract,
    writeContract,
    isAfterStart,
    isBeforeEnd,
    isOnMintWindow,
    dateNow,
    getSarauNFTInfos,
    getHasNft,
    alreadyMinted,
    editSarauNFTCode,
  };
};
