
import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"; // Update to match your file structure

const IssueCard = ({ project, onClick }) => {
  const { name, latestGitHubData = {} } = project;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all"
    >
      <CardContent className="flex flex-col">
        <CardTitle className="text-xl font-semibold mb-2">{name}</CardTitle>
        <p className="text-sm text-gray-600 mb-4">
          {latestGitHubData.description || "No description available"}
        </p>
        <CardFooter className="flex justify-between text-sm text-gray-500 mt-auto">
          <span>Lang: {latestGitHubData.language || "N/A"}</span>
          <span>Stars: {latestGitHubData.stars || "0"}</span>
          <span>Last Activity: {latestGitHubData.updatedAt || "N/A"}</span>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default IssueCard;
