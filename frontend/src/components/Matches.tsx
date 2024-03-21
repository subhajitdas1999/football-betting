// import { useAccount } from "wagmi";
// import { config } from "./Web3Provider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
}

interface Match {
  fixture: Fixture;
  // Add other properties as needed
}
const allMatches: Match[] = [
  {
    fixture: {
      id: 1035464,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035465,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T23:00:00+05:30",
      timestamp: 1711819800,
    },
  },
  {
    fixture: {
      id: 1035466,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T01:30:00+05:30",
      timestamp: 1711828800,
    },
  },
  {
    fixture: {
      id: 1035467,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035468,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T18:30:00+05:30",
      timestamp: 1711890000,
    },
  },
  {
    fixture: {
      id: 1035469,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T21:00:00+05:30",
      timestamp: 1711899000,
    },
  },
  {
    fixture: {
      id: 1035470,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T18:00:00+05:30",
      timestamp: 1711801800,
    },
  },
  {
    fixture: {
      id: 1035471,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035472,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035473,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035474,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-03T00:15:00+05:30",
      timestamp: 1712083500,
    },
  },
  {
    fixture: {
      id: 1035475,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-04T00:00:00+05:30",
      timestamp: 1712169000,
    },
  },
  {
    fixture: {
      id: 1035476,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-04T00:00:00+05:30",
      timestamp: 1712169000,
    },
  },
  {
    fixture: {
      id: 1035464,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035465,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T23:00:00+05:30",
      timestamp: 1711819800,
    },
  },
  {
    fixture: {
      id: 1035466,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T01:30:00+05:30",
      timestamp: 1711828800,
    },
  },
  {
    fixture: {
      id: 1035467,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035468,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T18:30:00+05:30",
      timestamp: 1711890000,
    },
  },
  {
    fixture: {
      id: 1035469,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-31T21:00:00+05:30",
      timestamp: 1711899000,
    },
  },
  {
    fixture: {
      id: 1035470,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T18:00:00+05:30",
      timestamp: 1711801800,
    },
  },
  {
    fixture: {
      id: 1035471,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035472,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035473,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-03-30T20:30:00+05:30",
      timestamp: 1711810800,
    },
  },
  {
    fixture: {
      id: 1035474,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-03T00:15:00+05:30",
      timestamp: 1712083500,
    },
  },
  {
    fixture: {
      id: 1035475,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-04T00:00:00+05:30",
      timestamp: 1712169000,
    },
  },
  {
    fixture: {
      id: 1035476,
      referee: null,
      timezone: "Asia/Kolkata",
      date: "2024-04-04T00:00:00+05:30",
      timestamp: 1712169000,
    },
  },
];

export const Matches = () => {
  // const { isConnected, address } = useAccount({ config: config });
  const { id } = useParams<{ id: string }>();
  const [league, season] = (id as string).split("-");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;
  const [hasMore, setHasMore] = useState<boolean>(true);
  console.log(league, season);

  useEffect(() => {
    // Simulated fetch of all matches for the league
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Simulated API call to fetch all matches for the league
        const data: Match[] = await fetchMatchesFromServer(page);
        // setMatches(data);
        setMatches((prevMatches) => [...prevMatches, ...data]);
        if (allMatches.length <= page * pageSize) {
          setHasMore(false); // No more data available
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1); // Load next page of matches
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading]);

  // Function to simulate fetching all matches for the league from the server
  const fetchMatchesFromServer = async (page: number): Promise<Match[]> => {
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulated data
    const newData = allMatches.slice((page - 1) * pageSize, page * pageSize);
    return newData;
  };

  return (
    <div>
      <h2>Matches Component</h2>
      {matches.map((match) => (
        <div key={match.fixture.id} className="match">
          <p>Match ID: {match.fixture.id}</p>
          <p>Referee: {match.fixture.referee || "N/A"}</p>
          <p>Date: {new Date(match.fixture.date).toLocaleString()}</p>
          {/* Render other match details */}
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};
