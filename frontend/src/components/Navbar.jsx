import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const getUser = () => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="w-full border-b border-gray-300 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-blue-600">
          FindEmp
        </Link>
        
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">Browse Jobs</Link>
          <Link to="/companies" className="text-sm font-medium text-gray-700 hover:text-blue-600">Companies</Link>
          {user?.role === 'RECRUITER' && (
            <Link to="/recruiter" className="text-sm font-medium text-gray-700 hover:text-blue-600">Recruiter Panel</Link>
          )}
          <Link to="/add-job" className="text-sm font-medium text-gray-700 hover:text-blue-600">Post a Job</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Welcome, {user.name || 'User'}
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-sm text-red-600 hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 cursor-pointer border-0"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
