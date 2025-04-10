
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  
  const handleClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type.includes("application")) {
      if (user?.role === "recruiter") {
        navigate(`/my-jobs/${notification.relatedId.split("-")[0]}`);
      } else {
        navigate(`/applications`);
      }
    } else if (notification.type === "new-message") {
      navigate(`/messages`);
    }
  };

  return (
    <RequireAuth>
      <Layout>
        <div className="max-w-3xl mx-auto">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Notifications</h1>
              <p className="text-gray-500">Stay updated on your job activity</p>
            </div>
            {notifications.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => markAllAsRead()}
              >
                Mark All as Read
              </Button>
            )}
          </header>
          
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No notifications</h2>
              <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  }`}
                  onClick={() => handleClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.read ? "bg-gray-100" : "bg-blue-100"
                    }`}>
                      <Bell className={`w-4 h-4 ${
                        notification.read ? "text-gray-500" : "text-blue-500"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={notification.read ? "text-gray-800" : "text-black font-medium"}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        {notification.read && (
                          <div className="flex items-center text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 mr-1" /> Read
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default Notifications;
