import { storage } from "./storage";

export async function seedScoringData() {
  console.log("Seeding scoring system demo data...");

  try {
    // Create sample teams
    const team1 = await storage.createTeam({
      name: "Kerala Warriors",
      organizationId: 3, // Using College Sports League Kerala
      sportCategoryId: 6, // Football
      description: "Elite football team from Kerala",
      foundedYear: 2020,
      isActive: true
    });

    const team2 = await storage.createTeam({
      name: "Chennai Champions",
      organizationId: 3,
      sportCategoryId: 6, // Football
      description: "Professional football team from Chennai",
      foundedYear: 2019,
      isActive: true
    });

    console.log(`✅ Created teams: ${team1.name} and ${team2.name}`);

    // Add team members (using existing users)
    await storage.addTeamMember({
      teamId: team1.id,
      userId: 2, // Sports Director
      position: "Captain",
      jerseyNumber: 10,
      isActive: true
    });

    await storage.addTeamMember({
      teamId: team2.id,
      userId: 3, // Ahammed Sukarno
      position: "Coach",
      jerseyNumber: null,
      isActive: true
    });

    console.log("✅ Added team members");

    // Create a live match
    const match = await storage.createTeamMatch({
      homeTeamId: team1.id,
      awayTeamId: team2.id,
      eventId: 4, // College Sports League Kerala 2025-2026
      scheduledTime: new Date(),
      status: "live",
      homeScore: 2,
      awayScore: 1,
      duration: 45,
      venue: "Kerala State Sports Stadium"
    });

    console.log(`✅ Created live match: ${team1.name} vs ${team2.name}`);

    // Add some match events
    await storage.addMatchEvent({
      matchId: match.id,
      eventType: "goal",
      eventTime: 15,
      teamId: team1.id,
      playerId: 2,
      description: "Beautiful header from corner kick",
      createdBy: 2
    });

    await storage.addMatchEvent({
      matchId: match.id,
      eventType: "goal",
      eventTime: 28,
      teamId: team2.id,
      playerId: 3,
      description: "Long range strike",
      createdBy: 3
    });

    await storage.addMatchEvent({
      matchId: match.id,
      eventType: "goal",
      eventTime: 42,
      teamId: team1.id,
      playerId: 2,
      description: "Penalty conversion",
      createdBy: 2
    });

    console.log("✅ Added match events");

    // Create standings for the event
    await storage.createStandings({
      eventId: 4,
      teamId: team1.id,
      groupName: "Group A",
      matchesPlayed: 3,
      wins: 2,
      draws: 1,
      losses: 0,
      goalsFor: 8,
      goalsAgainst: 3,
      goalDifference: 5,
      points: 7,
      position: 1
    });

    await storage.createStandings({
      eventId: 4,
      teamId: team2.id,
      groupName: "Group A",
      matchesPlayed: 3,
      wins: 1,
      draws: 1,
      losses: 1,
      goalsFor: 5,
      goalsAgainst: 6,
      goalDifference: -1,
      points: 4,
      position: 2
    });

    console.log("✅ Created standings");

    // Create season stats
    await storage.createPlayerSeasonStats({
      playerId: 2,
      teamId: team1.id,
      sportCategoryId: 6, // Football
      season: "2025-2026",
      matchesPlayed: 8,
      goals: 12,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
      minutesPlayed: 720
    });

    await storage.createTeamSeasonStats({
      teamId: team1.id,
      sportCategoryId: 6, // Football
      season: "2025-2026",
      matchesPlayed: 8,
      wins: 6,
      draws: 1,
      losses: 1,
      goalsFor: 18,
      goalsAgainst: 8,
      goalDifference: 10,
      points: 19,
      averageAttendance: 5000
    });

    console.log("✅ Created season statistics");
    console.log("🎯 Scoring system demo data seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding scoring data:", error);
  }
}