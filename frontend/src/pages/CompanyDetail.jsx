import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { jobService } from '../services/jobService';

const CompanyDetail = () => {
  const { name } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getJobsByCompany(name)
      .then(data => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch(err => {
        alert(err.message || "Failed to load open positions.");
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-8">
      <Link to="/companies" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Companies
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-600 text-2xl font-bold">
          🏢
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{decodeURIComponent(name)}</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} Open Positions</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          This company currently has no open positions listed.
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
