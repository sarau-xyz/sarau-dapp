import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import cogoToast from "cogo-toast";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import {
  FormGroup,
  Label,
  FormText,
  Input,
  Card,
  Row,
  Container,
} from "reactstrap";
import { useAccount, useBalance } from "wagmi";
import { ValidationError } from "yup";
import CreateSarauModal, {
  useCreateSarauModal,
} from "../components/CreateSarauModal";
import CustomButton from "../components/forms/CustomButton";
import CustomInput from "../components/forms/CustomInput";
import { useSarauMaker } from "../hooks/useSarauMaker";
import { createSarauSchema, CreateSarauForm } from "../schemas/manager";

export default function Create() {
  const sarauModal = useCreateSarauModal();
  const account = useAccount();
  const balance = useBalance({ addressOrName: account.address });
  const sarauMaker = useSarauMaker();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>();

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);

      setFileUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  const handleFormSubmit = async (data: CreateSarauForm) => {
    if (!sarauMaker.writeContract) {
      return cogoToast.error("please connect to the supported chain");
    }

    if (!file) {
      cogoToast.error("please select one file");
    }

    try {
      setLoading(true);
      const tParsedData = await createSarauSchema.validate(data, {
        abortEarly: false,
      });

      console.log(tParsedData);

      sarauModal.doSteps(tParsedData, file!);
    } catch (err) {
      console.error(err);

      const validationErrors: { [key: string]: string } = {};

      if (err instanceof ValidationError) {
        err.inner.forEach((error) => {
          console.error(error);
          cogoToast.error(error.message);
          validationErrors[error.path!] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayEtherFee= ethers.utils
  .formatUnits(sarauMaker.etherFee.toString(), 18);

  const displayUsdFee= ethers.utils
  .formatUnits(sarauMaker.usdFee.toString(), 18);

  return (
    <>
      <CreateSarauModal
        currentStep={sarauModal.currentStep}
        progress={sarauModal.uploadProgress}
        isOpen={sarauModal.isOpen}
        sarauCreated={sarauModal.sarauCreated}
      />
      <Card
        style={{
          maxWidth: 500,
        }}
        className="mx-auto border-0 shadow mb-3"
        body
      >
        <Form ref={formRef} onSubmit={handleFormSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <CustomInput
              id="name"
              name="name"
              placeholder="Build With Celo ReFi Hackathon '22"
              type="text"
              minLength={3}
              required
            />
            <small>
              Name of your event, this will be also name of your NFT
            </small>
          </FormGroup>
          <FormGroup>
            <Label for="symbol">Symbol</Label>
            <CustomInput
              id="symbol"
              name="symbol"
              placeholder="BWCH2022"
              type="text"
              minLength={3}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="maxMint">Max Mint</Label>
            <CustomInput
              id="maxMint"
              name="maxMint"
              placeholder="10000"
              type="number"
              step={1}
              min={1}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="startDate">Mint Start Date</Label>
            <CustomInput
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="endDate">Mint End Date</Label>
            <CustomInput
              id="endDate"
              name="endDate"
              type="datetime-local"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="homepage">Homepage</Label>
            <CustomInput id="homepage" name="homepage" type="url" />
          </FormGroup>
          <Card body>
            <FormGroup>
              <Label for="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  e.target.files ? setFile(e.target.files[0]) : null
                }
              />
              <FormText>
                Recommended: measures 500x500px, round shape, size less than
                200KB (Max. 1MB)
              </FormText>
              {file && (
                <Row className="text-center mt-3">
                  <Container>
                    <img
                      src={fileUrl}
                      alt="..."
                      className="img-thumbnail "
                      width={500}
                      height={500}
                    />
                  </Container>
                </Row>
              )}
            </FormGroup>
          </Card>

          <CustomButton
            loading={loading}
            color="primary"
            className="mt-3"
            type="submit"
            block
          >
            Create (
            {displayEtherFee}{" "}
            CELO)
          </CustomButton>
          <small>{displayEtherFee} CELO is currently equivalent to approximately US${displayUsdFee}.</small>
          {balance.data && balance.data.value.lt(sarauMaker.etherFee) && (
            <small>
              You don't have enough balance to create a Sarau, you need at least{" "}
              {displayEtherFee} plus network fees.
            </small>
          )}
        </Form>
      </Card>
    </>
  );
}
