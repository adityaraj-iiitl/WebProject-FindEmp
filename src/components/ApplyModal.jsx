import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import api from '../api/config';
import { Send, X, FileText, CheckCircle } from "lucide-react"

const ApplyModal = ({ job, onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const applicationData = {
      jobId: job.id,
      applicantId: user.id,
      applicantName: user.name,
      applicantEmail: user.email,
      resumeUrl: user.resumeUrl || '',
      coverLetter: coverLetter,
      status: 'PENDING'
    };

    api.post('/applications', applicationData)
      .then(() => {
        setSubmitted(true);
        setLoading(false);
        setTimeout(() => onClose(), 2000);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="fe-modal-overlay">
      <Card className="w-full max-w-lg shadow-lg relative border border-border">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="absolute right-3 top-3"
        >
          <X className="h-4 w-4" />
        </Button>

        {submitted ? (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="h-14 w-14 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">Application Sent</CardTitle>
            <p className="text-sm text-muted-foreground">Your application for {job.title} at {job.company} has been received.</p>
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-lg">Apply for {job.title}</CardTitle>
              <CardDescription className="text-sm">Applying to {job.company} -- {job.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-lg bg-secondary p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Your Profile</span>
                    <span className="text-xs text-muted-foreground">Attached automatically</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {user.resumeUrl ? (
                    <div className="flex items-center gap-2 text-xs text-accent mt-2">
                      <FileText className="h-3 w-3" />
                      Resume Linked: Professional_Resume.pdf
                    </div>
                  ) : (
                    <p className="text-xs text-destructive mt-2">Warning: No resume linked in your profile!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter" className="text-sm">Cover Letter / Why should we hire you?</Label>
                  <textarea 
                    id="coverLetter"
                    required
                    className="min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Briefly describe your experience and interest in this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full gap-2 text-sm" disabled={loading}>
                  <Send className="h-4 w-4" />
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default ApplyModal;
