interface PropsPredictionProgressBar {
  homeCount: number;
  awayCount: number;
}

export const PredictionProgressBar: React.FC<PropsPredictionProgressBar> = ({
  homeCount,
  awayCount,
}) => {
  // Calculate percentages for home and away teams
  const totalPredictions = homeCount + awayCount;
  const homePercentage = (homeCount / totalPredictions) * 100;
  const awayPercentage = (awayCount / totalPredictions) * 100;

  return (
    <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden group">
      <div className="h-full flex">
        <div
          className="bg-blue-500 relative flex items-center justify-center group-hover:bg-blue-700 transition-colors duration-300"
          style={{ width: `${homePercentage}%` }}
          title={`Home: ${homeCount}`} // For non-CSS based tooltips
        >
          {/* The actual text should be hidden by default and only shown on hover */}
          <span className="opacity-0 group-hover:opacity-100 absolute">
            {homeCount}
          </span>
        </div>
        <div
          className="bg-green-500 relative flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300"
          style={{ width: `${awayPercentage}%` }}
          title={`Away: ${awayCount}`} // For non-CSS based tooltips
        >
          {/* Same as above for the away side */}
          <span className="opacity-0 group-hover:opacity-100 absolute">
            {awayCount}
          </span>
        </div>
      </div>
    </div>
  );
};
