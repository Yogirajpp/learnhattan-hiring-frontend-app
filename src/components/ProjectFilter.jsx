import React, { useState, useEffect } from "react";

const ProjectFilter = ({ languages, projects, onApplyFilters }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle language selection and filter projects
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    onApplyFilters({ language: lang, searchQuery }); // Apply filter when a language is selected
  };

  // Handle search query changes and filter projects
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onApplyFilters({ language: selectedLanguage, searchQuery: e.target.value }); // Apply filter when search query changes
  };

  // Count the number of projects for each language
  const getLanguageCounts = () => {
    const counts = {};

    if (Array.isArray(projects)) {
      projects.forEach((project) => {
        const lang = project.latestGitHubData.language;
        if (lang) {
          counts[lang] = counts[lang] ? counts[lang] + 1 : 1;
        }
      });
    }

    return counts;
  };

  const languageCounts = getLanguageCounts();

  return (
    <div>
        {/* Search Box */}
        <div className="mb-4">
            <input
            type="text"
            placeholder="Search projects..."
            className="w-full px-3 py-2 border rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
            />
        </div>

        <div className="p-4">
        <h3 className="font-semibold text-3xl mb-4">Language</h3>

        {/* Language Filters */}
        <div className="flex gap-2">
            {languages.map((language) => (
            <div
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`cursor-pointer px-3 py-2 p-2 border rounded-sm hover:bg-muted ${selectedLanguage === language ? "bg-primary text-white" : ""}`}
            >
                {language} x{languageCounts[language] || 0}
            </div>
            ))}
        </div>
        </div>
    </div>
  );
};

export default ProjectFilter;
