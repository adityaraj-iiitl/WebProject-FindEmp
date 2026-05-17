import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import api from '../api/config';
import {
  Eye,
  Send,
  CheckCircle2,
  Calendar,
  Star,
  FileText,
} from "lucide-react"

export function DashboardSection() {
  const [stats, setStats] = useState({
    applicationsSent: 0,
    profileViews: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
    recentApplications: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      api.get(`/dashboard/stats/${user.id}`)
        .then(res => {
          setStats(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading Dashboard...</div>;

  return (
    <section className="border-t border-slate-800/50 bg-slate-900/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white fe-section-heading">Your Dashboard</h2>
          <p className="mt-3 text-sm text-slate-400">
            Track your job search progress and upcoming activities
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="fe-stat-card blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications Sent</p>
                <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.applicationsSent}</p>
                <p className="mt-1 text-xs text-blue-400 font-medium">Live Data</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900/30 text-blue-400 shadow-sm border border-blue-800/30">
                <Send className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="fe-stat-card teal">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Views</p>
                <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.profileViews}</p>
                <p className="mt-1 text-xs text-teal-400 font-medium">Live Data</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-900/30 text-teal-400 shadow-sm border border-teal-800/30">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="fe-stat-card indigo">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews</p>
                <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.interviewsScheduled}</p>
                <p className="mt-1 text-xs text-slate-500">Across all time</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-900/30 text-indigo-400 shadow-sm border border-indigo-800/30">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="fe-stat-card amber">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Jobs</p>
                <p className="mt-2 text-3xl font-extrabold text-white fe-stat-number">{stats.savedJobs}</p>
                <p className="mt-1 text-xs text-slate-500">In your library</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-900/30 text-amber-400 shadow-sm border border-amber-800/30">
                <Star className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="fe-card lg:col-span-1 border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base font-bold text-white">
                Profile Strength
                <span className="fe-badge-success">Good</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400 text-xs font-medium">Completion</span>
                  <span className="font-bold text-white text-sm">60%</span>
                </div>
                <div className="fe-progress-track">
                  <div className="fe-progress-fill" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                  <span className="text-sm font-medium text-white">Basic info complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-700" />
                  <span className="text-sm font-medium text-slate-500">Resume uploaded</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-slate-700" />
                  <span className="text-sm font-medium text-slate-500">Skills added</span>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 text-sm font-semibold border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <FileText className="h-4 w-4 text-slate-400" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="fe-card lg:col-span-2 border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/50">
              <CardTitle className="text-base font-bold text-white">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-sm font-semibold">
                View All
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {stats.recentApplications.length > 0 ? (
                  stats.recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/80 hover:border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 shadow-sm text-sm font-bold text-white">
                          {(app.company || 'J').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{app.role}</p>
                          <p className="text-xs font-medium text-slate-400 mt-0.5">{app.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={
                          app.status === "ACCEPTED" || app.status === "INTERVIEW"
                            ? "fe-badge-success"
                            : "fe-badge-primary"
                        }>
                          {app.status}
                        </span>
                        <p className="mt-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                          {new Date(app.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                      <Send className="h-5 w-5 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No applications found yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
