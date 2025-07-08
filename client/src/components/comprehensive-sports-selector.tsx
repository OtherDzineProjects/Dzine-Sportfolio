import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Info, X } from "lucide-react";
import { COMPREHENSIVE_SPORTS_CATEGORIES } from "@/lib/kerala-sports";

interface Sport {
  name: string;
  tooltip: string;
}

interface SportsCategory {
  name: string;
  description: string;
  allowMultiple: boolean;
  sports: Sport[];
}

interface ComprehensiveSportsSelectorProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
  maxSelections?: number;
  showCategoryDescriptions?: boolean;
  allowSearch?: boolean;
}

export default function ComprehensiveSportsSelector({
  selectedSports = [],
  onSportsChange,
  maxSelections = 999,
  showCategoryDescriptions = true,
  allowSearch = true
}: ComprehensiveSportsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Filter sports based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return COMPREHENSIVE_SPORTS_CATEGORIES;

    const filtered: Record<string, SportsCategory> = {};
    
    Object.entries(COMPREHENSIVE_SPORTS_CATEGORIES).forEach(([key, category]) => {
      const matchingSports = category.sports.filter(sport =>
        sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.tooltip.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingSports.length > 0 || category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered[key] = {
          ...category,
          sports: matchingSports.length > 0 ? matchingSports : category.sports
        };
      }
    });
    
    return filtered;
  }, [searchTerm]);

  const toggleSport = (sportName: string) => {
    const isSelected = selectedSports.includes(sportName);
    
    if (isSelected) {
      // Remove sport
      onSportsChange(selectedSports.filter(s => s !== sportName));
    } else {
      // Add sport (check max selections)
      if (selectedSports.length < maxSelections) {
        onSportsChange([...selectedSports, sportName]);
      }
    }
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const removeSport = (sportName: string) => {
    onSportsChange(selectedSports.filter(s => s !== sportName));
  };

  const clearAllSports = () => {
    onSportsChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Selected Sports Display */}
      {selectedSports.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Selected Sports ({selectedSports.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAllSports}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSports.map((sport) => (
                <Badge key={sport} variant="default" className="flex items-center gap-1">
                  {sport}
                  <button
                    onClick={() => removeSport(sport)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      {allowSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sports (e.g., 'football', 'traditional', 'water sports')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Sports Categories */}
      <div className="space-y-4">
        {Object.entries(filteredCategories).map(([categoryKey, category]) => (
          <Card key={categoryKey} className="border-l-4 border-l-primary/30">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
              onClick={() => toggleCategory(categoryKey)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {category.name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{category.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  {showCategoryDescriptions && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary">
                  {category.sports.filter(sport => selectedSports.includes(sport.name)).length}/{category.sports.length}
                </Badge>
              </div>
            </CardHeader>
            
            {(expandedCategories.has(categoryKey) || searchTerm) && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.sports.map((sport) => (
                    <TooltipProvider key={sport.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedSports.includes(sport.name)
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                            onClick={() => toggleSport(sport.name)}
                          >
                            <Checkbox
                              checked={selectedSports.includes(sport.name)}
                              onChange={() => toggleSport(sport.name)}
                            />
                            <Label className="flex-1 cursor-pointer text-sm">
                              {sport.name}
                            </Label>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p>{sport.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>




      {/* No Results */}
      {Object.keys(filteredCategories).length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No sports found matching "{searchTerm}". Try different keywords.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}