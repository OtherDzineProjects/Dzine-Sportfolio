import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // athlete, coach, organization, facility_manager
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected, suspended
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  roleId: integer("role_id"),
  subscriptionTier: text("subscription_tier").default("basic"), // basic, pro, enterprise
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, trial
  subscriptionExpiry: timestamp("subscription_expires_at"),
  toolAccess: jsonb("tool_access").default({}), // {"facility": true, "fixtures": false, "scoring": true}
  blockchainWallet: text("blockchain_wallet"),
  // Profile information
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  dateOfBirth: date("date_of_birth"),
  profileImageUrl: text("profile_image_url"),
  // Education
  educationQualification: text("education_qualification"),
  institution: text("institution"),
  graduationYear: integer("graduation_year"),
  // Career
  currentPosition: text("current_position"),
  currentOrganization: text("current_organization"),
  workExperience: integer("work_experience"),
  // Sports interests with enhanced Kerala system
  sportsInterests: jsonb("sports_interests").$type<string[]>(),
  sportCategories: jsonb("sport_categories").$type<{primary: string[], trackAndField?: string[]}>(),
  district: text("district"), // Kerala districts
  skillLevel: text("skill_level"), // beginner, intermediate, professional
  sportsGoal: text("sports_goal"), // fitness, competition, recreation
  preferredVenue: text("preferred_venue"), // backwaters, indoor_stadium, local_ground
  completedQuestionnaire: boolean("completed_questionnaire").default(false),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Roles and permissions system
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  level: integer("level").notNull(), // 1=user, 2=moderator, 3=admin, 4=super_admin
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  module: text("module").notNull(), // facility, fixtures, scoring, user_management, etc
  action: text("action").notNull(), // create, read, update, delete, approve
  isActive: boolean("is_active").default(true)
});

export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const userApprovals = pgTable("user_approvals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  requestType: text("request_type").notNull(), // registration, role_change, subscription_upgrade
  requestData: jsonb("request_data"),
  status: text("status").default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewComments: text("review_comments"),
  createdAt: timestamp("created_at").defaultNow()
});

