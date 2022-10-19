import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Row,
} from "reactstrap";
import { FaLink } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export default function Mint() {
  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);

  console.log(query.get("id"));

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
          src="https://static.crypto.com/token/icons/celo/color_icon.png"
          className="mt-3"
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
            <p>
              Mint ends in <Badge>23h33s</Badge>
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
