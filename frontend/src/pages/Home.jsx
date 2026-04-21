import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import api from '../api/config';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b' }}>Find Your Dream Job</h1>
        <p style={{ color: '#64748b' }}>Explore the latest opportunities in top tech companies.</p>
      </header>

      <div className="job-list">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Home;
