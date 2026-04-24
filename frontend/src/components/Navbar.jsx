import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Briefcase, User, LogOut, Search } from "lucide-react"

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
            <Briefcase className="h-5 w-5" />
          </div>
          FindEmp
        </Link>
        
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Browse Jobs</Link>
          <Link to="/companies" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Companies</Link>
          <Link to="/add-job" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Post a Job</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:border-primary/50 hover:bg-primary/5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 overflow-hidden text-[10px] font-bold text-primary">
                  {user.profilePicUrl ? (
                    <img src={user.profilePicUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    (user.name || 'U').slice(0, 2).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{user.name || 'Profile'}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/login')} className="gap-2">
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
