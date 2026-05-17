import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import JobCard from '../components/JobCard';
import api from '../api/config';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Briefcase } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const getUser = () => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };
  const user = getUser();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = (keyword = '', location = '') => {
    let url = '/jobs';
    if (keyword || location) {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      url = `/jobs/search?${params.toString()}`;
    }
    api.get(url)
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  return (
    <div className="flex flex-col">
      <HeroSection onSearch={fetchJobs} />

      <section className="py-20 relative">
        {/* Subtle background decorative element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none -z-10" />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-white fe-section-heading">Featured Opportunities</h2>
              <p className="mt-4 text-sm font-medium text-slate-400">Hand-picked roles from top companies hiring right now</p>
            </div>
            <Button variant="outline" className="gap-2 text-sm font-semibold shadow-sm border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all" onClick={() => fetchJobs()}>
              View all jobs
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center">
                <div className="fe-empty-icon">
                  <Search className="h-7 w-7 text-blue-400 opacity-60" />
                </div>
                <h3 className="text-xl font-bold text-white">No jobs found</h3>
                <p className="mt-2 text-sm font-medium text-slate-400 text-center max-w-md">We couldn't find any opportunities matching your current filters. Try adjusting your search or clearing the filters.</p>
                <Button className="mt-6 text-sm font-semibold shadow-sm bg-blue-600 hover:bg-blue-500 text-white px-6 border-0" onClick={() => fetchJobs()}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="fe-footer mt-auto relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-2.5 mb-6 opacity-60">
            <Briefcase className="h-5 w-5" />
            <span className="text-lg font-bold tracking-tight">FindEmp</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            FindEmp -- Built as a college project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
