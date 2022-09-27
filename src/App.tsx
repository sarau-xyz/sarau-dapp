import "./App.css";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import Header from "./components/Header";
import Create from "./pages/create";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function App() {
  return (
    <Router>
      <WagmiConfig client={client}>
        <div className="App">
          <Header />
          <Routes>
          <Route path="/" element={<Create />}/>
            <Route path="/create" element={<Create />}/>
            <Route path="/mint" element={<Create />}/>
          </Routes>
        </div>
      </WagmiConfig>
    </Router>
  );
}

export default App;
