
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password, role);
      // Redirect to the page they tried to visit or home
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in AuthContext with toast
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto my-8">
        <Card>
          <CardHeader className="space-y-1 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-tempo-blue bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-tempo-blue" />
            </div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">I am a:</Label>
                <RadioGroup 
                  id="role" 
                  className="flex justify-between" 
                  defaultValue={role} 
                  onValueChange={(value) => setRole(value as "seeker" | "recruiter")}
                >
                  <div className="flex items-center space-x-2 border rounded-md p-2 px-4 flex-1 mr-2">
                    <RadioGroupItem value="seeker" id="seeker" />
                    <Label htmlFor="seeker" className="cursor-pointer">Job Seeker</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 px-4 flex-1">
                    <RadioGroupItem value="recruiter" id="recruiter" />
                    <Label htmlFor="recruiter" className="cursor-pointer">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-tempo-blue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full mb-4" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-tempo-blue hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
