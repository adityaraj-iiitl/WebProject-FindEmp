import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { jobService } from '../services/jobService';

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

    companyService.getCompaniesByRecruiter(user.id)
      .then(data => {
        setCompanies(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, company: data[0].name, location: data[0].location }));
        }
      })
      .catch(err => {
        alert(err.message || "Failed to load companies.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    jobService.createJob(formData)
      .then(() => {
        alert("Job posted successfully!");
        navigate('/profile');
      })
      .catch(err => {
        alert(err.message || "Failed to post job.");
      });
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-2xl border border-gray-300 bg-white p-8 rounded shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create a job listing</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="title">Job Title</label>
              <input 
                id="title"
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                placeholder="e.g. Senior Java Developer"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="company">Company</label>
              <select 
                id="company"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="location">Location</label>
              <input 
                id="location"
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                placeholder="e.g. Mumbai or Remote"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="salary">Salary Range</label>
              <input 
                id="salary"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                placeholder="e.g. ₹10 LPA - ₹15 LPA"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="description">Job Description</label>
            <textarea 
              id="description"
              required
              className="min-h-[120px] w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
              placeholder="Describe the responsibilities, requirements, and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm mt-2 cursor-pointer border-0"
          >
            Publish Job Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
