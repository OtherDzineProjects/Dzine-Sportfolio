// Kerala Sports Categories and Districts System

export const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export const KERALA_SPORTS_CATEGORIES = {
  waterSports: {
    name: "🌊 Water Sports",
    maxSelections: 1,
    sports: [
      "Canoe Sprint/Slalom",
      "Kayaking & Stand-Up Paddling", 
      "Rowing (Coastal)",
      "Beach Volleyball",
      "Vallam Kali (Boat Race)"
    ]
  },
  outdoorFieldSports: {
    name: "⚽ Outdoor Field Sports",
    maxSelections: 1,
    sports: [
      "Football",
      "Cricket", 
      "Softball",
      "Volleyball",
      "Kabaddi/Kho-Kho"
    ]
  },
  indoorSports: {
    name: "🏟️ Indoor Sports", 
    maxSelections: 1,
    sports: [
      "Badminton",
      "Table Tennis",
      "Chess/Carrom"
    ]
  },
  traditionalSports: {
    name: "🎪 Traditional Sports (Kerala-Specific)",
    maxSelections: 1,
    sports: [
      "Vallam Kali",
      "Kuttiyum Kolum", 
      "Onam Kali",
      "Kalaripayattu"
    ]
  },
  trackAndField: {
    name: "🏃 Track & Field (Expandable)",
    maxSelections: 1,
    requiresSubcategory: true,
    sports: ["Track & Field (Athletics)"],
    subcategories: {
      runningEvents: {
        name: "Running Events",
        options: [
          "100m/200m Sprint",
          "400m/800m Middle-Distance", 
          "1500m/5000m Long-Distance",
          "Marathon/Cross-Country"
        ]
      },
      jumpingEvents: {
        name: "Jumping Events",
        options: [
          "Long Jump",
          "High Jump",
          "Triple Jump", 
          "Pole Vault"
        ]
      },
      throwingEvents: {
        name: "Throwing Events", 
        options: [
          "Shot Put",
          "Javelin Throw",
          "Discus Throw",
          "Hammer Throw"
        ]
      },
      hurdlesAndRelays: {
        name: "Hurdles & Relays",
        options: [
          "110m/400m Hurdles",
          "4x100m/4x400m Relay"
        ]
      }
    }
  }
};

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to the sport" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "professional", label: "Professional", description: "Advanced competitor" }
];

export const SPORTS_GOALS = [
  { value: "fitness", label: "Fitness", description: "Stay healthy and active" },
  { value: "competition", label: "Competition", description: "Compete at various levels" },
  { value: "recreation", label: "Recreation", description: "Fun and social activity" }
];

export const PREFERRED_VENUES = [
  { value: "backwaters", label: "Backwaters", description: "Kerala's scenic waterways" },
  { value: "indoor_stadium", label: "Indoor Stadium", description: "Covered sports facilities" },
  { value: "local_ground", label: "Local Ground", description: "Community sports grounds" }
];

// Sample Organizations with District-based matching
export const SAMPLE_ORGANIZATIONS = [
  {
    name: "Alleppey Boat Race Club",
    sports: ["Vallam Kali", "Kayaking & Stand-Up Paddling"],
    districts: ["Alappuzha"],
    levels: ["Beginner", "Intermediate", "Professional"],
    venue: "backwaters"
  },
  {
    name: "Kochi Water Sports Club", 
    sports: ["Canoe Sprint/Slalom", "Rowing (Coastal)"],
    districts: ["Ernakulam"],
    levels: ["Beginner"],
    venue: "backwaters"
  },
  {
    name: "CVN Kalari Sangam",
    sports: ["Kalaripayattu"],
    districts: ["Thiruvananthapuram"],
    levels: ["Beginner", "Professional"]
  },
  {
    name: "Kerala Softball Association",
    sports: ["Softball"],
    districts: ["Ernakulam", "Thrissur", "Kozhikode"],
    levels: ["Intermediate", "Professional"]
  },
  {
    name: "Wayanad Athletics Club",
    sports: ["Track & Field (Athletics)"],
    districts: ["Wayanad"],
    levels: ["Beginner", "Intermediate"]
  }
];

export function getMatchingOrganizations(
  userDistrict: string,
  selectedSports: string[],
  skillLevel: string,
  venue?: string
) {
  return SAMPLE_ORGANIZATIONS.filter(org => {
    const districtMatch = org.districts.includes(userDistrict);
    const sportsMatch = selectedSports.some(sport => org.sports.includes(sport));
    const levelMatch = org.levels.includes(skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1));
    const venueMatch = !venue || !org.venue || org.venue === venue;
    
    return districtMatch && sportsMatch && levelMatch && venueMatch;
  });
}

export function generateRecommendationText(
  userDistrict: string,
  selectedSports: string[],
  skillLevel: string,
  venue?: string
): string {
  const matches = getMatchingOrganizations(userDistrict, selectedSports, skillLevel, venue);
  
  if (matches.length === 0) {
    return `Based in ${userDistrict}? We're working on finding organizations for ${selectedSports.join(', ')} in your area. Check back soon!`;
  }
  
  const recommendations = matches.slice(0, 2).map(org => 
    `- ${org.name} (${org.levels.includes('Beginner') ? 'Beginner-friendly' : 'Advanced training'})`
  ).join('\n');
  
  return `Based in ${userDistrict}? For ${selectedSports[0]}, try:\n${recommendations}`;
}