import { ConnectKitButton } from "connectkit";
import { Web3Provider } from "./components/Web3Provider";
import { Test } from "./components/Test";

function App() {
  return (
    <Web3Provider>
      <ConnectKitButton />
      <Test />
    </Web3Provider>
  );
}

export default App;