export const moduleConfigurations = pgTable("module_configurations", {
  id: serial("id").primaryKey(),
  moduleName: text("module_name").notNull().unique(),
  isEnabled: boolean("is_enabled").default(true),
  configuration: jsonb("configuration").default({}),
  requiredPermissions: jsonb("required_permissions").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Sports categories
export const sportsCategories = pgTable("sports_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // olympic, traditional_indian, other
  description: text("description"),
  icon: text("icon"),
  isActive: boolean("is_active").default(true)
});

// Athlete profiles
export const athleteProfiles = pgTable("athlete_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  height: decimal("height", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  primarySport: integer("primary_sport").references(() => sportsCategories.id),
  secondarySports: jsonb("secondary_sports").default([]),
  coachId: integer("coach_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  achievements: jsonb("achievements").default([]),
  blockchainHash: text("blockchain_hash"),
  profilePhoto: text("profile_photo"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organizations
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // club, school, college, state_council, national_federation
  registrationNumber: text("registration_number"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  adminUserId: integer("admin_user_id").references(() => users.id),
  logo: text("logo"),
  website: text("website"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Sports facilities
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // court, pool, field, gym, track, etc.
  sports: jsonb("sports").default([]), // array of sport category IDs
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  managerId: integer("manager_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  capacity: integer("capacity"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  amenities: jsonb("amenities").default([]),
  photos: jsonb("photos").default([]),
  operatingHours: jsonb("operating_hours").default({}),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalBookings: integer("total_bookings").default(0),
  coordinates: jsonb("coordinates"), // {lat, lng}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Facility bookings
export const facilityBookings = pgTable("facility_bookings", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  purpose: text("purpose"), // training, event, tournament, etc.
  status: text("status").default("confirmed"), // pending, confirmed, cancelled, completed
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded
  paymentId: text("payment_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Events/Tournaments
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sportId: integer("sport_id").references(() => sportsCategories.id).notNull(),
  organizerId: integer("organizer_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  facilityId: integer("facility_id").references(() => facilities.id),
  eventType: text("event_type").notNull(), // tournament, championship, friendly, training
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  maxParticipants: integer("max_participants"),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).default("0"),
  rules: jsonb("rules").default({}),
  status: text("status").default("upcoming"), // upcoming, ongoing, completed, cancelled
  isPublic: boolean("is_public").default(true),
  banner: text("banner"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Event participants
export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  registrationDate: timestamp("registration_date").defaultNow(),
  status: text("status").default("registered"), // registered, confirmed, withdrawn, disqualified
  paymentStatus: text("payment_status").default("pending"),
  teamName: text("team_name"),
  category: text("category"), // age group, skill level, etc.
  seedNumber: integer("seed_number"),
  notes: text("notes")
});

// Matches/Fixtures
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  facilityId: integer("facility_id").references(() => facilities.id),
  round: text("round"), // qualification, round1, semifinal, final, etc.
  matchNumber: integer("match_number"),
  participant1Id: integer("participant1_id").references(() => eventParticipants.id),
  participant2Id: integer("participant2_id").references(() => eventParticipants.id),
  scheduledTime: timestamp("scheduled_time"),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  status: text("status").default("scheduled"), // scheduled, ongoing, completed, cancelled
  winnerId: integer("winner_id").references(() => eventParticipants.id),
  score: jsonb("score").default({}), // flexible scoring format
  notes: text("notes"),
  refereeId: integer("referee_id").references(() => users.id),
  courtNumber: text("court_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Digital certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  title: text("title").notNull(),
  description: text("description"),
  achievementType: text("achievement_type").notNull(), // winner, participant, completion, skill
  position: integer("position"), // 1st, 2nd, 3rd place
  issuedBy: integer("issued_by").references(() => organizations.id).notNull(),
  issuedDate: timestamp("issued_date").defaultNow(),
  blockchainHash: text("blockchain_hash").notNull(),
  certificateData: jsonb("certificate_data").default({}),
  isValid: boolean("is_valid").default(true),
  templateId: text("template_id"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow()
});

// Maintenance records
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  requestedBy: integer("requested_by").references(() => users.id).notNull(),
  maintenanceType: text("maintenance_type").notNull(), // routine, repair, upgrade, cleaning
  description: text("description").notNull(),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("pending"), // pending, in_progress, completed, cancelled
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Revenue analytics
export const revenueRecords = pgTable("revenue_records", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  source: text("source").notNull(), // booking, event, subscription, merchandise
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("INR"),
  transactionDate: timestamp("transaction_date").defaultNow(),
  description: text("description"),
  bookingId: integer("booking_id").references(() => facilityBookings.id),
  eventId: integer("event_id").references(() => events.id),
  createdAt: timestamp("created_at").defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id]
  }),
  approver: one(users, {
    fields: [users.approvedBy],
    references: [users.id]
  }),
  approvedUsers: many(users),
  athleteProfile: one(athleteProfiles, {
    fields: [users.id],
    references: [athleteProfiles.userId]
  }),
  managedFacilities: many(facilities),
  bookings: many(facilityBookings),
  organizedEvents: many(events),
  eventParticipations: many(eventParticipants),
  certificates: many(certificates),
  maintenanceRequests: many(maintenanceRecords),
  approvalRequests: many(userApprovals),
  reviewedApprovals: many(userApprovals),
  // New relations
  ownedOrganizations: many(userOrganizations),
  organizationMemberships: many(organizationMembers),
  achievements: many(sportsAchievements),
  questionnaireResponses: many(sportsQuestionnaireResponses),
  verifiedAchievements: many(sportsAchievements) // For verifiedBy field
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(rolePermissions)
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions)
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id]
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id]
  })
}));

export const userApprovalsRelations = relations(userApprovals, ({ one }) => ({
  user: one(users, {
    fields: [userApprovals.userId],
    references: [users.id]
  }),
  reviewer: one(users, {
    fields: [userApprovals.reviewedBy],
    references: [users.id]
  })
}));

export const athleteProfilesRelations = relations(athleteProfiles, ({ one }) => ({
  user: one(users, {
    fields: [athleteProfiles.userId],
    references: [users.id]
  }),
  primarySportCategory: one(sportsCategories, {
    fields: [athleteProfiles.primarySport],
    references: [sportsCategories.id]
  }),
  coach: one(users, {
    fields: [athleteProfiles.coachId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [athleteProfiles.organizationId],
    references: [organizations.id]
  })
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  admin: one(users, {
    fields: [organizations.adminUserId],
    references: [users.id]
  }),
  facilities: many(facilities),
  events: many(events),
  athletes: many(athleteProfiles),
  certificates: many(certificates)
}));

export const facilitiesRelations = relations(facilities, ({ one, many }) => ({
  manager: one(users, {
    fields: [facilities.managerId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [facilities.organizationId],
    references: [organizations.id]
  }),
  bookings: many(facilityBookings),
  events: many(events),
  maintenanceRecords: many(maintenanceRecords)
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  sport: one(sportsCategories, {
    fields: [events.sportId],
    references: [sportsCategories.id]
  }),
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id]
  }),
  facility: one(facilities, {
    fields: [events.facilityId],
    references: [facilities.id]
  }),
  participants: many(eventParticipants),
  matches: many(matches),
  certificates: many(certificates)
}));

