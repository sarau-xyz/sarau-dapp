import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WrapperBuilder } from "redstone-evm-connector";
import { useSigner, useAccount, useProvider } from "wagmi";
import { SARAU_MAKER_ADDRESSES } from "../constants/SARAU_MAKER_ADDRESSES";
import { useChainId } from "../hooks/useChainId";
import { SarauMakerContext } from "../hooks/useSarauMaker";
import abi from "../static/abis/SarauMaker.json";

export const SarauMakerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: signer } = useSigner();
  const account = useAccount();
  const provider = useProvider();
  const { chainId } = useChainId();
  const [etherFee, setEtherFee] = useState(ethers.BigNumber.from("0"));
  const [usdFee, setUsdFee] = useState(ethers.BigNumber.from("0"));
  const [isAdmin, setIsAdmin] = useState(false);

  const writeContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId] && signer) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, signer)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, signer]);

  const readContract = useMemo(() => {
    if (chainId && SARAU_MAKER_ADDRESSES[chainId]) {
      // console.log("connector", chainId, SARAU_MAKER_ADDRESSES[chainId]);
      return WrapperBuilder.wrapLite(
        new ethers.Contract(SARAU_MAKER_ADDRESSES[chainId], abi.abi, provider)
      ).usingPriceFeed("redstone", { asset: "CELO" });
    }
    return null;
  }, [chainId, provider]);

  const getSarauCreationEtherFee = useCallback(async () => {
    const fee =
      (await readContract?.callStatic.creationEtherFee()) as ethers.BigNumber;
    const usdFee =
      (await readContract?.callStatic.creationUSDFee()) as ethers.BigNumber;

    setEtherFee(fee);
    setUsdFee(usdFee);
  }, [readContract]);

  useEffect(() => {
    getSarauCreationEtherFee();
  }, [getSarauCreationEtherFee]);

  const getIsAdmin = useCallback(async () => {
    if (account.address && readContract) {
      const isAdmin = await readContract.callStatic.hasRole(
        ethers.utils.formatBytes32String(""),
        account.address
      );

      setIsAdmin(isAdmin);
    }
  }, [account.address, readContract]);

  useEffect(() => {
    getIsAdmin();
  }, [getIsAdmin]);

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
        etherFee,
        usdFee,
        isAdmin,
        updateCeloPrice,
      }}
    >
      {children}
    </SarauMakerContext.Provider>
  );
};
