import { Link } from "react-router-dom";
import { Match } from "../interfaces";

interface Props {
  data: Match;
}
function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit", // '2-digit' or 'numeric'
    month: "short", // 'numeric', '2-digit', 'narrow', 'short', or 'long'
    year: "numeric", // '2-digit' or 'numeric'
    hour: "2-digit", // '2-digit' or 'numeric'
    minute: "2-digit", // '2-digit' or 'numeric'
    hour12: false,
  };

  // Split the date and time to remove the comma after the year
  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}

export const MatchCard: React.FC<Props> = ({ data }) => {
  return (
    <Link to={`/league/${data.fixture.id}-${data.fixture.date}`}>
      <div className="p-4 rounded-lg border border-gray-300 transform transition-all hover:scale-105 max-w-xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <img
                alt={data.teams.home.name}
                className="w-20 h-20 rounded-full bg-gray-100 object-cover"
                src={data.teams.home.logo}
              />
              <h2 className="text-xl font-bold mt-2">{data.teams.home.name}</h2>
            </div>
            <span className="text-2xl font-bold">vs</span>
            <div className="flex flex-col items-center">
              <img
                alt={data.teams.away.name}
                className="w-20 h-20 rounded-full bg-gray-100 object-cover"
                src={data.teams.away.logo}
              />
              <h2 className="text-xl font-bold mt-2">{data.teams.away.name}</h2>
            </div>
          </div>
          <p className="text-gray-400 mt-4">
            {formatDateTime(data.fixture.date)}
          </p>
        </div>
      </div>
    </Link>
  );
};
