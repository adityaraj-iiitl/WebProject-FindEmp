import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">FindEmp</Link>
      <div className="nav-links">
        <Link to="/">Browse Jobs</Link>
        {user ? (
          <>
            <Link to="/add-job">Post a Job</Link>
            <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#4f46e5' }}>Hi, {user.name}</span>
            <a href="#" onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</a>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
