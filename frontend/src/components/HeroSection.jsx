import * as React from 'react'

export function HeroSection({ onSearch }) {
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(keyword, location);
  };

  return (
    <section className="bg-gray-100 py-12 border-b border-gray-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Jobs Easily
          </h1>

          <p className="mt-2 text-base text-gray-600">
            Search jobs and internships from different companies.
          </p>

          <div className="mt-6 w-full max-w-2xl bg-white p-4 border border-gray-300 rounded shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <input
                type="text"
                placeholder="City, state, or remote"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-800"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm whitespace-nowrap cursor-pointer border-0"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
