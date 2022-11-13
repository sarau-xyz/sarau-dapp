import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "reactstrap";
import TextTransition, { presets } from "react-text-transition";
// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { RiLeafLine } from "react-icons/ri";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { BsCodeSlash } from "react-icons/bs";
import styled from "styled-components";
import { useSarauMaker } from "../hooks/useSarauMaker";

const TEXTS = ["Souvenirs", "Mementos", "Memories", "Collectibles", "Art"];

const IconBackGround = styled.div`
  background-color: white;
  border-radius: 10px;
  height: 50px;
  width: 50px;
  color: black;
  /* align-content: center; */
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SarauGradient = styled.span`
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(90deg, #35d07f, #b8eebc);
`;

const WhyUseItems = styled.div`
  display: flex;
  align-items: center;
  /* justify-items: center; */
`;

const Home: React.FC = () => {
  const sarauMaker = useSarauMaker();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <Col className="p-0 m-0">
      <section>
        <div className="mb-3 pb-3">
          <div className="container-xxl">
            <div className="col-md-8 mx-auto text-center">
              <img
                src="/images/sarau_xyz_logo.png"
                width="200"
                height="200"
                alt="Bootstrap"
                className="d-block mx-auto mb-3"
              />
              <h1 className="mb-3 fw-semibold">
                Create Digital{" "}
                <TextTransition springConfig={presets.wobbly} inline>
                  {TEXTS[index % TEXTS.length]}
                </TextTransition>
              </h1>
              <p className="lead mb-4">
                Sarau is a dapp that enables users to easily collect NFTs that
                represent moments of real life.
              </p>
              <div className="d-flex flex-column flex-lg-row align-items-md-stretch justify-content-md-center gap-3 mb-4">
                <div>
                  <Link to="/create">
                    <Button color="primary" size="lg" className="enlarge">
                      Create your Sarau
                    </Button>
                  </Link>
                </div>
              </div>
              <p className="text-muted mb-0">
                <a
                  href="https://github.com/sarau-xyz"
                  className="link-secondary"
                >
                  Source code
                </a>
                <span className="px-1">·</span>
                <a
                  href="https://twitter.com/SarauXyz"
                  className="link-secondary text-nowrap"
                >
                  Twitter
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <Container
          fluid
          style={{
            backgroundColor: "#000000",
            minHeight: 400,
          }}
          className="text-white d-flex"
        >
          <div className="my-auto mx-auto">
            <h1 className="text-center mt-3 mb-3">
              Why Use <SarauGradient>Sarau</SarauGradient> ?
            </h1>
            <Container className="pt-3">
              <Row>
                <Col md={4} className="mt-3">
                  <WhyUseItems>
                    <IconBackGround>
                      <RiLeafLine />
                    </IconBackGround>
                    <span>Low Carbon Footprint</span>
                  </WhyUseItems>
                </Col>
                <Col md={4} className="mt-3">
                  <WhyUseItems>
                    <IconBackGround>
                      <FaMoneyBillWaveAlt />
                    </IconBackGround>
                    <span>Cheap Transaction Fees</span>
                  </WhyUseItems>
                </Col>
                <Col md={4} className="mt-3">
                  <WhyUseItems>
                    <IconBackGround>
                      <BsCodeSlash />
                    </IconBackGround>
                    <span>No Code Necessary</span>
                  </WhyUseItems>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
      </section>

      <section>
        <Container
          style={{
            // backgroundColor: "#252525",
            minHeight: 400,
          }}
        >
          <div
            style={{
              paddingTop: 100,
              paddingBottom: 100,
            }}
          >
            <h1 className="text-center">See our stats</h1>
            <Row className="text-center">
              <Col>
                <h3>
                  <AnimatedNumber
                    value={sarauMaker?.data?.getNumberOfSaraus ?? 0}
                    formatValue={(v: number) => v.toFixed(0)}
                  />
                </h3>
                <span>Saraus created</span>
              </Col>
              <Col>
                <h3>
                  <AnimatedNumber
                    value={sarauMaker?.data?.getNumberOfMints ?? 0}
                    formatValue={(v: number) => v.toFixed(0)}
                  />
                </h3>
                <span>NFTs Issued </span>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section>
        <Container
          fluid
          style={{
            backgroundColor: "#000000",
            minHeight: 400,
          }}
          className="text-white d-flex"
        >
          <div className="my-auto mx-auto">
            <h1>Build With</h1>
            <Row>
              <Col>Valora</Col>
              <Col>Celo</Col>
              <Col>Lavanet</Col>
              <Col>Redstone.Finance</Col>
            </Row>
          </div>
        </Container>
      </section>
    </Col>
  );
};

export default Home;
