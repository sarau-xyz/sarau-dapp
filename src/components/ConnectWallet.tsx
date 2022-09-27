import React from "react";
import { Button } from "reactstrap";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { truncateMiddle } from "../utils/truncateMiddle";
import { FaLink } from "react-icons/fa";

const ConnectWallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <Button color="info" onClick={() => connect()}>
      {isConnected ? (
        truncateMiddle(address!, 4, 4, 6)
      ) : (
        <>
          <FaLink
            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
            aria-hidden="true"
          />{" "}
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectWallet;
