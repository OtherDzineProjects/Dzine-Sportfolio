import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Building2, MapPin, Users, Tag, Bookmark, BookmarkCheck, ChevronDown, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Organization {
  id: number;
  name: string;
  organizationType: string;
  district?: string;
  city?: string;
  lsgd?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  sportsInterests?: string[];
  verificationStatus: string;
  createdAt?: string;
  isActive?: boolean;
}

interface OrganizationTag {
  id: number;
  userId: number;
  organizationId: number;
  tagType: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface OrganizationHierarchy {
  id: number;
  parentOrganizationId: number;
  childOrganizationId: number;
  hierarchyType: string;
  level: number;
}

export default function OrganizationsDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all organizations
  const { data: organizations = [], isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations/all"],
    refetchOnWindowFocus: false,
  });

  // Fetch user's organization tags
  const { data: userTags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ["/api/organization-tags"],
    refetchOnWindowFocus: false,
  });

  // Fetch organization hierarchy
  const { data: hierarchy = [], isLoading: hierarchyLoading } = useQuery({
    queryKey: ["/api/organization-hierarchy"],
    refetchOnWindowFocus: false,
  });

  // Search organizations
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["/api/organizations/search", searchQuery],
    enabled: searchQuery.length > 2,
    refetchOnWindowFocus: false,
  });

  // Tag organization mutation
  const tagMutation = useMutation({
    mutationFn: async (data: { organizationId: number; tagType: string; notes?: string }) => {
      return await apiRequest("POST", "/api/organization-tags", data);
    },
    onSuccess: () => {
      toast({
        title: "Organization Tagged",
        description: "Successfully tagged the organization!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organization-tags"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to tag organization",
        variant: "destructive",
      });
    },
  });

  // Group organizations by type and hierarchy
  const groupedOrganizations = () => {
    const groups: { [key: string]: Organization[] } = {
      "State Sports Council": [],
      "District Sports Councils": [],
      "State Sports Associations": [],
      "District Sport Associations": [],
      "University Sports Councils": [],
      "Private Sports Organizations": [],
      "Others": []
    };

    organizations.forEach((org: Organization) => {
      const type = org.organizationType || "Others";
      if (groups[type]) {
        groups[type].push(org);
      } else {
        groups["Others"].push(org);
      }
    });

    return groups;
  };

  // Check if organization is tagged by user
  const isTagged = (orgId: number, tagType: string) => {
    return userTags.some((tag: OrganizationTag) => 
      tag.organizationId === orgId && tag.tagType === tagType && tag.status === 'active'
    );
  };

  // Get organization children from hierarchy
  const getOrganizationChildren = (parentId: number): Organization[] => {
    const childIds = hierarchy
      .filter((h: OrganizationHierarchy) => h.parentOrganizationId === parentId)
      .map((h: OrganizationHierarchy) => h.childOrganizationId);
    
    return organizations.filter((org: Organization) => childIds.includes(org.id));
  };

  // Get display data for organizations
  const getDisplayData = () => {
    if (searchQuery.length > 2) {
      return { searchResults, isSearching: true };
    }
    return { searchResults: organizations, isSearching: false };
  };

  const { searchResults: displayOrgs, isSearching } = getDisplayData();

  const OrganizationCard = ({ org, level = 0 }: { org: Organization; level?: number }) => {
    const children = getOrganizationChildren(org.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedOrgs.has(org.id);

    const toggleExpanded = () => {
      const newExpanded = new Set(expandedOrgs);
      if (isExpanded) {
        newExpanded.delete(org.id);
      } else {
        newExpanded.add(org.id);
      }
      setExpandedOrgs(newExpanded);
    };

    return (
      <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
        <Card className="mb-4 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasChildren && (
                  <button
                    onClick={toggleExpanded}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                )}
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {org.organizationType} • {org.district || org.city || 'Kerala'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={org.verificationStatus === 'verified' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {org.verificationStatus || 'Pending'}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrganization(org)}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <TagOrganizationDialog organization={org} />
                </Dialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {org.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{org.address}</span>
                </div>
              )}
              
              {org.sportsInterests && org.sportsInterests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {org.sportsInterests.slice(0, 3).map((sport, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sport}
                    </Badge>
                  ))}
                  {org.sportsInterests.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{org.sportsInterests.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm">
                {org.phone && (
                  <span className="text-gray-600">📞 {org.phone}</span>
                )}
                {org.email && (
                  <span className="text-gray-600">✉️ {org.email}</span>
                )}
                {org.website && (
                  <a 
                    href={org.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <div className="flex items-center gap-1">
                  {isTagged(org.id, 'follow') ? (
                    <BookmarkCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-600">
                    {isTagged(org.id, 'follow') ? 'Following' : 'Not Following'}
                  </span>
                </div>
                
                {isTagged(org.id, 'member_request') && (
                  <Badge variant="outline" className="text-xs">
                    Membership Requested
                  </Badge>
                )}
              </div>
              
              {hasChildren && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{children.length} associated organizations</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {children.map((child) => (
              <OrganizationCard key={child.id} org={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const TagOrganizationDialog = ({ organization }: { organization: Organization | null }) => {
    const [tagType, setTagType] = useState("");
    const [notes, setNotes] = useState("");

    if (!organization) return null;

    const handleTag = () => {
      if (!tagType) return;
      tagMutation.mutate({
        organizationId: organization.id,
        tagType,
        notes: notes || undefined
      });
    };

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tag Organization</DialogTitle>
          <DialogDescription>
            Tag "{organization.name}" for notifications and membership
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tag Type</label>
            <Select value={tagType} onValueChange={setTagType}>
              <SelectTrigger>
                <SelectValue placeholder="Select tag type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow">Follow for Updates</SelectItem>
                <SelectItem value="member_request">Request Membership</SelectItem>
                <SelectItem value="notification_subscribe">Subscribe to Notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleTag} 
            disabled={!tagType || tagMutation.isPending}
            className="w-full"
          >
            {tagMutation.isPending ? "Tagging..." : "Tag Organization"}
          </Button>
        </div>
      </DialogContent>
    );
  };

  const grouped = groupedOrganizations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kerala Sports Organizations
        </h1>
        <p className="text-gray-600">
          Discover and connect with sports organizations across Kerala's comprehensive sports ecosystem
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search organizations by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{organizations.length}</div>
            <div className="text-sm text-gray-600">Total Organizations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{userTags.length}</div>
            <div className="text-sm text-gray-600">Your Tags</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {organizations.filter((org: Organization) => org.verificationStatus === 'verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified Organizations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">14</div>
            <div className="text-sm text-gray-600">Districts Covered</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Organizations</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          <TabsTrigger value="my-tags">My Tagged Organizations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {isSearching ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Search Results ({searchResults.length})
              </h3>
              {searchLoading ? (
                <div className="text-center py-8">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((org: Organization) => (
                    <OrganizationCard key={org.id} org={org} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No organizations found for "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([type, orgs]) => (
                orgs.length > 0 && (
                  <div key={type}>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      {type} ({orgs.length})
                    </h3>
                    <div className="space-y-4">
                      {orgs.map((org: Organization) => (
                        <OrganizationCard key={org.id} org={org} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="hierarchy" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Kerala Sports Organizational Hierarchy</h3>
            <div className="space-y-4">
              {grouped["State Sports Council"].map((org: Organization) => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="my-tags" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Tagged Organizations</h3>
            {tagsLoading ? (
              <div className="text-center py-8">Loading your tags...</div>
            ) : userTags.length > 0 ? (
              <div className="space-y-4">
                {userTags.map((tag: OrganizationTag) => {
                  const org = organizations.find((o: Organization) => o.id === tag.organizationId);
                  return org ? (
                    <div key={tag.id} className="relative">
                      <Badge 
                        className="absolute top-4 right-4 z-10" 
                        variant={tag.status === 'active' ? 'default' : 'secondary'}
                      >
                        {tag.tagType}
                      </Badge>
                      <OrganizationCard org={org} />
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                You haven't tagged any organizations yet. Start exploring!
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}