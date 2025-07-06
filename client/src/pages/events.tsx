import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Users, Trophy, IndianRupee, Clock } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: number;
  name: string;
  description: string;
  sportId: number;
  organizerId: number;
  organizationId: number;
  facilityId: number | null;
  eventType: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  entryFee: string;
  prizePool: string;
  rules: any;
  status: string;
  isPublic: boolean;
  banner: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (num === 0) return "Free";
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "tournament": return "bg-purple-100 text-purple-800";
      case "league": return "bg-orange-100 text-orange-800";
      case "match": return "bg-blue-100 text-blue-800";
      case "training": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Events</h1>
          <p className="text-gray-600">
            Discover and register for upcoming sports events, tournaments, and leagues
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                  <Badge className={getEventTypeColor(event.eventType)}>
                    {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-1">{event.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {format(new Date(event.startDate), "MMM dd, yyyy")} - {format(new Date(event.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Registration by: {format(new Date(event.registrationDeadline), "MMM dd, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Max {event.maxParticipants} participants</span>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IndianRupee className="w-4 h-4" />
                      <span>Entry Fee:</span>
                    </div>
                    <span className="font-semibold text-lg">
                      {formatCurrency(event.entryFee)}
                    </span>
                  </div>
                  
                  {event.rules?.fees && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {event.rules.fees.teamRegistration && (
                        <div>Team: ₹{event.rules.fees.teamRegistration.toLocaleString('en-IN')}</div>
                      )}
                      {event.rules.fees.memberRegistration && (
                        <div>Per Member: ₹{event.rules.fees.memberRegistration.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4" />
                      <span>Prize Pool:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(event.prizePool)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  variant={event.status === "upcoming" ? "default" : "secondary"}
                  disabled={event.status !== "upcoming"}
                >
                  {event.status === "upcoming" ? "Register Now" : 
                   event.status === "ongoing" ? "View Details" : 
                   "View Results"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events && events.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">Check back later for upcoming sports events and tournaments.</p>
          </div>
        )}
      </div>
    </div>
  );
}