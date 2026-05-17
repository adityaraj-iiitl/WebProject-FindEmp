import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import api from '../api/config';
import { Building2, ChevronLeft, MapPin } from "lucide-react"

const CompanyDetail = () => {
  const { name } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/company/${name}`)
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [name]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 min-h-[calc(100vh-64px)]">
      <Link to="/companies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-indigo-400 mb-8 transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Back to all companies
      </Link>

      <div className="flex items-center gap-6 mb-12 bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20">
          <Building2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{decodeURIComponent(name)}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="fe-badge-primary">
              {jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-slate-400">
              <MapPin className="h-4 w-4" /> Global Reach
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white fe-section-heading">Available Roles</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm font-medium text-slate-400">Loading open positions...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="fe-empty-state bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 mt-4">
          <div className="fe-empty-icon">
            <Building2 className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-base font-bold text-white">No open positions</p>
          <p className="text-sm text-slate-400 mt-1">This company currently has no open positions listed.</p>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
