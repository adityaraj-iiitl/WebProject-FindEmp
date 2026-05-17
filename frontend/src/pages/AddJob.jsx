import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from '../api/config';
import { Briefcase, Send, Building2, MapPin, DollarSign } from "lucide-react"

const AddJob = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    recruiterId: user?.id
  });

  useEffect(() => {
    if (!user || user.role !== 'RECRUITER') {
      alert("Only recruiters can access this page.");
      navigate('/');
      return;
    }

    // Fetch recruiter's companies to select from
    api.get(`/companies/recruiter/${user.id}`)
      .then(res => {
        setCompanies(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, company: res.data[0].name, location: res.data[0].location }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/jobs', formData)
      .then(() => {
        alert("Job posted successfully!");
        navigate('/profile');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-2xl border-primary/10 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
              <CardDescription>Reach thousands of qualified candidates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="title"
                    required 
                    className="pl-10"
                    placeholder="e.g. Senior Java Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select 
                    id="company"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.company}
                    onChange={(e) => {
                      const selected = companies.find(c => c.name === e.target.value);
                      setFormData({...formData, company: e.target.value, location: selected?.location || ''});
                    }}
                  >
                    {companies.length > 0 ? companies.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    )) : (
                      <option value="">No companies added yet</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="location"
                    required 
                    className="pl-10"
                    placeholder="e.g. Mumbai or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="salary"
                    className="pl-10"
                    placeholder="e.g. ₹10 LPA - ₹15 LPA"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <textarea 
                id="description"
                required
                className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe the responsibilities, requirements, and benefits..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full gap-2 py-6 text-lg font-semibold">
              <Send className="h-5 w-5" />
              Publish Job Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddJob;
