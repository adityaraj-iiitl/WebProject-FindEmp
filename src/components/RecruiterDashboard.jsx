import React, { useState, useEffect } from 'react';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, Eye, Send, Building2, ChevronRight, Download } from "lucide-react"
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    totalViews: 0,
    interviewsScheduled: 0
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      Promise.all([
        api.get(`/dashboard/recruiter/stats/${user.id}`),
        api.get(`/jobs/recruiter/${user.id}`)
      ]).then(([statsRes, jobsRes]) => {
        setStats(statsRes.data);
        setJobs(jobsRes.data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, []);

  const handleStatusChange = (appId, newStatus) => {
    api.put(`/applications/${appId}/status`, { status: newStatus })
      .then(() => {
        api.get(`/jobs/recruiter/${user.id}`)
          .then(res => setJobs(res.data));
      })
      .catch(err => console.log(err));
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-400">Loading Recruiter Dashboard...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white fe-section-heading">Recruiter Dashboard</h1>
          <p className="mt-4 text-sm font-medium text-slate-400">Manage your job postings and review incoming applications.</p>
        </div>
        <Button onClick={() => navigate('/add-job')} className="gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm">
          <Send className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="fe-stat-card blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Jobs</p>
              <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.activeJobs}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/30 text-blue-400 shadow-sm border border-blue-800/30">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="fe-stat-card teal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Applicants</p>
              <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.totalApplicants}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-900/30 text-teal-400 shadow-sm border border-teal-800/30">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="fe-stat-card indigo">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Views</p>
              <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.totalViews}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-900/30 text-indigo-400 shadow-sm border border-indigo-800/30">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="fe-stat-card amber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interviews</p>
              <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.interviewsScheduled}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-900/30 text-amber-400 shadow-sm border border-amber-800/30">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white fe-section-heading">Your Job Postings</h2>
        
        {jobs.length === 0 ? (
          <Card className="fe-card border-0">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="fe-empty-icon mb-4">
                <Briefcase className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-base font-bold text-white">No jobs posted yet</p>
              <p className="text-sm text-slate-400 mt-1 mb-6 text-center max-w-sm">You haven't created any job listings. Post your first job to start receiving applications.</p>
              <Button onClick={() => navigate('/add-job')} className="font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm">Post a Job Now</Button>
            </CardContent>
          </Card>
        ) : (
          jobs.map(job => (
            <Card key={job.id} className="fe-card border-0 overflow-hidden">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/50 bg-slate-900/50 pb-4">
                <div>
                  <CardTitle className="text-lg font-bold text-white">{job.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                    <span className="fe-badge-primary">ID: {job.id.substring(0,8)}</span>
                    <span>{job.location}</span> • <span>{job.type}</span>
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0 flex gap-4 text-sm font-semibold">
                  <div className="text-center px-4 border-r border-slate-800">
                    <span className="block text-2xl text-white">{job.views || 0}</span>
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">Views</span>
                  </div>
                  <div className="text-center px-2">
                    <span className="block text-2xl text-teal-400">{job.applications?.length || 0}</span>
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">Applicants</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {job.applications && job.applications.length > 0 ? (
                  <div className="divide-y divide-slate-800/50">
                    {job.applications.map(app => (
                      <div key={app.id} className="p-4 md:p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold text-sm shadow-sm border border-slate-700">
                            {(app.applicantName || 'A').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{app.applicantName || 'Unknown Applicant'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{app.applicantEmail}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-medium text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                                Applied: {new Date(app.date).toLocaleDateString()}
                              </span>
                              {app.resumeUrl && (
                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                  <Download className="h-3 w-3" /> Resume
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                          <span className={app.status === 'ACCEPTED' || app.status === 'INTERVIEW' ? 'fe-badge-success' : 'fe-badge-primary'}>
                            {app.status}
                          </span>
                          <select 
                            className="fe-glass-input h-9 rounded-md px-2 py-1 text-sm shadow-sm min-w-[140px]"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="REVIEWING">Reviewing</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-800/20">
                    <p className="text-sm font-medium text-slate-400">No applications received yet for this position.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
