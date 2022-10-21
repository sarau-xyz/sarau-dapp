import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Row,
} from "reactstrap";
import { FaLink } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSarauNFT } from "../hooks/useSarauNFT";
import { format, fromUnixTime } from "date-fns";
import axios from "axios";
import { useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";

const parseIpfsUrl = (ipfsUrl: string) =>
  `https://cloudflare-ipfs.com/ipfs/${ipfsUrl.replace("ipfs://", "")}`;

export default function Mint() {
  const { connect } = useConnect();
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
  }, [sarauNFT.nftData, getNFTImage]);

  const handleMint = useCallback(async () => {
    if (!account.address) {
      connect();
    } else {
      const res = await sarauNFT.writeContract!.mint(
        ethers.utils.parseBytes32String("")
      );
      console.log(res, "res");

      const tx = await res.wait();

      console.log(tx, "tx");
    }
  }, [sarauNFT, account]);

  return (
    <Row>
      <Card
        style={{
          width: "18rem",
        }}
        className="mx-auto"
      >
        <img alt="Sample" src={imageUrl} className="mt-3" />
        {sarauNFT.nftData && (
          <CardBody>
            <CardTitle tag="h5">{sarauNFT.nftData?.name}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {sarauNFT.nftData?.symbol}
            </CardSubtitle>
            {/* Some quick example text to build on the card title and make up the
            bulk of the card‘s content. */}
            <a
              href={sarauNFT.nftData?.homepage}
              target="_blank"
              rel="noreferrer"
            >
              <FaLink /> {sarauNFT.nftData?.homepage}
            </a>
            <p>
              Mint start date{" "}
              <Badge>
                {format(
                  fromUnixTime(sarauNFT.nftData?.startDate.toNumber()),
                  "dd/MM/yyyy"
                )}{" "}
              </Badge>
            </p>
            <p>
              Mint end date{" "}
              <Badge>
                {format(
                  fromUnixTime(sarauNFT.nftData?.endDate.toNumber()),
                  "dd/MM/yyyy"
                )}
              </Badge>
            </p>
            <Button
              color="primary"
              block
              disabled={!sarauNFT.isOnMintWindow}
              onClick={handleMint}
            >
              {sarauNFT.isOnMintWindow
                ? !account.address
                  ? "Connect wallet"
                  : "Mint now"
                : sarauNFT.isBeforeEnd
                ? "Mint will start soon"
                : "Mint ended"}
            </Button>
          </CardBody>
        )}
      </Card>
    </Row>
  );
}
