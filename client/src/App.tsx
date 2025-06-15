import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";
import FacilityManagement from "@/pages/facility-management";
import FixturesManagement from "@/pages/fixtures-management";
import LiveScoring from "@/pages/live-scoring";
import AthleteProfile from "@/pages/athlete-profile";
import Facilities from "@/pages/facilities";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/facility-management" component={FacilityManagement} />
      <Route path="/fixtures-management" component={FixturesManagement} />
      <Route path="/live-scoring" component={LiveScoring} />
      <Route path="/athlete-profile" component={AthleteProfile} />
      <Route path="/facilities" component={Facilities} />
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
