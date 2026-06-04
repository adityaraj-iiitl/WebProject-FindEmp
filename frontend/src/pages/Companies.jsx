import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyService.getAllCompanies()
      .then(data => {
        setCompanies(data || []);
        setLoading(false);
      })
      .catch(err => {
        alert(err.message || "Failed to load companies.");
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explore Companies</h1>
        <p className="text-sm text-gray-600 mt-1">Discover the organizations hiring the best talent.</p>
      </div>

      <div className="mb-6 max-w-md">
        <input 
          placeholder="Search companies..." 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company, index) => (
            <div key={index} className="border border-gray-300 rounded p-5 bg-white flex flex-col justify-between hover:border-gray-400">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Location: {company.location || 'Hiring Globally'}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link 
                  to={`/company/${encodeURIComponent(company.name)}`} 
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View Open Positions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No companies found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default Companies;
