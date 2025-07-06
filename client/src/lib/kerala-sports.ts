// Kerala Sports Categories and Districts System

export const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export const COMPREHENSIVE_SPORTS_CATEGORIES = {
  waterSports: {
    name: "🌊 Water Sports",
    description: "Aquatic and water-based sports",
    allowMultiple: true,
    sports: [
      { name: "Canoe Sprint/Slalom", tooltip: "High-speed canoe racing and technical slalom navigation" },
      { name: "Kayaking/Stand-Up Paddling", tooltip: "Paddle sports including kayak racing and SUP boarding" },
      { name: "Rowing (Coastal)", tooltip: "Team rowing sport in open coastal waters" },
      { name: "Swimming (Marathon/Artistic)", tooltip: "Long-distance swimming and synchronized swimming" },
      { name: "Beach Volleyball", tooltip: "Volleyball played on sand courts" },
      { name: "Surfing (Emerging)", tooltip: "Board riding on ocean waves - growing sport in Kerala" },
      { name: "Vallam Kali (Boat Race)", tooltip: "Traditional Kerala snake boat racing" }
    ]
  },
  indoorSports: {
    name: "🏠 Indoor Sports",
    description: "Sports played in enclosed venues", 
    allowMultiple: true,
    sports: [
      { name: "Badminton", tooltip: "Racquet sport with shuttlecock" },
      { name: "Basketball", tooltip: "Team sport with hoops and dribbling" },
      { name: "Boxing", tooltip: "Combat sport with gloved fists" },
      { name: "Carrom", tooltip: "Traditional board game with striker and coins" },
      { name: "Chess", tooltip: "Strategic board game - mental sport" },
      { name: "Futsal", tooltip: "Indoor football with smaller teams" },
      { name: "Judo/Karate", tooltip: "Japanese martial arts focusing on throws and strikes" },
      { name: "Snooker/Billiards", tooltip: "Cue sports with colored balls and pockets" },
      { name: "Table Tennis", tooltip: "Fast-paced paddle sport on table" },
      { name: "Volleyball (Indoor)", tooltip: "Indoor team sport with net and spiking" }
    ]
  },
  outdoorFieldSports: {
    name: "🌳 Outdoor Field Sports",
    description: "Field and outdoor team sports",
    allowMultiple: true,
    sports: [
      { name: "Football", tooltip: "World's most popular team sport" },
      { name: "Cricket", tooltip: "Bat and ball sport popular across India" },
      { name: "Athletics (Track & Field)", tooltip: "Running, jumping, and throwing events" },
      { name: "Archery", tooltip: "Precision sport with bow and arrows" },
      { name: "Baseball 5", tooltip: "5-player softball variant - Olympic sport" },
      { name: "Softball", tooltip: "Bat and ball sport similar to baseball" },
      { name: "Handball", tooltip: "Fast-paced team sport with goals" },
      { name: "Kabaddi", tooltip: "Traditional Indian contact team sport" },
      { name: "Kho-Kho", tooltip: "Traditional Indian tag sport with strategy" },
      { name: "Tug of War", tooltip: "Team strength sport pulling rope" }
    ]
  },
  gymnasticsFitness: {
    name: "🤸 Gymnastics & Fitness",
    description: "Body movement and fitness sports",
    allowMultiple: true,
    sports: [
      { name: "Artistic Gymnastics", tooltip: "Competitive gymnastics with apparatus" },
      { name: "Yoga Sports", tooltip: "Competitive yoga focusing on precision and flexibility" },
      { name: "Mallakhamb", tooltip: "Traditional Indian gymnastics with pole/rope" }
    ]
  },
  cycling: {
    name: "🚴 Cycling",
    description: "Bicycle-based sports",
    allowMultiple: true,
    sports: [
      { name: "Road Cycling", tooltip: "Long-distance cycling on roads" },
      { name: "Track Cycling", tooltip: "High-speed cycling on banked tracks" },
      { name: "BMX Racing", tooltip: "Off-road bicycle racing with jumps" }
    ]
  },
  precisionSports: {
    name: "🎯 Precision Sports",
    description: "Accuracy and precision-based sports",
    allowMultiple: true,
    sports: [
      { name: "Archery", tooltip: "Bow and arrow precision shooting" },
      { name: "Shooting", tooltip: "Firearm and air gun precision sports" },
      { name: "Darts", tooltip: "Throwing sport targeting dartboard" }
    ]
  },
  combatSports: {
    name: "🥋 Combat Sports",
    description: "Martial arts and fighting sports",
    allowMultiple: true,
    sports: [
      { name: "Boxing", tooltip: "Combat sport with gloved punches" },
      { name: "Judo", tooltip: "Japanese martial art focusing on throws" },
      { name: "Karate", tooltip: "Japanese martial art with strikes and blocks" },
      { name: "Kalaripayattu", tooltip: "Ancient Kerala martial art - mother of all martial arts" },
      { name: "Wrestling", tooltip: "Grappling combat sport" }
    ]
  },
  traditionalKerala: {
    name: "🛶 Traditional Kerala Sports",
    description: "Ancient Kerala sporting traditions",
    allowMultiple: true,
    sports: [
      { name: "Vallam Kali (Boat Race)", tooltip: "Traditional snake boat racing during Onam" },
      { name: "Kuttiyum Kolum", tooltip: "Traditional Kerala martial training with sticks" },
      { name: "Onathallu", tooltip: "Traditional Kerala wrestling during Onam festival" },
      { name: "Kalaripayattu", tooltip: "World's oldest martial art form from Kerala" }
    ]
  },
  mindGamesEsports: {
    name: "🎮 Mind Games & Esports",
    description: "Strategic and digital sports",
    allowMultiple: true,
    sports: [
      { name: "Chess", tooltip: "Strategic board game - the royal game" },
      { name: "Carrom", tooltip: "Traditional board game with striker and coins" },
      { name: "Esports (Gaming)", tooltip: "Competitive video gaming tournaments" }
    ]
  },
  emergingSports: {
    name: "🚀 Emerging Sports in Kerala",
    description: "New and developing sports",
    allowMultiple: true,
    sports: [
      { name: "Surfing", tooltip: "Ocean wave riding - new in Kerala coastline" },
      { name: "Skateboarding", tooltip: "Board sport with tricks and competitions" },
      { name: "Baseball 5", tooltip: "Olympic softball variant gaining popularity" },
      { name: "Esports", tooltip: "Professional competitive gaming" }
    ]
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