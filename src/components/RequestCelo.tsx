import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, Button, Collapse } from "reactstrap";
import { useAccount, useBalance } from "wagmi";
import { CUSTOM_CHAINS } from "../constants/CUSTOM_CHAINS";
import { useChainId } from "../hooks/useChainId";
// @ts-ignore
import { useRecaptcha } from "react-hook-recaptcha";
import axios from "axios";
import { ethers } from "ethers";
import cogoToast from "cogo-toast";

const containerId = "recaptcha";

const RequestCelo: React.FC = () => {
  const account = useAccount();
  const balance = useBalance({ addressOrName: account.address, watch: true });
  const [loading, setIsLoading] = useState(false);
  const { chainId } = useChainId();
  const [requested, setRequested] = useState(false);

  const successCallback = (response: string) => {
    requestCelo(response);
  };

  const { recaptchaLoaded, execute, reset } = useRecaptcha({
    containerId,
    successCallback,
    sitekey: import.meta.env.VITE_CAPTCHA_SITE_KEY,
    size: "invisible",
    errorCallback: (e: any) => console.error(e),
  });

  const networkSupport = useMemo(() => {
    return [CUSTOM_CHAINS.alfajores.id, CUSTOM_CHAINS.celo.id].includes(
      chainId
    );
  }, [chainId]);

  const requestCelo = useCallback(
    async (captcha: string) => {
      if (networkSupport) {
        try {
          const form = new FormData();
          form.append("token", captcha);
          form.append("address", account.address ?? "");

          setIsLoading(true);
          await axios.post(
            `https://dust.sarau.xyz/api/${
              chainId === CUSTOM_CHAINS.alfajores.id ? "alfajores" : "celo"
            }`,
            form
          );
          setRequested(true);
          cogoToast.success(
            "Success, in a few seconds you will have a little cello needed to make the mint in your wallet."
          );
        } catch (error) {
          console.error(error, "requestCelo");
          cogoToast.error(
            "There was an error with your request, try again or if it persists, contact our team."
          );
        } finally {
          setIsLoading(false);
        }
      }
    },
    [networkSupport, chainId, account.address]
  );

  const executeCaptcha = useCallback(async () => {
    await reset();
    await execute();
  }, [reset, execute]);

  return (
    <Collapse
      isOpen={
        !requested &&
        balance.data &&
        balance.data.value.eq(ethers.BigNumber.from(0))
      }
    >
      <Card body className="mb-3">
        <Button
          color="primary"
          disabled={!recaptchaLoaded || !account.address || loading}
          onClick={() => executeCaptcha()}
          id={containerId}
        >
          {loading && (
            <>
              <AiOutlineLoading3Quarters className="spin" />{" "}
            </>
          )}
          Request free CELO
        </Button>
        <small>
          We detected that you don't have enough CELO to do the mint, request a
          few cents for free.
        </small>
      </Card>
    </Collapse>
  );
};

export default RequestCelo;
