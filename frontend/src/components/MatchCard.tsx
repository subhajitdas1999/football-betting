import { useState } from "react";
import { Match } from "../interfaces";
import { formatDateTime } from "../utils";
import { PredictionProgressBar } from "./PredictionProgressBar";
import { PredictModal } from "./PredictModal";

interface Props {
  data: Match;
}

export const MatchCard: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePredictClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleTeam1Click = () => {
    console.log(`You clicked ${data.teams.home.name}`);
    // You can add additional logic here
  };

  const handleTeam2Click = () => {
    console.log(`You clicked ${data.teams.away.name}`);
    // You can add additional logic here
  };

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
          <div className="py-2 px-4">Amount of Matic:12.044</div>
        </div>
        <PredictionProgressBar homeCount={10} awayCount={36} />
      </div>
      <PredictModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        team1={data.teams.home.name}
        team2={data.teams.away.name}
        onTeam1Click={handleTeam1Click}
        onTeam2Click={handleTeam2Click}
      />
    </div>
  );
};
