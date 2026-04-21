import React from 'react';
import axios from 'axios';

const JobCard = ({ job }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleApply = () => {
    if (!user) {
      alert("Please login to apply!");
      return;
    }

    const application = {
      job: { id: job.id },
      user: { id: user.id }
    };

    axios.post('http://localhost:8080/api/applications/apply', application)
      .then(() => alert("Applied Successfully!"))
      .catch(err => console.log(err));
  };

  return (
    <div className="job-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div className="job-title">{job.title}</div>
          <div className="company-name">{job.company}</div>
        </div>
        <button className="btn" onClick={handleApply} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Apply Now</button>
      </div>
      <div className="job-meta">
        <span className="badge">{job.location}</span>
        <span className="badge">{job.type || 'Full-time'}</span>
        <span style={{ color: '#059669', fontWeight: '600' }}>{job.salary}</span>
      </div>
      <p style={{ color: '#475569', marginTop: '1rem' }}>
        {job.description?.substring(0, 150)}...
      </p>
    </div>
  );
};

export default JobCard;
