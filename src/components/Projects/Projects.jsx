import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";
import { useNavigate } from "react-router-dom";
import { baseurl } from "@/lib/utils";
import { AuthContext } from "../../providers/auth-provider"; // Import the AuthContext

const socket = io(`${baseurl}`, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ProjectDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext); // Access user and isAuthenticated from AuthContext
  console.log("User:", user);
  const [allProjects, setAllProjects] = useState([]); // Store all projects (unfiltered)
  const [filteredProjects, setFilteredProjects] = useState([]); // Store filtered projects
  const [languages, setLanguages] = useState([]); // Store all unique languages
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const projectsPerPage = 5; // Number of projects to display per page
  const navigate = useNavigate();

  // Fetch all projects and extract unique languages
  const fetchProjects = (filters = {}) => {
    if (user && user._id) { // Ensure the user is authenticated and userId is available
      const userId = user._id; // Assuming `user.id` holds the userId
      console.log("Fetching projects for user:", userId);

      const requestData = {
        ...filters,
        userId, // Add userId to the request data
      };

      socket.emit("getAllProjects", requestData, (response) => {
        if (response.success) {
          setAllProjects(response.projects);
          console.log(response);

          const uniqueLanguages = [];
          response.projects.forEach((project) => {
            const lang = project.latestGitHubData.language;
            if (lang && !uniqueLanguages.includes(lang)) {
              uniqueLanguages.push(lang);
            }
          });
          setLanguages(uniqueLanguages);

          let filteredProjects = response.projects;

          if (filters.searchQuery) {
            filteredProjects = filteredProjects.filter((project) =>
              project.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
            );
          }

          if (filters.language) {
            filteredProjects = filteredProjects.filter(
              (project) => project.latestGitHubData.language === filters.language
            );
          }

          setFilteredProjects(filteredProjects);
          setCurrentPage(1);
        } else {
          console.error("Failed to fetch projects:", response.error);
        }
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects(); // Fetch all projects initially
    }

    socket.on("connect", () => {
      console.log("Socket reconnected. Fetching projects...");
      if (isAuthenticated) {
        fetchProjects(); // Fetch all projects again when reconnected
      }
    });

    return () => {
      socket.off("connect");
    };
  }, [isAuthenticated, user]); // Ensure re-fetching when user changes

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}/issues`);
  };

  const handleApplyFilters = (filters) => {
    fetchProjects(filters); // Fetch and filter projects based on user input
  };

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2 p-2">
      <div className="grid grid-cols-12 gap-4">
        {/* Projects Column (65% width) */}
        <div className="col-span-8 flex flex-col gap-4">
          {currentProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleCardClick(project._id)}
            />
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastProject >= filteredProjects.length}
              className="px-4 py-2 bg-gray-200 rounded-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Filter Column (35% width) */}
        <div className="col-span-4 sticky top-4 h-fit">
          <ProjectFilter
            languages={languages} // Pass all unique languages to the filter
            projects={allProjects} // Pass all projects to count the languages
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
