import PropTypes from "prop-types"

export function JobCard({
  title,
//   companyName,
  tags,
  minExp,
  jobType,
  location,
  isActive,
  onApply,
  onSelect,
  selected,
}) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer hover:border-purple-300 transition-colors ${
        selected ? "border-purple-600" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
          <span className="text-base sm:text-lg font-semibold text-purple-700">{title[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg truncate">{title}</h3>
          {/* <p className="text-xs sm:text-sm text-gray-600 mb-2">{companyName}</p> */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>{jobType}</span>
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-600 font-medium text-sm">min {minExp}Exp required</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onApply()
              }}
              className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isActive ? "Apply" : "Inactive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

JobCard.propTypes = {
  title: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  minExp: PropTypes.number.isRequired,
  jobType: PropTypes.oneOf(["remote", "on-site", "hybrid"]).isRequired,
  location: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onApply: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
}

