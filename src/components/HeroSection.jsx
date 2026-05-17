import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Briefcase, TrendingUp, Users, Building2 } from "lucide-react"

export function HeroSection({ onSearch }) {
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(keyword, location);
  };

  return (
    <section className="fe-hero pt-20 pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Trusted by 2M+ professionals across India
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
            Find Your Next{" "}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Career Opportunity
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-white/60 leading-relaxed">
            Browse thousands of job listings from top companies.
            Search by role, location, or company and apply in seconds.
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <div className="fe-search-bar flex flex-col gap-0 p-1.5 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Job title, keyword, or company"
                  className="fe-glass-input h-11 pl-10 text-sm rounded-xl shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative flex-1 hidden md:block">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="City or remote"
                  className="fe-glass-input h-11 pl-10 text-sm rounded-xl shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button size="lg" className="h-11 gap-2 px-7 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 shadow-lg shadow-blue-500/20" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Briefcase className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white fe-stat-number md:text-3xl">250K+</p>
              <p className="mt-0.5 text-xs text-white/50 uppercase tracking-wider">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Building2 className="h-4 w-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-white fe-stat-number md:text-3xl">50K+</p>
              <p className="mt-0.5 text-xs text-white/50 uppercase tracking-wider">Companies</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white fe-stat-number md:text-3xl">2M+</p>
              <p className="mt-0.5 text-xs text-white/50 uppercase tracking-wider">Hired Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
