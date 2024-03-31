import { useAccount } from "wagmi";
import { config } from "./Web3Provider";
import { ConnectButton } from "./Header";
import { useEffect, useState } from "react";
import { axiosInstance } from "../utils";

interface Prediction {
  id: string;
  team: "home" | "away";
  fixtureId: number;
  amount: string;
  chain: string;
  walletAddress: string;
  txHash: string;
  leagueIdSeason: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
  };
}

interface MatchProps {
  fixture: Fixture;
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  predictions: Prediction[];
}

export const ProfileMatches = () => {
  const { isConnected, address } = useAccount({ config: config });
  const [matchData, setMatchData] = useState<MatchProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/v1/prediction", {
          params: { walletAddress: address },
        });
        // console.log(res.data.data);
        setMatchData(res.data.data);
        // Do something with the data
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle any errors
      }
      setLoading(false);
    };

    if (isConnected) {
      fetchData();
    }
  }, [address, isConnected]);

  if (loading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div className="min-h-screen">
      {isConnected ? (
        <div className="max-w-2xl mx-auto">
          {matchData.map((md, idx) => (
            <div
              key={idx}
              className="my-4 p-4 bg-gray-800 text-white rounded-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={md.teams.home.logo}
                    alt={md.teams.home.name}
                    className="w-10 h-10 mr-2"
                  />
                  <span>{md.teams.home.name}</span>
                </div>
                <div>
                  <p>Status: {md.fixture.status.long}</p>
                  <p>
                    Score: {md.goals.home ? md.goals.home : 0} -{" "}
                    {md.goals.away ? md.goals.away : 0}
                  </p>
                </div>
                <div className="flex items-center">
                  <span>{md.teams.away.name}</span>
                  <img
                    src={md.teams.away.logo}
                    alt={md.teams.away.name}
                    className="w-10 h-10 ml-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg">Predictions</h3>
                <div className="grid grid-cols-3 text-right border-b border-gray-700 py-2 px-2">
                  <span className="text-left">Team</span>
                  <span>Sent</span>
                  <span>Receive</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {md.predictions.map((prediction) => (
                    <PredictionRow
                      key={prediction.id}
                      prediction={prediction}
                      teamName={
                        prediction.team === "home"
                          ? md.teams.home.name
                          : md.teams.away.name
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
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

const PredictionRow: React.FC<{ prediction: Prediction; teamName: string }> = ({
  prediction,
  teamName,
}) => {
  console.log(teamName);

  const receivedAmount = 0; // Replace with actual calculation logic

  return (
    <div className="grid grid-cols-3 text-right border-b border-gray-700 py-2 px-2">
      <span className="text-left capitalize">{teamName}</span>
      <span>{prediction.amount}</span>
      <span>{receivedAmount}</span>
    </div>
  );
};
