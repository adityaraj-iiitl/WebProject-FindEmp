import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

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
    authService.register(formData)
      .then(() => {
        alert("Registration Successful! Please Login.");
        navigate('/login');
      })
      .catch(err => {
        alert(err.message || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-sm border border-gray-300 bg-white p-8 rounded shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Register</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your information to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="name">Full Name</label>
            <input 
              id="name"
              required 
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              required 
              placeholder="m@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="role">I am a:</label>
            <select 
              id="role"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="APPLICANT">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm cursor-pointer border-0"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
