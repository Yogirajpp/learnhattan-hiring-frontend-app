// src/components/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarComponent from './components/Sidebar'; // Import the Sidebar component
import { SidebarProvider } from "@/components/ui/sidebar"; // Import the SidebarProvider
import BreadcrumbComponent from './components/Breadcrumb';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Leaderboard from './components/Leaderboard';
import Jobs from './components/Jobs';
import Issues from './components/Issues';

const App = () => {
  return (
    <Router>
      <SidebarProvider> {/* Wrap Sidebar with SidebarProvider */}
        <SidebarComponent /> {/* Render the Sidebar */}
        <main className="flex-1 p-6">
          <BreadcrumbComponent />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId/issues" element={<Issues />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
        </main>
      </SidebarProvider>
    </Router>
  );
};

export default App;
