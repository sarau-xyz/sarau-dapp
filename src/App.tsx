import "bootstrap/dist/css/bootstrap.min.css";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import Header from "./components/Header";
import Create from "./pages/create";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import Mint from "./pages/mint";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function App() {
  return (
    <Router>
      <WagmiConfig client={client}>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Create />} />
            <Route path="/create" element={<Create />} />
            <Route path="/mint" element={<Mint />} />
          </Routes>
        </Container>
      </WagmiConfig>
    </Router>
  );
}

export default App;
