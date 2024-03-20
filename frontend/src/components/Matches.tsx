import { useAccount } from "wagmi";
import { config } from "./Web3Provider";

export const Matches = () => {
  const { isConnected, address } = useAccount({ config: config });
  console.log(isConnected, address);
  // useAccountEffect({
  //   onConnect(data) {
  //     console.log("Connected!", data);
  //   },
  //   onDisconnect() {
  //     console.log("Disconnected!");
  //   },
  // });
  return <>{isConnected ? <div>connected</div> : <div>Not connected</div>}</>;
};
