import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

// import { Container } from './styles';

const Home: React.FC = () => {
  return (
    <div className="bd-masthead mb-3" id="content">
      <div className="container-xxl bd-gutter">
        <div className="col-md-8 mx-auto text-center">
          <img
            src="https://avatars.githubusercontent.com/u/114229151?s=200&v=4"
            width="200"
            height="200"
            alt="Bootstrap"
            className="d-block mx-auto mb-3"
          />
          <h1 className="mb-3 fw-semibold">Create digital souvenirs</h1>
          <p className="lead mb-4">
            Sarau is a dapp that enables users to easily collect NFTs that
            represent moments of real life.
          </p>
          <div className="d-flex flex-column flex-lg-row align-items-md-stretch justify-content-md-center gap-3 mb-4">
            <div>
              <Link to="/create">
                <Button color="info" size="lg">
                  Create your Sarau
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-muted mb-0">
            <a href="https://github.com/sarau-xyz" className="link-secondary">
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
  );
};

export default Home;
