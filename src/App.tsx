import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultProvider } from "ethers";
import Header from "./components/Header";
import Create from "./pages/create";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import Mint from "./pages/mint";
import "./App.css";
import Home from "./pages/home";
import { CUSTOM_CHAINS } from "./constants/CUSTOM_CHAINS";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, provider } = configureChains(Object.values(CUSTOM_CHAINS), [
  publicProvider(),
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

function App() {
  return (
    <Router>
      <WagmiConfig client={client}>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/mint" element={<Mint />} />
          </Routes>
        </Container>
      </WagmiConfig>
    </Router>
  );
}

export default App;
