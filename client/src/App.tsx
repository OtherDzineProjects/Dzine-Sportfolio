import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import DashboardModern from "@/pages/dashboard-modern";
import UserDashboard from "@/pages/user-dashboard";
import Auth from "@/pages/auth";
import AuthModern from "@/pages/auth-modern";
import FacilityManagement from "@/pages/facility-management";
import FixturesManagement from "@/pages/fixtures-management";
import LiveScoring from "@/pages/live-scoring";
import AthleteProfile from "@/pages/athlete-profile";
import Facilities from "@/pages/facilities";
import AdminDashboard from "@/pages/admin";
import Analytics from "@/pages/analytics";
import ComprehensiveSportsManagement from "@/pages/comprehensive-sports-management";
import Events from "@/pages/events";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth-modern" component={AuthModern} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard-modern" component={DashboardModern} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/facility-management" component={FacilityManagement} />
      <Route path="/fixtures-management" component={FixturesManagement} />
      <Route path="/live-scoring" component={LiveScoring} />
      <Route path="/athlete-profile" component={AthleteProfile} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/comprehensive-sports" component={ComprehensiveSportsManagement} />
      <Route path="/events" component={Events} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
