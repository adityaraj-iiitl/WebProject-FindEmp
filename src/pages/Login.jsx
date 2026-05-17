import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/users/login', formData)
      .then(res => {
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          if (res.data.role === 'RECRUITER') {
            navigate('/recruiter');
          } else {
            navigate('/');
          }
        } else {
          alert("Invalid Credentials!");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="fe-auth-bg flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <Card className="w-full max-w-md border border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-slate-900/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 mb-2">
            <LogIn className="h-6 w-6 ml-1" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-white tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-400">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-300">Email Address</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com"
                required 
                className="fe-glass-input h-11 text-sm shadow-sm focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</Label>
                <a href="#" className="text-xs font-semibold text-blue-400 hover:text-blue-300">Forgot password?</a>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                required 
                className="fe-glass-input h-11 text-sm shadow-sm focus:ring-blue-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-11 mt-2 text-sm font-bold shadow-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 text-white transition-all">
              Sign In
            </Button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors">
              Create one now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
