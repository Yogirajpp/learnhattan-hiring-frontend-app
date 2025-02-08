import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "@/lib/utils";
import { AuthContext } from "@/providers/auth-provider";

const Leaderboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState(null);

  const userId = user?._id;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/leaderboard/${userId}`);
        setLeaderboard(response.data.topUsers);
        setUserRank(response.data.userRank);
        setUserData(response.data.userData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">
        <p><span className="text-[#D8A7DF]">Top</span> Performers</p>
      </h2>

      {/* Top 3 Users Cards */}
      <div className="flex justify-center gap-4 mb-6">
        {leaderboard.slice(0, 3).map((temp, index) => (
          <div
            key={temp._id}
            className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-200 w-1/3"
          >
            <h3 className="text-xl font-semibold">
              #{index + 1} {temp.userId?.name || "Unknown"}
            </h3>
            <p className="text-gray-600">Exp Points: {temp.expPoint}</p>
            <p className="text-gray-600">League: {temp.league}</p>
          </div>
        ))}
      </div>

      {/* User's Rank Table */}
      {userData && (
        <div className="mt-6 text-center rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Your Rank</h3>
          <table className="min-w-full border border-black border-opacity-50 shadow-lg rounded-lg mt-4">
            <thead className="bg-[#D8A7DF]">
              <tr>
                <th className="py-2 px-4 border">Rank</th>
                <th className="py-2 px-4 border">User</th>
                <th className="py-2 px-4 border">Exp Points</th>
                <th className="py-2 px-4 border">League</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center bg-white hover:bg-gray-100 transition">
                <td className="py-2 px-4 border">{userRank}</td>
                <td className="py-2 px-4 border">{userData.userId?.name}</td>
                <td className="py-2 px-4 border">{userData.expPoint}</td>
                <td className="py-2 px-4 border">{userData.league}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
