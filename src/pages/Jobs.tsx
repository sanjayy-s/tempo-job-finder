
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useJobs } from "@/contexts/JobContext";
import { Job } from "@/types";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";

const Jobs = () => {
  const navigate = useNavigate();
  const { jobs, loading, refreshJobs } = useJobs();
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState<string>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryCap, setSalaryCap] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Effect to filter jobs based on criteria
  useEffect(() => {
    let filtered = [...jobs];
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job => 
          job.title.toLowerCase().includes(query) || 
          job.description.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.requirements.some(req => req.toLowerCase().includes(query))
      );
    }
    
    // Job type filter
    if (jobType !== "all") {
      filtered = filtered.filter(job => job.type === jobType);
    }
    
    // Remote filter
    if (remoteOnly) {
      filtered = filtered.filter(job => job.remote);
    }
    
    // Salary filter
    filtered = filtered.filter(
      job => job.salary.min >= salaryCap[0] && job.salary.max <= salaryCap[1]
    );
    
    // Only show open jobs
    filtered = filtered.filter(job => job.status === "open");
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, jobType, remoteOnly, salaryCap]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Browse Jobs</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={refreshJobs}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search and filters - mobile */}
        <div className="lg:hidden w-full">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border mb-4">
              <h2 className="font-medium mb-3">Filters</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All job types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All job types</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remote-only-mobile" 
                    checked={remoteOnly} 
                    onCheckedChange={(checked) => setRemoteOnly(checked as boolean)} 
                  />
                  <Label htmlFor="remote-only-mobile">Remote only</Label>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Salary Range ($/hr)</Label>
                    <span className="text-sm text-gray-500">
                      ${salaryCap[0]} - ${salaryCap[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={salaryCap}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setSalaryCap(value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Filters - desktop */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white p-5 rounded-lg border sticky top-20">
            <h2 className="font-medium mb-4">Filters</h2>
            
            <div className="space-y-5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All job types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All job types</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remote-only" 
                  checked={remoteOnly} 
                  onCheckedChange={(checked) => setRemoteOnly(checked as boolean)} 
                />
                <Label htmlFor="remote-only">Remote only</Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Salary Range ($/hr)</Label>
                  <span className="text-sm text-gray-500">
                    ${salaryCap[0]} - ${salaryCap[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={salaryCap}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setSalaryCap(value)}
                />
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced-filters">
                  <AccordionTrigger className="py-2">Advanced Filters</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input placeholder="Enter location" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Posted Within</Label>
                        <Select defaultValue="any">
                          <SelectTrigger>
                            <SelectValue placeholder="Any time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any time</SelectItem>
                            <SelectItem value="day">Last 24 hours</SelectItem>
                            <SelectItem value="week">Last week</SelectItem>
                            <SelectItem value="month">Last month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setJobType("all");
                  setRemoteOnly(false);
                  setSalaryCap([0, 100]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Job listings */}
        <div className="flex-1">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-tempo-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-4">{filteredJobs.length} jobs found</p>
              
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setJobType("all");
                      setRemoteOnly(false);
                      setSalaryCap([0, 100]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      onApply={() => navigate(`/jobs/${job.id}`)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
