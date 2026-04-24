import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import api from '../api/config';
import { Building2, Plus, Users, Briefcase, Settings, ArrowRight, FileText, Eye, User } from "lucide-react"

const RecruiterDashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ totalApplicants: 0, activeJobs: 0, companiesManaged: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', location: '', description: '' });
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApps, setJobApps] = useState([]);
  const [showApplicantProfile, setShowApplicantProfile] = useState(false);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePicUrl || '');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (!user || !user.id) {
      console.warn("User data not available for fetching stats");
      return;
    }
    
    console.log("Fetching data for user:", user.id);

    // Use individual catches so one failure doesn't block others
    api.get(`/companies/recruiter/${user.id}`)
      .then(res => {
        console.log("Companies fetched:", res.data.length);
        setCompanies(res.data);
      })
      .catch(err => console.error("Error fetching companies:", err));

    api.get(`/applications/recruiter/${user.id}`)
      .then(res => {
        console.log("Applications fetched:", res.data.length);
        setApplications(res.data);
      })
      .catch(err => console.error("Error fetching applications:", err));

    api.get(`/jobs/recruiter/${user.id}`)
      .then(res => {
        console.log("Jobs fetched:", res.data.length);
        setJobs(res.data);
      })
      .catch(err => console.error("Error fetching jobs:", err));

    api.get(`/dashboard/stats/${user.id}?role=RECRUITER`)
      .then(res => {
        console.log("Stats fetched:", res.data);
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  };

  const updateAppStatus = (appId, status) => {
    api.put(`/applications/${appId}/status?status=${status}`)
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    api.post('/companies', { ...newCompany, recruiterId: user.id })
      .then(() => {
        setShowAddCompany(false);
        setNewCompany({ name: '', location: '', description: '' });
        fetchData();
      })
      .catch(err => console.error(err));
  };

  const handleUpdateCompany = (e) => {
    e.preventDefault();
    api.put(`/companies/${editingCompany.id}`, editingCompany)
      .then(() => {
        setShowEditCompany(false);
        setEditingCompany(null);
        fetchData();
      })
      .catch(err => console.error(err));
  };

  const handleUpdateJob = (e) => {
    e.preventDefault();
    api.put(`/jobs/${editingJob.id}`, editingJob)
      .then(() => {
        setShowEditJob(false);
        setEditingJob(null);
        fetchData();
      })
      .catch(err => console.error(err));
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to close this job listing? This will remove it from the platform.")) {
      api.delete(`/jobs/${jobId}`)
        .then(() => fetchData())
        .catch(err => console.error(err));
    }
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
    api.get(`/applications/job/${job.id}`)
      .then(res => {
        setJobApps(res.data);
        setShowJobDetails(true);
      })
      .catch(err => console.error(err));
  };

  const handleViewApplicant = (applicantId, resumeUrl) => {
    // Increment the applicant's profile views in the backend
    api.post(`/users/${applicantId}/view`)
      .catch(err => console.error("Error incrementing profile views:", err));
    
    // Open the resume in a new tab
    if (resumeUrl) {
      window.open(resumeUrl, '_blank', 'noreferrer');
    }
  };

  const viewApplicantProfile = (applicantId) => {
    api.get(`/users/${applicantId}`)
      .then(res => {
        setViewingApplicant(res.data);
        setShowApplicantProfile(true);
        // Also increment views since the recruiter is looking at the profile
        api.post(`/users/${applicantId}/view`)
          .catch(err => console.error(err));
      })
      .catch(err => console.error("Error fetching applicant profile:", err));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    api.put(`/users/profile/${user.id}`, { ...user, profilePicUrl })
      .then(res => {
        const updatedUser = res.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowEditProfile(false);
        // We don't need to reload everything, just the local state if needed
        window.location.reload(); // Refresh to update all references to user
      })
      .catch(err => console.error(err));
  };

  if (!user) return null;

  if (loading) return <div className="py-20 text-center">Loading Recruiter Dashboard...</div>;

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="group relative h-20 w-20 rounded-2xl bg-muted overflow-hidden border-2 border-border shadow-sm">
            {user.profilePicUrl ? (
              <img src={user.profilePicUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary font-bold text-2xl">
                {user?.name?.slice(0, 2).toUpperCase() || 'RE'}
              </div>
            )}
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Recruiter Panel</h1>
            <p className="mt-1 text-muted-foreground">Manage your companies and hire top talent.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddCompany(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
          <a href="/add-job">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Companies</h2>
              <Badge variant="secondary">{companies.length} Registered</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {companies.length > 0 ? companies.map(company => (
                <Card key={company.id} className="group hover:border-primary/50 transition-all">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription>{company.location}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {company.description || 'No description added.'}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 group-hover:text-primary"
                        onClick={() => {
                          setEditingCompany({ ...company });
                          setShowEditCompany(true);
                        }}
                      >
                        Manage <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card className="md:col-span-2 flex flex-col items-center justify-center p-12 border-dashed">
                  <Building2 className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">You haven't added any companies yet.</p>
                  <Button variant="link" onClick={() => setShowAddCompany(true)}>Add your first company</Button>
                </Card>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Recent Applications</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {applications.length > 0 ? applications.map(app => (
                    <div key={app.id} className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                            {app.applicantName?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{app.applicantName}</p>
                            <p className="text-sm text-muted-foreground">{app.applicantEmail}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {app.status === 'PENDING' ? (
                            <>
                              <Button size="sm" variant="outline" className="text-accent" onClick={() => updateAppStatus(app.id, 'ACCEPTED')}>Accept</Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateAppStatus(app.id, 'REJECTED')}>Reject</Button>
                            </>
                          ) : (
                            <Badge variant={app.status === 'ACCEPTED' ? 'accent' : 'secondary'}>{app.status}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cover Letter</p>
                        <p className="text-sm text-foreground/80 italic">"{app.coverLetter}"</p>
                      </div>
                      <div className="flex gap-4">
                        {app.resumeUrl && (
                          <button 
                            onClick={() => handleViewApplicant(app.applicantId, app.resumeUrl)} 
                            className="inline-flex items-center gap-2 text-xs text-primary hover:underline bg-transparent border-0 cursor-pointer p-0"
                          >
                            <FileText className="h-3 w-3" />
                            View Resume
                          </button>
                        )}
                        <button 
                          onClick={() => viewApplicantProfile(app.applicantId)} 
                          className="inline-flex items-center gap-2 text-xs text-accent hover:underline bg-transparent border-0 cursor-pointer p-0"
                        >
                          <User className="h-3 w-3" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="p-12 text-center text-muted-foreground">No applications yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Posted Jobs</h2>
              <Badge variant="outline">{jobs.length} Jobs</Badge>
            </div>
            <div className="grid gap-4">
              {jobs.length > 0 ? jobs.map(job => (
                <Card key={job.id} className="overflow-hidden">
                  <div className="flex items-center p-6 gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {job.company}</span>
                        <span>{job.location}</span>
                        <span className="text-accent font-medium">{job.salary}</span>
                        <span className="flex items-center gap-1 text-primary"><Eye className="h-3 w-3" /> {job.views} Views</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => viewJobDetails(job)}>
                        <Users className="h-4 w-4 mr-2" />
                        Applicants ({applications.filter(a => a.jobId === job.id).length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingJob({ ...job });
                          setShowEditJob(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <p className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">No jobs posted yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Hiring Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
                <span className="text-sm text-muted-foreground">Total Applicants</span>
                <span className="text-xl font-bold">{stats.totalApplicants}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
                <span className="text-sm text-muted-foreground">Active Jobs</span>
                <span className="text-xl font-bold">{stats.activeJobs}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background/50 p-4">
                <span className="text-sm text-muted-foreground">Companies Managed</span>
                <span className="text-xl font-bold">{stats.companiesManaged}</span>
              </div>
              <Button className="w-full">View Detailed Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAddCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
              <CardTitle>Add New Company</CardTitle>
              <CardDescription>Enter your company details to start posting jobs.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cname">Company Name</Label>
                  <Input
                    id="cname"
                    required
                    placeholder="e.g. Acme Corp"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cloc">Location</Label>
                  <Input
                    id="cloc"
                    required
                    placeholder="e.g. Remote or San Francisco"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cdesc">Description</Label>
                  <textarea
                    id="cdesc"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Tell applicants what your company does..."
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowAddCompany(false)}>Cancel</Button>
                  <Button type="submit">Create Company</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showEditCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
              <CardTitle>Edit Company Details</CardTitle>
              <CardDescription>Update your company information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ecname">Company Name</Label>
                  <Input
                    id="ecname"
                    required
                    placeholder="e.g. Acme Corp"
                    value={editingCompany?.name || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecloc">Location</Label>
                  <Input
                    id="ecloc"
                    required
                    placeholder="e.g. Remote or San Francisco"
                    value={editingCompany?.location || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecdesc">Description</Label>
                  <textarea
                    id="ecdesc"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Tell applicants what your company does..."
                    value={editingCompany?.description || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => { setShowEditCompany(false); setEditingCompany(null); }}>Cancel</Button>
                  <Button type="submit">Update Details</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-sm shadow-2xl">
            <CardHeader>
              <CardTitle>Update Profile Photo</CardTitle>
              <CardDescription>Paste a link to your new profile picture.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purl">Photo URL</Label>
                  <Input
                    id="purl"
                    required
                    placeholder="https://example.com/photo.jpg"
                    value={profilePicUrl}
                    onChange={(e) => setProfilePicUrl(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowEditProfile(false)}>Cancel</Button>
                  <Button type="submit">Save Photo</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      {showEditJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader>
              <CardTitle>Edit Job Posting</CardTitle>
              <CardDescription>Update the details for your job listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateJob} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ejtitle">Job Title</Label>
                  <Input
                    id="ejtitle"
                    required
                    value={editingJob?.title || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ejloc">Location</Label>
                    <Input
                      id="ejloc"
                      required
                      value={editingJob?.location || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ejsal">Salary Range</Label>
                    <Input
                      id="ejsal"
                      required
                      value={editingJob?.salary || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ejdesc">Job Description</Label>
                  <textarea
                    id="ejdesc"
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editingJob?.description || ''}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => { setShowEditJob(false); setEditingJob(null); }}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedJob.title}</CardTitle>
                  <CardDescription>{selectedJob.company} • {selectedJob.location}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowJobDetails(false)}>Close</Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Applicants for this position</h4>
              <div className="space-y-4">
                {jobApps.length > 0 ? jobApps.map(app => (
                  <div key={app.id} className="rounded-xl border p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {app.applicantName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-medium">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{app.applicantEmail}</p>
                        </div>
                      </div>
                      <Badge variant={app.status === 'ACCEPTED' ? 'accent' : 'secondary'}>{app.status}</Badge>
                    </div>
                    <div className="text-sm text-foreground/80 bg-muted/20 p-3 rounded-lg italic mb-3">
                      "{app.coverLetter}"
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        {app.resumeUrl && (
                          <button 
                            onClick={() => handleViewApplicant(app.applicantId, app.resumeUrl)} 
                            className="text-xs text-primary flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer p-0"
                          >
                            <FileText className="h-3 w-3" /> Resume
                          </button>
                        )}
                        <button 
                          onClick={() => viewApplicantProfile(app.applicantId)} 
                          className="text-xs text-accent flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer p-0"
                        >
                          <User className="h-3 w-3" /> Profile
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {app.status === 'PENDING' && (
                          <>
                            <Button size="sm" variant="outline" className="h-8 text-accent border-accent/20 hover:bg-accent/5" onClick={() => {
                              updateAppStatus(app.id, 'ACCEPTED');
                              // Also update local jobApps state for immediate feedback
                              setJobApps(jobApps.map(a => a.id === app.id ? { ...a, status: 'ACCEPTED' } : a));
                            }}>Accept</Button>
                            <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/5" onClick={() => {
                              updateAppStatus(app.id, 'REJECTED');
                              setJobApps(jobApps.map(a => a.id === app.id ? { ...a, status: 'REJECTED' } : a));
                            }}>Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center text-muted-foreground italic">
                    No applications received for this position yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showApplicantProfile && viewingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 overflow-hidden mb-4 border-4 border-background shadow-xl ring-2 ring-primary/20">
                {viewingApplicant.profilePicUrl ? (
                  <img src={viewingApplicant.profilePicUrl} alt={viewingApplicant.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary font-bold text-2xl">
                    {viewingApplicant.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{viewingApplicant.name}</CardTitle>
              <CardDescription className="text-primary font-medium">{viewingApplicant.title || 'Applicant'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">About</Label>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                  {viewingApplicant.bio || "No bio provided by the applicant."}
                </p>
              </div>
              
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Skills</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {viewingApplicant.skills ? viewingApplicant.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-none">
                      {skill.trim()}
                    </Badge>
                  )) : (
                    <span className="text-sm text-muted-foreground italic">No skills listed.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {viewingApplicant.resumeUrl ? (
                  <Button variant="outline" onClick={() => handleViewApplicant(viewingApplicant.id, viewingApplicant.resumeUrl)} className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                    <FileText className="h-4 w-4" /> View Resume
                  </Button>
                ) : (
                  <Button variant="outline" disabled className="w-full gap-2 opacity-50 cursor-not-allowed">
                    <FileText className="h-4 w-4" /> Resume Not Available
                  </Button>
                )}
                <Button onClick={() => setShowApplicantProfile(false)} className="w-full">Close Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
