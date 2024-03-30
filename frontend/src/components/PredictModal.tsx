import { useState } from "react";
import ReactDOM from "react-dom";
import polygonIcon from "../assets/polygon.png";
import closeIcon from "../assets/close.png";
import { axiosInstance } from "../utils";
import { BettingContractAbi } from "../abi/bettingContract";
import { parseEther } from "viem";
import { writeContract, readContract } from "@wagmi/core";
import { config } from "./Web3Provider";
import { useAccount } from "wagmi";
import { getClient } from "@wagmi/core";
import { waitForTransactionReceipt } from "viem/actions";
import { defaultWagmiConfig } from "../utils/defaultWagmiConfig";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixtureId: number;
  gameStartTimeStamp: number;
  home: string;
  away: string;
}

export const PredictModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  fixtureId,
  gameStartTimeStamp,
  home,
  away,
}) => {
  const [amount, setAmount] = useState("");
  const { isConnected, address } = useAccount({ config: config });

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleTeam1Click = () => {
    handleTeamClick("home");
    // You can add additional logic here
  };

  const handleTeam2Click = () => {
    handleTeamClick("away");

    // You can add additional logic here
  };
  const handleTeamClick = async (team: string) => {
    //will check if the fixture ID game already present
    if (isConnected) {
      const res = await axiosInstance.get("/v1/prediction/check", {
        params: { fixtureId, gameStartTimeStamp },
      });
      console.log({ res });
      //then check from smart contract
      const canPredict = await readContract(config, {
        abi: BettingContractAbi,
        address: "0xC1A566F0a33549bAa344e23282705A7008dCb4E8",
        functionName: "canPredictGame",
        args: [fixtureId],
      });
      let result;
      try {
        if (!res.data.data) {
          console.log("here register");

          //register and predict
          result = await writeContract(config, {
            abi: BettingContractAbi,
            address: "0xC1A566F0a33549bAa344e23282705A7008dCb4E8",
            functionName: "registerAndPredictGame",
            args: [
              fixtureId,
              gameStartTimeStamp,
              team === "home" ? 0 : 1,
              res.data.offChainHash,
            ],
            value: parseEther(amount),
          });
          console.log({ result });
        } else {
          //predict
          if (canPredict) {
            console.log("here predict");
            result = await writeContract(config, {
              abi: BettingContractAbi,
              address: "0xC1A566F0a33549bAa344e23282705A7008dCb4E8",
              functionName: "predictGame",
              args: [fixtureId, team === "home" ? 0 : 1],
              value: parseEther(amount),
            });
            console.log({ result });
          } else {
            //can not predict
            alert("Cannot predict this game");
          }
        }
        const client = getClient(defaultWagmiConfig);
        const transactionReceipt = await waitForTransactionReceipt(client, {
          confirmations: 3,
          hash: result as `0x${string}`,
        });
        console.log(transactionReceipt);

        //save the data to db
        await axiosInstance.post("/v1/prediction/add", {
          team,
          amount: amount,
          fixtureId: fixtureId.toString(),
          chain: "MATIC",
          walletAddress: address,
          txHash: result,
          leagueIdSeason: "39-2023",
        });
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        alert(err.shortMessage);
      }

      // console.log(canPredict);
    } else {
      alert("Connect you Wallet");
    }
  };
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl w-auto relative max-w-lg">
        <button onClick={handleClose} className="absolute top-0 right-0 m-2">
          <img src={closeIcon} alt="close" className="h-4 w-4" />
        </button>
        <h1 className="text-3xl font-bold mb-4 text-center">
          Predict for your team !!!!
        </h1>
        <h3 className=" text-base mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde soluta
          nisi assumenda officiis vel dolores quidem laudantium adipisci
          sapiente vitae architecto iusto, minus placeat et voluptatem,
          doloribus tenetur velit earum, illum possimus voluptatum
        </h3>
        <div className="flex space-x-2 my-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-1 rounded bg-gray-700 border-gray-600 text-white flex-grow"
            placeholder="Matic amount you want to bet"
          />
          <div className="flex items-center justify-center">
            <img src={polygonIcon} alt="coin icon" className="h-6 w-6" />
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button
            onClick={handleTeam1Click}
            className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600 w-full mr-2"
          >
            {home}
          </button>
          <button
            onClick={handleTeam2Click}
            className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600 w-full ml-2"
          >
            {away}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("root") as HTMLElement
  );
};
