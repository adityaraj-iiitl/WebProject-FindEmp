import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/login', formData)
      .then(res => {
        if (res.data) {
          localStorage.setItem('user', JSON.stringify(res.data));
          alert("Login Successful!");
          navigate('/');
        } else {
          alert("Invalid Credentials!");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>User Login</h2>
      <form onSubmit={handleSubmit} className="job-form">
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
        <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Don't have an account? <Link to="/register">Sign Up here</Link>
      </p>
    </div>
  );
};

export default Login;
