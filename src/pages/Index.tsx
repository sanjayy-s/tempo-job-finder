
import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Briefcase, Search, Users, Star, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { JobCard } from "@/components/JobCard";
import { useJobs } from "@/contexts/JobContext";

const Index = () => {
  const { user } = useAuth();
  const { jobs, userJobs } = useJobs();
  const navigate = useNavigate();
  
  // Show featured jobs if user is not logged in
  const featuredJobs = user ? userJobs.slice(0, 3) : jobs.slice(0, 3);

  return (
    <Layout>
      {/* Hero section */}
      <section className="py-12 md:py-16 lg:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-tempo-blue to-tempo-lightblue bg-clip-text text-transparent">
            AI-Powered Part-Time Job Matching
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the perfect temporary job matches based on your skills and preferences, powered by advanced AI recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user && (
              <>
                <Button size="lg" onClick={() => navigate("/signup")}>
                  Create an Account
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </>
            )}
            {user && user.role === "seeker" && (
              <Button size="lg" onClick={() => navigate("/jobs")}>
                Browse Jobs
              </Button>
            )}
            {user && user.role === "recruiter" && (
              <Button size="lg" onClick={() => navigate("/post-job")}>
                Post a Job
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured jobs section */}
      <section className="py-12 bg-slate-50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">
              {user 
                ? user.role === "seeker" 
                  ? "Recommended Jobs" 
                  : "Your Job Postings"
                : "Featured Jobs"
              }
            </h2>
            <Button variant="ghost" onClick={() => navigate("/jobs")}>
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => navigate(`/jobs/${job.id}`)}
                onApply={() => navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>
          
          {featuredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                {user && user.role === "recruiter" 
                  ? "You haven't posted any jobs yet." 
                  : "No jobs found. Check back soon!"}
              </p>
              {user && user.role === "recruiter" && (
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/post-job")}
                >
                  Post Your First Job
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How it works section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">How TempoMatch Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-tempo-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-tempo-blue" />
              </div>
              <h3 className="font-medium text-lg mb-2">1. Create Profile</h3>
              <p className="text-gray-600">Add your skills, experience, and job preferences to your profile.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-tempo-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-tempo-blue" />
              </div>
              <h3 className="font-medium text-lg mb-2">2. AI Matching</h3>
              <p className="text-gray-600">Our AI analyzes your profile to find the most suitable job matches.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-tempo-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-tempo-blue" />
              </div>
              <h3 className="font-medium text-lg mb-2">3. Apply with Ease</h3>
              <p className="text-gray-600">Apply to jobs with a single click and track your applications.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-tempo-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-tempo-blue" />
              </div>
              <h3 className="font-medium text-lg mb-2">4. Grow Your Skills</h3>
              <p className="text-gray-600">Earn skill points with each job to enhance future opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* User testimonials or CTA section */}
      <section className="py-12 bg-tempo-blue text-white -mx-4 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to find your perfect match?</h2>
          <p className="mb-8">Join thousands of job seekers and recruiters already using TempoMatch.</p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate(user ? "/jobs" : "/signup")}
          >
            {user ? "Get Started" : "Sign Up Now"}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
