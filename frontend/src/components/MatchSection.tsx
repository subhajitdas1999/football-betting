import React, { useState } from "react";
import { Matches } from "./Matches";
import { ProfileMatches } from "./ProfileMatches";
// import UpcomingMatches from './UpcomingMatches';
// import YourMatches from './YourMatches';

const MatchSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"upcoming" | "yours">(
    "upcoming"
  );

  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto py-6">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-6 py-2 ${
              activeSection === "upcoming" ? "bg-blue-600" : "bg-gray-800"
            } rounded-tl-lg rounded-tr-lg focus:outline-none`}
            onClick={() => setActiveSection("upcoming")}
          >
            Upcoming Matches
          </button>
          <button
            className={`px-6 py-2 ${
              activeSection === "yours" ? "bg-blue-600" : "bg-gray-800"
            } rounded-tl-lg rounded-tr-lg focus:outline-none`}
            onClick={() => setActiveSection("yours")}
          >
            Your Matches
          </button>
        </div>
        <div className="pt-4">
          {activeSection === "upcoming" ? <Matches /> : <ProfileMatches />}
        </div>
      </div>
    </div>
  );
};

export default MatchSection;
