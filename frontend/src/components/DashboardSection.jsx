import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import api from '../api/config';
import {
  Briefcase,
  Eye,
  Send,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Star,
  ArrowUpRight,
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

  if (loading) return <div className="py-20 text-center">Loading Dashboard...</div>;

  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground">Your Dashboard</h2>
          <p className="mt-2 text-muted-foreground">
            Track your job search progress and upcoming activities
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications Sent</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.applicationsSent}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-accent">
                    <TrendingUp className="h-4 w-4" />
                    Live Data
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Send className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.profileViews}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-accent">
                    <TrendingUp className="h-4 w-4" />
                    Live Data
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.interviewsScheduled}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Across all time</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Jobs</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.savedJobs}</p>
                  <p className="mt-1 text-sm text-muted-foreground">In your library</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Star className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-lg">
                Profile Strength
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  Good
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium text-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm text-foreground">Basic info complete</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Resume uploaded</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Skills added</span>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Update Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentApplications.length > 0 ? (
                  stats.recentApplications.map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                          {(app.company || 'J').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{app.role}</p>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className={
                            app.status === "ACCEPTED" || app.status === "INTERVIEW"
                              ? "bg-accent/10 text-accent"
                              : "bg-primary/10 text-primary"
                          }
                        >
                          {app.status}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(app.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No applications found yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
