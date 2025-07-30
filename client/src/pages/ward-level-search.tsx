import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Filter, Users, Building, CalendarDays, Trophy } from "lucide-react";

interface SearchResult {
  id: number;
  name: string;
  type: 'user' | 'organization' | 'facility' | 'event';
  district: string;
  ward: string;
  address: string;
  description?: string;
  verified?: boolean;
}

const keralaDistricts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export default function WardLevelSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [activeTab, setActiveTab] = useState("users");

  // Search query with filters
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/ward-search", { 
      query: searchQuery, 
      district: selectedDistrict, 
      ward: selectedWard, 
      type: searchType 
    }],
    enabled: searchQuery.length > 2 || selectedDistrict || selectedWard,
    select: (data: SearchResult[]) => data || []
  });

  // Get wards for selected district
  const { data: availableWards } = useQuery({
    queryKey: ["/api/wards", selectedDistrict],
    enabled: !!selectedDistrict,
    select: (data: string[]) => data || []
  });

  const handleSearch = () => {
    // Trigger search with current filters
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'organization': return <Building className="w-4 h-4" />;
      case 'facility': return <MapPin className="w-4 h-4" />;
      case 'event': return <CalendarDays className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const filteredResults = searchResults?.filter(result => {
    if (activeTab === "all") return true;
    return result.type === activeTab.slice(0, -1); // Remove 's' from plural
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ward-Level Search System
          </h1>
          <p className="text-lg text-gray-600">
            Find users, organizations, facilities, and events in Kerala with precise ward-level mapping
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Search Filters
            </CardTitle>
            <CardDescription>
              Use ward-level and district-level filters for precise location-based search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Query</label>
                <Input
                  placeholder="Search by name, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Districts</SelectItem>
                    {keralaDistricts.map(district => (
                      <SelectItem key={district} value={district.toLowerCase()}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ward</label>
                <Select 
                  value={selectedWard} 
                  onValueChange={setSelectedWard}
                  disabled={!selectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Wards</SelectItem>
                    {availableWards?.map(ward => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="organization">Organizations</SelectItem>
                    <SelectItem value="facility">Facilities</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict("");
                  setSelectedWard("");
                  setSearchType("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {filteredResults.length} results found
              {selectedDistrict && ` in ${selectedDistrict}`}
              {selectedWard && ` - Ward: ${selectedWard}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or filters
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredResults.map((result) => (
                      <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getIconForType(result.type)}
                                <h3 className="text-lg font-semibold">{result.name}</h3>
                                <Badge 
                                  variant={result.type === 'user' ? 'default' : 
                                          result.type === 'organization' ? 'secondary' :
                                          result.type === 'facility' ? 'outline' : 'destructive'}
                                >
                                  {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                                </Badge>
                                {result.verified && (
                                  <Badge variant="default" className="bg-green-500">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              
                              {result.description && (
                                <p className="text-gray-600 mb-3">{result.description}</p>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{result.district} District</span>
                                </div>
                                <div>
                                  Ward: {result.ward}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-500 mt-1">{result.address}</p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                              <Button variant="outline" size="sm">
                                <MapPin className="w-4 h-4 mr-2" />
                                Location
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Location Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {searchResults?.filter(r => r.type === 'user').length || 0}
              </h3>
              <p className="text-gray-600">Users Found</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {searchResults?.filter(r => r.type === 'organization').length || 0}
              </h3>
              <p className="text-gray-600">Organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {searchResults?.filter(r => r.type === 'facility').length || 0}
              </h3>
              <p className="text-gray-600">Facilities</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CalendarDays className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">
                {searchResults?.filter(r => r.type === 'event').length || 0}
              </h3>
              <p className="text-gray-600">Events</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}