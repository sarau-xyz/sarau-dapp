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

interface INFTData {
  name: string;
  symbol: string;
  maxMint: ethers.BigNumber;
  totalSupply: ethers.BigNumber;
  startDate: ethers.BigNumber;
  endDate: ethers.BigNumber;
  homepage: string;
  tokenURI: string;
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
  const multicall = useMemo(
    () =>
      new Multicall({
        ethersProvider: provider,
        tryAggregate: false,
        multicallCustomContractAddress:
          "0x75F59534dd892c1f8a7B172D639FA854D529ada3", // multicall CELO and alfajores addr
      }),
    [provider]
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
    const res = await sarauMaker.readContract!.callStatic.getSarau(sarauId);
    setNftAddress(res);
  }, [sarauMaker, sarauId]);

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
          ],
        },
      ];

      const results: ContractCallResults = await multicall.call(
        contractCallContext
      );

      const data = {} as INFTData;

      results.results.nft.callsReturnContext.forEach((res) => {
        data[res.reference as keyof INFTData] =
          res.returnValues[0].type === "BigNumber"
            ? ethers.BigNumber.from(res.returnValues[0])
            : res.returnValues[0];
      });

      setNftData(data);
    }
  }, [readContract]);

  useEffect(() => {
    getSarauNFTInfos();
  }, [readContract, getSarauNFTInfos]);

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
  };
};
