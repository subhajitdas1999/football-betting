import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import { Web3Provider } from "./components/Web3Provider";
import { Matches } from "./components/Matches";
import { MatchDetails } from "./components/MatchDetails";

function App() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen text-white font-mono">
        <Web3Provider>
          <Header />
          {/* <Test /> */}
          {/* <Home /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/league/:id" element={<Matches />} />
              <Route
                path="/league/:id/fixture/:fixtureId"
                element={<MatchDetails />}
              />
            </Routes>
          </BrowserRouter>
          {/* Rest of your app content */}
        </Web3Provider>
      </div>
    </>
  );
}

export default App;
