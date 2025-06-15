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
  type RevenueRecord
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
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
    return await db.select().from(organizations).orderBy(asc(organizations.name));
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
      .values(facility)
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
      .values(booking)
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
      .values(event)
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
      .values(match)
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
      .values(cert)
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
      .values(record)
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
      .values(record)
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
}

export const storage = new DatabaseStorage();
