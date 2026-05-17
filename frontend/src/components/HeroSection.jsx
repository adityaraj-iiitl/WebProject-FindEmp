import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Briefcase, Sparkles } from "lucide-react"

export function HeroSection({ onSearch }) {
  const [keyword, setKeyword] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(keyword, location);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-20 pb-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Job Matching
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find Your Dream Job{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Join millions of professionals discovering opportunities matched to their skills. 
            Our AI understands your potential and connects you with roles you'll love.
          </p>

          <div className="mt-10 w-full max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-primary/5 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="h-12 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative flex-1 hidden md:block">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="City, state, or remote"
                  className="h-12 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button size="lg" className="h-12 gap-2 px-8 text-base font-semibold" onClick={handleSearch}>
                <Briefcase className="h-5 w-5" />
                Search Jobs
              </Button>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">250K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Active Jobs</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">50K+</p>
              <p className="mt-1 text-sm text-muted-foreground">Companies</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">2M+</p>
              <p className="mt-1 text-sm text-muted-foreground">Hired Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
