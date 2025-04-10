
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Briefcase, FileText, Star, Zap } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How JobJosh Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The smarter way to connect job seekers with part-time opportunities through AI-powered matching.
          </p>
        </div>
        
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-4">For Job Seekers</h2>
              <p className="text-gray-600 mb-6">
                JobJosh helps you find part-time opportunities that match your skills and preferences. Our AI technology understands your strengths and recommends jobs where you'll excel.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Create Your Profile</h3>
                    <p className="text-sm text-gray-600">
                      Add your skills, preferences, and experience to help our AI find your perfect job matches.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Get AI-Powered Recommendations</h3>
                    <p className="text-sm text-gray-600">
                      Our algorithm analyzes your profile and matches you with suitable opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Build Your Skill Score</h3>
                    <p className="text-sm text-gray-600">
                      Every job you complete increases your skill score, making you more attractive to future employers.
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" onClick={() => navigate("/signup")}>
                Create Job Seeker Profile
              </Button>
            </div>
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Job Seeker" 
                className="w-3/4 h-3/4 object-contain" 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Recruiter" 
                className="w-3/4 h-3/4 object-contain" 
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-semibold mb-4">For Recruiters</h2>
              <p className="text-gray-600 mb-6">
                JobJosh helps you find the perfect candidates for your temporary positions quickly and efficiently. Our AI analyzes skills and preferences to deliver qualified applicants.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Post Job Openings</h3>
                    <p className="text-sm text-gray-600">
                      Create detailed job listings with requirements and preferences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">AI-Powered Matching</h3>
                    <p className="text-sm text-gray-600">
                      Our system recommends your job to candidates whose skills and preferences align with your needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tempo-blue bg-opacity-10 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-tempo-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Find Skilled Workers</h3>
                    <p className="text-sm text-gray-600">
                      Review candidates' skill scores and profiles to find the perfect fit for your position.
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6" onClick={() => navigate("/signup")}>
                Create Recruiter Profile
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-tempo-blue text-white rounded-lg p-8 md:p-12 text-center mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our AI Matching Technology</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            JobJosh uses advanced natural language processing and machine learning algorithms to understand job requirements and candidate skills at a deeper level.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="font-medium mb-2 text-white">Skill Analysis</h3>
              <p className="text-sm text-white text-opacity-80">
                Our AI identifies both explicit and implicit skills from profiles and job descriptions.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="font-medium mb-2 text-white">Match Scoring</h3>
              <p className="text-sm text-white text-opacity-80">
                Generate match scores based on multiple factors including skills, location, and preferences.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <h3 className="font-medium mb-2 text-white">Continuous Learning</h3>
              <p className="text-sm text-white text-opacity-80">
                Our system improves with each match, learning from successful placements.
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate("/signup")}>
            Get Started Today
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default About;
