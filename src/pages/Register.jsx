import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'APPLICANT'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users/register', formData)
      .then(res => {
        alert("Registration Successful! Please Login.");
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="fe-auth-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-slate-900/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 mb-2">
            <UserPlus className="h-6 w-6 ml-0.5" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-400">Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-300">Full Name</Label>
              <Input 
                id="name"
                required 
                placeholder="John Doe"
                className="fe-glass-input h-11 text-sm shadow-sm focus:ring-teal-500"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-300">Email Address</Label>
              <Input 
                id="email"
                type="email" 
                required 
                placeholder="you@example.com"
                className="fe-glass-input h-11 text-sm shadow-sm focus:ring-teal-500"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</Label>
              <Input 
                id="password"
                type="password" 
                required 
                placeholder="••••••••"
                className="fe-glass-input h-11 text-sm shadow-sm focus:ring-teal-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-slate-300">I am a</Label>
              <select 
                id="role"
                className="flex h-11 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="APPLICANT">Job Seeker</option>
                <option value="RECRUITER">Recruiter / Employer</option>
              </select>
            </div>
            <Button type="submit" className="w-full h-11 mt-2 text-sm font-bold shadow-md bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 border-0 text-white transition-all">
              Create Account
            </Button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-teal-400 hover:text-teal-300 hover:underline transition-colors">
              Sign in instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
