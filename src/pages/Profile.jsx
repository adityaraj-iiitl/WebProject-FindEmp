import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import api from '../api/config';
import { 
  User, 
  Mail, 
  Briefcase, 
  FileText, 
  Save, 
  CheckCircle2, 
  Eye, 
  Calendar, 
  Star,
  Send,
  Camera,
  ChevronRight
} from "lucide-react"
import RecruiterDashboard from "../components/RecruiterDashboard";

import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="py-20 text-center text-sm text-slate-400">Redirecting to login...</div>;
  }

  const [stats, setStats] = useState({
    applicationsSent: 0,
    profileViews: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    recentApplications: []
  });
  const [formData, setFormData] = useState({
    title: user?.title || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    resumeUrl: user?.resumeUrl || '',
    profilePicUrl: user?.profilePicUrl || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.title = "FindEmp | Profile";
    if (user && user.id) {
      Promise.all([
        api.get(`/users/${user.id}`),
        api.get(`/dashboard/stats/${user.id}?role=${user.role}`)
      ]).then(([userRes, statsRes]) => {
        setUser(userRes.data);
        localStorage.setItem('user', JSON.stringify(userRes.data));
        setStats(statsRes.data);
        setFormData({
          title: userRes.data.title || '',
          bio: userRes.data.bio || '',
          skills: userRes.data.skills || '',
          resumeUrl: userRes.data.resumeUrl || '',
          profilePicUrl: userRes.data.profilePicUrl || ''
        });
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put(`/users/profile/${user.id}`, formData)
      .then(res => {
        const updatedUser = res.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => console.error(err));
  };

  const completionRate = () => {
    let count = 0;
    if (user.title) count += 25;
    if (user.bio) count += 25;
    if (user.skills) count += 25;
    if (user.resumeUrl) count += 25;
    return count;
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-400">Loading Profile...</div>;

  if (user.role === 'RECRUITER') {
    return <RecruiterDashboard />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Column: User Card & Profile Strength */}
        <div className="space-y-6">
          <Card className="fe-card overflow-hidden border-0">
            <div className="fe-profile-banner" />
            <CardContent className="relative px-6 pb-6 pt-0">
              <div className="absolute -top-12 left-6">
                <div className="group relative flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900 border-[4px] border-slate-900 shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105">
                  {formData.profilePicUrl ? (
                    <img src={formData.profilePicUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-900/50 to-blue-800/50 text-blue-400">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
                <p className="text-sm font-medium text-slate-400 mt-0.5">{user.title || 'Add a professional title'}</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    {user.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fe-card border-0">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <CardTitle className="text-base font-bold text-white">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion</span>
                  <span className="font-bold text-white text-sm">{completionRate()}%</span>
                </div>
                <div className="fe-progress-track">
                  <div className="fe-progress-fill" style={{ width: `${completionRate()}%` }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.title ? "h-5 w-5 text-teal-400" : "h-5 w-5 text-slate-700"} />
                  <span className={user.title ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-500"}>Professional Title</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.bio ? "h-5 w-5 text-teal-400" : "h-5 w-5 text-slate-700"} />
                  <span className={user.bio ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-500"}>Career Bio</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.skills ? "h-5 w-5 text-teal-400" : "h-5 w-5 text-slate-700"} />
                  <span className={user.skills ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-500"}>Technical Skills</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.resumeUrl ? "h-5 w-5 text-teal-400" : "h-5 w-5 text-slate-700"} />
                  <span className={user.resumeUrl ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-500"}>Resume Uploaded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800/50 gap-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3 text-sm transition-colors ${activeTab === 'overview' ? 'fe-tab-active text-white' : 'text-slate-400 font-medium hover:text-slate-200'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-3 text-sm transition-colors ${activeTab === 'profile' ? 'fe-tab-active text-white' : 'text-slate-400 font-medium hover:text-slate-200'}`}
            >
              Professional Profile
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`px-5 py-3 text-sm transition-colors ${activeTab === 'applications' ? 'fe-tab-active text-white' : 'text-slate-400 font-medium hover:text-slate-200'}`}
            >
              Applications
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="fe-stat-card blue p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applications</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white fe-stat-number">{stats.applicationsSent}</span>
                    <Send className="h-5 w-5 text-blue-400 opacity-50" />
                  </div>
                </div>
                <div className="fe-stat-card teal p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interviews</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white fe-stat-number">{stats.interviewsScheduled}</span>
                    <Calendar className="h-5 w-5 text-teal-400 opacity-50" />
                  </div>
                </div>
                <div className="fe-stat-card indigo p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white fe-stat-number">{stats.savedJobs}</span>
                    <Star className="h-5 w-5 text-indigo-400 opacity-50" />
                  </div>
                </div>
                <div className="fe-stat-card amber p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-white fe-stat-number">{stats.profileViews}</span>
                    <Eye className="h-5 w-5 text-amber-400 opacity-50" />
                  </div>
                </div>
              </div>

              <Card className="fe-card border-0">
                <CardHeader className="pb-4 border-b border-slate-800/50">
                  <CardTitle className="text-base font-bold text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {stats?.recentApplications?.slice(0, 3).map((app, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors cursor-default">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 shadow-sm border border-slate-700 text-slate-200 font-bold text-sm">
                            {app.company?.charAt(0) || 'J'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{app.role}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">{app.company} • {app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <span className={app.status === 'ACCEPTED' ? 'fe-badge-success' : 'fe-badge-primary'}>{app.status}</span>
                      </div>
                    ))}
                    {(!stats?.recentApplications || stats.recentApplications.length === 0) && (
                      <div className="fe-empty-state">
                        <div className="fe-empty-icon">
                          <Briefcase className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-300">No recent activity found</p>
                        <p className="text-xs text-slate-500 mt-1">Start applying to jobs to see activity here.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="fe-card border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/50">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Professional Information</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1 text-slate-400">Complete your profile to attract top companies.</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="text-sm font-semibold shadow-sm border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-5">
              {message && <div className="mb-5 rounded-lg bg-teal-900/30 px-4 py-3 text-sm font-semibold text-teal-400 border border-teal-800/50">{message}</div>}
              
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-semibold text-slate-300">Professional Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Full Stack Developer" 
                        className="fe-glass-input h-10 text-sm shadow-sm"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl" className="text-sm font-semibold text-slate-300">Resume Link (URL)</Label>
                      <Input 
                        id="resumeUrl" 
                        placeholder="Link to your Google Drive/Dropbox resume" 
                        className="fe-glass-input h-10 text-sm shadow-sm"
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicUrl" className="text-sm font-semibold text-slate-300">Profile Picture URL</Label>
                    <Input 
                      id="profilePicUrl" 
                      placeholder="https://example.com/photo.jpg" 
                      className="fe-glass-input h-10 text-sm shadow-sm"
                      value={formData.profilePicUrl}
                      onChange={(e) => setFormData({...formData, profilePicUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-sm font-semibold text-slate-300">Skills (Comma separated)</Label>
                    <Input 
                      id="skills" 
                      placeholder="e.g. React, Java, Spring Boot, MySQL" 
                      className="fe-glass-input h-10 text-sm shadow-sm"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-semibold text-slate-300">Professional Bio</Label>
                    <textarea 
                      id="bio"
                      className="fe-glass-input min-h-[120px] w-full rounded-lg px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                      placeholder="Tell companies about your experience and goals..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white">Cancel</Button>
                    <Button type="submit" className="gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 shadow-sm text-white">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">About Me</h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {user.bio || 'No bio added yet. Tell employers about yourself!'}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills ? user.skills.split(',').map((skill, i) => (
                          <span key={i} className="fe-tag shadow-sm">
                            {skill.trim()}
                          </span>
                        )) : (
                          <p className="text-sm text-slate-400 font-medium">No skills listed yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">Attached Resume</h4>
                    {user.resumeUrl ? (
                      <div className="group flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-4 hover:border-blue-500/50 hover:bg-blue-900/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 shadow-sm border border-slate-700">
                            <FileText className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Professional_Resume.pdf</p>
                            <p className="text-xs font-medium text-teal-400 mt-0.5 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> External Link Verified
                            </p>
                          </div>
                        </div>
                        <a href={user.resumeUrl} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="text-sm font-semibold shadow-sm border-slate-600 text-slate-300 group-hover:border-blue-500 group-hover:text-blue-400 hover:bg-slate-800">
                            View <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-slate-700 p-8 text-center bg-slate-800/30">
                        <FileText className="mx-auto h-8 w-8 text-slate-600 mb-3" />
                        <p className="text-sm font-semibold text-slate-400">No resume link provided</p>
                        <Button variant="link" className="text-sm font-semibold text-blue-400 mt-1 hover:text-blue-300" onClick={() => setIsEditing(true)}>Add Link Now</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'applications' && (
            <div className="space-y-6">
              <Card className="fe-card border-0">
                <CardHeader className="pb-4 border-b border-slate-800/50">
                  <CardTitle className="text-base font-bold text-white">Application History</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1 text-slate-400">Track the status of all your job applications.</CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-3">
                    {stats?.recentApplications?.length > 0 ? stats.recentApplications.map((app, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 shadow-sm border border-slate-700 text-slate-200 font-bold text-sm">
                            {app.company?.charAt(0) || 'J'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{app.role}</p>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">{app.company} • {app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <span className={app.status === 'ACCEPTED' ? 'fe-badge-success' : 'fe-badge-primary'}>{app.status}</span>
                      </div>
                    )) : (
                      <div className="fe-empty-state">
                        <div className="fe-empty-icon">
                          <Send className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-300">No applications yet</p>
                        <p className="text-xs text-slate-500 mt-1">You haven't applied to any jobs yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
