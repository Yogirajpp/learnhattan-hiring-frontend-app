import PropTypes from "prop-types"

export function JobDetail({ title, description, companyName, minExp, tags, jobType, location, isActive }) {
  return (
    <div className="p-4 sm:p-6 border-t md:border-t-0 md:border-l h-full">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Company: {companyName}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Location: {location}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Job Type: {jobType}</p>
        <p className="text-sm sm:text-base text-gray-600 mb-2">Minimum Experience: {minExp} years</p>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Status:{" "}
          <span className={isActive ? "text-green-600" : "text-red-600"}>{isActive ? "Active" : "Inactive"}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2">Job Description</h3>
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-3xl hover:bg-purple-700">
        Apply Now
      </button>
    </div>
  )
}

JobDetail.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  minExp: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  jobType: PropTypes.oneOf(["remote", "on-site", "hybrid"]).isRequired,
  location: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
}

