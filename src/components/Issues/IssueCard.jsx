import { Card, CardContent, CardFooter } from "@/components/ui/card";

const truncateTitle = (title, wordLimit = 5) => {
  const words = title.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : title;
};

const IssueCard = ({ issue, onClick }) => {
  return (
    <Card
      className="border border-gray-200 rounded-sm cursor-pointer hover:border-blue-500 transition-colors duration-200 mb-4"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Issue Title */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            {truncateTitle(issue.title)}
          </div>
          <div className="text-xl font-bold text-[#D8A7DF] flex-shrink-0">
            {issue.exp} XP 
          </div>
        </div>

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
  );
};

export default IssueCard;
