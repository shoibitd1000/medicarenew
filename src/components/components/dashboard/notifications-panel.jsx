import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { SheetTitle } from "../ui/sheet";

export const sampleNotifications = [
  {
    id: "1",
    title: "Appointment Reminder",
    body: "Your appointment with Dr. Smith is tomorrow at 10:00 AM.",
    timestamp: "2024-08-15T09:00:00Z",
    type: "appointment",
  },
  {
    id: "2",
    title: "Bill Due",
    body: "Your hospital bill of $250 is due today.",
    timestamp: "2024-08-15T08:00:00Z",
    type: "bill",
  },
  {
    id: "3",
    title: "Lab Results Ready",
    body: "Your lab results are available to view in your health record.",
    timestamp: "2024-08-14T15:30:00Z",
    type: "report",
  },
  {
    id: "4",
    title: "Health Tip",
    body: "Remember to drink at least 8 glasses of water today!",
    timestamp: "2024-08-15T11:00:00Z",
    type: "reminder",
  },
  {
    id: "5",
    title: "Medication Reminder",
    body: "Time to take your afternoon medication.",
    timestamp: "2024-08-15T13:00:00Z",
    type: "medication",
  },
  {
    id: "6",
    title: "Upcoming Bill",
    body: "Your bill for the recent consultation will be generated soon.",
    timestamp: "2024-08-15T14:00:00Z",
    type: "bill",
  },
];

const priorityColorMap = {
  10: "bg-red-500",
  9: "bg-red-500",
  8: "bg-orange-500",
  7: "bg-orange-500",
  6: "bg-yellow-500",
  5: "bg-yellow-500",
  4: "bg-blue-500",
  3: "bg-blue-500",
  2: "bg-green-500",
  1: "bg-green-500",
};

export default function NotificationsPanel() {
  const [prioritized, setPrioritized] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runAI = async () => {
      setLoading(true);
      setError(null);
      try {
        // In real app, replace with AI API call
        // const result = await prioritizeNotifications({ notifications: sampleNotifications });
        // setPrioritized(result.prioritizedNotifications || []);
        // For now, fallback to sample with fake priority
        const fakePrioritized = sampleNotifications.map((n, i) => ({
          ...n,
          priorityScore: 10 - i,
          reason: "Sample AI reason for prioritization",
        }));
        setPrioritized(fakePrioritized);
      } catch (err) {
        console.error("Error prioritizing notifications:", err);
        setError("Could not load smart notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    runAI();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {prioritized.map((notification) => (
            <Card key={notification.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <div
                  className={`w-2 self-stretch rounded-l-md ${
                    priorityColorMap[Math.round(notification.priorityScore)] ||
                    "bg-gray-400"
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {notification.title}
                    </CardTitle>
                    <Badge>
                      Score: {notification.priorityScore}/10
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(notification.timestamp).toLocaleString()}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p>{notification.body}</p>
              </CardContent>
              <CardFooter className="bg-muted/50 px-4 py-2">
                <p className="text-xs text-muted-foreground italic">
                  <strong>AI Reason:</strong> {notification.reason}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <SheetTitle>Notifications</SheetTitle>
        <h2 className="text-xl font-bold font-headline">Smart Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Prioritized for you by AI
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
