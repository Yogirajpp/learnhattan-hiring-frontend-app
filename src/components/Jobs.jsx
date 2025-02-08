import { useState, useEffect } from "react"
import axios from "axios"
import { JobCard } from "./jobCard"
import { JobDetail } from "./jobDetail"
import { baseurl } from "../lib/utils"

export default function JobsBoard() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  // const [balance] = useState(900)

  // Company names mapping
  const [companyNames, setCompanyNames] = useState({})

  // Filter states
  const [searchFilter, setSearchFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 5

  const handleApply = (jobId) => {
    console.log("Applying for job:", jobId)
    // Implement apply logic
  }

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/getAllJobs`)
        setJobs(response.data.jobs)
        setFilteredJobs(response.data.jobs)

        // Extract unique company IDs
        const uniqueCompanyIds = [...new Set(response.data.jobs.map((job) => job.companyId))]

        // Fetch company names
        const companyNamesMap = {}
        await Promise.all(
          uniqueCompanyIds.map(async (companyId) => {
            try {
              const res = await axios.get(`${baseurl}/api//getCompanyName/${companyId}`)
              companyNamesMap[companyId] = res.data.companyName
            } catch (error) {
              console.error(`Error fetching company name for ${companyId}:`, error)
              companyNamesMap[companyId] = "Unknown Company"
            }
          })
        )
        setCompanyNames(companyNamesMap)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        searchFilter === "" ||
        job.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        job.tags.some((tag) => tag.toLowerCase().includes(searchFilter.toLowerCase()))
      const matchesJobType = jobTypeFilter === "" || job.jobType.toLowerCase() === jobTypeFilter.toLowerCase()
      const matchesLocation = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase())
      return matchesSearch && matchesJobType && matchesLocation
    })
    setFilteredJobs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [jobs, searchFilter, jobTypeFilter, locationFilter])

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Jobs</h1>
      </div>

      {/* Filter inputs */}
      <div className="mb-6 space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
        <input
          type="text"
          placeholder="Search by job title or tag"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-700 rounded-md"
        />
        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-700 rounded-md"
        >
          <option value="">All Job Types</option>
          <option value="remote">Remote</option>
          <option value="on-site">On-site</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 border border-gray-700 rounded-md"
        />
      </div>

      <div className="md:grid md:grid-cols-12 md:gap-6">
        {/* Job List */}
        <div className="md:col-span-5 space-y-4 mb-6 md:mb-0">
          {currentJobs.map((job) => (
            <JobCard
              key={job._id}
              title={job.title}
              companyName={companyNames[job.companyId] || "Loading..."}
              tags={job.tags}
              minExp={job.minExp}
              jobType={job.jobType}
              location={job.location}
              isActive={job.isActive}
              onApply={() => handleApply(job._id)}
              onSelect={() => setSelectedJob(job)}
              selected={selectedJob?._id === job._id}
            />
          ))}
        </div>

        {/* Job Details */}
        <div className="md:col-span-7">
          {selectedJob ? (
            <JobDetail
              jobId={selectedJob._id}
              title={selectedJob.title}
              description={selectedJob.description}
              companyName={companyNames[selectedJob.companyId] || "Loading..."}
              minExp={selectedJob.minExp}
              tags={selectedJob.tags}
              jobType={selectedJob.jobType}
              location={selectedJob.location}
              isActive={selectedJob.isActive}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
              Select a job to view details
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-purple-200 hover:bg-purple-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <span className="px-3 py-1 rounded-md bg-purple-100">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-purple-200 hover:bg-purple-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </div>
  )
}
