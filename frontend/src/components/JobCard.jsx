import React, { useState, useEffect } from 'react';
import { jobService } from '../services/jobService';
import { savedJobService } from '../services/savedJobService';
import ApplyModal from './ApplyModal';

const JobCard = ({ job }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      jobService.incrementJobViews(job.id)
        .catch(() => {});
    }
  }, [job.id, user?.role]);

  const handleApplyClick = () => {
    if (!user) {
      alert("Please login as a Job Seeker to apply!");
      return;
    }
    if (user.role === 'RECRUITER') {
      alert("Recruiters cannot apply for jobs. Please use a Job Seeker account.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveToggle = () => {
    if (!user) {
      alert("Please login to save jobs!");
      return;
    }
    savedJobService.toggleSavedJob(user.id, job.id)
      .then(status => {
        alert(status === 'SAVED' ? "Job Saved!" : "Job Removed!");
      })
      .catch(err => {
        alert(err.message || "Failed to update saved job.");
      });
  };

  return (
    <>
      <div className="border border-gray-300 rounded p-5 bg-white flex flex-col justify-between hover:border-gray-400">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            <div className="flex items-center gap-2">
              <button 
                className="h-8 w-8 text-gray-400 hover:text-yellow-500 bg-transparent border-0 cursor-pointer p-0"
                onClick={handleSaveToggle}
              >
                ⭐
              </button>
              <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded font-medium">
                {job.type || 'Full-time'}
              </span>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-600 mt-1">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
            <div>{job.location}</div>
            <div>{job.salary}</div>
          </div>
          
          <p className="mt-3 line-clamp-3 text-sm text-gray-600">
            {job.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          {user && user.role === 'RECRUITER' ? (
            <button className="text-xs text-gray-400 bg-gray-100 border border-gray-200 py-1.5 rounded cursor-not-allowed w-full text-center" disabled>
              Recruiter View
            </button>
          ) : (
            <button 
              onClick={handleApplyClick} 
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 py-1.5 rounded w-full text-center font-semibold cursor-pointer border-0"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ApplyModal job={job} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default JobCard;
