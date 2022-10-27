import { ethers } from "ethers";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { useSarauMaker } from "./useSarauMaker";
import abi from "../static/abis/SarauNFT.json";
import { isAfter, isBefore, fromUnixTime } from "date-fns";

export const useSarauNFT = (sarauId: string | null) => {
  const sarauMaker = useSarauMaker();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const account = useAccount();
  const [nftAddress, setNftAddress] = useState<string>();
  const [nftData, setNftData] = useState<{
    name: string;
    symbol: string;
    maxMint: ethers.BigNumber;
    totalSupply: ethers.BigNumber;
    startDate: ethers.BigNumber;
    endDate: ethers.BigNumber;
    homepage: string;
    tokenURI: string;
  }>();
  const [dateNow, setDateNow] = useState(new Date());
  const [alreadyMinted, setAlreadyMinted] = useState(false);

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
      const name = await readContract.callStatic.name();
      const symbol = await readContract.callStatic.symbol();
      const maxMint = await readContract.callStatic.maxMint();
      const totalSupply = await readContract.callStatic.totalSupply();
      const startDate = await readContract.callStatic.startDate();
      const endDate = await readContract.callStatic.endDate();
      const homepage = await readContract.callStatic.homepage();
      const tokenURI = await readContract.callStatic.tokenURI(1);

      setNftData({
        name,
        symbol,
        maxMint,
        totalSupply,
        startDate,
        endDate,
        homepage,
        tokenURI,
      });
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
