import { Form, FormGroup, Label, Input, FormText, Button } from "reactstrap";

export default function Create() {
  return (
    <>
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Build With Celo ReFi Hackathon '22"
            type="text"
            minlength={3}
            required
          />
          <small>Name of your event, this will be also name of your NFT</small>
        </FormGroup>
        <FormGroup>
          <Label for="symbol">Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="BWCH2022"
            type="text"
            minlength={3}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="symbol">Max Mint</Label>
          <Input
            id="symbol"
            name="symbol"
            placeholder="10000"
            type="number"
            step={1}
            min={1}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="startDate">Mint Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="endDate">Mint End Date</Label>
          <Input id="endDate" name="endDate" type="datetime-local" required />
        </FormGroup>
        <FormGroup>
          <Label for="homepage">Homepage</Label>
          <Input id="homepage" name="homepage" type="url" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleFile">File</Label>
          <Input id="exampleFile" name="file" type="file" />
          <FormText>
            Recommended: measures 500x500px, round shape, size less than 200KB
            (Max. 4MB)
          </FormText>
        </FormGroup>

        <Button>Submit</Button>
      </Form>
    </>
  );
}
