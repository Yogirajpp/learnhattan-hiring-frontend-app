import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ProjectCard from "./ProjectCard";
import ProjectFilter from "./ProjectFilter";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ProjectDashboard = () => {
  const [allProjects, setAllProjects] = useState([]); // Store all projects (unfiltered)
  const [filteredProjects, setFilteredProjects] = useState([]); // Store filtered projects
  const [languages, setLanguages] = useState([]); // Store all unique languages
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const projectsPerPage = 5; // Number of projects to display per page
  const navigate = useNavigate();

  // Fetch all projects and extract unique languages
  const fetchProjects = (filters = {}) => {
    socket.emit("getAllProjects", filters, (response) => {
      if (response.success) {
        // Store all projects (unfiltered)
        setAllProjects(response.projects);

        // Extract unique languages from all projects
        const uniqueLanguages = [];
        response.projects.forEach((project) => {
          const lang = project.latestGitHubData.language;
          if (lang && !uniqueLanguages.includes(lang)) {
            uniqueLanguages.push(lang);
          }
        });
        setLanguages(uniqueLanguages); // Set the unique languages

        // Apply filters to the projects
        let filteredProjects = response.projects;

        // Apply search query filter
        if (filters.searchQuery) {
          filteredProjects = filteredProjects.filter((project) =>
            project.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }

        // Apply language filter
        if (filters.language) {
          filteredProjects = filteredProjects.filter(
            (project) => project.latestGitHubData.language === filters.language
          );
        }

        setFilteredProjects(filteredProjects); // Set the filtered projects
        setCurrentPage(1); // Reset to the first page when filters change
      } else {
        console.error("Failed to fetch projects:", response.error);
      }
    });
  };

  useEffect(() => {
    fetchProjects(); // Fetch all projects initially

    socket.on("connect", () => {
      console.log("Socket reconnected. Fetching projects...");
      fetchProjects(); // Fetch all projects again when reconnected
    });

    return () => {
      socket.off("connect");
    };
  }, []);

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
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastProject >= filteredProjects.length}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
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