import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Briefcase, User, LogOut } from "lucide-react"

const Navbar = () => {
  const getUser = () => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Browse Jobs', path: '/' },
    { name: 'Companies', path: '/companies' },
    ...(user?.role === 'RECRUITER' ? [{ name: 'Recruiter Panel', path: '/recruiter' }] : []),
    { name: 'Post a Job', path: '/add-job' },
  ];

  return (
    <nav className="fe-navbar sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          FindEmp
        </Link>
        
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === link.path 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="group flex items-center gap-2.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 shadow-sm transition-all hover:border-blue-500/50 hover:bg-slate-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 overflow-hidden text-[10px] font-bold text-blue-400 shadow-inner">
                  {user.profilePicUrl ? (
                    <img src={user.profilePicUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    (user.name || 'U').slice(0, 2).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{user.name || 'Profile'}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-full h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')} className="gap-2 rounded-full px-6 shadow-sm bg-blue-600 hover:bg-blue-500 text-white border-0">
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
