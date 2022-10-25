import { Card, CardSubtitle, CardTitle, Col, Row } from "reactstrap";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSarauNFT } from "../hooks/useSarauNFT";
import {
  format,
  fromUnixTime,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import axios from "axios";
import { useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";
import ShimmerMintCard from "../components/ShimmerMintCard";
import RequestCelo from "../components/RequestCelo";
import CustomButton from "../components/forms/CustomButton";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const parseIpfsUrl = (ipfsUrl: string) =>
  `https://cloudflare-ipfs.com/ipfs/${ipfsUrl.replace("ipfs://", "")}`;

export default function Mint() {
  const [loading, setLoading] = useState(false);
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const [imageUrl, setImageUrl] = useState("");
  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  const sarauId = useMemo(() => query.get("id"), [query]);

  const sarauNFT = useSarauNFT(sarauId);

  const getNFTImage = useCallback(async () => {
    const { data: metadata } = await axios.get<{ image: string }>(
      parseIpfsUrl(sarauNFT.nftData!.tokenURI!)
    );

    setImageUrl(parseIpfsUrl(metadata.image));
  }, [sarauNFT]);

  useEffect(() => {
    if (sarauNFT.nftData) {
      getNFTImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sarauNFT.nftData]);

  const handleMint = useCallback(async () => {
    setLoading(true);
    if (!account.address && openConnectModal) {
      openConnectModal();
    } else {
      const res = await sarauNFT.writeContract!.mint(
        ethers.utils.formatBytes32String("")
      );
      console.log(res, "res");

      const tx = await res.wait();

      console.log(tx, "tx");

      await sarauNFT.getSarauNFTInfos();
    }
    setLoading(false);
  }, [sarauNFT, account, openConnectModal]);

  return (
    <Col>
      <Row>
        {sarauNFT.nftData ? (
          <Card
            style={{
              maxWidth: 500,
            }}
            className="mx-auto border-0 shadow"
            body
          >
            <CardTitle tag="h5">{sarauNFT.nftData?.name}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {sarauNFT.nftData?.symbol} <VscDebugBreakpointLog />{" "}
              <a
                href={sarauNFT.nftData?.homepage}
                target="_blank"
                rel="noreferrer"
              >
                {sarauNFT.nftData?.homepage}
              </a>
            </CardSubtitle>
            <img
              alt="Sample"
              src={imageUrl}
              className="my-3 img-fluid rounded"
            />
            <p>
              Minted:{" "}
              <b>
                {sarauNFT.nftData.totalSupply.toNumber()}/
                {sarauNFT.nftData.maxMint.toNumber()}
              </b>
            </p>
            <p>
              Mint period:{" "}
              <b>
                {format(
                  fromUnixTime(sarauNFT.nftData?.startDate.toNumber()),
                  "dd/MM/yyyy HH:mm"
                )}
              </b>
              {" - "}
              <b>
                {format(
                  fromUnixTime(sarauNFT.nftData?.endDate.toNumber()),
                  "dd/MM/yyyy HH:mm"
                )}
              </b>
            </p>

            <RequestCelo />

            <CustomButton
              color="primary"
              block
              disabled={!sarauNFT.isOnMintWindow}
              onClick={handleMint}
              className="glowing"
              loading={loading}
            >
              {sarauNFT.isOnMintWindow
                ? !account.address
                  ? "Connect wallet"
                  : "Mint now"
                : sarauNFT.isBeforeEnd
                ? "Mint will start soon"
                : "Mint ended"}
            </CustomButton>
            {sarauNFT.isOnMintWindow && (
              <p className="text-center">
                <small>
                  Ending in{" "}
                  {formatDuration(
                    intervalToDuration({
                      start: sarauNFT.dateNow,
                      end: fromUnixTime(sarauNFT.nftData.endDate.toNumber()),
                    }),
                    {
                      delimiter: ", ",
                    }
                  )}
                </small>
              </p>
            )}
          </Card>
        ) : (
          <ShimmerMintCard />
        )}
      </Row>
    </Col>
  );
}
