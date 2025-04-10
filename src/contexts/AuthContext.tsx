
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, JobSeeker, Recruiter } from '@/types';
import { mockJobSeekers, mockRecruiters } from '@/lib/mockData';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: "seeker" | "recruiter") => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage (simulating persistent auth)
    const storedUser = localStorage.getItem('tempoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "seeker" | "recruiter") => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let foundUser = null;
      if (role === "seeker") {
        foundUser = mockJobSeekers.find(seeker => seeker.email === email);
      } else {
        foundUser = mockRecruiters.find(recruiter => recruiter.email === email);
      }
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, we would validate the password here
      
      setUser(foundUser);
      localStorage.setItem('tempoUser', JSON.stringify(foundUser));
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = [...mockJobSeekers, ...mockRecruiters].some(u => u.email === userData.email);
      if (emailExists) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser = {
        id: `${userData.role}-${Date.now()}`,
        email: userData.email || '',
        name: userData.name || '',
        role: userData.role as "seeker" | "recruiter",
        createdAt: new Date().toISOString(),
        ...(userData.role === "seeker" ? {
          skills: [],
          experience: "",
          bio: "",
          location: "",
          preferences: {
            jobTypes: [],
            industries: [],
            minSalary: 0,
            remoteOnly: false
          },
          skillScore: 50
        } : {
          company: "",
          position: "",
          companyDescription: "",
          industry: ""
        })
      } as User;
      
      setUser(newUser);
      localStorage.setItem('tempoUser', JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Signup failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tempoUser');
    toast.info("You've been logged out");
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error("Not authenticated");
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('tempoUser', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Update failed: " + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
