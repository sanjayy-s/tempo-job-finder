
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, CalendarIcon, CheckIcon, PlusIcon, UserIcon, XIcon } from "lucide-react";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { format } from "date-fns";

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getJobsForRecruiter, getApplicationsForJob, loading } = useJobs();
  
  // Get jobs posted by the current recruiter
  const myJobs = user ? getJobsForRecruiter(user.id) : [];
  
  // Filter jobs by status
  const activeJobs = myJobs.filter(job => job.status === "open");
  const closedJobs = myJobs.filter(job => job.status !== "open");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "filled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <RequireAuth allowedRoles={["recruiter"]}>
      <Layout>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">My Job Postings</h1>
              <p className="text-gray-500">Manage your job listings and applications</p>
            </div>
            <Button 
              onClick={() => navigate("/post-job")}
              className="md:self-start flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Post New Job
            </Button>
          </div>
          
          {myJobs.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <BriefcaseIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No jobs posted yet</h2>
              <p className="text-gray-500 mb-6">Create your first job listing to start finding candidates.</p>
              <Button onClick={() => navigate("/post-job")}>Post Your First Job</Button>
            </div>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Listings ({activeJobs.length})</TabsTrigger>
                <TabsTrigger value="closed">Closed Listings ({closedJobs.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <div className="space-y-6">
                  {activeJobs.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500 mb-4">No active job listings</p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/post-job")}
                      >
                        Post a Job
                      </Button>
                    </div>
                  ) : (
                    activeJobs.map(job => {
                      const applications = getApplicationsForJob(job.id);
                      const newApplications = applications.filter(app => app.status === "pending").length;
                      const viewedApplications = applications.filter(app => app.status === "viewed").length;
                      
                      return (
                        <Card key={job.id} className="overflow-hidden">
                          <CardHeader className="bg-gray-50 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>{job.company}</span>
                                  <span>•</span>
                                  <span>{job.remote ? "Remote" : job.location}</span>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(job.status)} capitalize`}>
                                {job.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <UserIcon className="w-4 h-4 text-gray-500" />
                                  <span>
                                    <span className="font-medium">{job.applicants.length}</span> applicant{job.applicants.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                {newApplications > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 bg-tempo-blue rounded-full animate-pulse-slow"></span>
                                    <span><span className="font-medium">{newApplications}</span> new</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                                  <span>Expires: {format(new Date(job.expiresAt), "MMM d, yyyy")}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                  View Listing
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => navigate(`/my-jobs/${job.id}`)}
                                  className="flex items-center gap-1"
                                >
                                  {newApplications > 0 && (
                                    <span className="h-2 w-2 bg-white rounded-full animate-pulse-slow"></span>
                                  )}
                                  Manage Applications
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="space-y-6">
                  {closedJobs.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No closed job listings</p>
                    </div>
                  ) : (
                    closedJobs.map(job => {
                      const applications = getApplicationsForJob(job.id);
                      const acceptedApplication = applications.find(app => app.status === "accepted");
                      
                      return (
                        <Card key={job.id} className="overflow-hidden">
                          <CardHeader className="bg-gray-50 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>{job.company}</span>
                                  <span>•</span>
                                  <span>{job.remote ? "Remote" : job.location}</span>
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(job.status)} capitalize`}>
                                {job.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <UserIcon className="w-4 h-4 text-gray-500" />
                                  <span>
                                    <span className="font-medium">{job.applicants.length}</span> applicant{job.applicants.length !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                {job.status === "filled" && acceptedApplication && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckIcon className="w-4 h-4" />
                                    <span>Filled on {format(new Date(acceptedApplication.appliedAt), "MMM d, yyyy")}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                >
                                  View Listing
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/my-jobs/${job.id}`)}
                                >
                                  Review Applications
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default RecruiterJobs;