// User Organizations
export const userOrganizations = pgTable("user_organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  organizationType: text("organization_type").notNull(), // sports_club, academy, school, college, etc.
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  // Enhanced sports interests and facilities
  sportsInterests: jsonb("sports_interests").$type<string[]>(),
  facilityAvailability: jsonb("facility_availability").$type<{
    sport: string;
    hasVenue: boolean;
    venueType?: 'owned' | 'rented' | 'partnership';
    capacity?: number;
    hourlyRate?: number;
    availableHours?: string[];
    equipment?: string[];
    maintenanceStatus?: 'excellent' | 'good' | 'fair' | 'needs_repair';
    bookingAdvanceNotice?: number;
    specialFeatures?: string[];
  }[]>(),
  // Kerala district for organization matching
  district: text("district"),
  completedQuestionnaire: boolean("completed_questionnaire").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organization Members
export const organizationMembers = pgTable("organization_members", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // owner, admin, member, coach, etc.
  permissions: jsonb("permissions").$type<string[]>(),
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});

// Sports Achievements with blockchain verification
export const sportsAchievements = pgTable("sports_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  sport: text("sport").notNull(),
  category: text("category"), // national, state, district, etc.
  eventName: text("event_name"),
  position: text("position"), // gold, silver, bronze, participant
  achievementDate: date("achievement_date"),
  organizingBody: text("organizing_body"),
  certificateUrl: text("certificate_url"),
  // Blockchain verification
  blockchainHash: text("blockchain_hash").unique(),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Sports Questionnaire Responses
export const sportsQuestionnaireResponses = pgTable("sports_questionnaire_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => userOrganizations.id),
  responseType: text("response_type").notNull(), // user, organization
  responses: jsonb("responses").$type<{[key: string]: string[]}>(), // {"athletics": ["track_100m", "field_long_jump"], "swimming": ["freestyle", "butterfly"]}
  facilityResponses: jsonb("facility_responses").$type<{[key: string]: boolean}>(), // Only for organizations
  completedAt: timestamp("completed_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Relations for new tables
export const userOrganizationsRelations = relations(userOrganizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [userOrganizations.ownerId],
    references: [users.id]
  }),
  members: many(organizationMembers),
  questionnaireResponses: many(sportsQuestionnaireResponses)
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(userOrganizations, {
    fields: [organizationMembers.organizationId],
    references: [userOrganizations.id]
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id]
  })
}));

export const sportsAchievementsRelations = relations(sportsAchievements, ({ one }) => ({
  user: one(users, {
    fields: [sportsAchievements.userId],
    references: [users.id]
  }),
  verifier: one(users, {
    fields: [sportsAchievements.verifiedBy],
    references: [users.id]
  })
}));

export const sportsQuestionnaireResponsesRelations = relations(sportsQuestionnaireResponses, ({ one }) => ({
  user: one(users, {
    fields: [sportsQuestionnaireResponses.userId],
    references: [users.id]
  }),
  organization: one(userOrganizations, {
    fields: [sportsQuestionnaireResponses.organizationId],
    references: [userOrganizations.id]
  })
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAthleteProfileSchema = createInsertSchema(athleteProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertFacilityBookingSchema = createInsertSchema(facilityBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true
});

export const insertPermissionSchema = createInsertSchema(permissions);

export const insertUserApprovalSchema = createInsertSchema(userApprovals).omit({
  id: true,
  createdAt: true
});

export const insertModuleConfigurationSchema = createInsertSchema(moduleConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// New insert schemas
export const insertUserOrganizationSchema = createInsertSchema(userOrganizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).omit({
  id: true,
  joinedAt: true
});

export const insertSportsAchievementSchema = createInsertSchema(sportsAchievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verifiedAt: true,
  verifiedBy: true
});

export const insertSportsQuestionnaireResponseSchema = createInsertSchema(sportsQuestionnaireResponses).omit({
  id: true,
  completedAt: true,
  updatedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type InsertAthleteProfile = z.infer<typeof insertAthleteProfileSchema>;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type Facility = typeof facilities.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type FacilityBooking = typeof facilityBookings.$inferSelect;
export type InsertFacilityBooking = z.infer<typeof insertFacilityBookingSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type SportsCategory = typeof sportsCategories.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type RevenueRecord = typeof revenueRecords.$inferSelect;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export type RolePermission = typeof rolePermissions.$inferSelect;

export type UserApproval = typeof userApprovals.$inferSelect;
export type InsertUserApproval = z.infer<typeof insertUserApprovalSchema>;

export type ModuleConfiguration = typeof moduleConfigurations.$inferSelect;
export type InsertModuleConfiguration = z.infer<typeof insertModuleConfigurationSchema>;

// New types
export type UserOrganization = typeof userOrganizations.$inferSelect;
export type InsertUserOrganization = z.infer<typeof insertUserOrganizationSchema>;

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;

export type SportsAchievement = typeof sportsAchievements.$inferSelect;
export type InsertSportsAchievement = z.infer<typeof insertSportsAchievementSchema>;

export type SportsQuestionnaireResponse = typeof sportsQuestionnaireResponses.$inferSelect;
export type InsertSportsQuestionnaireResponse = z.infer<typeof insertSportsQuestionnaireResponseSchema>;
