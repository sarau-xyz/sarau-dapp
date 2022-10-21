import React, { memo, useCallback, useState } from "react";
import {
  AiOutlineLoading3Quarters,
  AiOutlineClockCircle,
  AiFillCheckCircle,
} from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import {
  Button,
  Collapse,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { useSarauMaker } from "../hooks/useSarauMaker";
import { CreateSarauForm } from "../schemas/manager";
import axios from "axios";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

export const useCreateSarauModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sarauMaker = useSarauMaker();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sarauCreated, setSarauCreated] = useState<{ id: ethers.BigNumber }>();
  const [currentStep, setStep] = useState(0);

  const toggle = () => setIsOpen((oldState) => !oldState);

  const sendToIPFS = useCallback(
    async (name: string, file: File) => {
      const form = new FormData();
      form.append("file", file);
      form.append("name", name);

      const res = await axios.post<{ name: string; image: string }>(
        "https://ipsf-uploader-production.up.railway.app/api/upload",
        form,
        {
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentage);
          },
        }
      );

      const image = res.data.image;

      return image;
    },
    [setUploadProgress]
  );

  const createTx = useCallback(
    async (data: CreateSarauForm, image: string) => {
      const fee = await sarauMaker.writeContract!.creationEtherFee();

      console.log("fee", fee);

      const tx = await sarauMaker.writeContract!.createSarau(
        data.maxMint,
        Math.floor(new Date(data.startDate).getTime() / 1000),
        Math.floor(new Date(data.endDate).getTime() / 1000),
        data.homepage,
        data.name,
        data.symbol,
        image,
        {
          value: fee,
        }
      );

      return tx;
    },
    [sarauMaker]
  );

  const waitTx = useCallback(async (tx: any) => {
    const waited = await tx.wait();

    const event = waited.events.find(
      (event: any) => event.event === "SarauCreated"
    );

    return event.args as { id: ethers.BigNumber };
  }, []);

  const doSteps = useCallback(
    async (data: CreateSarauForm, file: File) => {
      toggle();
      setStep(1);
      const image = await sendToIPFS(data.name, file);
      setStep(2);
      const tx = await createTx(data, image);
      setStep(3);
      const res = await waitTx(tx);
      console.log(res, "sarauCreated");
      setSarauCreated(res);
      setStep(5);
    },
    [sendToIPFS, createTx, waitTx]
  );

  return { currentStep, isOpen, toggle, doSteps, uploadProgress, sarauCreated };
};

const CreateSarauModal: React.FC<{
  progress: number;
  currentStep: number;
  isOpen: boolean;
  sarauCreated?: {
    id: ethers.BigNumber;
  };
}> = ({ progress, currentStep, isOpen, sarauCreated }) => {
  const makeStepIcon = (step: number, current: number) => {
    if (current > step) {
      return <AiFillCheckCircle color="green" />;
    } else if (current === step) {
      return <AiOutlineLoading3Quarters className="spin" />;
    } else if (current < step) {
      return <AiOutlineClockCircle />;
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader>Creating your Sarau</ModalHeader>
      <ModalBody>
        <ListGroup>
          <ListGroupItem>
            {makeStepIcon(1, currentStep)} Sending your image to IPFS (
            {progress}
            %)
          </ListGroupItem>
          <ListGroupItem>
            {makeStepIcon(2, currentStep)} Requesting transaction to your wallet
          </ListGroupItem>
          <ListGroupItem>
            {makeStepIcon(3, currentStep)} Waiting for blockchain
          </ListGroupItem>
          <ListGroupItem>
            {makeStepIcon(4, currentStep)} Sarau created
          </ListGroupItem>
        </ListGroup>
        <Collapse isOpen={sarauCreated !== undefined}>
          <Link to={`/mint?id=${sarauCreated?.id.toString()}`}>
            <Button block className="mt-3" color="info">
              See your Sarau mint page <BsArrowUpRight size={10} />
            </Button>
          </Link>
        </Collapse>
      </ModalBody>
    </Modal>
  );
};

export default memo(CreateSarauModal);
