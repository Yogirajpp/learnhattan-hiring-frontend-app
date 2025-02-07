import { AuthContext } from "@/providers/auth-provider";
import { useContext, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { baseurl } from "@/lib/utils";
import { FaBell } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [jobsApplied, setJobsApplied] = useState([]);
  const [issuesEnrolled, setIssuesEnrolled] = useState([]);

  const tabs = ["Overview", "Jobs Applied", "Issues Enrolled"];

  const [githubBio, setGithubBio] = useState("");

  useEffect(() => {
    fetch(`https://api.github.com/users/${user.name}`)
      .then((response) => response.json())
      .then((data) => setGithubBio(data.bio || "No bio available"))
      .catch((error) => console.error("Error fetching GitHub bio:", error));
  }, []);

  useEffect(() => {
    if (selectedTab === "Jobs Applied" && user?._id) {
      fetchJobsApplied(user._id);
    }
    if (selectedTab === "Issues Enrolled" && user?._id) {
      fetchIssuesEnrolled(user._id);
    }
  }, [selectedTab, user]);

  const fetchJobsApplied = async (userId) => {
    try {
      const response = await fetch(`${baseurl}/api/jobsApplied/${userId}`);
      const data = await response.json();
      setJobsApplied(data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchIssuesEnrolled = async (userId) => {
    try {
      const response = await fetch(`${baseurl}/api/issuesEnrolled/${userId}`);
      const data = await response.json();
      setIssuesEnrolled(data.issues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  return (
    <div className="p-6 w-full mx-auto">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Navbar */}
      <div className="flex justify-start gap-6 mb-2 border-b pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`text-lg font-medium ${selectedTab === tab ? "text-[#D8A7DF]" : "text-gray-600"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Overview" && (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-1 h-full">
            {/* Left Side: Avatar and Details */}
            <Card className="flex flex-col border border-black border-opacity-50 p-4 h-full">
              <div className="flex flex-row items-center justify-start">
                <Avatar className="w-24 h-24 rounded-full">
                  {user.avatar && <img src={user.avatar} alt="User Avatar" className="rounded-full" />}
                </Avatar>
                <div className="pl-4">
                  <CardTitle className="text-2xl font-semibold">{user.name}</CardTitle>
                </div>
              </div>
              <div className="p-5 flex-1">
                <p className="text-gray-800">Role: {user.role}</p>
                <p className="text-gray-800">Provider: {user.provider}</p>
                <p className="text-gray-800">Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-800">Updated At: {new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </Card>

            {/* Right Side: Stats and Notifications */}
            <div className="flex flex-col h-full">
              {/* Notifications Section */}
              <Card className="flex items-center justify-between border border-black border-opacity-50 mb-2 p-2">
                <div className="flex items-center gap-2">
                  <FaBell className="text-xl text-gray-700" />
                  <h2 className="text-xl font-semibold">Notifications</h2>
                </div>
                <FaArrowRight className="text-xl text-gray-700" />
              </Card>

              {/* Stats Section */}
              <Card className="border p-3 border-black border-opacity-50 text-gray-800 flex-1">
                <h2 className="text-2xl font-semibold mb-3">Stats</h2>
                <div className="flex justify-between">
                  <p>ExpPoints:</p> <p>{5}</p>
                </div>
                <div className="flex justify-between">
                  <p>Leagues:</p> <p>{"Bronze 3"}</p>
                </div>
                <div className="flex justify-between">
                  <p>Issues Solved:</p> <p>{5}</p>
                </div>
                <div className="flex justify-between">
                  <p>Project Contributions:</p> <p>{2}</p>
                </div>
                <div className="flex justify-between">
                  <p>Rank:</p> <p>{12}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* New Row with Additional Cards */}
          <div className="grid grid-cols-2 gap-1 mt-2">
            {/* About Me Section */}
            <Card className="p-4 border border-black border-opacity-50">
              <h2 className="text-2xl font-semibold mb-3">About Me</h2>
              <p className="text-gray-800">{githubBio}</p>
            </Card>

            {/* GitHub ReadMe Stats */}
            <Card className="flex justify-center items-center">
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${user.name}&show_icons=true&locale=en&layout=compact`}
                alt="languages_used"
                className="w-full h-full object-cover"
              />
            </Card>

          </div>
        </div>
      )}

      {selectedTab === "Jobs Applied" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
          {jobsApplied.length === 0 ? (
            <p className="text-gray-600">No jobs applied yet.</p>
          ) : (
            <ul>
              {jobsApplied.map((job) => (
                <li key={job._id} className="border-b py-2">
                  <p className="text-lg font-medium">{job.title}</p>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-gray-500">Location: {job.location}</p>
                  <p className="text-gray-500">Experience Required: {job.minExp} years</p>
                  <p className="text-gray-500">Tags: {job.tags.join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedTab === "Issues Enrolled" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Issues Enrolled</h2>
          {issuesEnrolled.length === 0 ? (
            <p className="text-gray-600">No issues enrolled yet.</p>
          ) : (
            <ul>
              {issuesEnrolled.map((issue) => (
                <li key={issue._id} className="border-b py-2">
                  <a
                    href={`https://www.github.com/${issue.owner}/${issue.repo}/pull/${issue.issue_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {issue.owner}/{issue.repo} - Issue #{issue.issue_number}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
