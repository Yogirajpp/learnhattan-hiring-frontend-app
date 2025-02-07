// Issues.jsx
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import IssueCard from "./IssueCard";
import IssueDetail from "./issueDetail";
import { baseurl } from "@/lib/utils";
import { AuthContext } from "@/providers/auth-provider";

const Issues = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState("open"); // "open" or "closed"
  const issuesPerPage = 10;

  // Create a socket instance and store it in state.
  const [socketInstance, setSocketInstance] = useState(null);

  // Initialize (or reinitialize) the socket connection on mount/refresh.
  useEffect(() => {
    // Create a new socket instance with autoConnect disabled.
    const newSocket = io(`${baseurl}`, { autoConnect: false });
    
    // Connect the socket.
    newSocket.connect();
    
    // When the connection is established, join the specific project room.
    newSocket.on("connect", () => {
      console.log("Socket connected with id:", newSocket.id);
      if (projectId) {
        newSocket.emit("joinProject", { projectId });
      }
    });

    // Save the socket instance in state.
    setSocketInstance(newSocket);

    // Cleanup on component unmount: disconnect the socket.
    return () => {
      newSocket.disconnect();
    };
  }, [projectId]); // Re-run when projectId changes (or on refresh)

  // Use the socket instance to fetch issues and listen for updates.
  useEffect(() => {
    if (isAuthenticated && projectId && socketInstance) {
      const userId = user._id;
      console.log(`Fetching ${state} issues for user:`, userId);

      // Request the project issues from the server.
      // The server should return an object: { open: [...], closed: [...] }.
      socketInstance.emit("getProjectIssues", { userId, projectId, state }, (response) => {
        if (response.success) {
          // Filter the issues based on the selected state.
          const filteredIssues = response.issues[state] || [];
          setIssues(filteredIssues);
          setTotalPages(Math.ceil(filteredIssues.length / issuesPerPage));
          setCurrentPage(1); // Reset to first page on state change.
        } else {
          console.error("Failed to fetch issues:", response.error);
        }
      });

      // Listen for real-time updates from the server.
      socketInstance.on("updateProjectIssues", (updatedData) => {
        // updatedData.issues is an object: { open: [...], closed: [...] }.
        const filteredIssues = updatedData.issues[state] || [];
        setIssues(filteredIssues);
        setTotalPages(Math.ceil(filteredIssues.length / issuesPerPage));
      });

      // Cleanup the update listener when dependencies change.
      return () => {
        socketInstance.off("updateProjectIssues");
      };
    }
  }, [isAuthenticated, projectId, state, user, socketInstance]);

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
            <p className="text-gray-600">
              No {state} issues found for this project.
            </p>
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
