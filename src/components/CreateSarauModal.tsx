import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
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

const CreateSarauModal: React.FC<{
  data: CreateSarauForm;
  file: File;
}> = ({ data, file }) => {
  const sarauMaker = useSarauMaker();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState(0);

  const sendToIPFS = useCallback(async () => {
    const form = new FormData();
    form.append(file.name, file);
    form.append("name", data.name);

    const res = await axios.post<{ name: string; image: string }>(
      "https://ipsf-uploader.vercel.app/api/upload",
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

    console.log(res.data);

    const image = res.data.image;

    return image;
  }, [data, file, setUploadProgress]);

  const sendToBlockchain = useCallback(
    async (image: string) => {
      // TODO look in contract for parameters
      const created = await sarauMaker!.createSarau(
        data.maxMint,
        data.startDate,
        data.endDate,
        image,
        data.homepage,
        data.name,
        data.symbol,
        {
          value: ethers.utils.parseUnits("1", "ether"),
        }
      );

      return created;
    },
    [data, sarauMaker]
  );

  const doSteps = useCallback(async () => {
    setStep(1);
    const image = await sendToIPFS();
    setStep(2);
    const sarauCreated = await sendToBlockchain(image);

    console.log(sarauCreated);
    setStep(3);
    setStep(4);
  }, [sendToIPFS, sendToBlockchain]);

  useEffect(() => {
    doSteps();
  }, [doSteps]);

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
    <Modal isOpen>
      <ModalHeader>Creating your Sarau</ModalHeader>
      <ModalBody>
        <ListGroup>
          <ListGroupItem>
            {makeStepIcon(1, step)} Sending your image to IPFS ({uploadProgress}
            %)
          </ListGroupItem>
          <ListGroupItem>
            {makeStepIcon(2, step)} Requesting transaction to your wallet
          </ListGroupItem>
          <ListGroupItem>{makeStepIcon(3, step)} Sarau created</ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default CreateSarauModal;
