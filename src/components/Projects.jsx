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
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate();

  const fetchProjects = (filters = {}) => {
    socket.emit("getAllProjects", filters, (response) => {
      if (response.success) {
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

        setProjects(filteredProjects);

        // Extract unique languages from the fetched projects
        const uniqueLanguages = [];
        filteredProjects.forEach((project) => {
          const lang = project.latestGitHubData.language;
          if (lang && !uniqueLanguages.includes(lang)) {
            uniqueLanguages.push(lang);
          }
        });
        setLanguages(uniqueLanguages); // Set the unique languages
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
    fetchProjects(filters); // Fetch filtered projects based on user input
  };

  return (
    <div className="mt-2 p-2">
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-7 flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleCardClick(project._id)}
            />
          ))}
        </div>
        <div className="col-span-3">
          <ProjectFilter
            languages={languages} // Pass the unique languages to the filter
            projects={projects}  // Pass the projects to count the languages
            onApplyFilters={handleApplyFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
