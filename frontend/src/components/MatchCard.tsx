/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { Match } from "../interfaces";
import { formatDateTime } from "../utils";
import { PredictionProgressBar } from "./PredictionProgressBar";
import { PredictModal } from "./PredictModal";
import { BettingContractAbi } from "../abi/bettingContract";
import { readContract } from "wagmi/actions";
import { config } from "./Web3Provider";
import { formatEther } from "viem";

interface Props {
  data: Match;
}

export const MatchCard: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homeCount, setHomeCount] = useState(BigInt(0));
  const [awayCount, setAwayCount] = useState(BigInt(0));

  const handlePredictClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    (async () => {
      const game = await readContract(config, {
        abi: BettingContractAbi,
        address: "0xC1A566F0a33549bAa344e23282705A7008dCb4E8",
        functionName: "games",
        args: [data.fixture.id],
      });
      ///@ts-expect-error
      setHomeCount(game[2]);
      ///@ts-expect-error
      setAwayCount(game[3]);
    })();
  }, [data.fixture.id]);

  return (
    <div className="p-4 rounded-lg border border-gray-300 transform transition-all hover:scale-105 max-w-xl mx-auto w-full">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <img
              alt={data.teams.home.name}
              className="w-20 h-20 rounded-full bg-gray-100 object-cover"
              src={data.teams.home.logo}
            />
            <h2 className="text-xl font-bold mt-2 min-w-[150px]">
              {data.teams.home.name}
            </h2>
          </div>
          <span className="text-2xl font-bold">vs</span>
          <div className="flex flex-col items-center">
            <img
              alt={data.teams.away.name}
              className="w-20 h-20 rounded-full bg-gray-100 object-cover"
              src={data.teams.away.logo}
            />
            <h2 className="text-xl font-bold mt-2 min-w-[150px]">
              {data.teams.away.name}
            </h2>
          </div>
        </div>
        <p className="text-gray-400 mt-4 h-6">
          {formatDateTime(data.fixture.date)}
        </p>
        <div className="my-4 flex justify-center align-middle w-full">
          <div className="">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePredictClick}
            >
              Predict
            </button>
          </div>
          <div className="py-2 px-4">
            Total Invested : {formatEther(homeCount + awayCount)} Matic
          </div>
        </div>
        <PredictionProgressBar homeCount={homeCount} awayCount={awayCount} />
      </div>
      <PredictModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fixtureId={data.fixture.id}
        gameStartTimeStamp={data.fixture.timestamp}
        home={data.teams.home.name}
        away={data.teams.away.name}
      />
    </div>
  );
};
