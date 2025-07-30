import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import EnhancedHome from "@/pages/enhanced-home";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import DashboardModern from "@/pages/dashboard-modern";
import UserDashboard from "@/pages/user-dashboard-clean";
import Auth from "@/pages/auth";
import AuthModern from "@/pages/auth-modern";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import FacilityManagement from "@/pages/facility-management";
import FixturesManagement from "@/pages/fixtures-management";
import LiveScoring from "@/pages/live-scoring";
import TeamsManagement from "@/pages/teams-management";
import PlayerEvaluation from "@/pages/player-evaluation";
import AthleteProfile from "@/pages/athlete-profile";
import Facilities from "@/pages/facilities";
import AdminDashboard from "@/pages/admin";
import SuperAdminDashboard from "@/pages/super-admin-dashboard";
import EventOrganizerDashboard from "@/pages/event-organizer-dashboard";
import CreateOrganization from "@/pages/create-organization";
import OrganizationDashboard from "@/pages/organization-dashboard";
import OrganizationsDiscovery from "@/pages/organizations-discovery";
import AssociationManagement from "@/pages/association-management";
import Analytics from "@/pages/analytics";
import ComprehensiveSportsManagement from "@/pages/comprehensive-sports-management";
import ComprehensiveDashboard from "@/pages/comprehensive-dashboard";
import SubscriptionManagement from "@/pages/subscription-management";
import WardLevelSearch from "@/pages/ward-level-search";
import Events from "@/pages/events";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EnhancedHome} />
      <Route path="/home" component={Home} />
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/auth" component={Auth} />
      <Route path="/auth-modern" component={AuthModern} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard-modern" component={DashboardModern} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/user-dashboard-clean" component={UserDashboard} />
      <Route path="/facility-management" component={FacilityManagement} />
      <Route path="/fixtures-management" component={FixturesManagement} />
      <Route path="/live-scoring" component={LiveScoring} />
      <Route path="/teams-management" component={TeamsManagement} />
      <Route path="/athlete-profile" component={AthleteProfile} />
      <Route path="/facilities" component={Facilities} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/super-admin" component={SuperAdminDashboard} />
      <Route path="/event-organizer" component={EventOrganizerDashboard} />
      <Route path="/create-organization" component={CreateOrganization} />
      <Route path="/organization/:id" component={OrganizationDashboard} />
      <Route path="/organization" component={OrganizationDashboard} />
      <Route path="/organizations" component={OrganizationsDiscovery} />
      <Route path="/association-management" component={AssociationManagement} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/comprehensive-sports" component={ComprehensiveSportsManagement} />
      <Route path="/comprehensive-dashboard" component={ComprehensiveDashboard} />
      <Route path="/subscription" component={SubscriptionManagement} />
      <Route path="/ward-search" component={WardLevelSearch} />
      <Route path="/events" component={Events} />
      <Route path="/player-evaluation" component={PlayerEvaluation} />
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
