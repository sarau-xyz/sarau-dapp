
import React from "react";
import {Button} from "reactstrap";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { truncateMiddle } from "../utils/truncateMiddle";

const ConnectWallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <Button color="danger">{isConnected ? (
      truncateMiddle(address!, 4, 4, 6)
    ) : (
      <>
        <LinkIcon
          className="-ml-1 mr-2 h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
        Connect Wallet
      </>
    )}</Button>
    <button
      type="button"
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => connect()}
    >
      
    </button>
  );
};

export default ConnectWallet;
