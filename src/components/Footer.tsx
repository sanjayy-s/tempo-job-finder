
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-tempo-blue" />
              <span className="font-semibold text-tempo-blue">JobJosh</span>
            </div>
            <p className="text-sm text-gray-500">
              AI-powered part-time job matching for job seekers and recruiters.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-gray-900">For Job Seekers</h4>
            <ul className="space-y-2">
              <li>
                <a href="/jobs" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Update Profile
                </a>
              </li>
              <li>
                <a href="/applications" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Track Applications
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-gray-900">For Recruiters</h4>
            <ul className="space-y-2">
              <li>
                <a href="/post-job" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="/my-jobs" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Manage Listings
                </a>
              </li>
              <li>
                <a href="/find-candidates" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Find Candidates
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-600 hover:text-tempo-blue transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-center text-gray-500">
            © {new Date().getFullYear()} JobJosh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
