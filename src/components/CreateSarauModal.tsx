import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
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

const CreateSarauModal: React.FC<{
  data: CreateSarauForm;
}> = ({ data }) => {
  const sarauMaker = useSarauMaker();
  const [step, setStep] = useState(1);

  const sendToIPFS = async () => {
    // TODO send files to ipfs

    const ipfsUrl = "todo";

    const jsonToCreate = JSON.stringify({
      name: data.name,
      image: ipfsUrl,
    });

    return new Promise((res) => setTimeout(res, 500));
  };

  const sendToBlockchain = async () => {
    const created = await sarauMaker!.createSarau({
      value: ethers.utils.parseUnits("1", "ether"),
    });

    return new Promise((res) => setTimeout(res, 2000));
  };

  const doSteps = async () => {
    await sendToIPFS();

    await sendToBlockchain();
  };

  useEffect(() => {
    doSteps();
  }, []);

  const makeStepIcon = (step: number, current: number) => {
    if (current > step) {
      return <AiFillCheckCircle color="green" />;
    } else if (step == current) {
      <AiOutlineLoading3Quarters className="spin" />;
    } else if (step < current) {
      <AiOutlineClockCircle />;
    }
  };

  return (
    <Modal isOpen>
      <ModalHeader>Creating your NFT</ModalHeader>
      <ModalBody>
        <ListGroup>
          <ListGroupItem>
            {makeStepIcon(1, step)} Sending your image to IPFS
          </ListGroupItem>
          <ListGroupItem>
            {makeStepIcon(2, step)} Requesting transaction to your wallet
          </ListGroupItem>
          <ListGroupItem>{makeStepIcon(3, step)} NFT created</ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default CreateSarauModal;
