import "./App.css";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from "ethers";
import Header from "./components/Header";
import CreateSarau from "./pages/create-sarau";
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
          <Route path="/" element={<CreateSarau />}/>
            <Route path="/create" element={<CreateSarau />}/>
            <Route path="/mint" element={<CreateSarau />}/>
          </Routes>
        </div>
      </WagmiConfig>
    </Router>
  );
}

export default App;
