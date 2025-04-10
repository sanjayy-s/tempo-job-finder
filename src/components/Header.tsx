
import React from "react";
import { Bell, Briefcase, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <a href="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-tempo-blue" />
            <span className="text-xl font-semibold tracking-tight text-tempo-blue">TempoMatch</span>
          </a>
        </div>
        <nav className="hidden md:flex md:items-center md:gap-6">
          <a href="/" className="text-sm font-medium hover:text-tempo-blue transition-colors">Home</a>
          <a href="/jobs" className="text-sm font-medium hover:text-tempo-blue transition-colors">Browse Jobs</a>
          {user?.role === "recruiter" && (
            <a href="/post-job" className="text-sm font-medium hover:text-tempo-blue transition-colors">Post Job</a>
          )}
          <a href="/about" className="text-sm font-medium hover:text-tempo-blue transition-colors">How It Works</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-tempo-blue text-white text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {user.role === 'seeker' && (
                    <DropdownMenuItem onClick={() => navigate('/applications')}>
                      My Applications
                    </DropdownMenuItem>
                  )}
                  {user.role === 'recruiter' && (
                    <DropdownMenuItem onClick={() => navigate('/my-jobs')}>
                      My Job Postings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
