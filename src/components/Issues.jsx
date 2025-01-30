// src/components/Issues.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:5000");

const Issues = () => {
  const { projectId } = useParams();
  console.log(projectId);
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    // Emit event to fetch project issues
    socket.emit("getProjectIssues", { projectId }, (response) => {
      console.log('running')
      if (response.success) {
        console.log("Fetched issues:", response);
        setIssues(response.issues);
      } else {
        console.error("Failed to fetch issues:", response.error);
      }
    });

    // Listen for real-time issue updates with correct event name
    socket.on(`updateProjectIssues`, (updatedData) => {
      console.log("Received real-time issue updates:", updatedData);
      setIssues(updatedData.issues);
    });

    // Cleanup on component unmount
    return () => {
      socket.off(`updateProjectIssues`); // Listen for updates, not projectId directly
      // socket.disconnect();
    };
  }, [projectId]);

  return (
    <div className="p-4">
      <Button className="mb-4" onClick={() => navigate("/")}>
        Back to Projects
      </Button>
      <h2 className="text-xl font-semibold mb-4">Project Issues</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <Card key={issue.url} className="hover:shadow-lg">
              <CardContent>
                <CardTitle className="text-xl font-bold">{issue.title}</CardTitle>
                <p className="text-gray-500">
                  Created by: {issue.user} | State: {issue.state}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between text-sm">
                <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</span>
              </CardFooter>
              <Button as="a" href={issue.url} target="_blank" className="mt-2 w-full">
                View Issue on GitHub
              </Button>
            </Card>
          ))
        ) : (
          <p>No issues found for this project.</p>
        )}
      </div>
    </div>
  );
};

export default Issues;
