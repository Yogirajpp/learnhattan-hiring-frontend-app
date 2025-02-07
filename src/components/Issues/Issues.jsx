import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import IssueCard from "./IssueCard";
import IssueDetail from "./issueDetail";
import { baseurl } from "@/lib/utils";
import { AuthContext } from "@/providers/auth-provider";

const socket = io(`${baseurl}`);

const Issues = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState("open"); // New state for issue filter
  const issuesPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && projectId) {
      const userId = user._id;
      console.log(`Fetching ${state} issues for user:`, userId);

      // Emit event to fetch project issues with the selected state (open/closed)
      socket.emit("getProjectIssues", { userId, projectId, state }, (response) => {
        if (response.success) {
          console.log(response.issues.slice(0, 3));
          setIssues(response.issues);
          setTotalPages(Math.ceil(response.issues.length / issuesPerPage));
          setCurrentPage(1); // Reset to first page on state change
        } else {
          console.error("Failed to fetch issues:", response.error);
        }
      });

      // Listen for real-time issue updates
      socket.on(`updateProjectIssues`, (updatedData) => {
        setIssues(updatedData.issues);
        setTotalPages(Math.ceil(updatedData.issues.length / issuesPerPage));
      });

      return () => {
        socket.off(`updateProjectIssues`);
      };
    }
  }, [isAuthenticated, projectId, state]); // Re-run when `state` changes

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
      {/* Navigation Button */}
      <Button className="mb-4" onClick={() => navigate("/projects")}>
        Back to Projects
      </Button>

      {/* Open Issues & Closed Issues Buttons */}
      <div className="flex gap-4 mb-4">
        <Button
          variant={state === "open" ? "default" : "outline"}
          onClick={() => setState("open")}
        >
          Open Issues
        </Button>
        <Button
          variant={state === "closed" ? "default" : "outline"}
          onClick={() => setState("closed")}
        >
          Closed Issues
        </Button>
      </div>

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
            <p className="text-gray-600">No {state} issues found for this project.</p>
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
