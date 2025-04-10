
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, JobApplication, JobSeeker, User } from '@/types';
import { mockJobs, mockApplications } from '@/lib/mockData';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  applications: JobApplication[];
  loading: boolean;
  userJobs: Job[]; // For recruiters: their posted jobs, for seekers: recommended jobs
  applyForJob: (jobId: string, coverLetter: string) => Promise<void>;
  postJob: (jobData: Partial<Job>) => Promise<void>;
  updateJobStatus: (jobId: string, status: Job['status']) => Promise<void>;
  updateApplicationStatus: (appId: string, status: JobApplication['status'], notes?: string) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  getApplicationById: (id: string) => JobApplication | undefined;
  getJobsForRecruiter: (recruiterId: string) => Job[];
  getApplicationsForJob: (jobId: string) => JobApplication[];
  getApplicationsForSeeker: (seekerId: string) => JobApplication[];
  getSeekerRecommendedJobs: (seeker: JobSeeker) => Job[];
  refreshJobs: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Initialize with mock data
  useEffect(() => {
    setJobs(mockJobs);
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  // Update userJobs whenever user or jobs changes
  useEffect(() => {
    if (!user) {
      setUserJobs([]);
      return;
    }

    if (user.role === 'recruiter') {
      setUserJobs(jobs.filter(job => job.recruiterId === user.id));
    } else {
      setUserJobs(getSeekerRecommendedJobs(user as JobSeeker));
    }
  }, [user, jobs]);

  const applyForJob = async (jobId: string, coverLetter: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user || user.role !== 'seeker') throw new Error("Must be logged in as a job seeker");
      
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");
      
      if (job.status !== 'open') throw new Error("This job is no longer accepting applications");
      
      // Check if already applied
      const alreadyApplied = applications.some(a => a.jobId === jobId && a.seekerId === user.id);
      if (alreadyApplied) throw new Error("You've already applied to this job");
      
      const newApplication: JobApplication = {
        id: `app-${Date.now()}`,
        jobId,
        seekerId: user.id,
        appliedAt: new Date().toISOString(),
        coverLetter,
        status: 'pending'
      };
      
      setApplications(prev => [...prev, newApplication]);
      
      // Update job applicants list
      setJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, applicants: [...j.applicants, user.id] } 
          : j
      ));
      
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Application failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const postJob = async (jobData: Partial<Job>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user || user.role !== 'recruiter') throw new Error("Must be logged in as a recruiter");
      
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: jobData.title || "",
        company: jobData.company || "",
        recruiterId: user.id,
        location: jobData.location || "",
        description: jobData.description || "",
        requirements: jobData.requirements || [],
        salary: jobData.salary || { min: 0, max: 0, period: "hourly" },
        type: jobData.type || "part-time",
        remote: jobData.remote || false,
        postedAt: new Date().toISOString(),
        expiresAt: jobData.expiresAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        status: "open",
        applicants: []
      };
      
      setJobs(prev => [...prev, newJob]);
      toast.success("Job posted successfully!");
      return;
    } catch (error) {
      toast.error("Job posting failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: Job['status']) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user || user.role !== 'recruiter') throw new Error("Must be logged in as a recruiter");
      
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");
      
      if (job.recruiterId !== user.id) throw new Error("You can only update your own jobs");
      
      setJobs(prev => prev.map(j => 
        j.id === jobId ? { ...j, status } : j
      ));
      
      toast.success(`Job status updated to ${status}`);
    } catch (error) {
      toast.error("Update failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: string, status: JobApplication['status'], notes?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user || user.role !== 'recruiter') throw new Error("Must be logged in as a recruiter");
      
      const application = applications.find(a => a.id === appId);
      if (!application) throw new Error("Application not found");
      
      const job = jobs.find(j => j.id === application.jobId);
      if (!job || job.recruiterId !== user.id) throw new Error("You can only update applications for your own jobs");
      
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status, ...(notes && { notes }) } : a
      ));
      
      // If application is accepted, mark the job as filled
      if (status === 'accepted') {
        setJobs(prev => prev.map(j => 
          j.id === application.jobId ? { ...j, status: 'filled' } : j
        ));
      }
      
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error("Update failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getJobById = (id: string) => jobs.find(job => job.id === id);
  
  const getApplicationById = (id: string) => applications.find(app => app.id === id);
  
  const getJobsForRecruiter = (recruiterId: string) => jobs.filter(job => job.recruiterId === recruiterId);
  
  const getApplicationsForJob = (jobId: string) => applications.filter(app => app.jobId === jobId);
  
  const getApplicationsForSeeker = (seekerId: string) => applications.filter(app => app.seekerId === seekerId);

  const calculateJobMatchScore = (job: Job, seeker: JobSeeker): number => {
    // Simple scoring algorithm (can be improved with actual NLP in a real implementation)
    let score = 0;
    
    // Match skills with job requirements
    const seekerSkillNames = seeker.skills.map(s => s.name.toLowerCase());
    const matchedSkills = job.requirements.filter(req => 
      seekerSkillNames.some(skill => req.toLowerCase().includes(skill))
    );
    
    // 50% of score comes from skill matches
    score += (matchedSkills.length / job.requirements.length) * 50;
    
    // 20% of score comes from job type match
    if (seeker.preferences.jobTypes.includes(job.type)) {
      score += 20;
    }
    
    // 15% of score comes from salary match
    if (job.salary.min >= seeker.preferences.minSalary) {
      score += 15;
    }
    
    // 15% of score comes from remote preference match
    if (seeker.preferences.remoteOnly === job.remote || !seeker.preferences.remoteOnly) {
      score += 15;
    }
    
    return Math.min(Math.round(score), 100);
  };
  
  const getSeekerRecommendedJobs = (seeker: JobSeeker): Job[] => {
    // Filter to only open jobs
    const openJobs = jobs.filter(job => job.status === 'open');
    
    // Calculate match score for each job
    const scoredJobs = openJobs.map(job => ({
      ...job,
      matchScore: calculateJobMatchScore(job, seeker)
    }));
    
    // Sort by match score (highest first)
    return scoredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const refreshJobs = () => {
    // In a real app, this would fetch the latest data from the server
    // For this demo, we'll just reset loading state to simulate a refresh
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      loading,
      userJobs,
      applyForJob,
      postJob,
      updateJobStatus,
      updateApplicationStatus,
      getJobById,
      getApplicationById,
      getJobsForRecruiter,
      getApplicationsForJob,
      getApplicationsForSeeker,
      getSeekerRecommendedJobs,
      refreshJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
