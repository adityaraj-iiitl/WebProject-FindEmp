import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import api from '../api/config';
import { 
  User, 
  Mail, 
  Briefcase, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Calendar, 
  Star,
  Send,
  Camera
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
    return <div className="py-20 text-center">Redirecting to login...</div>;
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
      // Fetch full user data and stats
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

  if (loading) return <div className="py-20 text-center">Loading Profile...</div>;

  if (user.role === 'RECRUITER') {
    return <RecruiterDashboard />;
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Column: User Card & Profile Strength */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-accent" />
            <CardContent className="relative px-6 pb-6 pt-0">
              <div className="absolute -top-12 left-6">
                <div className="group relative flex h-24 w-24 items-center justify-center rounded-2xl bg-background border-4 border-background shadow-xl overflow-hidden cursor-pointer">
                  {formData.profilePicUrl ? (
                    <img src={formData.profilePicUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted text-primary">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">{user.title || 'Add a professional title'}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {user.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-foreground">{completionRate()}%</span>
                </div>
                <Progress value={completionRate()} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.title ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted"} />
                  <span className={user.title ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>Professional Title</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.bio ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted"} />
                  <span className={user.bio ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>Career Bio</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.skills ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted"} />
                  <span className={user.skills ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>Technical Skills</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={user.resumeUrl ? "h-5 w-5 text-accent" : "h-5 w-5 text-muted"} />
                  <span className={user.resumeUrl ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>Resume Uploaded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Overview
              {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Professional Profile
              {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'applications' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Applications
              {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Applications</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.applicationsSent}</span>
                    <Send className="h-5 w-5 text-primary opacity-50" />
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Interviews</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.interviewsScheduled}</span>
                    <Calendar className="h-5 w-5 text-accent opacity-50" />
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Saved</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.savedJobs}</span>
                    <Star className="h-5 w-5 text-primary opacity-50" />
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-bold">{stats.profileViews}</span>
                    <Eye className="h-5 w-5 text-accent opacity-50" />
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentApplications?.slice(0, 3).map((app, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                            {app.company?.charAt(0) || 'J'}
                          </div>
                          <div>
                            <p className="font-medium">{app.role}</p>
                            <p className="text-xs text-muted-foreground">{app.company} • {app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <Badge variant={app.status === 'ACCEPTED' ? 'accent' : 'secondary'}>{app.status}</Badge>
                      </div>
                    ))}
                    {(!stats?.recentApplications || stats.recentApplications.length === 0) && (
                      <p className="text-center py-8 text-muted-foreground italic">No recent activity found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Complete your profile to attract top companies.</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {/* ... Existing content logic will go here in next step ... */}
              {message && <div className="mb-4 text-sm text-accent font-medium">{message}</div>}
              
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Full Stack Developer" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resumeUrl">Resume Link (URL)</Label>
                      <Input 
                        id="resumeUrl" 
                        placeholder="Link to your Google Drive/Dropbox resume" 
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicUrl">Profile Picture URL</Label>
                    <Input 
                      id="profilePicUrl" 
                      placeholder="https://example.com/photo.jpg" 
                      value={formData.profilePicUrl}
                      onChange={(e) => setFormData({...formData, profilePicUrl: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (Comma separated)</Label>
                    <Input 
                      id="skills" 
                      placeholder="e.g. React, Java, Spring Boot, MySQL" 
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <textarea 
                      id="bio"
                      className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell companies about your experience and goals..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h4>
                      <p className="text-foreground leading-relaxed">
                        {user.bio || 'No bio added yet. Tell employers about yourself!'}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills ? user.skills.split(',').map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                            {skill.trim()}
                          </Badge>
                        )) : (
                          <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resume</h4>
                    {user.resumeUrl ? (
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Professional_Resume.pdf</p>
                            <p className="text-xs text-muted-foreground">External Link Verified</p>
                          </div>
                        </div>
                        <a href={user.resumeUrl} target="_blank" rel="noreferrer">
                          <Button variant="ghost" size="sm" className="text-accent">View</Button>
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-8 text-center">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-30" />
                        <p className="mt-2 text-sm text-muted-foreground">No resume link provided</p>
                        <Button variant="link" onClick={() => setIsEditing(true)}>Add Link Now</Button>
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application History</CardTitle>
                  <CardDescription>Track the status of all your job applications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentApplications?.length > 0 ? stats.recentApplications.map((app, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                            {app.company?.charAt(0) || 'J'}
                          </div>
                          <div>
                            <p className="font-medium">{app.role}</p>
                            <p className="text-xs text-muted-foreground">{app.company} • {app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}</p>
                          </div>
                        </div>
                        <Badge variant={app.status === 'ACCEPTED' ? 'accent' : 'secondary'}>{app.status}</Badge>
                      </div>
                    )) : (
                      <p className="text-center py-10 text-muted-foreground">You haven't applied to any jobs yet.</p>
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
