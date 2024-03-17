import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import { Test } from "./components/Test";
import { Web3Provider } from "./components/Web3Provider";

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
              {/* <Route path="about" element={<AboutPage />} /> */}
              <Route path="/league/:id" element={<Test />} />
            </Routes>
          </BrowserRouter>
          {/* Rest of your app content */}
        </Web3Provider>
      </div>
    </>
  );
}

export default App;
