
import { JobApplication, Job } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ApplicationCardProps {
  application: JobApplication;
  job: Job;
  isRecruiter?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

export function ApplicationCard({ 
  application, 
  job, 
  isRecruiter = false,
  onAccept,
  onReject,
  onView
}: ApplicationCardProps) {
  const getStatusBadgeColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'viewed':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'accepted':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>
            </div>
            <Badge className={`${getStatusBadgeColor(application.status)} capitalize`}>
              {application.status}
            </Badge>
          </div>
          
          <p className="text-sm">
            <span className="text-gray-500">Applied:</span> {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
          </p>
          
          {application.notes && (
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="font-medium">Recruiter Notes:</p>
              <p className="text-gray-700">{application.notes}</p>
            </div>
          )}
          
          {isRecruiter && application.status === 'pending' && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Button onClick={onView} variant="outline" size="sm">
                View Details
              </Button>
              <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700" size="sm">
                Accept
              </Button>
              <Button onClick={onReject} variant="destructive" size="sm">
                Reject
              </Button>
            </div>
          )}
          
          {!isRecruiter && (
            <Button onClick={onView} variant="outline" size="sm">
              View Application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
