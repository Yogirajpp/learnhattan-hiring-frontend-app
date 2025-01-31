import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:5000");

const Issues = () => {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const issuesPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    // Emit event to fetch project issues
    socket.emit("getProjectIssues", { projectId }, (response) => {
      if (response.success) {
        setIssues(response.issues);
        setTotalPages(Math.ceil(response.issues.length / issuesPerPage));
      } else {
        console.error("Failed to fetch issues:", response.error);
      }
    });

    // Listen for real-time issue updates
    socket.on(`updateProjectIssues`, (updatedData) => {
      setIssues(updatedData.issues);
      setTotalPages(Math.ceil(updatedData.issues.length / issuesPerPage));
    });

    // Cleanup on component unmount
    return () => {
      socket.off(`updateProjectIssues`);
    };
  }, [projectId]);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedIssues = issues.slice(
    (currentPage - 1) * issuesPerPage,
    currentPage * issuesPerPage
  );

  return (
    <div>
      <Button className="mb-4" onClick={() => navigate("/projects")}>
        Back to Projects
      </Button>
      <div className=" flex gap-2">
        {/* Issues List (50% width) */}
        <div className="w-2/5 overflow-y-auto pr-4">
          {displayedIssues.length > 0 ? (
            displayedIssues.map((issue) => (
              <Card
                key={issue.url}
                className="border border-gray-200 rounded-sm cursor-pointer hover:border-blue-500 transition-colors duration-200 mb-4"
                onClick={() => handleIssueSelect(issue)}
              >
                <CardContent className="p-4">
                  {/* Issue Title */}
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {issue.title}
                  </CardTitle>

                  {/* Created By */}
                  <p className="text-gray-600 mt-1">
                    Created by:{" "}
                    <a
                      href={issue.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {issue.user.login}
                    </a>
                  </p>

                  {/* Labels */}
                  <div className="mt-3">
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {issue.labels.map((label, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Footer (Dates) */}
                <CardFooter className="flex justify-between text-sm text-gray-600 p-4 border-t border-gray-100">
                  <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No issues found for this project.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="mx-2">
              {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Selected Issue Details (50% width, Stationary) */}
        <div className="w-3/5 sticky top-0 overflow-y-auto">
          {selectedIssue ? (
            <div className="bg-white p-4 rounded-sm border">
              <h3 className="text-2xl font-semibold">{selectedIssue.title}</h3>
              <p className="text-gray-500">
                Created by:{" "}
                <a href={selectedIssue.user.html_url} target="_blank" className="text-blue-500">
                  {selectedIssue.user.login}
                </a>{" "}
                | State: {selectedIssue.state}
              </p>
              <div className="mt-2">
                {selectedIssue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedIssue.labels.map((label, idx) => (
                      <span key={idx} className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200">
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <div className="h-80 overflow-auto">
                  <p className="text-sm">{selectedIssue.body || "No description available"}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button as="a" href={selectedIssue.url} target="_blank" className="w-full">
                  View Issue on GitHub
                </Button>
                {selectedIssue.pullRequestUrl && (
                  <Button as="a" href={selectedIssue.pullRequestUrl} target="_blank" className="w-full">
                    View Pull Request
                  </Button>
                )}
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Apply Changes
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Select an issue to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;