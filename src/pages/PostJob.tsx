
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
} from "@/components/ui/form";
import { useJobs } from "@/contexts/JobContext";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Job } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(20, "Please provide a detailed job description"),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  salaryMin: z.coerce.number().min(1, "Minimum salary is required"),
  salaryMax: z.coerce.number().min(1, "Maximum salary is required"),
  salaryPeriod: z.enum(["hourly", "daily", "weekly", "monthly"]),
  type: z.enum(["part-time", "temporary", "contract", "internship"]),
  remote: z.boolean(),
  expiresAt: z.string(),
});

const PostJob = () => {
  const navigate = useNavigate();
  const { postJob, loading } = useJobs();
  const { user } = useAuth();
  
  const [newRequirement, setNewRequirement] = useState("");
  
  // Set default expiration date 2 weeks from now
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  
  const defaultExpirationDate = twoWeeksFromNow.toISOString().split('T')[0];
  
  // Initialize the form
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: user?.role === "recruiter" ? (user as any).company : "",
      location: "",
      description: "",
      requirements: [],
      salaryMin: 0,
      salaryMax: 0,
      salaryPeriod: "hourly",
      type: "part-time",
      remote: false,
      expiresAt: defaultExpirationDate,
    },
  });
  
  const { control, handleSubmit, formState, watch, setValue } = form;
  
  const watchRequirements = watch("requirements");
  
  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    
    const currentRequirements = watch("requirements");
    setValue("requirements", [...currentRequirements, newRequirement.trim()]);
    setNewRequirement("");
  };
  
  const removeRequirement = (index: number) => {
    const currentRequirements = watch("requirements");
    setValue("requirements", currentRequirements.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    try {
      await postJob({
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        requirements: data.requirements,
        salary: {
          min: data.salaryMin,
          max: data.salaryMax,
          period: data.salaryPeriod,
        },
        type: data.type,
        remote: data.remote,
        expiresAt: new Date(data.expiresAt).toISOString(),
      });
      
      navigate("/my-jobs");
    } catch (error) {
      // Error is handled in JobContext
    }
  };

  return (
    <RequireAuth allowedRoles={["recruiter"]}>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">Post a New Job</h1>
            <p className="text-gray-500">Create a job listing and find qualified candidates</p>
          </header>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide detailed information to attract the right candidates
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Part-time Barista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="temporary">Temporary</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <FormField
                        control={control}
                        name="remote"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full md:w-1/2">
                            <div className="space-y-0.5">
                              <FormLabel>Remote Job</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="w-full md:w-1/2">
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={watch("remote") ? "Remote" : "e.g. New York, NY"} 
                                {...field}
                                disabled={watch("remote")}
                                value={watch("remote") ? "Remote" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed description of the job..." 
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormField
                      control={control}
                      name="requirements"
                      render={() => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <div className="flex gap-2 mb-2">
                            <Input 
                              placeholder="e.g. 2 years of customer service experience" 
                              value={newRequirement}
                              onChange={(e) => setNewRequirement(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addRequirement();
                                }
                              }}
                            />
                            <Button type="button" onClick={addRequirement}>Add</Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {watchRequirements.map((req, index) => (
                              <div 
                                key={index} 
                                className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1"
                              >
                                <span className="text-sm">{req}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => removeRequirement(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            
                            {watchRequirements.length === 0 && (
                              <p className="text-sm text-gray-500">
                                Add at least one job requirement
                              </p>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel>Salary</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      <FormField
                        control={control}
                        name="salaryMin"
                        render={({ field }) => (
                          <FormItem className="w-full md:w-[calc(33%-0.5rem)]">
                            <FormLabel>Minimum</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="salaryMax"
                        render={({ field }) => (
                          <FormItem className="w-full md:w-[calc(33%-0.5rem)]">
                            <FormLabel>Maximum</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="salaryPeriod"
                        render={({ field }) => (
                          <FormItem className="w-full md:w-[calc(33%-0.5rem)]">
                            <FormLabel>Period</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Expires On</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => navigate("/my-jobs")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Job"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default PostJob;
