import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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
    axios.post('http://localhost:8080/api/users/register', formData)
      .then(res => {
        alert("Registration Successful! Please Login.");
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '3rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            required 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>I am a:</label>
          <select 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="APPLICANT">Job Seeker</option>
            <option value="RECRUITER">Recruiter</option>
          </select>
        </div>
        <button type="submit" className="btn" style={{ width: '100%' }}>Sign Up</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
