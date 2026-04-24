import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import api from '../api/config';
import { Building2, ChevronLeft } from "lucide-react"

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
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8">
        <ChevronLeft className="h-4 w-4" />
        Back to Companies
      </Link>

      <div className="flex items-center gap-6 mb-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
          <Building2 className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">{decodeURIComponent(name)}</h1>
          <p className="mt-2 text-muted-foreground">{jobs.length} Open Positions</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading jobs...</div>
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
