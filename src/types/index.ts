
export type UserRole = "seeker" | "recruiter";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface JobSeeker extends User {
  role: "seeker";
  skills: Skill[];
  experience: string;
  bio: string;
  location: string;
  preferences: {
    jobTypes: string[];
    industries: string[];
    minSalary: number;
    remoteOnly: boolean;
  };
  skillScore: number;
}

export interface Recruiter extends User {
  role: "recruiter";
  company: string;
  position: string;
  companyDescription: string;
  industry: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  endorsements: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  recruiterId: string;
  location: string;
  description: string;
  requirements: string[];
  salary: {
    min: number;
    max: number;
    period: "hourly" | "daily" | "weekly" | "monthly";
  };
  type: "part-time" | "temporary" | "contract" | "internship";
  remote: boolean;
  postedAt: string;
  expiresAt: string;
  status: "open" | "closed" | "filled";
  applicants: string[]; // Array of user IDs
  matchScore?: number; // Score calculated for job seeker
}

export interface JobApplication {
  id: string;
  jobId: string;
  seekerId: string;
  appliedAt: string;
  coverLetter: string;
  status: "pending" | "viewed" | "accepted" | "rejected";
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 
    | "new-application" 
    | "application-viewed" 
    | "application-accepted" 
    | "application-rejected"
    | "new-message";
  relatedId: string; // Job ID or application ID
  message: string;
  read: boolean;
  createdAt: string;
}
