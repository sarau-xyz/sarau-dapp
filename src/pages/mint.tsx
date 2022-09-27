import {
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Row,
} from "reactstrap";
import { FaLink } from "react-icons/fa";

export default function Mint() {
  return (
    <Row>
      <Card
        style={{
          width: "18rem",
        }}
        className="mx-auto"
      >
        <img
          alt="Sample"
          src="https://he-s3.s3.amazonaws.com/media/sprint/celo-hackathon/b6c7fceBuild-with-Celo-Prizes-NFTs.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6I2ISGOYH7WWS3G5%2F20220927%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20220927T215443Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=313d18308c93cb861b581ca6e9983e7639c9035f0fdce93c25d9112070970da1"
        />
        <CardBody>
          <CardTitle tag="h5">Build With Celo ReFi Hackathon '22</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            BWCH2022
          </CardSubtitle>
          <CardText>
            {/* Some quick example text to build on the card title and make up the
            bulk of the card‘s content. */}
            <p style={{ cursor: "pointer" }}>
              <FaLink /> celo.org
            </p>
          </CardText>
          <Button color="primary" block>
            Mint
          </Button>
        </CardBody>
      </Card>
    </Row>
  );
}
