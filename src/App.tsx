import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Header from "./components/Header";
import Create from "./pages/create";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import Mint from "./pages/mint";
import Home from "./pages/home";
import { CUSTOM_CHAINS } from "./constants/CUSTOM_CHAINS";
import { ChainIdProvider } from "./providers/ChainIdProvider";
import {
  connectorsForWallets,
  RainbowKitProvider,
  // Wallet,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  omniWallet,
  walletConnectWallet,
  trustWallet,
  coinbaseWallet,
  braveWallet,
} from "@rainbow-me/rainbowkit/wallets";
import Valora from "./wallets/Valora";
import CeloWallet from "./wallets/CeloWallet";
import CeloDance from "./wallets/CeloDance";

const { chains, provider } = configureChains(Object.values(CUSTOM_CHAINS), [
  publicProvider(),
]);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended with CELO",
    wallets: [
      Valora({ chains }),
      CeloWallet({ chains }),
      CeloDance({ chains }),
      metaMaskWallet({ chains }),
      omniWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
  {
    groupName: "Also works",
    wallets: [
      trustWallet({ chains }),
      coinbaseWallet({ appName: "SarauXYZ", chains }),
      braveWallet({ chains }),
    ],
  },
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <ChainIdProvider>
      <WagmiConfig client={client}>
        <RainbowKitProvider coolMode chains={chains}>
          <Router>
            <Header />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/mint" element={<Mint />} />
              </Routes>
            </Container>
          </Router>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChainIdProvider>
  );
}

export default App;
