import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DataObject {
  leagueId: number;
  name: string;
  logo: string;
  season: number;
  start: string;
  end: string;
  // Add more properties as needed
}

export default function Home() {
  const [data, setData] = useState<DataObject[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/data/getAllLeagues`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="text-white overflow-hidden min-h-screen">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 w-fit mx-auto">SOME TEXT</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.map((ele, idx) => (
            <Link to={`/league/${ele.leagueId}-${ele.season}`} key={idx}>
              <div className="p-4 rounded-lg border-gray-300 border transform transition-all hover:scale-105">
                <h2 className="text-2xl font-bold mb-2">{ele.name}</h2>
                <p className="text-gray-400">Season {ele.season}</p>
                <img
                  alt="League"
                  className="mt-4 rounded-lg bg-gray-100"
                  src={ele.logo}
                  style={{
                    objectFit: "cover",
                    width: "200px",
                    height: "auto",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
