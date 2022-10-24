import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, Button } from "reactstrap";
import { useAccount } from "wagmi";
import { CUSTOM_CHAINS } from "../constants/CUSTOM_CHAINS";
import { useChainId } from "../hooks/useChainId";
// @ts-ignore
import { useRecaptcha } from "react-hook-recaptcha";
import axios from "axios";

const containerId = "recaptcha";

const RequestCelo: React.FC = () => {
  const account = useAccount();
  const [loading, setIsLoading] = useState(false);
  const [captchaResponse, setCaptchaResponse] = useState("");
  const { chainId } = useChainId();

  const successCallback = (response: string) => {
    setCaptchaResponse(response);
  };

  const expiredCallback = () => setCaptchaResponse("");

  const { recaptchaLoaded, execute, reset } = useRecaptcha({
    containerId,
    successCallback,
    expiredCallback,
    sitekey: process.env.REACT_APP_CAPTCHA_SITE_KEY,
    size: "invisible",
    errorCallback: (e: any) => console.error(e),
  });

  const executeCaptcha = useCallback(() => {
    reset();
    execute();
  }, [reset, execute]);

  const networkSupport = useMemo(() => {
    return [CUSTOM_CHAINS.alfajores.id, CUSTOM_CHAINS.celo.id].includes(
      chainId
    );
  }, [chainId]);

  const requestCelo = useCallback(
    async (address: string) => {
      if (networkSupport) {
        try {
          const form = new FormData();
          form.append("token", captchaResponse);
          setIsLoading(true);
          await axios.post(
            `https://dust.sarau.xyz/api/${
              chainId === CUSTOM_CHAINS.alfajores.id ? "alfajores" : "celo"
            }?address=${address}`,
            form
          );
        } catch (error) {
          console.error(error, "requestCelo");
        } finally {
          setIsLoading(false);
        }
      }
    },
    [networkSupport, captchaResponse, chainId]
  );

  useEffect(() => {
    if (recaptchaLoaded && !captchaResponse) {
      executeCaptcha();
    }
  }, [recaptchaLoaded, captchaResponse, executeCaptcha]);

  return (
    <Card body className="mb-3">
      <Button
        color="primary"
        disabled={!recaptchaLoaded || !account.address || loading}
        onClick={() => requestCelo(account.address ?? "")}
        id={containerId}
      >
        {loading && <AiOutlineLoading3Quarters className="spin" />}
        Request free CELO
      </Button>
      <small>
        We detected that you don't have enough CELO to do the mint, request a
        few cents for free.
      </small>
    </Card>
  );
};

export default RequestCelo;
