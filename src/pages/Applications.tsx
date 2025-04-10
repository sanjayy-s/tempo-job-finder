
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ApplicationCard } from "@/components/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobs } from "@/contexts/JobContext";
import { useAuth } from "@/contexts/AuthContext";
import { JobApplication } from "@/types";
import { RequireAuth } from "@/components/RequireAuth";
import { BriefcaseIcon } from "lucide-react";

const Applications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applications, getApplicationsForSeeker, getJobById } = useJobs();
  
  // Filter applications by seeker ID
  const myApplications = user ? getApplicationsForSeeker(user.id) : [];
  
  // Group applications by status
  const pendingApplications = myApplications.filter(app => app.status === "pending" || app.status === "viewed");
  const closedApplications = myApplications.filter(app => app.status === "accepted" || app.status === "rejected");

  return (
    <RequireAuth allowedRoles={["seeker"]}>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">My Applications</h1>
            <p className="text-gray-500">Track and manage your job applications</p>
          </header>
          
          {myApplications.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <BriefcaseIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No applications yet</h2>
              <p className="text-gray-500 mb-6">You haven't applied to any jobs yet.</p>
              <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
            </div>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Applications ({pendingApplications.length})</TabsTrigger>
                <TabsTrigger value="closed">Closed Applications ({closedApplications.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <div className="space-y-4">
                  {pendingApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No active applications</p>
                    </div>
                  ) : (
                    pendingApplications.map(application => {
                      const job = getJobById(application.jobId);
                      if (!job) return null;
                      
                      return (
                        <ApplicationCard 
                          key={application.id} 
                          application={application} 
                          job={job}
                          onView={() => navigate(`/jobs/${job.id}`)}
                        />
                      );
                    })
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="closed">
                <div className="space-y-4">
                  {closedApplications.length === 0 ? (
                    <div className="bg-white rounded-lg border p-6 text-center">
                      <p className="text-gray-500">No closed applications</p>
                    </div>
                  ) : (
                    closedApplications.map(application => {
                      const job = getJobById(application.jobId);
                      if (!job) return null;
                      
                      return (
                        <ApplicationCard 
                          key={application.id} 
                          application={application} 
                          job={job}
                          onView={() => navigate(`/jobs/${job.id}`)}
                        />
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

export default Applications;
