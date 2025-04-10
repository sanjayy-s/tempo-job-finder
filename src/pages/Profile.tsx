
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillBadge } from "@/components/SkillBadge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ChartBar, Edit2, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { JobSeeker, Recruiter, Skill } from "@/types";
import { RequireAuth } from "@/components/RequireAuth";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({
    name: "",
    level: 3,
    endorsements: 0,
  });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  
  const isSeeker = user?.role === "seeker";
  const seekerUser = user as JobSeeker;
  const recruiterUser = user as Recruiter;
  
  const handleUpdateProfile = async (updatedData: Partial<JobSeeker | Recruiter>) => {
    setIsUpdating(true);
    
    try {
      await updateProfile(updatedData);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAddSkill = () => {
    if (!isSeeker || !newSkill.name.trim()) return;
    
    const updatedSkills = [...(seekerUser.skills || []), newSkill];
    
    handleUpdateProfile({ 
      skills: updatedSkills 
    } as Partial<JobSeeker>);
    
    setNewSkill({ name: "", level: 3, endorsements: 0 });
    setIsAddingSkill(false);
  };

  if (!user) return null;

  return (
    <RequireAuth>
      <Layout>
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">My Profile</h1>
            <p className="text-gray-500">Manage your account information and preferences</p>
          </header>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              {isSeeker && (
                <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
              )}
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={user.name || ""} 
                        onChange={(e) => handleUpdateProfile({ name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled />
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    {isSeeker && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={seekerUser.location || ""} 
                          onChange={(e) => handleUpdateProfile({ location: e.target.value })}
                          placeholder="e.g. New York, NY"
                        />
                      </div>
                    )}
                    
                    {!isSeeker && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input 
                            id="company" 
                            value={recruiterUser.company || ""} 
                            onChange={(e) => handleUpdateProfile({ company: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="position">Your Position</Label>
                          <Input 
                            id="position" 
                            value={recruiterUser.position || ""} 
                            onChange={(e) => handleUpdateProfile({ position: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="companyDescription">Company Description</Label>
                          <Textarea 
                            id="companyDescription" 
                            value={recruiterUser.companyDescription || ""} 
                            onChange={(e) => handleUpdateProfile({ companyDescription: e.target.value })}
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input 
                            id="industry" 
                            value={recruiterUser.industry || ""} 
                            onChange={(e) => handleUpdateProfile({ industry: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                    
                    {isSeeker && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={seekerUser.bio || ""} 
                          onChange={(e) => handleUpdateProfile({ bio: e.target.value })}
                          rows={4}
                          placeholder="Tell recruiters about yourself..."
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isSeeker && (
              <TabsContent value="skills">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Skills & Experience</CardTitle>
                      <CardDescription>Showcase your abilities to potential employers</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                      <ChartBar className="w-4 h-4 text-tempo-blue" />
                      <span className="text-sm font-medium">Skill Score: {seekerUser.skillScore}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">My Skills</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-tempo-blue"
                          onClick={() => setIsAddingSkill(true)}
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Add Skill</span>
                        </Button>
                      </div>
                      
                      {seekerUser.skills && seekerUser.skills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {seekerUser.skills.map((skill, index) => (
                            <SkillBadge key={index} skill={skill} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 mb-4">You haven't added any skills yet</p>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddingSkill(true)}
                          >
                            Add Your First Skill
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Experience</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-tempo-blue"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>
                      </div>
                      
                      <Textarea 
                        value={seekerUser.experience || ""} 
                        onChange={(e) => handleUpdateProfile({ experience: e.target.value })}
                        rows={4}
                        placeholder="Describe your work experience..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                  <CardDescription>
                    {isSeeker 
                      ? "Update your job preferences to get better matches" 
                      : "Set your recruiting preferences"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isSeeker && (
                    <>
                      <div className="space-y-4">
                        <Label>Job Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {["part-time", "temporary", "contract", "internship"].map((type) => {
                            const isSelected = seekerUser.preferences?.jobTypes.includes(type);
                            return (
                              <Badge 
                                key={type}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer capitalize"
                                onClick={() => {
                                  const jobTypes = [...(seekerUser.preferences?.jobTypes || [])];
                                  if (isSelected) {
                                    const index = jobTypes.indexOf(type);
                                    jobTypes.splice(index, 1);
                                  } else {
                                    jobTypes.push(type);
                                  }
                                  handleUpdateProfile({
                                    preferences: {
                                      ...seekerUser.preferences,
                                      jobTypes,
                                    },
                                  });
                                }}
                              >
                                {type.replace('-', ' ')}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Industries</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Technology", "Food Service", "Retail", "Education", "Healthcare"].map((industry) => {
                            const isSelected = seekerUser.preferences?.industries.includes(industry);
                            return (
                              <Badge 
                                key={industry}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => {
                                  const industries = [...(seekerUser.preferences?.industries || [])];
                                  if (isSelected) {
                                    const index = industries.indexOf(industry);
                                    industries.splice(index, 1);
                                  } else {
                                    industries.push(industry);
                                  }
                                  handleUpdateProfile({
                                    preferences: {
                                      ...seekerUser.preferences,
                                      industries,
                                    },
                                  });
                                }}
                              >
                                {industry}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="min-salary">Minimum Hourly Salary ($)</Label>
                        <Input 
                          id="min-salary" 
                          type="number" 
                          min="0"
                          value={seekerUser.preferences?.minSalary || 0}
                          onChange={(e) => handleUpdateProfile({
                            preferences: {
                              ...seekerUser.preferences,
                              minSalary: parseInt(e.target.value) || 0,
                            },
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="remote-only"
                          checked={seekerUser.preferences?.remoteOnly || false}
                          onCheckedChange={(checked) => handleUpdateProfile({
                            preferences: {
                              ...seekerUser.preferences,
                              remoteOnly: checked,
                            },
                          })}
                        />
                        <Label htmlFor="remote-only">Only show remote jobs</Label>
                      </div>
                    </>
                  )}
                  
                  {!isSeeker && (
                    <div className="space-y-4">
                      <p className="text-gray-500">Recruiter preferences coming soon...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      
        {/* Add Skill Dialog */}
        <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add a new skill</DialogTitle>
              <DialogDescription>
                Add skills to showcase your capabilities to potential employers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skill-name" className="text-right">
                  Skill Name
                </Label>
                <Input
                  id="skill-name"
                  className="col-span-3"
                  placeholder="e.g., JavaScript, Customer Service"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skill-level" className="text-right">
                  Proficiency
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="skill-level"
                    type="range"
                    min="1"
                    max="5"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span>{newSkill.level}/5</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingSkill(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddSkill} 
                disabled={!newSkill.name.trim()}
              >
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </RequireAuth>
  );
};

export default Profile;
