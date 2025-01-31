import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import IssueCard from "./IssueCard";
import IssueDetail from "./IssueDetail";

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
      <div className="flex gap-2">
        {/* Issues List (40% width, Scrollable) */}
        <div className="w-2/5 overflow-y-auto pr-4">
          {displayedIssues.length > 0 ? (
            displayedIssues.map((issue) => (
              <IssueCard
                key={issue.url}
                issue={issue}
                onClick={() => handleIssueSelect(issue)}
              />
            ))
          ) : (
            <p className="text-gray-600">No issues found for this project.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-end mt-2">
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

        {/* Selected Issue Details (60% width, Stationary) */}
        <div className="w-3/5 sticky top-0 h-full overflow-y-auto">
          <IssueDetail selectedIssue={selectedIssue} />
        </div>
      </div>
    </div>
  );
};

export default Issues;
