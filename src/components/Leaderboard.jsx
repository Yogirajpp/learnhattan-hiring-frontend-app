import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "@/lib/utils";
import { AuthContext } from "@/providers/auth-provider";

const Leaderboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userId, setUserId] = useState(user?._id || null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/leaderboard/${userId}`);
        setLeaderboard(response.data.topUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    if (userId) fetchLeaderboard();
  }, [userId]);

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6">
        {/* Left Empty/Additional Content (40%) */}
        <div className="w-full sm:w-2/5">
          {/* Title */}
          <h2 className="text-6xl font-bold mb-6 text-center sm:text-left">
            <span className="text-[#D8A7DF]">Top</span> Performers
          </h2>
        </div>

        {/* Right Top Performers (60%) */}
        <div className="w-full sm:w-3/5">
          {/* Top Performers Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div></div> {/* Empty cell at (0,0) */}
            {leaderboard.slice(0, 3).map((temp, index) => (
              <div
                key={temp._id}
                className="bg-white p-4 rounded-sm border border-gray-200 w-30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">
                    {temp.userId?.name || "Unknown"}
                  </h3>
                  <h3 className="text-xl font-semibold">#{index + 1}</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600">League: {temp.league}</p>
                  <p className="text-[#D8A7DF] text-xl">{temp.expPoint} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Leaderboard Table */}
      <div className="mt-6 text-center rounded-sm">
        <h3 className="text-lg font-semibold">Leaderboard</h3>
        <table className="min-w-full border border-black border-opacity-50 rounded-sm mt-4">
          <thead className="bg-[#D8A7DF]">
            <tr>
              <th className="py-2 px-4 border">Rank</th>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Exp Points</th>
              <th className="py-2 px-4 border">League</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={player._id}
                className={`text-center bg-white hover:bg-gray-100 transition ${
                  player.userId?._id === userId ? "bg-yellow-200" : ""
                }`}
              >
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{player.userId?.name}</td>
                <td className="py-2 px-4 border">{player.expPoint}</td>
                <td className="py-2 px-4 border">{player.league}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
