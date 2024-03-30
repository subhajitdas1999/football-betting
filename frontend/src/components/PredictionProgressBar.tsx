import { formatEther } from "viem";

interface PropsPredictionProgressBar {
  homeCount: bigint;
  awayCount: bigint;
}

export const PredictionProgressBar: React.FC<PropsPredictionProgressBar> = ({
  homeCount,
  awayCount,
}) => {
  // Calculate percentages for home and away teams
  const totalPredictions = homeCount + awayCount;
  const homePercentage =
    totalPredictions === BigInt(0)
      ? 0
      : (homeCount / totalPredictions) * BigInt(100);
  const awayPercentage =
    totalPredictions === BigInt(0)
      ? 0
      : (awayCount / totalPredictions) * BigInt(100);
  const parsedHomeCount = formatEther(homeCount);
  const parsedAwayCount = formatEther(awayCount);
  // const parsedTotalPredictions = formatEther(totalPredictions)

  return (
    <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden group">
      <div className="h-full flex">
        <div
          className="bg-blue-500 relative flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300"
          style={{ width: `${homePercentage}%` }}
          title={`Home: ${parsedHomeCount}`} // For non-CSS based tooltips
        >
          {/* The actual text should be hidden by default and only shown on hover */}
          <span className="opacity-0 group-hover:opacity-100 absolute">
            {parsedHomeCount}
          </span>
        </div>
        <div
          className="bg-green-500 relative flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300"
          style={{ width: `${awayPercentage}%` }}
          title={`Away: ${parsedAwayCount}`} // For non-CSS based tooltips
        >
          {/* Same as above for the away side */}
          <span className="opacity-0 group-hover:opacity-100 absolute">
            {parsedAwayCount}
          </span>
        </div>
      </div>
    </div>
  );
};
