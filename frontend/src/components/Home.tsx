import { Link } from "react-router-dom";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PGDaHArIPOz
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Home() {
  const data = [
    {
      id: 39,
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png",
      season: 2023,
      start: "2023-08-11",
      end: "2024-05-19",
    },
    {
      id: 39,
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png",
      season: 2023,
      start: "2023-08-11",
      end: "2024-05-19",
    },
    {
      id: 39,
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png",
      season: 2023,
      start: "2023-08-11",
      end: "2024-05-19",
    },
  ];

  // useEffect(() => {
  //     fetch('https://api.example.com/data')
  //       .then(response => response.json())
  //       .then(json => setData(json))
  //       .catch(error => console.error(error));
  //   }, []);
  return (
    <div className="text-white min-h-screen">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 w-fit mx-auto">SOME TEXT</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.map((ele, idx) => (
            <Link to={`/league/${ele.id}`}>
              <div
                key={idx}
                className="p-4 rounded-lg border-gray-300 border transform transition-all hover:scale-105"
              >
                <h2 className="text-2xl font-bold mb-2">{ele.name}</h2>
                <p className="text-gray-400">Season {ele.season}</p>
                <img
                  alt="League 1"
                  className="mt-4 rounded-lg bg-gray-100"
                  height="100"
                  src={ele.logo}
                  style={{
                    objectFit: "cover",
                  }}
                  width="200"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
