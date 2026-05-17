import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Building2, Star, ArrowRight } from "lucide-react"
import ApplyModal from './ApplyModal';

const JobCard = ({ job }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      api.post(`/jobs/${job.id}/view`)
        .catch(err => console.error("Error incrementing views:", err));
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

  return (
    <>
      <Card className="fe-card group flex flex-col h-full border-transparent bg-slate-800/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3 flex-none">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-800/50 text-blue-400 shadow-sm border border-blue-800/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                onClick={() => {
                  if(!user) return alert("Please login to save jobs!");
                  api.post(`/saved-jobs/toggle?userId=${user.id}&jobId=${job.id}`)
                    .then(res => alert(res.data === 'SAVED' ? "Job Saved!" : "Job Removed!"))
                }}
              >
                <Star className="h-4 w-4" />
              </Button>
              <span className="fe-type-badge shadow-sm">
                {job.type || 'Full-time'}
              </span>
            </div>
          </div>
          <CardTitle className="mt-4 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {job.title}
          </CardTitle>
          <p className="text-sm font-medium text-slate-400">{job.company}</p>
        </CardHeader>
        
        <CardContent className="pb-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-4">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-900/30 px-2.5 py-1 rounded-md text-emerald-400 border border-emerald-800/30">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="font-semibold">{job.salary}</span>
              </div>
            </div>
            <p className="line-clamp-3 text-sm text-slate-400 leading-relaxed">
              {job.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex-none border-t border-slate-800 mt-4 p-4">
          {user && user.role === 'RECRUITER' ? (
            <Button variant="outline" className="w-full cursor-not-allowed opacity-50 text-sm border-slate-700 text-slate-300 hover:bg-transparent hover:text-slate-300" disabled>
              Recruiter View
            </Button>
          ) : (
            <Button onClick={handleApplyClick} className="w-full text-sm font-semibold shadow-sm hover:shadow group/btn transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white border-0">
              Apply Now
              <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {isModalOpen && (
        <ApplyModal job={job} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default JobCard;
