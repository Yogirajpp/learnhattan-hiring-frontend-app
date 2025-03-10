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
  const [state, setState] = useState("open"); // Filter state
  const issuesPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && projectId) {
      const userId = user._id;

      socket.emit("getProjectIssues", { userId, projectId, state }, (response) => {
        if (response.success) {
          setIssues(response.issues);
          setTotalPages(Math.ceil(response.issues.length / issuesPerPage));
        } else {
          console.error("Failed to fetch issues:", response.error);
        }
      });

      socket.on(`updateProjectIssues`, (updatedData) => {
        setIssues(updatedData.issues);
        setTotalPages(Math.ceil(updatedData.issues.length / issuesPerPage));
      });

      return () => {
        socket.off(`updateProjectIssues`);
      };
    }
  }, [isAuthenticated, projectId, state]);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // **Filtering Logic**
  const filteredIssues = issues.filter((issue) => {
    if (state === "open") return issue.state === "open";
    if (state === "closed") return issue.state === "closed" && issue.pullRequestUrl === null;
    if (state === "pull_requests") return issue.state === "closed" && issue.pullRequestUrl;
    return true;
  });

  const displayedIssues = filteredIssues.slice(
    (currentPage - 1) * issuesPerPage,
    currentPage * issuesPerPage
  );

  return (
    <div>
      <Button className="mb-4" onClick={() => navigate("/projects")}>
        Back to Projects
      </Button>

      {/* Open, Closed, and Pull Requests Buttons */}
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
        <Button
          variant={state === "pull_requests" ? "default" : "outline"}
          onClick={() => setState("pull_requests")}
        >
          Pull Requests
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
