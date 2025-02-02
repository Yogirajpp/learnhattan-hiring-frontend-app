import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { io } from "socket.io-client";
import { AuthContext } from "@/providers/auth-provider";

const socket = io("http://localhost:5000"); // Adjust to match your backend

const IssueDetail = ({ selectedIssue }) => {
  const { user, isAuthenticated } = useContext(AuthContext); // Access user and isAuthenticated from AuthContext
  console.log("User:", user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (!selectedIssue) return;
      
      console.log(selectedIssue);
      const userId = user._id; // Assuming `user.id` holds the userId
        console.log("Fetching issue detail for user:", userId);


      // Extract owner and repoName from the issue URL
      const urlParts = selectedIssue.url.split("/");
      const owner = urlParts[3]; // "facebook"
      const repoName = urlParts[4]; // "react"
      const issueId = urlParts[6]; // Use issue number instead of id
      console.log(owner, repoName, issueId);

      setLoading(true);
      socket.emit(
        "getIssueComments",
        {userId, owner, repoName, issueId },
        (response) => {
          setLoading(false);
          if (response.success) {
              console.log(response.comments);
            setComments(response.comments);
          } else {
            console.error(response.error);
          }
        }
      );
    }
  }, [isAuthenticated, selectedIssue]);

  if (!selectedIssue) {
    return <p className="text-gray-500">Select an issue to view details.</p>;
  }

  return (
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
            {selectedIssue.labels.map((label) => (
              <span
                key={label.id}
                className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="h-80 overflow-auto border p-2 bg-gray-50 rounded">
          {loading ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : comments.length > 0 ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="prose text-sm"
            >
              {comments[0].body || "No comment available"}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500">No comments found.</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-2">
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
  );
};

export default IssueDetail;
