import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "@/providers/auth-provider";
import { baseurl } from "../lib/utils";

export function JobDetail({ jobId, title, description, companyName, minExp, tags, jobType, location, isActive }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [expPoint, setExpPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Function to fetch user's experience points
  const fetchUserExp = async (userId) => {
    try {
      const response = await fetch(`${baseurl}/api/getUserExp/${userId}`);
      const data = await response.json();
      return data.expPoint;
    } catch (error) {
      console.error("Failed to fetch experience points:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchUserExp(user._id).then((points) => {
        setExpPoint(points);
        setLoading(false);
      });
    }
  }, [user, isAuthenticated]);

  const isEligible = expPoint >= minExp;

  // Function to apply for the job
  const handleApply = async () => {
    if (!isEligible) return;
    setMessage("");

    try {
      const response = await fetch(`${baseurl}/api/applyForJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, jobId })
      });

      if (response.status === 400) {
        setMessage("You have already applied for this job.");
      } else if (response.status === 201) {
        setMessage("Successfully applied for the job!");
      } else {
        setMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setMessage("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 border-t md:border-t-0 md:border-l h-full">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Company: {companyName}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Location: {location}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Job Type: {jobType}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Minimum ExpPoints: {minExp} Points</p>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Status: <span className={isActive ? "text-green-600" : "text-red-600"}>{isActive ? "Active" : "Inactive"}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Job Description</h3>
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      {!loading && (
        <div className="relative mt-6">
          <button
            onClick={handleApply}
            className={`px-4 py-2 text-white rounded-3xl ${isEligible ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isEligible}
            title={!isEligible ? "Experience points not enough" : ""}
          >
            Apply Now
          </button>
          {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
      )}
    </div>
  );
}

JobDetail.propTypes = {
  jobId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  minExp: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  jobType: PropTypes.oneOf(["remote", "on-site", "hybrid"]).isRequired,
  location: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};
