
import { Job, JobSeeker, Recruiter, JobApplication, Notification } from "@/types";

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: "job-1",
    title: "Part-time Barista",
    company: "Coffee Haven",
    recruiterId: "rec-1",
    location: "San Francisco, CA",
    description: "Looking for an energetic barista for weekend shifts. Experience making specialty coffee drinks required.",
    requirements: ["Coffee preparation experience", "Customer service skills", "Available weekends"],
    salary: {
      min: 18,
      max: 22,
      period: "hourly",
    },
    type: "part-time",
    remote: false,
    postedAt: "2025-04-08T10:30:00Z",
    expiresAt: "2025-04-20T23:59:59Z",
    status: "open",
    applicants: []
  },
  {
    id: "job-2",
    title: "Web Developer (Contract)",
    company: "TechNova",
    recruiterId: "rec-2",
    location: "Remote",
    description: "Looking for a skilled web developer to help with a 3-month project. React and TypeScript experience required.",
    requirements: ["React", "TypeScript", "Tailwind CSS", "3+ years experience"],
    salary: {
      min: 40,
      max: 60,
      period: "hourly",
    },
    type: "contract",
    remote: true,
    postedAt: "2025-04-07T14:15:00Z",
    expiresAt: "2025-04-30T23:59:59Z",
    status: "open",
    applicants: []
  },
  {
    id: "job-3",
    title: "Weekend Event Staff",
    company: "EventPro",
    recruiterId: "rec-3",
    location: "New York, NY",
    description: "Join our team of event staff for weekend events. Flexible schedule, fun atmosphere.",
    requirements: ["Customer service orientation", "Ability to stand for long periods", "Weekend availability"],
    salary: {
      min: 20,
      max: 25,
      period: "hourly",
    },
    type: "part-time",
    remote: false,
    postedAt: "2025-04-09T09:45:00Z",
    expiresAt: "2025-04-25T23:59:59Z",
    status: "open",
    applicants: []
  },
  {
    id: "job-4",
    title: "Virtual Assistant",
    company: "RemoteWorks",
    recruiterId: "rec-2",
    location: "Remote",
    description: "Looking for a detail-oriented virtual assistant to help with administrative tasks. Flexible hours.",
    requirements: ["Excellent organizational skills", "Fast typing", "Experience with GSuite"],
    salary: {
      min: 22,
      max: 30,
      period: "hourly",
    },
    type: "part-time",
    remote: true,
    postedAt: "2025-04-06T11:20:00Z",
    expiresAt: "2025-04-22T23:59:59Z",
    status: "open",
    applicants: ["seeker-1"]
  },
  {
    id: "job-5",
    title: "Dog Walker",
    company: "PawPals",
    recruiterId: "rec-1",
    location: "Portland, OR",
    description: "Seeking reliable dog walkers for weekday afternoon walks. Love for dogs a must!",
    requirements: ["Experience with dogs", "Reliable transportation", "Available weekday afternoons"],
    salary: {
      min: 19,
      max: 24,
      period: "hourly",
    },
    type: "part-time",
    remote: false,
    postedAt: "2025-04-05T15:30:00Z",
    expiresAt: "2025-04-21T23:59:59Z",
    status: "open",
    applicants: []
  }
];

// Mock Job Seekers
export const mockJobSeekers: JobSeeker[] = [
  {
    id: "seeker-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "seeker",
    skills: [
      { name: "Customer Service", level: 4, endorsements: 7 },
      { name: "JavaScript", level: 3, endorsements: 2 },
      { name: "Coffee Preparation", level: 5, endorsements: 12 }
    ],
    experience: "2 years as a barista, 1 year as a web development intern",
    bio: "Current student looking for flexible part-time work.",
    location: "San Francisco, CA",
    preferences: {
      jobTypes: ["part-time", "contract"],
      industries: ["Food Service", "Technology"],
      minSalary: 18,
      remoteOnly: false
    },
    skillScore: 85,
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "seeker-2",
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "seeker",
    skills: [
      { name: "React", level: 4, endorsements: 8 },
      { name: "TypeScript", level: 4, endorsements: 5 },
      { name: "Tailwind CSS", level: 4, endorsements: 3 }
    ],
    experience: "3 years as a frontend developer, freelance work",
    bio: "Looking for remote contract positions in web development.",
    location: "Remote",
    preferences: {
      jobTypes: ["contract", "part-time"],
      industries: ["Technology", "Education"],
      minSalary: 35,
      remoteOnly: true
    },
    skillScore: 92,
    createdAt: "2025-01-15T14:30:00Z"
  }
];

// Mock Recruiters
export const mockRecruiters: Recruiter[] = [
  {
    id: "rec-1",
    name: "Jamie Smith",
    email: "jamie@example.com",
    role: "recruiter",
    company: "Coffee Haven",
    position: "Store Manager",
    companyDescription: "A cozy coffee shop specializing in artisanal brews.",
    industry: "Food Service",
    createdAt: "2024-11-15T09:00:00Z"
  },
  {
    id: "rec-2",
    name: "Taylor Reed",
    email: "taylor@example.com",
    role: "recruiter",
    company: "TechNova",
    position: "Talent Acquisition",
    companyDescription: "A cutting-edge tech company focused on web applications.",
    industry: "Technology",
    createdAt: "2024-10-20T11:15:00Z"
  },
  {
    id: "rec-3",
    name: "Morgan Lewis",
    email: "morgan@example.com",
    role: "recruiter",
    company: "EventPro",
    position: "Event Coordinator",
    companyDescription: "Premier event planning and staffing company.",
    industry: "Events & Entertainment",
    createdAt: "2025-01-05T16:45:00Z"
  }
];

// Mock Job Applications
export const mockApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-4",
    seekerId: "seeker-1",
    appliedAt: "2025-04-09T14:35:00Z",
    coverLetter: "I'm very interested in this virtual assistant position. My organizational skills and experience with GSuite make me a great fit.",
    status: "pending",
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "rec-2",
    type: "new-application",
    relatedId: "app-1",
    message: "Alex Johnson has applied to Virtual Assistant position",
    read: false,
    createdAt: "2025-04-09T14:35:00Z"
  },
  {
    id: "notif-2",
    userId: "seeker-1",
    type: "application-viewed",
    relatedId: "app-1",
    message: "Your application for Virtual Assistant has been viewed",
    read: true,
    createdAt: "2025-04-09T16:20:00Z"
  }
];
