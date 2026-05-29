import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import JobCard from '../components/JobCard';
import { jobService } from '../services/jobService';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const serviceCall = (keyword || location)
      ? jobService.searchJobs(keyword, location)
      : jobService.getAllJobs();

    serviceCall
      .then(data => {
        setJobs(data || []);
      })
      .catch(err => {
        alert(err.message || "Failed to load jobs.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col">
      <HeroSection onSearch={fetchJobs} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Opportunities</h2>
              <p className="mt-2 text-muted-foreground">Hand-picked roles from top companies</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => fetchJobs()}>
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 w-full col-span-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No such jobs available</h3>
                  <p className="mt-2 text-muted-foreground">Try adjusting your search filters or browse all opportunities.</p>
                  <Button variant="link" className="mt-4" onClick={() => fetchJobs()}>Clear all filters</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
