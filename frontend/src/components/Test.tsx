import { useAccount } from "wagmi";
import { config } from "./Web3Provider";

export const Test = () => {
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
  return (
    <div className=" min-h-screen">
      {isConnected ? <div>connected</div> : <div>Not connected</div>}
    </div>
  );
};
