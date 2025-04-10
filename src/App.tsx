
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { JobProvider } from "@/contexts/JobContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import PostJob from "./pages/PostJob";
import RecruiterJobs from "./pages/RecruiterJobs";
import ManageJobApplications from "./pages/ManageJobApplications";
import Notifications from "./pages/Notifications";
import About from "./pages/About";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <JobProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/my-jobs" element={<RecruiterJobs />} />
                <Route path="/my-jobs/:id" element={<ManageJobApplications />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/about" element={<About />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </JobProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
