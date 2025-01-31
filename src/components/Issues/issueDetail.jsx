import { Button } from "@/components/ui/button";

const IssueDetail = ({ selectedIssue }) => {
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
  );
};

export default IssueDetail;