import React, { useEffect, useState } from "react";
import {
  AiOutlineLoading3Quarters,
  AiOutlineClockCircle,
} from "react-icons/ai";
import {
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { CreateSarauForm } from "../schemas/manager";

const CreateSarauModal: React.FC<{
  data: CreateSarauForm;
}> = ({  data }) => {
    const [step, setStep] = useState(1);

  const sendToIPFS = async () => {
    // TODO send files to ipfs

    const ipfsUrl = 'todo';

    const jsonToCreate = JSON.stringify({
      name: data.name,
      image: ipfsUrl,
    });

    return new Promise(res => setTimeout(res, 500));
  };

  const sendToBlockchain = async () => {
    return new Promise(res => setTimeout(res, 2000));
  };

  const doSteps = async () => {
    await sendToIPFS();
    
    await sendToBlockchain();
  };

  useEffect(() => {
    doSteps();
  }, []);

  return (
    <Modal isOpen>
      <ModalHeader>Creating your NFT</ModalHeader>
      <ModalBody>
        <ListGroup>
          <ListGroupItem>
            <AiOutlineLoading3Quarters className="spin" /> Sending your image to
            IPFS
          </ListGroupItem>
          <ListGroupItem>
            <AiOutlineClockCircle /> Requesting transaction to your wallet
          </ListGroupItem>
          <ListGroupItem>
            <AiOutlineClockCircle /> NFT created
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default CreateSarauModal;
