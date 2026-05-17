import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight, Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import api from '../api/config';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companies')
      .then(res => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 min-h-[calc(100vh-64px)]">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white fe-section-heading">Explore Companies</h1>
          <p className="mt-4 text-sm font-medium text-slate-400">Discover the organizations hiring the best talent right now.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search companies by name..." 
            className="fe-glass-input pl-10 h-11 text-sm shadow-sm rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm font-medium text-slate-400">Loading companies...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company, index) => (
            <Card key={index} className="fe-card group border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-slate-800/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 text-indigo-400 shadow-sm border border-indigo-800/30 group-hover:scale-105 transition-transform">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{company.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1 text-xs font-medium text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {company.location || 'Hiring Globally'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex justify-between items-center bg-slate-800/30 rounded-b-xl">
                <span className="text-xs font-semibold text-slate-400">Active Hiring</span>
                <Link 
                  to={`/company/${encodeURIComponent(company.name)}`} 
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline group/link"
                >
                  View Positions
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="fe-empty-state col-span-full">
          <div className="fe-empty-icon">
            <Building2 className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-base font-bold text-white">No companies found</p>
          <p className="text-sm text-slate-400 mt-1">We couldn't find any companies matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default Companies;
