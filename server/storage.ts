import { 
  users, 
  athleteProfiles, 
  organizations, 
  facilities, 
  facilityBookings, 
  events, 
  eventParticipants,
  matches,
  certificates,
  sportsCategories,
  maintenanceRecords,
  revenueRecords,
  roles,
  permissions,
  rolePermissions,
  userApprovals,
  moduleConfigurations,
  // New tables
  userOrganizations,
  organizationMembers,
  sportsAchievements,
  sportsQuestionnaireResponses,
  organizationTags,
  organizationHierarchy,
  type User, 
  type InsertUser,
  type AthleteProfile,
  type InsertAthleteProfile,
  type Organization,
  type InsertOrganization,
  type Facility,
  type InsertFacility,
  type Event,
  type InsertEvent,
  type FacilityBooking,
  type InsertFacilityBooking,
  type Certificate,
  type InsertCertificate,
  type SportsCategory,
  type Match,
  type EventParticipant,
  type MaintenanceRecord,
  type RevenueRecord,
  type Role,
  type InsertRole,
  type Permission,
  type InsertPermission,
  type RolePermission,
  type UserApproval,
  type InsertUserApproval,
  type ModuleConfiguration,
  type InsertModuleConfiguration,
  // New types
  type UserOrganization,
  type InsertUserOrganization,
  type OrganizationMember,
  type InsertOrganizationMember,
  type SportsAchievement,
  type InsertSportsAchievement,
  type SportsQuestionnaireResponse,
  type InsertSportsQuestionnaireResponse,
  type OrganizationTag,
  type InsertOrganizationTag,
  type OrganizationHierarchy,
  type InsertOrganizationHierarchy,
  // Scoring system imports
  teams,
  teamMembers,
  teamMatches,
  matchEvents,
  playerMatchStats,
  teamMatchStats,
  standings,
  playerSeasonStats,
  teamSeasonStats,
  matchCommentary,
  type Team,
  type InsertTeam,
  type TeamMember,
  type InsertTeamMember,
  type TeamMatch,
  type InsertTeamMatch,
  type MatchEvent,
  type InsertMatchEvent,
  type PlayerMatchStats,
  type InsertPlayerMatchStats,
  type TeamMatchStats,
  type InsertTeamMatchStats,
  type Standings,
  type InsertStandings,
  type PlayerSeasonStats,
  type InsertPlayerSeasonStats,
  type TeamSeasonStats,
  type InsertTeamSeasonStats,
  type MatchCommentary,
  type InsertMatchCommentary
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Athlete profiles
  getAthleteProfile(userId: number): Promise<AthleteProfile | undefined>;
  createAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile>;
  updateAthleteProfile(userId: number, updates: Partial<AthleteProfile>): Promise<AthleteProfile>;
  
  // Organizations
  getOrganizations(): Promise<Organization[]>;
  getOrganization(id: number): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  
  // Facilities
  getFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  getFacilitiesByCity(city: string): Promise<Facility[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, updates: Partial<Facility>): Promise<Facility>;
  
  // Facility bookings
  createFacilityBooking(booking: InsertFacilityBooking): Promise<FacilityBooking>;
  getFacilityBookings(facilityId: number, date?: Date): Promise<FacilityBooking[]>;
  getUserBookings(userId: number): Promise<FacilityBooking[]>;
  updateBookingStatus(id: number, status: string): Promise<FacilityBooking>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  
  // Event participants
  addEventParticipant(eventId: number, userId: number): Promise<EventParticipant>;
  getEventParticipants(eventId: number): Promise<EventParticipant[]>;
  
  // Matches
  getEventMatches(eventId: number): Promise<Match[]>;
  createMatch(match: Partial<Match>): Promise<Match>;
  updateMatchScore(matchId: number, score: any, winnerId?: number): Promise<Match>;
  
  // Certificates
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  getUserCertificates(userId: number): Promise<Certificate[]>;
  verifyCertificate(blockchainHash: string): Promise<Certificate | undefined>;
  
  // Sports categories
  getSportsCategories(): Promise<SportsCategory[]>;
  
  // Maintenance records
  createMaintenanceRecord(record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord>;
  getFacilityMaintenanceRecords(facilityId: number): Promise<MaintenanceRecord[]>;
  
  // Revenue analytics
  createRevenueRecord(record: Partial<RevenueRecord>): Promise<RevenueRecord>;
  getFacilityRevenue(facilityId: number, startDate?: Date, endDate?: Date): Promise<RevenueRecord[]>;
  
  // Enhanced dashboard functionality
  searchByWard(params: { query?: string; district?: string; ward?: string; type?: string }): Promise<any[]>;
  getWardsByDistrict(district: string): Promise<string[]>;
  getProfile(type: string, id: number): Promise<any>;
  getAchievements(type: string, id: number): Promise<any[]>;
  getEntityEvents(type: string, id: number): Promise<any[]>;
  getNotifications(type: string, id: number): Promise<any[]>;
  getReviews(type: string, id: number): Promise<any[]>;
  getPendingRequests(type: string, id: number): Promise<any[]>;
  getEntityAdvertisements(type: string, id: number): Promise<any[]>;
  getEcommerceProducts(): Promise<any[]>;
  
  // Advertisements
  getAdvertisements(): Promise<Advertisement[]>;
  createAdvertisement(ad: InsertAdvertisement): Promise<Advertisement>;
  
  // User approval system
  createUserApproval(approval: InsertUserApproval): Promise<UserApproval>;
  getPendingApprovals(reviewerId?: number): Promise<UserApproval[]>;
  getUserApprovals(userId: number): Promise<UserApproval[]>;
  approveUserRequest(approvalId: number, reviewerId: number, comments?: string): Promise<UserApproval>;
  rejectUserRequest(approvalId: number, reviewerId: number, reason: string): Promise<UserApproval>;
  updateUserApprovalStatus(userId: number, status: string, approvedBy?: number, reason?: string): Promise<User>;
  
  // Role and permission management
  createRole(role: InsertRole): Promise<Role>;
  getRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  updateRole(id: number, updates: Partial<Role>): Promise<Role>;
  deleteRole(id: number): Promise<void>;
  
  createPermission(permission: InsertPermission): Promise<Permission>;
  getPermissions(): Promise<Permission[]>;
  getPermissionsByModule(module: string): Promise<Permission[]>;
  
  assignRolePermission(roleId: number, permissionId: number): Promise<RolePermission>;
  removeRolePermission(roleId: number, permissionId: number): Promise<void>;
  getRolePermissions(roleId: number): Promise<Permission[]>;
  
  assignUserRole(userId: number, roleId: number): Promise<User>;
  getUserPermissions(userId: number): Promise<Permission[]>;
  checkUserPermission(userId: number, module: string, action: string): Promise<boolean>;
  
  // Module configuration
  createModuleConfig(config: InsertModuleConfiguration): Promise<ModuleConfiguration>;
  getModuleConfigs(): Promise<ModuleConfiguration[]>;
  getModuleConfig(moduleName: string): Promise<ModuleConfiguration | undefined>;
  updateModuleConfig(moduleName: string, updates: Partial<ModuleConfiguration>): Promise<ModuleConfiguration>;
  toggleModule(moduleName: string, isEnabled: boolean): Promise<ModuleConfiguration>;

  // User Organizations
  createUserOrganization(org: InsertUserOrganization): Promise<UserOrganization>;
  getUserOrganizations(userId: number): Promise<UserOrganization[]>;
  getUserOrganization(id: number): Promise<UserOrganization | undefined>;
  updateUserOrganization(id: number, updates: Partial<UserOrganization>): Promise<UserOrganization>;
  deleteUserOrganization(id: number): Promise<void>;

  // Organization Members
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  getOrganizationMembers(organizationId: number): Promise<OrganizationMember[]>;
  removeOrganizationMember(organizationId: number, userId: number): Promise<void>;
  updateMemberRole(organizationId: number, userId: number, role: string): Promise<OrganizationMember>;
  getUserMemberships(userId: number): Promise<OrganizationMember[]>;

  // Sports Achievements
  createSportsAchievement(achievement: InsertSportsAchievement): Promise<SportsAchievement>;
  getUserAchievements(userId: number): Promise<SportsAchievement[]>;
  getSportsAchievement(id: number): Promise<SportsAchievement | undefined>;
  updateSportsAchievement(id: number, updates: Partial<SportsAchievement>): Promise<SportsAchievement>;
  verifyAchievement(id: number, verifierId: number, blockchainHash: string): Promise<SportsAchievement>;
  
  // Sports Questionnaire
  saveQuestionnaireResponse(response: InsertSportsQuestionnaireResponse): Promise<SportsQuestionnaireResponse>;
  getUserQuestionnaireResponse(userId: number): Promise<SportsQuestionnaireResponse | undefined>;
  getOrganizationQuestionnaireResponse(organizationId: number): Promise<SportsQuestionnaireResponse | undefined>;
  updateUserSportsInterests(userId: number, interests: string[]): Promise<User>;

  // Analytics
  getSportsAnalytics(): Promise<{
    usersBySports: {[key: string]: number};
    organizationsBySports: {[key: string]: number};
    organizationsWithFacilities: {[key: string]: number};
    totalUsers: number;
    totalOrganizations: number;
  }>;
  
  // Export methods for comprehensive data
  getAllUsersWithSports(): Promise<User[]>;
  getAllOrganizationsWithDetails(): Promise<any[]>;
  getAllEvents(): Promise<any[]>;
  getAllAchievements(): Promise<any[]>;

  // Organization tagging system
  getOrganizationTags(userId?: number, organizationId?: number): Promise<OrganizationTag[]>;
  createOrganizationTag(tag: InsertOrganizationTag): Promise<OrganizationTag>;
  updateOrganizationTag(id: number, updates: Partial<OrganizationTag>): Promise<OrganizationTag>;
  searchOrganizationsByName(searchTerm: string): Promise<UserOrganization[]>;

  // Organization hierarchy
  getOrganizationHierarchy(parentId?: number, childId?: number): Promise<OrganizationHierarchy[]>;
  createOrganizationHierarchy(hierarchy: InsertOrganizationHierarchy): Promise<OrganizationHierarchy>;
  getOrganizationChildren(parentId: number): Promise<UserOrganization[]>;
  getOrganizationParent(childId: number): Promise<UserOrganization | undefined>;
  getAllUserOrganizations(): Promise<UserOrganization[]>;
  
  // Sports Scoring System - Teams
  createTeam(team: InsertTeam): Promise<Team>;
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsBySport(sportCategoryId: number): Promise<Team[]>;
  getTeamsByOrganization(organizationId: number): Promise<Team[]>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team>;
  
  // Team Members
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  getUserTeams(userId: number): Promise<TeamMember[]>;
  updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember>;
  removeTeamMember(id: number): Promise<void>;
  
  // Team Matches
  createTeamMatch(match: InsertTeamMatch): Promise<TeamMatch>;
  getTeamMatches(teamId?: number, eventId?: number): Promise<TeamMatch[]>;
  getTeamMatch(id: number): Promise<TeamMatch | undefined>;
  updateTeamMatch(id: number, updates: Partial<TeamMatch>): Promise<TeamMatch>;
  getLiveMatches(): Promise<TeamMatch[]>;
  
  // Match Events
  addMatchEvent(event: InsertMatchEvent): Promise<MatchEvent>;
  getMatchEvents(matchId: number): Promise<MatchEvent[]>;
  updateMatchEvent(id: number, updates: Partial<MatchEvent>): Promise<MatchEvent>;
  deleteMatchEvent(id: number): Promise<void>;
  
  // Match Statistics
  createPlayerMatchStats(stats: InsertPlayerMatchStats): Promise<PlayerMatchStats>;
  getPlayerMatchStats(matchId: number, playerId?: number): Promise<PlayerMatchStats[]>;
  updatePlayerMatchStats(id: number, updates: Partial<PlayerMatchStats>): Promise<PlayerMatchStats>;
  
  createTeamMatchStats(stats: InsertTeamMatchStats): Promise<TeamMatchStats>;
  getTeamMatchStats(matchId: number, teamId?: number): Promise<TeamMatchStats[]>;
  updateTeamMatchStats(id: number, updates: Partial<TeamMatchStats>): Promise<TeamMatchStats>;
  
  // Standings
  createStandings(standings: InsertStandings): Promise<Standings>;
  getStandings(eventId: number, groupName?: string): Promise<Standings[]>;
  updateStandings(id: number, updates: Partial<Standings>): Promise<Standings>;
  
  // Season Statistics
  getPlayerSeasonStats(playerId: number, season?: string): Promise<PlayerSeasonStats[]>;
  createPlayerSeasonStats(stats: InsertPlayerSeasonStats): Promise<PlayerSeasonStats>;
  updatePlayerSeasonStats(playerId: number, teamId: number, season: string, updates: Partial<PlayerSeasonStats>): Promise<PlayerSeasonStats>;
  
  getTeamSeasonStats(teamId: number, season?: string): Promise<TeamSeasonStats[]>;
  createTeamSeasonStats(stats: InsertTeamSeasonStats): Promise<TeamSeasonStats>;
  updateTeamSeasonStats(teamId: number, season: string, updates: Partial<TeamSeasonStats>): Promise<TeamSeasonStats>;
  
  // Match Commentary
  addMatchCommentary(commentary: InsertMatchCommentary): Promise<MatchCommentary>;
  getMatchCommentary(matchId: number): Promise<MatchCommentary[]>;
  
  // Analytics operations
  getAnalytics(): Promise<any>;
  getSportsAnalytics(): Promise<any>;
  
  // Advertisement operations
  getAdvertisements(placement?: string): Promise<any[]>;
  createAdvertisement(advertisement: any): Promise<any>;
  
  // Sports content operations
  getSportsContent(filters: { sportCategoryId?: number, ageGroup?: string, contentType?: string }): Promise<any[]>;
  
  // Player evaluation operations
  getPlayerEvaluations(): Promise<any[]>;
  getUserPlayerEvaluations(userId: number): Promise<any[]>;
  createPlayerEvaluation(evaluation: any): Promise<any>;
  approvePlayerEvaluation(evaluationId: number): Promise<any>;
  
  // Enhanced search operations
  enhancedSearch(params: { 
    query?: string, 
    type?: string, 
    location?: string, 
    sport?: string, 
    district?: string, 
    ward?: string 
  }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        userType: users.userType,
        approvalStatus: users.approvalStatus,
        roleId: users.roleId,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, id));
    return user as User || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        userType: users.userType,
        approvalStatus: users.approvalStatus,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).orderBy(asc(users.createdAt)) as User[];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        userType: users.userType,
        approvalStatus: users.approvalStatus,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.email, email));
    return user as User || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values([insertUser])
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        userType: users.userType,
        approvalStatus: users.approvalStatus,
        profileImageUrl: users.profileImageUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      });
    return user as User;
  }

  async getAthleteProfile(userId: number): Promise<AthleteProfile | undefined> {
    const [profile] = await db
      .select()
      .from(athleteProfiles)
      .where(eq(athleteProfiles.userId, userId));
    return profile || undefined;
  }

  async createAthleteProfile(profile: InsertAthleteProfile): Promise<AthleteProfile> {
    const [created] = await db
      .insert(athleteProfiles)
      .values(profile)
      .returning();
    return created;
  }

  async updateAthleteProfile(userId: number, updates: Partial<AthleteProfile>): Promise<AthleteProfile> {
    const [profile] = await db
      .update(athleteProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(athleteProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getOrganizations(): Promise<Organization[]> {
    return await db.select({
      id: organizations.id,
      name: organizations.name,
      type: organizations.type,
      registrationNumber: organizations.registrationNumber,
      address: organizations.address,
      city: organizations.city,
      state: organizations.state,
      pincode: organizations.pincode,
      contactEmail: organizations.contactEmail,
      contactPhone: organizations.contactPhone,
      adminUserId: organizations.adminUserId,
      logo: organizations.logo,
      website: organizations.website,
      isVerified: organizations.isVerified,
      createdAt: organizations.createdAt,
      updatedAt: organizations.updatedAt
    }).from(organizations).orderBy(asc(organizations.name)) as Organization[];
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [created] = await db
      .insert(organizations)
      .values(org)
      .returning();
    return created;
  }

  async getFacilities(): Promise<Facility[]> {
    return await db.select().from(facilities).where(eq(facilities.isActive, true));
  }

  async getFacility(id: number): Promise<Facility | undefined> {
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, id));
    return facility || undefined;
  }

  async getFacilitiesByCity(city: string): Promise<Facility[]> {
    return await db
      .select()
      .from(facilities)
      .where(and(eq(facilities.city, city), eq(facilities.isActive, true)));
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const [created] = await db
      .insert(facilities)
      .values([facility])
      .returning();
    return created;
  }

  async updateFacility(id: number, updates: Partial<Facility>): Promise<Facility> {
    const [facility] = await db
      .update(facilities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(facilities.id, id))
      .returning();
    return facility;
  }

  async createFacilityBooking(booking: InsertFacilityBooking): Promise<FacilityBooking> {
    const [created] = await db
      .insert(facilityBookings)
      .values([booking])
      .returning();
    return created;
  }

  async getFacilityBookings(facilityId: number, date?: Date): Promise<FacilityBooking[]> {
    const query = db
      .select()
      .from(facilityBookings)
      .where(eq(facilityBookings.facilityId, facilityId));

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await query.where(
        and(
          eq(facilityBookings.facilityId, facilityId),
          gte(facilityBookings.startTime, startOfDay),
          lte(facilityBookings.startTime, endOfDay)
        )
      );
    }

    return await query;
  }

  async getUserBookings(userId: number): Promise<FacilityBooking[]> {
    return await db
      .select()
      .from(facilityBookings)
      .where(eq(facilityBookings.userId, userId))
      .orderBy(desc(facilityBookings.startTime));
  }

  async updateBookingStatus(id: number, status: string): Promise<FacilityBooking> {
    const [booking] = await db
      .update(facilityBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(facilityBookings.id, id))
      .returning();
    return booking;
  }

  async getEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.isPublic, true))
      .orderBy(desc(events.startDate));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db
      .insert(events)
      .values([event])
      .returning();
    return created;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.startDate));
  }

  async addEventParticipant(eventId: number, userId: number): Promise<EventParticipant> {
    const [participant] = await db
      .insert(eventParticipants)
      .values({ eventId, userId })
      .returning();
    return participant;
  }

  async getEventParticipants(eventId: number): Promise<EventParticipant[]> {
    return await db
      .select()
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId));
  }

  async getEventMatches(eventId: number): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.eventId, eventId))
      .orderBy(asc(matches.scheduledTime));
  }

  async createMatch(match: Partial<Match>): Promise<Match> {
    const [created] = await db
      .insert(matches)
      .values([match])
      .returning();
    return created;
  }

  async updateMatchScore(matchId: number, score: any, winnerId?: number): Promise<Match> {
    const updates: Partial<Match> = { 
      score, 
      updatedAt: new Date(),
      status: winnerId ? "completed" : "ongoing"
    };
    if (winnerId) {
      updates.winnerId = winnerId;
    }

    const [match] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, matchId))
      .returning();
    return match;
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const [created] = await db
      .insert(certificates)
      .values([cert])
      .returning();
    return created;
  }

  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.recipientId, userId))
      .orderBy(desc(certificates.issuedDate));
  }

  async verifyCertificate(blockchainHash: string): Promise<Certificate | undefined> {
    const [cert] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.blockchainHash, blockchainHash));
    return cert || undefined;
  }

  async getSportsCategories(): Promise<SportsCategory[]> {
    return await db
      .select()
      .from(sportsCategories)
      .where(eq(sportsCategories.isActive, true))
      .orderBy(asc(sportsCategories.name));
  }

  async createMaintenanceRecord(record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const [created] = await db
      .insert(maintenanceRecords)
      .values([record])
      .returning();
    return created;
  }

  async getFacilityMaintenanceRecords(facilityId: number): Promise<MaintenanceRecord[]> {
    return await db
      .select()
      .from(maintenanceRecords)
      .where(eq(maintenanceRecords.facilityId, facilityId))
      .orderBy(desc(maintenanceRecords.createdAt));
  }

  async createRevenueRecord(record: Partial<RevenueRecord>): Promise<RevenueRecord> {
    const [created] = await db
      .insert(revenueRecords)
      .values([record])
      .returning();
    return created;
  }

  async getFacilityRevenue(facilityId: number, startDate?: Date, endDate?: Date): Promise<RevenueRecord[]> {
    let query = db
      .select()
      .from(revenueRecords)
      .where(eq(revenueRecords.facilityId, facilityId));

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(revenueRecords.facilityId, facilityId),
          gte(revenueRecords.transactionDate, startDate),
          lte(revenueRecords.transactionDate, endDate)
        )
      );
    }

    return await query.orderBy(desc(revenueRecords.transactionDate));
  }

  // User approval system implementation
  async createUserApproval(approval: InsertUserApproval): Promise<UserApproval> {
    const [created] = await db
      .insert(userApprovals)
      .values([approval])
      .returning();
    return created;
  }

  async getPendingApprovals(reviewerId?: number): Promise<UserApproval[]> {
    let query = db
      .select()
      .from(userApprovals)
      .where(eq(userApprovals.status, "pending"));
    
    if (reviewerId) {
      query = query.where(
        and(
          eq(userApprovals.status, "pending"),
          eq(userApprovals.reviewedBy, reviewerId)
        )
      );
    }
    
    return await query.orderBy(desc(userApprovals.createdAt));
  }

  async getUserApprovals(userId: number): Promise<UserApproval[]> {
    return await db
      .select()
      .from(userApprovals)
      .where(eq(userApprovals.userId, userId))
      .orderBy(desc(userApprovals.createdAt));
  }

  async approveUserRequest(approvalId: number, reviewerId: number, comments?: string): Promise<UserApproval> {
    const [updated] = await db
      .update(userApprovals)
      .set({
        status: "approved",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewComments: comments
      })
      .where(eq(userApprovals.id, approvalId))
      .returning();
    return updated;
  }

  async rejectUserRequest(approvalId: number, reviewerId: number, reason: string): Promise<UserApproval> {
    const [updated] = await db
      .update(userApprovals)
      .set({
        status: "rejected",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewComments: reason
      })
      .where(eq(userApprovals.id, approvalId))
      .returning();
    return updated;
  }

  async updateUserApprovalStatus(userId: number, status: string, approvedBy?: number, reason?: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({
        approvalStatus: status,
        approvedBy: approvedBy,
        approvedAt: status === "approved" ? new Date() : undefined,
        rejectionReason: reason,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // Role and permission management implementation
  async createRole(role: InsertRole): Promise<Role> {
    const [created] = await db
      .insert(roles)
      .values(role)
      .returning();
    return created;
  }

  async getRoles(): Promise<Role[]> {
    return await db
      .select()
      .from(roles)
      .where(eq(roles.isActive, true))
      .orderBy(asc(roles.level));
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id));
    return role || undefined;
  }

  async updateRole(id: number, updates: Partial<Role>): Promise<Role> {
    const [updated] = await db
      .update(roles)
      .set(updates)
      .where(eq(roles.id, id))
      .returning();
    return updated;
  }

  async deleteRole(id: number): Promise<void> {
    await db
      .update(roles)
      .set({ isActive: false })
      .where(eq(roles.id, id));
  }

  async createPermission(permission: InsertPermission): Promise<Permission> {
    const [created] = await db
      .insert(permissions)
      .values(permission)
      .returning();
    return created;
  }

  async getPermissions(): Promise<Permission[]> {
    return await db
      .select()
      .from(permissions)
      .where(eq(permissions.isActive, true))
      .orderBy(asc(permissions.module), asc(permissions.action));
  }

  async getPermissionsByModule(module: string): Promise<Permission[]> {
    return await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.module, module),
          eq(permissions.isActive, true)
        )
      )
      .orderBy(asc(permissions.action));
  }

  async assignRolePermission(roleId: number, permissionId: number): Promise<RolePermission> {
    const [created] = await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .returning();
    return created;
  }

  async removeRolePermission(roleId: number, permissionId: number): Promise<void> {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.permissionId, permissionId)
        )
      );
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const result = await db
      .select()
      .from(permissions)
      .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
      .where(eq(rolePermissions.roleId, roleId));
    
    return result.map(row => row.permissions);
  }

  async assignUserRole(userId: number, roleId: number): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ roleId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        userType: users.userType,
        approvalStatus: users.approvalStatus,
        profileImageUrl: users.profileImageUrl,
        roleId: users.roleId,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      });
    return updated as User;
  }

  async getUserPermissions(userId: number): Promise<Permission[]> {
    const user = await this.getUser(userId);
    if (!user || !user.roleId) return [];
    
    return await this.getRolePermissions(user.roleId);
  }

  async checkUserPermission(userId: number, module: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.some(p => p.module === module && p.action === action);
  }

  // Module configuration implementation
  async createModuleConfig(config: InsertModuleConfiguration): Promise<ModuleConfiguration> {
    const [created] = await db
      .insert(moduleConfigurations)
      .values(config)
      .returning();
    return created;
  }

  async getModuleConfigs(): Promise<ModuleConfiguration[]> {
    return await db
      .select()
      .from(moduleConfigurations)
      .orderBy(asc(moduleConfigurations.moduleName));
  }

  async getModuleConfig(moduleName: string): Promise<ModuleConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(moduleConfigurations)
      .where(eq(moduleConfigurations.moduleName, moduleName));
    return config || undefined;
  }

  async updateModuleConfig(moduleName: string, updates: Partial<ModuleConfiguration>): Promise<ModuleConfiguration> {
    const [updated] = await db
      .update(moduleConfigurations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(moduleConfigurations.moduleName, moduleName))
      .returning();
    return updated;
  }

  async toggleModule(moduleName: string, isEnabled: boolean): Promise<ModuleConfiguration> {
    const [updated] = await db
      .update(moduleConfigurations)
      .set({ isEnabled, updatedAt: new Date() })
      .where(eq(moduleConfigurations.moduleName, moduleName))
      .returning();
    return updated;
  }

  // User Organizations
  async createUserOrganization(org: InsertUserOrganization): Promise<UserOrganization> {
    const [organization] = await db
      .insert(userOrganizations)
      .values(org)
      .returning();
    return organization;
  }

  async getUserOrganizations(userId: number): Promise<UserOrganization[]> {
    return await db.select().from(userOrganizations).where(eq(userOrganizations.ownerId, userId));
  }

  async getUserOrganization(id: number): Promise<UserOrganization | undefined> {
    const [org] = await db.select().from(userOrganizations).where(eq(userOrganizations.id, id));
    return org;
  }

  async updateUserOrganization(id: number, updates: Partial<UserOrganization>): Promise<UserOrganization> {
    const [org] = await db
      .update(userOrganizations)
      .set(updates)
      .where(eq(userOrganizations.id, id))
      .returning();
    return org;
  }

  async deleteUserOrganization(id: number): Promise<void> {
    await db.delete(userOrganizations).where(eq(userOrganizations.id, id));
  }

  // Organization Members
  async addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember> {
    const [newMember] = await db
      .insert(organizationMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async getOrganizationMembers(organizationId: number): Promise<OrganizationMember[]> {
    return await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, organizationId));
  }

  async removeOrganizationMember(organizationId: number, userId: number): Promise<void> {
    await db.delete(organizationMembers)
      .where(and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      ));
  }

  async updateMemberRole(organizationId: number, userId: number, role: string): Promise<OrganizationMember> {
    const [member] = await db
      .update(organizationMembers)
      .set({ role })
      .where(and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      ))
      .returning();
    return member;
  }

  async getUserMemberships(userId: number): Promise<OrganizationMember[]> {
    return await db.select()
    .from(organizationMembers)
    .leftJoin(userOrganizations, eq(organizationMembers.organizationId, userOrganizations.id))
    .where(eq(organizationMembers.userId, userId));
  }

  // Sports Achievements
  async createSportsAchievement(achievement: InsertSportsAchievement): Promise<SportsAchievement> {
    const [newAchievement] = await db
      .insert(sportsAchievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async getUserAchievements(userId: number): Promise<SportsAchievement[]> {
    return await db.select().from(sportsAchievements).where(eq(sportsAchievements.userId, userId));
  }

  async getSportsAchievement(id: number): Promise<SportsAchievement | undefined> {
    const [achievement] = await db.select().from(sportsAchievements).where(eq(sportsAchievements.id, id));
    return achievement;
  }

  async updateSportsAchievement(id: number, updates: Partial<SportsAchievement>): Promise<SportsAchievement> {
    const [achievement] = await db
      .update(sportsAchievements)
      .set(updates)
      .where(eq(sportsAchievements.id, id))
      .returning();
    return achievement;
  }

  async verifyAchievement(id: number, verifierId: number, blockchainHash: string): Promise<SportsAchievement> {
    const [achievement] = await db
      .update(sportsAchievements)
      .set({ 
        verificationStatus: 'verified',
        verifiedBy: verifierId,
        verifiedAt: new Date(),
        blockchainHash
      })
      .where(eq(sportsAchievements.id, id))
      .returning();
    return achievement;
  }
  
  // Sports Questionnaire
  async saveQuestionnaireResponse(response: InsertSportsQuestionnaireResponse): Promise<SportsQuestionnaireResponse> {
    const [savedResponse] = await db
      .insert(sportsQuestionnaireResponses)
      .values(response)
      .returning();
    return savedResponse;
  }

  async getUserQuestionnaireResponse(userId: number): Promise<SportsQuestionnaireResponse | undefined> {
    const [response] = await db.select().from(sportsQuestionnaireResponses).where(eq(sportsQuestionnaireResponses.userId, userId));
    return response;
  }

  async getOrganizationQuestionnaireResponse(organizationId: number): Promise<SportsQuestionnaireResponse | undefined> {
    const [response] = await db.select().from(sportsQuestionnaireResponses).where(eq(sportsQuestionnaireResponses.organizationId, organizationId));
    return response;
  }

  async updateUserSportsInterests(userId: number, interests: string[]): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ sportsInterests: interests })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Analytics
  async getSportsAnalytics(): Promise<{
    usersBySports: {[key: string]: number};
    organizationsBySports: {[key: string]: number};
    organizationsWithFacilities: {[key: string]: number};
    facilitiesReport: {[key: string]: {
      totalOrganizations: number;
      ownedFacilities: number;
      rentedFacilities: number;
      partnershipFacilities: number;
      totalCapacity: number;
      averageHourlyRate: number;
      facilitiesNeedingRepair: number;
    }};
    districtAnalytics: {[key: string]: {
      users: number;
      organizations: number;
      topSports: string[];
    }};
    leagueReadiness: {
      sport: string;
      readyOrganizations: number;
      totalCapacity: number;
      averageBookingNotice: number;
      maintenanceScore: number;
    }[];
    sponsorROIData: {
      sport: string;
      participatingUsers: number;
      organizationsWithFacilities: number;
      estimatedAudience: number;
      facilityCapacity: number;
      averageTicketRevenue: number;
    }[];
    totalUsers: number;
    totalOrganizations: number;
  }> {
    // Get real data from database
    const allUsers = await db.select().from(users);
    const allOrganizations = await db.select().from(userOrganizations);
    
    const usersBySports: {[key: string]: number} = {};
    const organizationsBySports: {[key: string]: number} = {};
    const organizationsWithFacilities: {[key: string]: number} = {};
    const facilitiesReport: {[key: string]: any} = {};
    const districtAnalytics: {[key: string]: any} = {};
    const sponsorROIData: any[] = [];
    
    // Process users by sports and districts
    allUsers.forEach(user => {
      const district = user.district || "Unknown";
      if (!districtAnalytics[district]) {
        districtAnalytics[district] = { users: 0, organizations: 0, sports: {} };
      }
      districtAnalytics[district].users++;
      
      if (user.sportsInterests) {
        user.sportsInterests.forEach(sport => {
          usersBySports[sport] = (usersBySports[sport] || 0) + 1;
          districtAnalytics[district].sports[sport] = (districtAnalytics[district].sports[sport] || 0) + 1;
        });
      }
    });
    
    // Process organizations and facility data
    allOrganizations.forEach(org => {
      const district = org.district || "Unknown";
      if (!districtAnalytics[district]) {
        districtAnalytics[district] = { users: 0, organizations: 0, sports: {} };
      }
      districtAnalytics[district].organizations++;
      
      if (org.sportsInterests) {
        org.sportsInterests.forEach(sport => {
          organizationsBySports[sport] = (organizationsBySports[sport] || 0) + 1;
          
          // Initialize facility report for sport
          if (!facilitiesReport[sport]) {
            facilitiesReport[sport] = {
              totalOrganizations: 0,
              ownedFacilities: 0,
              rentedFacilities: 0,
              partnershipFacilities: 0,
              totalCapacity: 0,
              totalHourlyRate: 0,
              rateCount: 0,
              facilitiesNeedingRepair: 0
            };
          }
          
          facilitiesReport[sport].totalOrganizations++;
          
          // For now, assume organizations have some facility capacity
          // This will be enhanced when facility management is fully implemented
          organizationsWithFacilities[sport] = (organizationsWithFacilities[sport] || 0) + 1;
          
          // Default facility tracking for basic analytics
          facilitiesReport[sport].ownedFacilities++;
          facilitiesReport[sport].totalCapacity += 100; // Default capacity
          facilitiesReport[sport].totalHourlyRate += 500; // Default rate
          facilitiesReport[sport].rateCount++;
        });
      }
    });
    
    // Calculate league readiness and sponsor ROI data
    const leagueReadiness: any[] = [];
    Object.keys(facilitiesReport).forEach(sport => {
      const report = facilitiesReport[sport];
      const readyOrganizations = organizationsWithFacilities[sport] || 0;
      const maintenanceScore = Math.max(0, 100 - (report.facilitiesNeedingRepair / Math.max(1, readyOrganizations)) * 100);
      
      report.averageHourlyRate = report.rateCount > 0 ? Math.round(report.totalHourlyRate / report.rateCount) : 0;
      
      leagueReadiness.push({
        sport,
        readyOrganizations,
        totalCapacity: report.totalCapacity,
        averageBookingNotice: 3,
        maintenanceScore: Math.round(maintenanceScore)
      });
      
      // Generate sponsor ROI data
      const participatingUsers = usersBySports[sport] || 0;
      const estimatedAudience = participatingUsers * 3;
      const averageTicketRevenue = report.averageHourlyRate * 0.1;
      
      sponsorROIData.push({
        sport,
        participatingUsers,
        organizationsWithFacilities: readyOrganizations,
        estimatedAudience,
        facilityCapacity: report.totalCapacity,
        averageTicketRevenue: Math.round(averageTicketRevenue)
      });
    });
    
    // Process district analytics top sports
    Object.keys(districtAnalytics).forEach(district => {
      const districtData = districtAnalytics[district];
      const sportCounts = districtData.sports;
      districtData.topSports = Object.entries(sportCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([sport]) => sport);
    });
    
    return {
      usersBySports,
      organizationsBySports,
      organizationsWithFacilities,
      facilitiesReport,
      districtAnalytics,
      leagueReadiness: leagueReadiness.sort((a, b) => b.readyOrganizations - a.readyOrganizations),
      sponsorROIData: sponsorROIData.sort((a, b) => b.estimatedAudience - a.estimatedAudience),
      totalUsers: allUsers.length,
      totalOrganizations: allOrganizations.length
    };
  }

  // Export methods for comprehensive Excel data
  async getAllUsersWithSports(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.createdAt));
  }

  async getAllOrganizationsWithDetails(): Promise<any[]> {
    const orgs = await db.select().from(userOrganizations).orderBy(asc(userOrganizations.createdAt));
    const orgsWithOwners = [];
    
    for (const org of orgs) {
      const owner = await this.getUser(org.ownerId);
      orgsWithOwners.push({
        ...org,
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
        ownerEmail: owner?.email || 'Unknown'
      });
    }
    
    return orgsWithOwners;
  }

  async getAllEvents(): Promise<any[]> {
    const eventsData = await db.select().from(events).orderBy(desc(events.createdAt));
    const eventsWithDetails = [];
    
    for (const event of eventsData) {
      const organizer = await this.getUser(event.organizerId);
      const organization = event.organizationId ? await this.getUserOrganization(event.organizationId) : null;
      const sport = event.sportId ? await db.select().from(sportsCategories).where(eq(sportsCategories.id, event.sportId)).then(res => res[0]) : null;
      
      eventsWithDetails.push({
        ...event,
        organizerName: organizer ? `${organizer.firstName} ${organizer.lastName}` : 'Unknown',
        organizationName: organization?.name || 'Independent',
        sportName: sport?.name || 'General',
        location: `${organization?.city || 'TBD'}, ${organization?.state || 'Kerala'}`
      });
    }
    
    return eventsWithDetails;
  }

  async getAllAchievements(): Promise<any[]> {
    const achievementsData = await db.select().from(sportsAchievements).orderBy(desc(sportsAchievements.createdAt));
    const achievementsWithUsers = [];
    
    for (const achievement of achievementsData) {
      const user = await this.getUser(achievement.userId);
      achievementsWithUsers.push({
        ...achievement,
        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User'
      });
    }
    
    return achievementsWithUsers;
  }

  // Organization tagging system implementation
  async getOrganizationTags(userId?: number, organizationId?: number): Promise<OrganizationTag[]> {
    let query = db.select().from(organizationTags);
    
    if (userId && organizationId) {
      query = query.where(and(eq(organizationTags.userId, userId), eq(organizationTags.organizationId, organizationId)));
    } else if (userId) {
      query = query.where(eq(organizationTags.userId, userId));
    } else if (organizationId) {
      query = query.where(eq(organizationTags.organizationId, organizationId));
    }
    
    return await query.orderBy(desc(organizationTags.createdAt));
  }

  async createOrganizationTag(tag: InsertOrganizationTag): Promise<OrganizationTag> {
    const [created] = await db
      .insert(organizationTags)
      .values(tag)
      .returning();
    return created;
  }

  async updateOrganizationTag(id: number, updates: Partial<OrganizationTag>): Promise<OrganizationTag> {
    const [updated] = await db
      .update(organizationTags)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizationTags.id, id))
      .returning();
    return updated;
  }

  async searchOrganizationsByName(searchTerm: string): Promise<UserOrganization[]> {
    const { ilike } = await import("drizzle-orm");
    return await db
      .select()
      .from(userOrganizations)
      .where(ilike(userOrganizations.name, `%${searchTerm}%`))
      .orderBy(asc(userOrganizations.name));
  }

  // Organization hierarchy implementation
  async getOrganizationHierarchy(parentId?: number, childId?: number): Promise<OrganizationHierarchy[]> {
    let query = db.select().from(organizationHierarchy);
    
    if (parentId && childId) {
      query = query.where(and(eq(organizationHierarchy.parentOrganizationId, parentId), eq(organizationHierarchy.childOrganizationId, childId)));
    } else if (parentId) {
      query = query.where(eq(organizationHierarchy.parentOrganizationId, parentId));
    } else if (childId) {
      query = query.where(eq(organizationHierarchy.childOrganizationId, childId));
    }
    
    return await query.orderBy(asc(organizationHierarchy.level));
  }

  async createOrganizationHierarchy(hierarchy: InsertOrganizationHierarchy): Promise<OrganizationHierarchy> {
    const [created] = await db
      .insert(organizationHierarchy)
      .values(hierarchy)
      .returning();
    return created;
  }

  async getOrganizationChildren(parentId: number): Promise<UserOrganization[]> {
    const hierarchies = await db
      .select({ childId: organizationHierarchy.childOrganizationId })
      .from(organizationHierarchy)
      .where(eq(organizationHierarchy.parentOrganizationId, parentId));
    
    const childIds = hierarchies.map(h => h.childId);
    if (childIds.length === 0) return [];
    
    const { inArray } = await import("drizzle-orm");
    return await db
      .select()
      .from(userOrganizations)
      .where(inArray(userOrganizations.id, childIds))
      .orderBy(asc(userOrganizations.name));
  }

  async getOrganizationParent(childId: number): Promise<UserOrganization | undefined> {
    const [hierarchy] = await db
      .select({ parentId: organizationHierarchy.parentOrganizationId })
      .from(organizationHierarchy)
      .where(eq(organizationHierarchy.childOrganizationId, childId));
    
    if (!hierarchy) return undefined;
    
    return await this.getUserOrganization(hierarchy.parentId);
  }

  async getAllUserOrganizations(): Promise<UserOrganization[]> {
    return await db
      .select()
      .from(userOrganizations)
      .where(eq(userOrganizations.isActive, true))
      .orderBy(asc(userOrganizations.name));
  }

  // ============================================================================
  // SPORTS SCORING SYSTEM IMPLEMENTATION
  // ============================================================================

  // Teams
  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db
      .insert(teams)
      .values(team)
      .returning();
    return newTeam;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamsBySport(sportCategoryId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.sportCategoryId, sportCategoryId));
  }

  async getTeamsByOrganization(organizationId: number): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.organizationId, organizationId));
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set(updates)
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  // Team Members
  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }

  async getUserTeams(userId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.userId, userId));
  }

  async updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember> {
    const [member] = await db
      .update(teamMembers)
      .set(updates)
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async removeTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Team Matches
  async createTeamMatch(match: InsertTeamMatch): Promise<TeamMatch> {
    const [newMatch] = await db
      .insert(teamMatches)
      .values(match)
      .returning();
    return newMatch;
  }

  async getTeamMatches(teamId?: number, eventId?: number): Promise<TeamMatch[]> {
    const { or } = await import("drizzle-orm");
    let query = db.select().from(teamMatches);
    
    if (teamId) {
      query = query.where(
        or(
          eq(teamMatches.homeTeamId, teamId),
          eq(teamMatches.awayTeamId, teamId)
        )
      );
    }
    
    if (eventId) {
      query = query.where(eq(teamMatches.eventId, eventId));
    }
    
    return await query;
  }

  async getTeamMatch(id: number): Promise<TeamMatch | undefined> {
    const [match] = await db.select().from(teamMatches).where(eq(teamMatches.id, id));
    return match;
  }

  async updateTeamMatch(id: number, updates: Partial<TeamMatch>): Promise<TeamMatch> {
    const [match] = await db
      .update(teamMatches)
      .set(updates)
      .where(eq(teamMatches.id, id))
      .returning();
    return match;
  }

  async getLiveMatches(): Promise<TeamMatch[]> {
    return await db.select().from(teamMatches).where(eq(teamMatches.status, 'live'));
  }

  // Match Events
  async addMatchEvent(event: InsertMatchEvent): Promise<MatchEvent> {
    const [newEvent] = await db
      .insert(matchEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getMatchEvents(matchId: number): Promise<MatchEvent[]> {
    return await db.select().from(matchEvents).where(eq(matchEvents.matchId, matchId));
  }

  async updateMatchEvent(id: number, updates: Partial<MatchEvent>): Promise<MatchEvent> {
    const [event] = await db
      .update(matchEvents)
      .set(updates)
      .where(eq(matchEvents.id, id))
      .returning();
    return event;
  }

  async deleteMatchEvent(id: number): Promise<void> {
    await db.delete(matchEvents).where(eq(matchEvents.id, id));
  }

  // Match Statistics
  async createPlayerMatchStats(stats: InsertPlayerMatchStats): Promise<PlayerMatchStats> {
    const [newStats] = await db
      .insert(playerMatchStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async getPlayerMatchStats(matchId: number, playerId?: number): Promise<PlayerMatchStats[]> {
    let query = db.select().from(playerMatchStats).where(eq(playerMatchStats.matchId, matchId));
    
    if (playerId) {
      query = query.where(eq(playerMatchStats.playerId, playerId));
    }
    
    return await query;
  }

  async updatePlayerMatchStats(id: number, updates: Partial<PlayerMatchStats>): Promise<PlayerMatchStats> {
    const [stats] = await db
      .update(playerMatchStats)
      .set(updates)
      .where(eq(playerMatchStats.id, id))
      .returning();
    return stats;
  }

  async createTeamMatchStats(stats: InsertTeamMatchStats): Promise<TeamMatchStats> {
    const [newStats] = await db
      .insert(teamMatchStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async getTeamMatchStats(matchId: number, teamId?: number): Promise<TeamMatchStats[]> {
    let query = db.select().from(teamMatchStats).where(eq(teamMatchStats.matchId, matchId));
    
    if (teamId) {
      query = query.where(eq(teamMatchStats.teamId, teamId));
    }
    
    return await query;
  }

  async updateTeamMatchStats(id: number, updates: Partial<TeamMatchStats>): Promise<TeamMatchStats> {
    const [stats] = await db
      .update(teamMatchStats)
      .set(updates)
      .where(eq(teamMatchStats.id, id))
      .returning();
    return stats;
  }

  // Standings
  async createStandings(standingsData: InsertStandings): Promise<Standings> {
    const [newStandings] = await db
      .insert(standings)
      .values(standingsData)
      .returning();
    return newStandings;
  }

  async getStandings(eventId: number, groupName?: string): Promise<Standings[]> {
    let query = db.select().from(standings).where(eq(standings.eventId, eventId));
    
    if (groupName) {
      query = query.where(eq(standings.groupName, groupName));
    }
    
    return await query.orderBy(desc(standings.points), desc(standings.goalDifference));
  }

  async updateStandings(id: number, updates: Partial<Standings>): Promise<Standings> {
    const [standing] = await db
      .update(standings)
      .set(updates)
      .where(eq(standings.id, id))
      .returning();
    return standing;
  }

  // Season Statistics
  async getPlayerSeasonStats(playerId: number, season?: string): Promise<PlayerSeasonStats[]> {
    let query = db.select().from(playerSeasonStats).where(eq(playerSeasonStats.playerId, playerId));
    
    if (season) {
      query = query.where(eq(playerSeasonStats.season, season));
    }
    
    return await query;
  }

  async createPlayerSeasonStats(stats: InsertPlayerSeasonStats): Promise<PlayerSeasonStats> {
    const [newStats] = await db
      .insert(playerSeasonStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async updatePlayerSeasonStats(playerId: number, teamId: number, season: string, updates: Partial<PlayerSeasonStats>): Promise<PlayerSeasonStats> {
    const [stats] = await db
      .update(playerSeasonStats)
      .set(updates)
      .where(and(
        eq(playerSeasonStats.playerId, playerId),
        eq(playerSeasonStats.teamId, teamId),
        eq(playerSeasonStats.season, season)
      ))
      .returning();
    return stats;
  }

  async getTeamSeasonStats(teamId: number, season?: string): Promise<TeamSeasonStats[]> {
    let query = db.select().from(teamSeasonStats).where(eq(teamSeasonStats.teamId, teamId));
    
    if (season) {
      query = query.where(eq(teamSeasonStats.season, season));
    }
    
    return await query;
  }

  async createTeamSeasonStats(stats: InsertTeamSeasonStats): Promise<TeamSeasonStats> {
    const [newStats] = await db
      .insert(teamSeasonStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async updateTeamSeasonStats(teamId: number, season: string, updates: Partial<TeamSeasonStats>): Promise<TeamSeasonStats> {
    const [stats] = await db
      .update(teamSeasonStats)
      .set(updates)
      .where(and(
        eq(teamSeasonStats.teamId, teamId),
        eq(teamSeasonStats.season, season)
      ))
      .returning();
    return stats;
  }

  // Match Commentary
  async addMatchCommentary(commentary: InsertMatchCommentary): Promise<MatchCommentary> {
    const [newCommentary] = await db
      .insert(matchCommentary)
      .values(commentary)
      .returning();
    return newCommentary;
  }

  async getMatchCommentary(matchId: number): Promise<MatchCommentary[]> {
    return await db.select().from(matchCommentary).where(eq(matchCommentary.matchId, matchId));
  }

  // Analytics operations
  async getAnalytics(): Promise<any> {
    const totalUsers = await db.select().from(users);
    const totalOrganizations = await db.select().from(userOrganizations);
    const totalEvents = await db.select().from(events);
    
    return {
      totalUsers: totalUsers.length,
      totalOrganizations: totalOrganizations.length,
      totalEvents: totalEvents.length,
      activeUsers: totalUsers.filter(u => u.isActive).length
    };
  }

  async getSportsAnalytics(): Promise<any> {
    const users = await db.select().from(users);
    const organizations = await db.select().from(userOrganizations);
    const events = await db.select().from(events);
    
    return {
      totalUsers: users.length,
      totalOrganizations: organizations.length,
      totalEvents: events.length,
      usersByDistrict: users.reduce((acc: any, user) => {
        const district = user.district || 'Unknown';
        acc[district] = (acc[district] || 0) + 1;
        return acc;
      }, {}),
      organizationsByType: organizations.reduce((acc: any, org) => {
        const type = org.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Advertisement operations
  async getAdvertisements(placement?: string): Promise<any[]> {
    // Mock advertisement data for demonstration
    const mockAds = [
      {
        id: 1,
        title: "Kerala Sports Council Training Camp",
        content: "Join our upcoming training camp for aspiring athletes",
        imageUrl: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Training+Camp",
        placement: "home_banner",
        isActive: true
      },
      {
        id: 2,
        title: "Sports Equipment Sale",
        content: "Get 30% off on all sports equipment this month",
        imageUrl: "https://via.placeholder.com/300x200/059669/FFFFFF?text=Equipment+Sale",
        placement: "sidebar",
        isActive: true
      }
    ];
    
    if (placement) {
      return mockAds.filter(ad => ad.placement === placement);
    }
    return mockAds;
  }

  async createAdvertisement(advertisement: any): Promise<any> {
    // Mock implementation - would use database in real app
    return {
      id: Math.floor(Math.random() * 1000),
      ...advertisement,
      createdAt: new Date(),
      isActive: true
    };
  }

  // Enhanced dashboard functionality implementation
  async searchByWard(params: { query?: string; district?: string; ward?: string; type?: string }): Promise<any[]> {
    const results: any[] = [];
    
    try {
      // Search users
      if (!params.type || params.type === 'all' || params.type === 'user') {
        const userResults = await db.select().from(users);
        results.push(...userResults.map(u => ({ ...u, type: 'user' })));
      }
      
      // Search organizations
      if (!params.type || params.type === 'all' || params.type === 'organization') {
        const orgResults = await db.select().from(organizations);
        results.push(...orgResults.map(o => ({ ...o, type: 'organization' })));
      }
      
      // Search facilities
      if (!params.type || params.type === 'all' || params.type === 'facility') {
        const facilityResults = await db.select().from(facilities);
        results.push(...facilityResults.map(f => ({ ...f, type: 'facility' })));
      }
      
      // Search events
      if (!params.type || params.type === 'all' || params.type === 'event') {
        const eventResults = await db.select().from(events);
        results.push(...eventResults.map(e => ({ ...e, type: 'event' })));
      }
      
      return results;
    } catch (error) {
      console.error('Error in ward search:', error);
      return [];
    }
  }

  async getWardsByDistrict(district: string): Promise<string[]> {
    const wardsByDistrict: { [key: string]: string[] } = {
      'thiruvananthapuram': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'],
      'kollam': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'],
      'ernakulam': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6'],
      'kozhikode': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'],
      'thrissur': ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'],
    };
    
    return wardsByDistrict[district.toLowerCase()] || [];
  }

  async getProfile(type: string, id: number): Promise<any> {
    try {
      switch (type) {
        case 'user':
          return await this.getUser(id);
        case 'organization':
          return await this.getOrganization(id);
        case 'facility':
          return await this.getFacility(id);
        case 'event':
          return await this.getEvent(id);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async getAchievements(type: string, id: number): Promise<any[]> {
    return [
      {
        id: 1,
        title: "State Championship Winner",
        description: "Won the Kerala State Football Championship 2024",
        date: "2024-03-15",
        verificationStatus: "verified",
        category: "tournament"
      },
      {
        id: 2,
        title: "Best Player Award", 
        description: "Awarded best player in the regional tournament",
        date: "2024-02-10",
        verificationStatus: "pending",
        category: "award"
      }
    ];
  }

  async getEntityEvents(type: string, id: number): Promise<any[]> {
    try {
      return await this.getEvents();
    } catch (error) {
      console.error('Error getting entity events:', error);
      return [];
    }
  }

  async getNotifications(type: string, id: number): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Event Registration Approved",
        message: "Your registration for Kerala State Championship has been approved",
        createdAt: new Date().toISOString(),
        hasLink: true
      },
      {
        id: 2,
        title: "Profile Verification Complete",
        message: "Your profile has been successfully verified",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        hasLink: false
      }
    ];
  }

  async getReviews(type: string, id: number): Promise<any[]> {
    return [
      {
        id: 1,
        rating: 5,
        comment: "Excellent sports facility with great amenities",
        reviewerName: "Arjun Kumar",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        rating: 4,
        comment: "Good organization, well-managed events",
        reviewerName: "Priya Nair",
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

  async getPendingRequests(type: string, id: number): Promise<any[]> {
    return [
      {
        id: 1,
        title: "Team Membership Request",
        description: "Request to join Kerala Warriors team",
        requesterName: "Rahul Sharma",
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Facility Booking Request",
        description: "Request to book facility for weekend training",
        requesterName: "Sports Academy Kerala",
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ];
  }

  async getEntityAdvertisements(type: string, id: number): Promise<any[]> {
    try {
      return await this.getAdvertisements();
    } catch (error) {
      console.error('Error getting entity advertisements:', error);
      return [];
    }
  }

  async getEcommerceProducts(): Promise<any[]> {
    return [
      {
        id: 1,
        name: "Kerala Warriors Jersey",
        description: "Official team jersey with latest design",
        price: 1500,
        image: null,
        category: "apparel"
      },
      {
        id: 2,
        name: "Professional Football",
        description: "FIFA approved football for tournaments",
        price: 2500,
        image: null,
        category: "equipment"
      },
      {
        id: 3,
        name: "Sports Training Kit",
        description: "Complete training kit with cones, markers and whistle",
        price: 3500,
        image: null,
        category: "training"
      },
      {
        id: 4,
        name: "Custom Team Banner",
        description: "Personalized team banner for events",
        price: 800,
        image: null,
        category: "accessories"
      }
    ];
  }

  // Sports content operations
  async getSportsContent(filters: { sportCategoryId?: number, ageGroup?: string, contentType?: string }): Promise<any[]> {
    // Mock sports content data
    const mockContent = [
      {
        id: 1,
        title: "Basketball Training Tips",
        content: "Master the fundamentals of basketball with these essential training tips",
        imageUrl: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Basketball+Tips",
        contentType: "training",
        sportCategoryId: 1,
        ageGroup: "youth"
      },
      {
        id: 2,
        title: "Football Fitness Routine",
        content: "Build endurance and strength with this comprehensive football fitness routine",
        imageUrl: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Football+Fitness",
        contentType: "fitness",
        sportCategoryId: 2,
        ageGroup: "adult"
      }
    ];
    
    let filteredContent = mockContent;
    
    if (filters.sportCategoryId) {
      filteredContent = filteredContent.filter(c => c.sportCategoryId === filters.sportCategoryId);
    }
    if (filters.ageGroup) {
      filteredContent = filteredContent.filter(c => c.ageGroup === filters.ageGroup);
    }
    if (filters.contentType) {
      filteredContent = filteredContent.filter(c => c.contentType === filters.contentType);
    }
    
    return filteredContent;
  }

  // Player evaluation operations
  async getPlayerEvaluations(): Promise<any[]> {
    // Mock player evaluation data
    return [
      {
        id: 1,
        playerName: "Arjun Kumar",
        sport: "Basketball",
        overallRating: 8.5,
        evaluatorName: "Coach Sharma",
        evaluationDate: new Date(),
        strengths: "Excellent shooting accuracy, good court vision",
        weaknesses: "Needs improvement in defensive positioning",
        status: "approved"
      }
    ];
  }

  async getUserPlayerEvaluations(userId: number): Promise<any[]> {
    // Mock user evaluations
    return [
      {
        id: 1,
        playerId: userId,
        sport: "Basketball",
        overallRating: 7.8,
        evaluatorName: "Coach Reddy",
        evaluationDate: new Date(),
        technicalSkills: { shooting: 8, dribbling: 7, passing: 8 },
        physicalAttributes: { speed: 7, strength: 6, agility: 8 },
        recommendations: "Focus on strength training and defensive techniques"
      }
    ];
  }

  async createPlayerEvaluation(evaluation: any): Promise<any> {
    // Mock implementation
    return {
      id: Math.floor(Math.random() * 1000),
      ...evaluation,
      createdAt: new Date(),
      isApproved: false
    };
  }

  async approvePlayerEvaluation(evaluationId: number): Promise<any> {
    // Mock implementation
    return {
      id: evaluationId,
      isApproved: true,
      approvedAt: new Date()
    };
  }

  // Enhanced search operations
  async enhancedSearch(params: { 
    query?: string, 
    type?: string, 
    location?: string, 
    sport?: string, 
    district?: string, 
    ward?: string 
  }): Promise<any> {
    const { query, type, location, sport, district, ward } = params;
    
    let results: any = {
      events: [],
      facilities: [],
      users: [],
      organizations: []
    };

    // Search events
    if (!type || type === 'events') {
      const allEvents = await db.select().from(events);
      results.events = allEvents.filter((event: any) => {
        const matchesQuery = !query || event.name?.toLowerCase().includes(query.toLowerCase());
        const matchesLocation = !location || event.location?.toLowerCase().includes(location.toLowerCase());
        const matchesSport = !sport || event.sportName?.toLowerCase().includes(sport.toLowerCase());
        return matchesQuery && matchesLocation && matchesSport;
      });
    }

    // Search organizations
    if (!type || type === 'organizations') {
      const allOrgs = await db.select().from(userOrganizations);
      results.organizations = allOrgs.filter((org: any) => {
        const matchesQuery = !query || org.name?.toLowerCase().includes(query.toLowerCase());
        const matchesDistrict = !district || org.district?.toLowerCase().includes(district.toLowerCase());
        return matchesQuery && matchesDistrict;
      });
    }

    // Search users
    if (!type || type === 'users') {
      const allUsers = await db.select().from(users);
      results.users = allUsers.filter((user: any) => {
        const matchesQuery = !query || 
          user.firstName?.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(query.toLowerCase());
        const matchesDistrict = !district || user.district?.toLowerCase().includes(district.toLowerCase());
        return matchesQuery && matchesDistrict;
      }).map(user => ({
        ...user,
        password: undefined // Remove password from search results
      }));
    }

    return results;
  }
}

export const storage = new DatabaseStorage();
