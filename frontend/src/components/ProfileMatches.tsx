import { useAccount } from "wagmi";
import { config } from "./Web3Provider";
import { ConnectButton } from "./Header";
import { useEffect } from "react";
import { axiosInstance } from "../utils";

export const ProfileMatches = () => {
  const { isConnected, address } = useAccount({ config: config });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/v1/prediction", {
          params: { walletAddress: address },
        });
        console.log(res.data.data);

        // Do something with the data
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle any errors
      }
    };

    if (isConnected) {
      fetchData();
    }
  }, [address, isConnected]);

  return (
    <div className="min-h-screen">
      {isConnected ? (
        <div>connected</div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div>
            <div className="">
              <ConnectButton />
            </div>
            <div>Connect your wallet</div>
          </div>
        </div>
      )}
    </div>
  );
};
