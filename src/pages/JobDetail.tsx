
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  CalendarIcon,
  MapPinIcon,
  CoinsIcon,
  BriefcaseIcon,
  ClockIcon,
  ChevronLeft,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow, format } from "date-fns";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, applyForJob, applications, loading } = useJobs();
  const { user } = useAuth();
  
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const job = id ? getJobById(id) : undefined;
  
  // Check if user has already applied
  const hasApplied = user?.role === "seeker" && applications.some(
    app => app.jobId === id && app.seekerId === user.id
  );
  
  const handleApply = async () => {
    if (!id || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await applyForJob(id, coverLetter);
      setIsApplyDialogOpen(false);
      setCoverLetter("");
    } catch (error) {
      // Error is handled in JobContext with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Job not found</h1>
          <p className="text-gray-500 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:bg-transparent"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-1 w-4 h-4" />
          Back to jobs
        </Button>
        
        {/* Job header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
              <p className="text-gray-600 mb-4">{job.company} • {job.remote ? "Remote" : job.location}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BriefcaseIcon className="w-3 h-3" />
                  <span className="capitalize">{job.type.replace('-', ' ')}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CoinsIcon className="w-3 h-3" />
                  ${job.salary.min}-${job.salary.max}/{job.salary.period}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                </Badge>
              </div>
              
              {job.matchScore && (
                <div className="inline-flex items-center gap-1 bg-tempo-blue bg-opacity-10 text-tempo-blue px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {job.matchScore}% Match
                </div>
              )}
            </div>
            
            <div className="w-full md:w-auto">
              {user?.role === "seeker" && job.status === "open" && (
                hasApplied ? (
                  <Button className="w-full md:w-auto" variant="outline" disabled>
                    Applied
                  </Button>
                ) : (
                  <Button 
                    className="w-full md:w-auto" 
                    onClick={() => setIsApplyDialogOpen(true)}
                  >
                    Apply Now
                  </Button>
                )
              )}
              
              {user?.role === "recruiter" && user.id === job.recruiterId && (
                <Button 
                  className="w-full md:w-auto" 
                  onClick={() => navigate(`/my-jobs/${job.id}`)}
                >
                  Manage Job
                </Button>
              )}
              
              {job.status !== "open" && (
                <Badge variant="secondary" className="text-sm">
                  {job.status === "filled" ? "Position filled" : "No longer accepting applications"}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Job details */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="mb-6">{job.description}</p>
            
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Job metadata */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Job Type</p>
                <p className="text-gray-600 capitalize">{job.type.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{job.remote ? "Remote" : job.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CoinsIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Salary</p>
                <p className="text-gray-600">
                  ${job.salary.min}-${job.salary.max}/{job.salary.period}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Posted On</p>
                <p className="text-gray-600">
                  {format(new Date(job.postedAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Apply dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Tell the recruiter why you're a good fit for this role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter</label>
              <Textarea 
                placeholder="Write a brief cover letter explaining why you're interested in this role and what makes you a good fit..."
                className="min-h-[150px]"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApplyDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={isSubmitting || !coverLetter.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default JobDetail;
