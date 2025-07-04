import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Landing from "@/pages/landing";

export default function Home() {
  const [, setLocation] = useLocation();
  
  // Get current user to determine routing
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not logged in, continue showing landing page
        return;
      }
      
      // User is logged in - route to appropriate dashboard
      if (user.userType === "admin") {
        setLocation("/dashboard-modern");
      } else {
        setLocation("/user-dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is not logged in, show landing page
  if (!user) {
    return <Landing />;
  }

  // If we get here, the redirect should have happened in useEffect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
