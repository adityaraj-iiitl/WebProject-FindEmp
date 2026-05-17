import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Send, Building2, MapPin, DollarSign } from "lucide-react"

const AddJob = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    recruiterId: user?.id
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/jobs', formData)
      .then(res => {
        alert("Job Posted Successfully!");
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  if (!user || user.role !== 'RECRUITER') {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="fe-empty-icon mb-4">
          <Briefcase className="h-8 w-8 text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="mt-2 text-sm text-slate-400">Only recruiters can post jobs.</p>
        <Button className="mt-6" onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white fe-section-heading">Post a New Job</h1>
        <p className="mt-4 text-sm font-medium text-slate-400">Fill out the details below to publish an open position to the platform.</p>
      </div>

      <Card className="fe-card border-0">
        <CardHeader className="pb-4 border-b border-slate-800/50">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/30 text-blue-400">
              <Building2 className="h-4 w-4" />
            </div>
            Job Details
          </CardTitle>
          <CardDescription className="text-slate-400">Provide clear and accurate information to attract the best candidates.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-300">Job Title</Label>
              <Input 
                id="title"
                required 
                placeholder="e.g. Senior Frontend Developer"
                className="fe-glass-input h-11 text-sm"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" /> Company Name
                </Label>
                <Input 
                  id="company"
                  required 
                  placeholder="e.g. Acme Corp"
                  className="fe-glass-input h-11 text-sm"
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" /> Location
                </Label>
                <Input 
                  id="location"
                  required 
                  placeholder="e.g. Bangalore or Remote"
                  className="fe-glass-input h-11 text-sm"
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-semibold text-slate-300">Employment Type</Label>
                <select 
                  id="type"
                  className="fe-glass-input flex h-11 w-full rounded-md px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-slate-500" /> Salary Range
                </Label>
                <Input 
                  id="salary"
                  required 
                  placeholder="e.g. ₹10L - ₹15L LPA"
                  className="fe-glass-input h-11 text-sm"
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-300">Job Description</Label>
              <textarea 
                id="description"
                required 
                placeholder="Describe the responsibilities, requirements, and benefits..."
                className="fe-glass-input min-h-[160px] w-full rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="pt-4 border-t border-slate-800/50 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white hover:bg-slate-800">
                Cancel
              </Button>
              <Button type="submit" className="gap-2 px-8 font-bold bg-blue-600 hover:bg-blue-500 text-white">
                <Send className="h-4 w-4" />
                Post Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddJob;
