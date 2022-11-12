import {
  Alert,
  Card,
  CardSubtitle,
  CardTitle,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
} from "reactstrap";
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
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import ShimmerMintCard from "../components/ShimmerMintCard";
import RequestCelo from "../components/RequestCelo";
import CustomButton from "../components/forms/CustomButton";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import cogoToast from "cogo-toast";
import {
  AiFillCheckCircle,
  AiOutlineQrcode,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { useChainId } from "../hooks/useChainId";
import { CUSTOM_CHAINS } from "../constants/CUSTOM_CHAINS";
import { QRCode } from "react-qrcode-logo";
import Skeleton from "react-loading-skeleton";
import { FaPen } from "react-icons/fa";

const parseIpfsUrl = (ipfsUrl: string) =>
  `https://cloudflare-ipfs.com/ipfs/${ipfsUrl.replace("ipfs://", "")}`;

export default function Mint() {
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const { openConnectModal } = useConnectModal();
  const account = useAccount();
  const [imageUrl, setImageUrl] = useState("");
  const { search } = useLocation();
  const [transactionHash, setTransactionHash] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [code, setCode] = useState("");

  const bytes32Code = useMemo(
    () => ethers.utils.formatBytes32String(code.toUpperCase()),
    [code]
  );

  const toggleQrCode = () => setShowQrCode((oldState) => !oldState);

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
    try {
      setLoading(true);
      if (!account.address && openConnectModal) {
        openConnectModal();
      } else {
        const res = await sarauNFT.writeContract!.mint(bytes32Code);

        setTransactionHash(res.hash);

        cogoToast.success("Success!");

        await sarauNFT.getSarauNFTInfos();
        await sarauNFT.getHasNft();
      }
    } catch (error) {
      const err = error as any;
      if (err.reason) {
        cogoToast.error(`Error: ${err.reason}`);
      } else {
        cogoToast.error(
          "There was an error with your request, please try again later, or open the log for more details."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [sarauNFT, account, openConnectModal, bytes32Code]);

  const handleEditCode = useCallback(async () => {
    try {
      await sarauNFT.editSarauNFTCode(bytes32Code);
      cogoToast.success("Code changed!");
    } catch (error) {
      const err = error as any;
      if (err.reason) {
        cogoToast.error(`Error: ${err.reason}`);
      } else {
        cogoToast.error(
          "There was an error with your request, please try again later, or open the log for more details."
        );
      }
    }
  }, [bytes32Code, sarauNFT]);

  const currentUrl = useMemo(() => window.location.href, [window]);

  const share = async () => {
    try {
      await navigator.share({
        title: sarauNFT.nftData?.name,
        url: currentUrl,
        text: `Free mint ${sarauNFT.nftData?.name} on Sarau.XYZ`,
      });
    } catch (_) {
      navigator.clipboard.writeText(
        `Free mint ${sarauNFT.nftData?.name} on Sarau.XYZ: ${window.location.href}`
      );
      cogoToast.success("Link copied to clipboard.");
    }
  };

  return (
    <div className="mb-3">
      <Modal isOpen={showQrCode} toggle={toggleQrCode}>
        <ModalHeader toggle={toggleQrCode}>
          {sarauNFT.nftData?.name}
        </ModalHeader>
        <div className="mx-auto">
          <QRCode
            value={currentUrl}
            size={300}
            logoImage={
              "https://avatars.githubusercontent.com/u/114229151?s=200&v=4"
            }
            eyeRadius={5}
          />
        </div>
      </Modal>
      {sarauNFT.nftData ? (
        <Card
          style={{
            maxWidth: 500,
          }}
          className="mx-auto border-0 shadow"
          body
        >
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 20,
              cursor: "pointer",
            }}
            onClick={share}
          >
            <AiOutlineShareAlt size={20} />
          </div>

          <div
            style={{
              position: "absolute",
              right: 45,
              top: 20,
              cursor: "pointer",
            }}
            onClick={toggleQrCode}
          >
            <AiOutlineQrcode size={20} />
          </div>

          <CardTitle tag="h5">{sarauNFT.nftData?.name}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {sarauNFT.nftData?.symbol} <span className="px-1">·</span>
            <a
              href={sarauNFT.nftData?.homepage}
              target="_blank"
              rel="noreferrer"
            >
              {sarauNFT.nftData?.homepage}
            </a>
          </CardSubtitle>
          <div className="mx-auto">
            {!imageLoaded && <Skeleton height={200} width={200} />}
            <img
              alt={sarauNFT.nftData?.name}
              src={imageUrl}
              onLoad={() => {
                setImageLoaded(true);
              }}
              className={`my-3 img-fluid rounded ${
                imageLoaded ? "d-block" : "d-none"
              }`}
              height={200}
              width={200}
            />
          </div>
          <p>
            Minted:{" "}
            <b>
              {sarauNFT.nftData.totalSupply.toString()}/
              {sarauNFT.nftData.maxMint.toString()}
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

          <Alert color="success" isOpen={!!transactionHash}>
            <AiFillCheckCircle /> NFT minted,{" "}
            <a
              href={`https://${
                chainId.chainId === CUSTOM_CHAINS.celo.id ? "" : "alfajores."
              }celoscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noreferrer"
            >
              view on explorer.
            </a>
          </Alert>
          <FormGroup>
            <Label>
              {sarauNFT.nftData.isAdmin === "1" && (
                <FaPen
                  style={{ marginRight: 5 }}
                  onClick={() => handleEditCode()}
                />
              )}
              Mint code:
            </Label>
            <Input
              maxLength={6}
              value={code}
              onChange={({ target }) => setCode(target.value.toUpperCase())}
            />
            <small>
              Mint code that the organizer provided, leave blank if none was
              offered.
            </small>
          </FormGroup>
          <CustomButton
            color="primary"
            block
            disabled={!sarauNFT.isOnMintWindow || sarauNFT.alreadyMinted}
            onClick={handleMint}
            className="glowing"
            loading={loading}
          >
            {sarauNFT.isOnMintWindow
              ? !account.address
                ? "Connect wallet"
                : sarauNFT.alreadyMinted
                ? "Already Minted"
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
    </div>
  );
}
