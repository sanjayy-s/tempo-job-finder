
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  UserIcon,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "@/components/ui/sonner";

const ManageJobApplications = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getJobById, 
    getApplicationsForJob,
    updateApplicationStatus, 
    loading,
    updateJobStatus,
  } = useJobs();
  
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  
  const job = id ? getJobById(id) : undefined;
  const applications = id ? getApplicationsForJob(id) : [];
  
  // Filter applications by status
  const pendingApplications = applications.filter(app => app.status === "pending");
  const viewedApplications = applications.filter(app => app.status === "viewed");
  const processedApplications = applications.filter(app => ["accepted", "rejected"].includes(app.status));
  
  const handleViewApplication = (applicationId: string) => {
    // In a real app, this would update the application status to "viewed"
    // For this demo, we'll just navigate to the application detail
    navigate(`/applications/${applicationId}`);
  };
  
  const handleActionDialog = (applicationId: string, action: "accept" | "reject") => {
    setSelectedApplication(applicationId);
    setActionType(action);
    setFeedbackNote("");
  };
  
  const handleApplicationAction = async () => {
    if (!selectedApplication || !actionType) return;
    
    try {
      await updateApplicationStatus(
        selectedApplication,
        actionType === "accept" ? "accepted" : "rejected",
        feedbackNote
      );
      
      setSelectedApplication(null);
      setActionType(null);
      setFeedbackNote("");
      
      if (actionType === "accept") {
        toast.success("Candidate accepted successfully! The job status has been updated to filled.");
      } else {
        toast.success("Application rejected successfully.");
      }
    } catch (error) {
      // Error handled in JobContext
    }
  };
  
  const handleCloseJob = async () => {
    if (!id) return;
    
    try {
      await updateJobStatus(id, "closed");
      toast.success("Job listing closed successfully.");
    } catch (error) {
      // Error handled in JobContext
    }
  };

  if (!job || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Job not found</h1>
          <p className="text-gray-500 mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/my-jobs")}>Back to My Jobs</Button>
        </div>
      </Layout>
    );
  }

  // Check if the current user is the job owner
  if (job.recruiterId !== user.id) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Unauthorized</h1>
          <p className="text-gray-500 mb-6">You don't have permission to manage this job listing.</p>
          <Button onClick={() => navigate("/my-jobs")}>Back to My Jobs</Button>
        </div>
      </Layout>
    );
  }

  return (
    <RequireAuth allowedRoles={["recruiter"]}>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 hover:bg-transparent"
            onClick={() => navigate("/my-jobs")}
          >
            <ChevronLeft className="mr-1 w-4 h-4" />
            Back to my jobs
          </Button>
          
          {/* Job header */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
                <p className="text-gray-600 mb-4">{job.company} • {job.remote ? "Remote" : job.location}</p>
                
                <div className="flex items-center gap-2">
                  <Badge className={`capitalize ${
                    job.status === "open" ? "bg-green-100 text-green-800 border-green-200" :
                    job.status === "filled" ? "bg-blue-100 text-blue-800 border-blue-200" :
                    "bg-gray-100 text-gray-800 border-gray-200"
                  }`}>
                    {job.status}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <UserIcon className="w-3 h-3" />
                    <span>{job.applicants.length} applicant{job.applicants.length !== 1 ? "s" : ""}</span>
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                    </span>
                  </Badge>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                {job.status === "open" ? (
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={handleCloseJob}
                  >
                    Close Job Listing
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={() => navigate(`/post-job`)}
                  >
                    Post Similar Job
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Applications tabs */}
          <h2 className="text-xl font-semibold mb-4">Applications</h2>
          
          {applications.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No applications yet</h3>
              <p className="text-gray-500">
                Your job posting hasn't received any applications yet. Check back later!
              </p>
            </div>
          ) : (
            <Tabs defaultValue="pending">
              <TabsList className="mb-6">
                <TabsTrigger value="pending">
                  New ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="viewed">
                  Viewed ({viewedApplications.length})
                </TabsTrigger>
                <TabsTrigger value="processed">
                  Processed ({processedApplications.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No new applications</p>
                    </div>
                  ) : (
                    pendingApplications.map((application) => (
                      <div 
                        key={application.id} 
                        className="bg-white rounded-lg border overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium mb-1">Application from Candidate #{application.id.slice(-4)}</h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                              </p>
                            </div>
                            <Badge className="bg-yellow-100 border-yellow-200 text-yellow-800">
                              New
                            </Badge>
                          </div>
                          
                          <div className="mt-4 bg-gray-50 rounded-md p-3">
                            <h4 className="text-sm font-medium mb-1">Cover Letter:</h4>
                            <p className="text-sm">{application.coverLetter}</p>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button 
                              onClick={() => handleActionDialog(application.id, "accept")}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleActionDialog(application.id, "reject")}
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button 
                              onClick={() => handleViewApplication(application.id)}
                              variant="outline"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="viewed">
                <div className="space-y-4">
                  {viewedApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No viewed applications</p>
                    </div>
                  ) : (
                    viewedApplications.map((application) => (
                      <div 
                        key={application.id} 
                        className="bg-white rounded-lg border overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium mb-1">Application from Candidate #{application.id.slice(-4)}</h3>
                              <p className="text-sm text-gray-500 mb-2">
                                Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 border-blue-200 text-blue-800">
                              Viewed
                            </Badge>
                          </div>
                          
                          <div className="mt-4 bg-gray-50 rounded-md p-3">
                            <h4 className="text-sm font-medium mb-1">Cover Letter:</h4>
                            <p className="text-sm">{application.coverLetter}</p>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button 
                              onClick={() => handleActionDialog(application.id, "accept")}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleActionDialog(application.id, "reject")}
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                            <Button 
                              onClick={() => handleViewApplication(application.id)}
                              variant="outline"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="processed">
                <div className="space-y-4">
                  {processedApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No processed applications</p>
                    </div>
                  ) : (
                    processedApplications.map((application) => {
                      const isAccepted = application.status === "accepted";
                      
                      return (
                        <div 
                          key={application.id} 
                          className="bg-white rounded-lg border overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium mb-1">Application from Candidate #{application.id.slice(-4)}</h3>
                                <p className="text-sm text-gray-500 mb-2">
                                  Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                                </p>
                              </div>
                              <Badge className={isAccepted 
                                ? "bg-green-100 border-green-200 text-green-800" 
                                : "bg-red-100 border-red-200 text-red-800"
                              }>
                                {isAccepted ? "Accepted" : "Rejected"}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 bg-gray-50 rounded-md p-3">
                              <h4 className="text-sm font-medium mb-1">Cover Letter:</h4>
                              <p className="text-sm">{application.coverLetter}</p>
                            </div>
                            
                            {application.notes && (
                              <div className="mt-3 bg-gray-50 rounded-md p-3">
                                <h4 className="text-sm font-medium mb-1">Your Feedback:</h4>
                                <p className="text-sm">{application.notes}</p>
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                              <Button 
                                onClick={() => handleViewApplication(application.id)}
                                variant="outline"
                                size="sm"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        {/* Feedback Dialog */}
        <Dialog 
          open={!!selectedApplication && !!actionType} 
          onOpenChange={(open) => !open && setSelectedApplication(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "accept" ? "Accept Candidate" : "Reject Application"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "accept" 
                  ? "The candidate will be notified that their application has been accepted and the job will be marked as filled."
                  : "The candidate will be notified that their application has been rejected."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback (Optional)</label>
                <Textarea 
                  placeholder={actionType === "accept" 
                    ? "Provide any additional information for the candidate..." 
                    : "Provide feedback on why this application was not selected..."
                  }
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedApplication(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplicationAction}
                disabled={loading}
                variant={actionType === "accept" ? "default" : "destructive"}
              >
                {loading ? "Processing..." : 
                  actionType === "accept" ? "Accept Candidate" : "Reject Application"
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </RequireAuth>
  );
};

export default ManageJobApplications;
