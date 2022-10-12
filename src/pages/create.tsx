import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import cogoToast from "cogo-toast";
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
import { ValidationError } from "yup";
import CreateSarauModal from "../components/CreateSarauModal";
import CustomButton from "../components/forms/CustomButton";
import CustomInput from "../components/forms/CustomInput";
import { useSarauMaker } from "../hooks/useSarauMaker";
import { createSarauSchema, CreateSarauForm } from "../schemas/manager";

export default function Create() {
  const sarauMaker = useSarauMaker();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const [parsedData, setParsedData] = useState<CreateSarauForm>();
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
    if (!sarauMaker) {
      return cogoToast.error("please connect to the supported chain");
    }

    try {
      setLoading(true);
      const tParsedData = await createSarauSchema.validate(data, {
        abortEarly: false,
      });

      console.log(tParsedData);
      setParsedData(tParsedData);
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

  return (
    <>
      {parsedData && file && (
        <CreateSarauModal data={parsedData!} file={file} />
      )}
      <Card
        style={{
          maxWidth: 500,
        }}
        body
        className="mx-auto"
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
          >
            Create
          </CustomButton>
        </Form>
      </Card>
    </>
  );
}
