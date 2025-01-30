import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ProjectCard from "./ProjectCard";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000",{
  reconnection: true, // Ensure automatic reconnection
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
}); // Update with your backend server URL

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = () => {
      socket.emit("getAllProjects", {}, (response) => {
        if (response.success) {
          console.log("Fetched projects:", response.projects);
          setProjects(response.projects);
        } else {
          console.error("Failed to fetch projects:", response.error);
        }
      });
    };
  
    // Fetch projects on initial load and after reconnection
    socket.on("connect", fetchProjects);
  
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  
  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}/issues`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onClick={() => handleCardClick(project._id)}
        />
      ))}
    </div>
  );
};

export default ProjectDashboard;
