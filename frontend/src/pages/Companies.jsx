import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Building2, ArrowRight, Search } from "lucide-react"
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
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground">Explore Companies</h1>
        <p className="mt-2 text-muted-foreground">Discover the organizations hiring the best talent.</p>
      </div>

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search companies..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20">Loading companies...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company, index) => (
            <Card key={index} className="group transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{company.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{company.location || 'Hiring Globally'}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`/company/${encodeURIComponent(company.name)}`} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  View Open Positions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
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
