import useAuth from "@/hooks/auth/useAuth";
import { useGitHubOAuth } from "@/hooks/auth/useGitHubOAuth";
import { useNavigate, useSearchParams } from "react-router-dom";

const redirect_url = import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL;

const GitHubOAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const { isLoading: isGitHubOAuthLoading, isError } = useGitHubOAuth(
    {
      code,
      redirect_url,
    },
    {
      enabled: !!code && !error && !isLoading && !isAuthenticated,
    }
  );

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return;
  }

  if ((error || isError) && !isLoading && !isGitHubOAuthLoading) {
    navigate("/auth", { replace: true });
    return;
  }

  return (
    <div className="flex gap-2 flex-col items-center justify-center h-screen">
      <p className="text-4xl font-bold">GitHub OAuth</p>
      {(isLoading || isGitHubOAuthLoading) && (
        <p className="text-xl">Loading...</p>
      )}
    </div>
  );
};

export default GitHubOAuth;
