
import React from "react";
import { CalendarIcon, MapPinIcon, CoinsIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  showApply?: boolean;
  onApply?: () => void;
}

export function JobCard({ job, onClick, showApply = true, onApply }: JobCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>
            {job.matchScore !== undefined && (
              <div className="bg-tempo-blue bg-opacity-10 rounded-full p-2 flex items-center justify-center">
                <span className="text-tempo-blue font-medium text-sm">{job.matchScore}% Match</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span className="capitalize">{job.type.replace('-', ' ')}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {job.remote ? "Remote" : job.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CoinsIcon className="w-3 h-3" />
              ${job.salary.min}-${job.salary.max}/{job.salary.period}
            </Badge>
          </div>
          
          <p className="text-sm line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {job.requirements.slice(0, 3).map((req, i) => (
              <span key={i} className="skill-badge text-xs">{req}</span>
            ))}
            {job.requirements.length > 3 && (
              <span className="skill-badge text-xs">+{job.requirements.length - 3} more</span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
            </div>
            {showApply && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onApply && onApply();
                }}
                size="sm"
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
