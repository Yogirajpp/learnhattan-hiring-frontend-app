import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { FaGithub, FaCircle, FaCodeBranch, FaCode, FaStar, FaClock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

// Helper function to format numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // For millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // For thousands
  } else {
    return num; // No formatting needed for numbers less than 1000
  }
};

const ProjectCard = ({ project, onClick }) => {
  const { name, latestGitHubData = {} } = project;

  // Format the `updatedAt` date
  const formattedUpdatedAt = latestGitHubData.updatedAt
    ? `Updated ${formatDistanceToNow(new Date(latestGitHubData.updatedAt))} ago`
    : "N/A";

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer hover:bg-muted transition-all duration-200 flex flex-row items-center p-6 gap-6 border rounded-sm"
    >
      {/* Right Section: Project Details */}
      <CardContent className="flex flex-col flex-1 p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-medium text-foreground">{latestGitHubData.name}</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EBCCEF] text-sm text-foreground rounded-sm border border-border">
              <span className="font-medium">Open Issues:</span>
              <span>{formatNumber(latestGitHubData.issues || 0)}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EBCCEF] text-sm text-foreground rounded-sm border border-border">
              <FaCodeBranch className="w-4 h-4 text-black" />
              <span>{formatNumber(latestGitHubData.forks || 0)}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {latestGitHubData.description || "No description available"}
        </p>

        {/* Footer Section */}
        <CardFooter className="flex p-4 pb-0 gap-6 items-center text-sm text-muted-foreground mt-4 px-0">
          <div className="flex items-center gap-2">
            <FaCode className="w-5 h-5 text-black" />
            <span>{latestGitHubData.language || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="w-5 h-5 text-black" />
            <span>{formatNumber(latestGitHubData.stars || 0)} Stars</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="w-5 h-5 text-black" />
            <span>{formattedUpdatedAt}</span>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
