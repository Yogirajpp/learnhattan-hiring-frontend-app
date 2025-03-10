// src/components/App.jsx
import { SidebarProvider } from "@/components/ui/sidebar"; // Import the SidebarProvider
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import GitHubOAuth from "./components/Auth/GitHubOAuth";
// import BreadcrumbComponent from './components/Breadcrumb';
import Dashboard from './components/Dashboard';
import Jobs from './components/Jobs';
import Leaderboard from './components/Leaderboard';
import SidebarComponent from './components/Sidebar'; // Import the Sidebar component
import AuthProvider, { AuthContext } from "./providers/auth-provider";
import QueryProvider from './providers/query-provider';
import Issues from "./components/Issues/Issues";
import ProjectDashboard from "./components/Projects/Projects";
import { useContext } from "react";

const App = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated)
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <SidebarProvider> {/* Wrap Sidebar with SidebarProvider */}
            <SidebarComponent /> {/* Render the Sidebar */}
            <main className="flex-1 p-6">
              {/* <BreadcrumbComponent /> */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth/oauth/github" element={<GitHubOAuth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/projects" element={<ProjectDashboard />} />
                <Route path="/projects/:projectId/issues" element={<Issues />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/jobs" element={<Jobs />} />
              </Routes>
            </main>
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
};

export default App;
