// import { useAccount } from "wagmi";
// import { config } from "./Web3Provider";
// import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MatchCard } from "./MatchCard";
import { Match } from "../interfaces";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MatchCardPlaceholder } from "./MatchCardPlaceholder";

export const Matches = () => {
  // const { isConnected, address } = useAccount({ config: config });
  const { id } = useParams<{ id: string }>();
  const [league, season] = (id as string).split("-");
  const [matches, setMatches] = useState<Match[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 16;
  const [hasMore, setHasMore] = useState<boolean>(true);
  // console.log(league, season);
  // Fetch all matches once
  useEffect(() => {
    setLoading(true);
    const params = { league, season, timezone: "Asia/Kolkata", status: "NS" };
    const headers = {
      "Content-Type": "application/json",
      "x-rapidapi-key": import.meta.env.VITE_APISPORTSKEY,
      "x-rapidapi-host": import.meta.env.VITE_APISPORTSHOST,
    };
    axios
      .get("https://v3.football.api-sports.io/fixtures", { headers, params })
      .then((response) => {
        setAllMatches(response.data.response);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [league, season]); // Depends on league and season

  // Handle infinite scroll and data slicing
  useEffect(() => {
    if (!loading && allMatches.length) {
      const newData = allMatches.slice((page - 1) * pageSize, page * pageSize);
      setMatches((prevMatches) => [...prevMatches, ...newData]);
      setHasMore(newData.length === pageSize);
    }
  }, [page, allMatches, loading]); // Now also depends on allMatches

  // Infinite scroll logic remains the same
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2 w-fit mx-auto">
          Upcoming Matches
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {loading
          ? Array.from({ length: pageSize }).map((_, idx) => (
              <MatchCardPlaceholder key={idx} />
            ))
          : matches.map(
              (match, idx) => <MatchCard data={match} key={idx} />
              // </Link>
            )}
      </div>
    </div>
  );
};
