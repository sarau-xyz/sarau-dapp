import React from "react";
import { Button } from "reactstrap";
import { useAccount, useClient, useConnect } from "wagmi";
import { truncateMiddle } from "../utils/truncateMiddle";
import { FaLink } from "react-icons/fa";

const ConnectWallet: React.FC = () => {
  const client = useClient();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <Button
      color="info"
      onClick={() =>
        connect({
          connector: connectors.at(0),
        })
      }
    >
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
