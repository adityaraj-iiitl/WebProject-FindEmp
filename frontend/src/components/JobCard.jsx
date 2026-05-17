import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Building2, Star, CheckCircle2 } from "lucide-react"
import ApplyModal from './ApplyModal';

const JobCard = ({ job }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Only increment views if viewed by a Seeker or guest, NOT the Recruiter
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
      <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-primary/10">
              <Building2 className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={() => {
                  if(!user) return alert("Please login to save jobs!");
                  api.post(`/saved-jobs/toggle?userId=${user.id}&jobId=${job.id}`)
                    .then(res => alert(res.data === 'SAVED' ? "Job Saved!" : "Job Removed!"))
                }}
              >
                <Star className="h-5 w-5" />
              </Button>
              <Badge variant="secondary" className="bg-primary/5 text-primary">
                {job.type || 'Full-time'}
              </Badge>
            </div>
          </div>
          <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">
            {job.title}
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </div>
          </div>
          <p className="mt-4 line-clamp-2 text-sm text-muted-foreground/80">
            {job.description}
          </p>
        </CardContent>

        <CardFooter className="pt-0">
          {user && user.role === 'RECRUITER' ? (
            <Button variant="outline" className="w-full cursor-not-allowed opacity-50" disabled>
              Recruiter View
            </Button>
          ) : (
            <Button onClick={handleApplyClick} className="w-full gap-2">
              Apply Now
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
