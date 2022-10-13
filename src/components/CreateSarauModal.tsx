import React, { memo, useCallback, useState } from "react";
import {
  AiOutlineLoading3Quarters,
  AiOutlineClockCircle,
  AiFillCheckCircle,
} from "react-icons/ai";
import {
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { useSarauMaker } from "../hooks/useSarauMaker";
import { CreateSarauForm } from "../schemas/manager";
import axios from "axios";

export const useCreateSarauModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sarauMaker = useSarauMaker();
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const sendToBlockchain = useCallback(
    async (data: CreateSarauForm, image: string) => {
      // TODO look in contract for parameters
      const fee = await sarauMaker!.creationEtherFee();

      console.log("fee", fee);

      const created = await sarauMaker!.createSarau(
        data.maxMint,
        data.startDate,
        data.endDate,
        image,
        data.homepage,
        data.name,
        data.symbol,
        {
          value: fee,
        }
      );

      return created;
    },
    [sarauMaker]
  );

  const doSteps = useCallback(
    async (data: CreateSarauForm, file: File) => {
      toggle();
      setStep(1);
      const image = await sendToIPFS(data.name, file);
      setStep(2);
      const sarauCreated = await sendToBlockchain(data, image);

      console.log(sarauCreated);
      setStep(3);
      setStep(4);
    },
    [sendToIPFS, sendToBlockchain]
  );

  return { currentStep, isOpen, toggle, doSteps, uploadProgress };
};

const CreateSarauModal: React.FC<{
  progress: number;
  currentStep: number;
  isOpen: boolean;
}> = ({ progress, currentStep, isOpen }) => {
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
            {makeStepIcon(3, currentStep)} Sarau created
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default memo(CreateSarauModal);
