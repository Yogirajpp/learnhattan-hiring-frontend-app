import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

function JobsTable({ jobs }) {
    const [menuVisible, setMenuVisible] = useState({});
    const menuRef = useRef(null);

    const handlePublish = async() => {
      // const res = await axios.post()
        console.log('Publish job');
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible({}); // Close all menus
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Min. EXP</TableHead>
          <TableHead>Job Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.companyId}</TableCell>
            <TableCell>{job.minExp}</TableCell>
            <TableCell>{job.jobType}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </TableCell>
            <TableCell>
              <Badge variant={job.isActive ? "success" : "destructive"}>{job.isActive ? "Active" : "Inactive"}</Badge>
            </TableCell>
            {!job.isActive && <TableCell>
                <button 
                    className="text-sm font-bold"
                    onClick={() => setMenuVisible(prev => ({ ...prev, [job._id]: !prev[job._id] }))}    
                    >&#x22EE;
                </button>
                {menuVisible[job._id] && 
                <div ref={menuRef} className="absolute right-0 bg-white text-black shadow-lg hover:bg-gray-200 rounded-md">
                    <button 
                    className="block px-4 py-2"
                    onClick={handlePublish}
                    >Publish</button>
                </div>}
            </TableCell>
            }
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

JobsTable.propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      companyId: PropTypes.string.isRequired,
      minExp: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      jobType: PropTypes.oneOf(['remote', 'on-site', 'hybrid']).isRequired,
      location: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
    })).isRequired,
  };

export default JobsTable

