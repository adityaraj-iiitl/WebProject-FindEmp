import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/jobs', formData)
      .then(() => {
        alert("Job posted successfully!");
        navigate('/');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '2rem' }}>Post a New Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Job Title</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Senior Java Developer"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Tech Solutions Inc."
            onChange={(e) => setFormData({...formData, company: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Mumbai or Remote"
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Salary Range</label>
          <input 
            type="text" 
            placeholder="e.g. ₹10 LPA - ₹15 LPA"
            onChange={(e) => setFormData({...formData, salary: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea 
            rows="5" 
            required
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Post Job</button>
      </form>
    </div>
  );
};

export default AddJob;
