import Header from "./components/Header";
import { Test } from "./components/Test";
import { Web3Provider } from "./components/Web3Provider";

function App() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen text-white font-mono">
        <Web3Provider>
          <Header />
          <Test />
          {/* Rest of your app content */}
        </Web3Provider>
      </div>
    </>
  );
}

export default App;
