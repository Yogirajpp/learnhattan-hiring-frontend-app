import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import JobsTable from "./tables/jobsTable"
import axios from "axios"
import { baseurl } from "@/lib/utils"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const {companyId } = useParams()
  console.log(companyId)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/getAllJobs`)
        console.log(response.data.jobs)
        // const data = [
        //     {
        //         _id: "1",
        //         title: "Software Engineer",
        //         description: "We are looking for a software engineer",
        //         jobType: "Full Time",
        //         location: "Pune",
        //         tags: ["remote", "full-time", "backend", "frontend"],
        //         status: "approved",
        //         companyId: "1",
        //     },
        //     {
        //         _id: "2",
        //         title: "Product Manager",
        //         description: "We are looking for a product manager",
        //         jobType: "Full Time",
        //         location: "Remote",
        //         tags: ["remote", "full-time", "product"],
        //         status: "pending",
        //         companyId: "1",
        //     },
        //     ]
        
        setJobs(response.data.jobs)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      }
    }

    fetchJobs()
  }, [companyId])

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs</h1>
      </div>
      <JobsTable jobs={jobs} />
    </div>
  )
}

export default Jobs

