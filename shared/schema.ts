import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import verification tables
export * from "./verification-schema";

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
  // 1. Personal Profile
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  dateOfBirth: date("date_of_birth"),
  profileImageUrl: text("profile_image_url"),
  photoVerificationStatus: text("photo_verification_status").default("unverified"), // verified, pending, rejected, unverified
  lastPhotoVerification: timestamp("last_photo_verification"),
  nextPhotoVerificationDue: timestamp("next_photo_verification_due"),
  fatherName: text("father_name"),
  motherName: text("mother_name"),
  fatherOccupation: text("father_occupation"),
  motherOccupation: text("mother_occupation"),
  emergencyContact: text("emergency_contact"),
  emergencyContactRelation: text("emergency_contact_relation"),
  
  // 2. Career Profile
  educationQualification: text("education_qualification"),
  institution: text("institution"),
  graduationYear: integer("graduation_year"),
  currentPosition: text("current_position"),
  currentOrganization: text("current_organization"),
  workExperience: integer("work_experience"),
  skills: jsonb("skills").$type<Array<{
    name: string;
    category: string; // sports, IT, academic, professional
    level: string; // beginner, intermediate, advanced, expert
    isVerified: boolean;
    verifiedBy?: string;
    verificationDate?: string;
    certificates?: string[];
  }>>(),
  
  // 3. Medical Profile
  height: decimal("height", { precision: 5, scale: 2 }), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  bmi: decimal("bmi", { precision: 4, scale: 2 }),
  bloodGroup: text("blood_group"),
  allergies: jsonb("allergies").$type<string[]>(),
  medicalConditions: jsonb("medical_conditions").$type<Array<{
    condition: string;
    severity: string; // mild, moderate, severe
    medications?: string[];
    doctorNotes?: string;
  }>>(),
  injuries: jsonb("injuries").$type<Array<{
    injury: string;
    date: string;
    recovered: boolean;
    restrictions?: string[];
  }>>(),
  lastMedicalCheckup: date("last_medical_checkup"),
  medicalClearance: boolean("medical_clearance").default(false),
  
  // 4. Guardian System (for under-18 and elderly support)
  isMinor: boolean("is_minor").default(false),
  guardianId: integer("guardian_id"), // References another user who is the guardian
  dependents: jsonb("dependents").$type<Array<{
    id: number;
    name: string;
    relation: string; // child, elderly_parent, spouse
    dateOfBirth: string;
    needsSupport: boolean;
  }>>(),
  // Sports interests with enhanced Kerala system
  sportsInterests: jsonb("sports_interests").$type<string[]>(),
  sportCategories: jsonb("sport_categories").$type<{primary: string[], trackAndField?: string[]}>(),
  district: text("district"), // Kerala districts
  lsgd: text("lsgd"), // Local Self Government Division (Ward/Corporation/Municipality)
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
  organizationType: text("organization_type"),
  registrationNumber: text("registration_number"),
  licenseNumber: text("license_number"),
  logo: text("logo"),
  verificationStatus: text("verification_status").default("pending"), // verified, pending, rejected
  lastVerificationDate: timestamp("last_verification_date"),
  nextVerificationDue: timestamp("next_verification_due"),
  verificationDocuments: jsonb("verification_documents").$type<string[]>(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  establishedYear: integer("established_year"),
  facilityCount: integer("facility_count").default(0),
  memberCount: integer("member_count").default(0),
  sportsInterests: jsonb("sports_interests").$type<string[]>(),
  facilityAvailability: jsonb("facility_availability").$type<string[]>(),
  district: text("district"),
  lsgd: text("lsgd"),
  ownerId: integer("owner_id").references(() => users.id),
  adminUserId: integer("admin_user_id").references(() => users.id),
  isVerified: boolean("is_verified").default(false),
  status: text("status").default("active"), // active, inactive
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
  // Kerala geo-location system
  state: text("state").default("Kerala"),
  district: varchar("district", { length: 100 }),
  city: text("city"), // Keep existing city field
  lsgd: text("lsgd"), // Local Self Government (Corporation/Municipality/Panchayat)
  lsgdType: text("lsgd_type"), // Corporation, Municipality, Panchayat
  address: text("address"),
  pincode: text("pincode"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  // Verification status for organization approval
  verificationStatus: text("verification_status").default("submitted"), // submitted, pending, verified, rejected
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  verificationComments: text("verification_comments"),
  // Enhanced sports interests and facilities
  sportsInterests: jsonb("sports_interests").$type<string[]>(),
  availableFacilities: jsonb("available_facilities").$type<string[]>(), // Keep existing field
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
    location?: {
      district?: string;
      lsgd?: string;
      address?: string;
    };
  }[]>(),
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

// Organization tagging system for users to follow/tag organizations
export const organizationTags = pgTable("organization_tags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  tagType: text("tag_type").notNull(), // 'follow', 'member_request', 'notification_subscribe'
  status: text("status").default("active"), // 'active', 'pending', 'approved', 'rejected'
  requestedAt: timestamp("requested_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organization hierarchy for state -> district structure
export const organizationHierarchy = pgTable("organization_hierarchy", {
  id: serial("id").primaryKey(),
  parentOrganizationId: integer("parent_organization_id").references(() => userOrganizations.id).notNull(),
  childOrganizationId: integer("child_organization_id").references(() => userOrganizations.id).notNull(),
  hierarchyType: text("hierarchy_type").notNull(), // 'state_district', 'association_branch', 'parent_subsidiary'
  level: integer("level").default(1), // 1 = direct child, 2 = grandchild, etc.
  createdAt: timestamp("created_at").defaultNow()
});

export type OrganizationTag = typeof organizationTags.$inferSelect;
export type InsertOrganizationTag = typeof organizationTags.$inferInsert;
export type OrganizationHierarchy = typeof organizationHierarchy.$inferSelect;
export type InsertOrganizationHierarchy = typeof organizationHierarchy.$inferInsert;

// ============================================================================
// ASSOCIATION MANAGEMENT SYSTEM - TOURNAMENTS, SCORING & PLAYER EVALUATION
// ============================================================================

// Tournaments managed by associations
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  sportId: integer("sport_id").references(() => sportsCategories.id).notNull(),
  tournamentType: text("tournament_type").notNull(), // "district", "state", "inter_district", "league"
  format: text("format").notNull(), // "knockout", "round_robin", "league", "hybrid"
  ageCategory: text("age_category"), // "U-12", "U-15", "U-18", "U-21", "Senior"
  gender: text("gender"), // "male", "female", "mixed"
  maxTeams: integer("max_teams"),
  maxPlayersPerTeam: integer("max_players_per_team"),
  registrationFee: decimal("registration_fee", { precision: 10, scale: 2 }).default("0"),
  prizeMoney: decimal("prize_money", { precision: 10, scale: 2 }).default("0"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  venue: text("venue"),
  rules: jsonb("rules").default({}),
  status: text("status").default("upcoming"), // "upcoming", "registration_open", "ongoing", "completed", "cancelled"
  isPublic: boolean("is_public").default(true),
  requiresApproval: boolean("requires_approval").default(true),
  certificateTemplate: text("certificate_template"),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Tournament registrations for teams/clubs
export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  teamName: text("team_name").notNull(),
  coachId: integer("coach_id").references(() => users.id),
  managerContact: text("manager_contact"),
  registrationDate: timestamp("registration_date").defaultNow(),
  status: text("status").default("pending"), // "pending", "approved", "rejected", "withdrawn"
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  paymentStatus: text("payment_status").default("pending"), // "pending", "paid", "refunded"
  paymentReference: text("payment_reference"),
  documents: jsonb("documents").default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Players registered for tournaments
export const tournamentPlayers = pgTable("tournament_players", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").references(() => tournamentRegistrations.id).notNull(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  playerName: text("player_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  position: text("position"), // player position/role in the sport
  jerseyNumber: integer("jersey_number"),
  isPlaying: boolean("is_playing").default(true), // true for main team, false for substitutes
  isCaptain: boolean("is_captain").default(false),
  medicalClearance: boolean("medical_clearance").default(false),
  documents: jsonb("documents").default([]), // ID proof, medical certificate, etc.
  emergencyContact: text("emergency_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Fixtures/Match Schedule
export const fixtures = pgTable("fixtures", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  matchNumber: integer("match_number").notNull(),
  round: text("round").notNull(), // "Round 1", "Quarter Final", "Semi Final", "Final"
  homeTeamId: integer("home_team_id").references(() => tournamentRegistrations.id).notNull(),
  awayTeamId: integer("away_team_id").references(() => tournamentRegistrations.id).notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  venue: text("venue"),
  field: text("field"), // specific field/court within venue
  refereeId: integer("referee_id").references(() => users.id),
  umpire1Id: integer("umpire1_id").references(() => users.id),
  umpire2Id: integer("umpire2_id").references(() => users.id),
  status: text("status").default("scheduled"), // "scheduled", "live", "completed", "postponed", "cancelled"
  homeTeamScore: integer("home_team_score"),
  awayTeamScore: integer("away_team_score"),
  winnerTeamId: integer("winner_team_id").references(() => tournamentRegistrations.id),
  matchResult: text("match_result"), // "home_win", "away_win", "draw", "walkover", "forfeit"
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  notes: text("notes"),
  weatherConditions: text("weather_conditions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Live scoring system
export const liveScores = pgTable("live_scores", {
  id: serial("id").primaryKey(),
  fixtureId: integer("fixture_id").references(() => fixtures.id).notNull(),
  eventType: text("event_type").notNull(), // "goal", "point", "foul", "substitution", "timeout", "period_end"
  playerId: integer("player_id").references(() => tournamentPlayers.id),
  teamId: integer("team_id").references(() => tournamentRegistrations.id).notNull(),
  minute: integer("minute"), // game minute when event occurred
  period: integer("period"), // half, quarter, set number
  score: jsonb("score").default({}), // current score snapshot
  description: text("description"),
  recordedBy: integer("recorded_by").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id)
});

// Player performance tracking
export const playerPerformances = pgTable("player_performances", {
  id: serial("id").primaryKey(),
  fixtureId: integer("fixture_id").references(() => fixtures.id).notNull(),
  playerId: integer("player_id").references(() => tournamentPlayers.id).notNull(),
  minutesPlayed: integer("minutes_played"),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  saves: integer("saves").default(0), // for goalkeepers
  fouls: integer("fouls").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  substitutedIn: integer("substituted_in"), // minute
  substitutedOut: integer("substituted_out"), // minute
  performanceRating: decimal("performance_rating", { precision: 3, scale: 1 }), // 1.0 to 10.0
  distanceCovered: decimal("distance_covered", { precision: 5, scale: 2 }), // in km
  passAccuracy: decimal("pass_accuracy", { precision: 5, scale: 2 }), // percentage
  shots: integer("shots").default(0),
  shotsOnTarget: integer("shots_on_target").default(0),
  tackles: integer("tackles").default(0),
  successfulTackles: integer("successful_tackles").default(0),
  customStats: jsonb("custom_stats").default({}), // sport-specific statistics
  coachRating: decimal("coach_rating", { precision: 3, scale: 1 }),
  coachNotes: text("coach_notes"),
  medicalNotes: text("medical_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Player evaluation and scouting
export const playerEvaluations = pgTable("player_evaluations", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  evaluatorId: integer("evaluator_id").references(() => users.id).notNull(),
  evaluatorRole: text("evaluator_role").notNull(), // "coach", "scout", "selector", "technical_director"
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  fixtureId: integer("fixture_id").references(() => fixtures.id),
  evaluationDate: timestamp("evaluation_date").defaultNow(),
  
  // Technical Skills (1-10 scale)
  ballControl: decimal("ball_control", { precision: 3, scale: 1 }),
  passing: decimal("passing", { precision: 3, scale: 1 }),
  shooting: decimal("shooting", { precision: 3, scale: 1 }),
  dribbling: decimal("dribbling", { precision: 3, scale: 1 }),
  defending: decimal("defending", { precision: 3, scale: 1 }),
  heading: decimal("heading", { precision: 3, scale: 1 }),
  
  // Physical Attributes
  speed: decimal("speed", { precision: 3, scale: 1 }),
  agility: decimal("agility", { precision: 3, scale: 1 }),
  strength: decimal("strength", { precision: 3, scale: 1 }),
  endurance: decimal("endurance", { precision: 3, scale: 1 }),
  jumping: decimal("jumping", { precision: 3, scale: 1 }),
  balance: decimal("balance", { precision: 3, scale: 1 }),
  
  // Mental & Tactical
  gameAwareness: decimal("game_awareness", { precision: 3, scale: 1 }),
  decisionMaking: decimal("decision_making", { precision: 3, scale: 1 }),
  communication: decimal("communication", { precision: 3, scale: 1 }),
  leadership: decimal("leadership", { precision: 3, scale: 1 }),
  temperament: decimal("temperament", { precision: 3, scale: 1 }),
  workEthic: decimal("work_ethic", { precision: 3, scale: 1 }),
  
  // Overall Ratings
  currentLevel: text("current_level"), // "district", "state", "national", "international"
  potential: text("potential"), // "amateur", "semi_professional", "professional", "elite"
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }),
  
  // Recommendations
  strengths: jsonb("strengths").$type<string[]>(),
  weaknesses: jsonb("weaknesses").$type<string[]>(),
  improvements: jsonb("improvements").$type<string[]>(),
  nextSteps: text("next_steps"),
  scoutingNotes: text("scouting_notes"),
  recommendForSelection: boolean("recommend_for_selection").default(false),
  selectionLevel: text("selection_level"), // "district_team", "state_team", "training_camp"
  
  isConfidential: boolean("is_confidential").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Talent scouting and state team selection
export const talentScouts = pgTable("talent_scouts", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  scoutLevel: text("scout_level").notNull(), // "district", "state", "national"
  sports: jsonb("sports").$type<string[]>(),
  territories: jsonb("territories").$type<string[]>(), // districts/regions covered
  licenseNumber: text("license_number"),
  certificationLevel: text("certification_level"),
  isActive: boolean("is_active").default(true),
  appointedBy: integer("appointed_by").references(() => users.id),
  appointmentDate: timestamp("appointment_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// State team selections and trials
export const stateSelections = pgTable("state_selections", {
  id: serial("id").primaryKey(),
  selectionCampaign: text("selection_campaign").notNull(), // e.g., "Kerala State Team 2025"
  sportId: integer("sport_id").references(() => sportsCategories.id).notNull(),
  ageCategory: text("age_category").notNull(),
  gender: text("gender").notNull(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  selectionStatus: text("selection_status").default("nominated"), // "nominated", "trial_invited", "selected", "reserve", "rejected"
  nominatedBy: integer("nominated_by").references(() => users.id).notNull(),
  trialDate: timestamp("trial_date"),
  trialVenue: text("trial_venue"),
  selectionCommittee: jsonb("selection_committee").$type<number[]>(),
  trialPerformance: jsonb("trial_performance").default({}),
  finalRanking: integer("final_ranking"),
  selectionNotes: text("selection_notes"),
  notificationSent: boolean("notification_sent").default(false),
  acceptanceStatus: text("acceptance_status"), // "pending", "accepted", "declined"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Government schemes and scholarships
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  schemeName: text("scheme_name").notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  schemeType: text("scheme_type").notNull(), // "kerala_sports_council", "district_council", "private", "central_government"
  amount: decimal("amount", { precision: 10, scale: 2 }),
  duration: integer("duration"), // in months
  eligibilityCriteria: jsonb("eligibility_criteria").default({}),
  requiredDocuments: jsonb("required_documents").$type<string[]>(),
  applicationDeadline: timestamp("application_deadline"),
  selectionProcess: text("selection_process"),
  maxRecipients: integer("max_recipients"),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  contactInfo: jsonb("contact_info").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Scholarship applications
export const scholarshipApplications = pgTable("scholarship_applications", {
  id: serial("id").primaryKey(),
  scholarshipId: integer("scholarship_id").references(() => scholarships.id).notNull(),
  applicantId: integer("applicant_id").references(() => users.id).notNull(),
  applicationDate: timestamp("application_date").defaultNow(),
  status: text("status").default("submitted"), // "submitted", "under_review", "approved", "rejected", "waitlisted"
  documents: jsonb("documents").default([]),
  personalStatement: text("personal_statement"),
  achievements: jsonb("achievements").default([]),
  recommendations: jsonb("recommendations").default([]),
  financialNeed: text("financial_need"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewDate: timestamp("review_date"),
  reviewNotes: text("review_notes"),
  awardAmount: decimal("award_amount", { precision: 10, scale: 2 }),
  disbursementSchedule: jsonb("disbursement_schedule").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Create insert schemas for new tables
export const insertTournamentSchema = createInsertSchema(tournaments);
export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations);
export const insertTournamentPlayerSchema = createInsertSchema(tournamentPlayers);
export const insertFixtureSchema = createInsertSchema(fixtures);
export const insertLiveScoreSchema = createInsertSchema(liveScores);
export const insertPlayerPerformanceSchema = createInsertSchema(playerPerformances);
export const insertPlayerEvaluationSchema = createInsertSchema(playerEvaluations);
export const insertTalentScoutSchema = createInsertSchema(talentScouts);
export const insertStateSelectionSchema = createInsertSchema(stateSelections);
export const insertScholarshipSchema = createInsertSchema(scholarships);
export const insertScholarshipApplicationSchema = createInsertSchema(scholarshipApplications);

// Export types for new tables
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;

export type TournamentPlayer = typeof tournamentPlayers.$inferSelect;
export type InsertTournamentPlayer = z.infer<typeof insertTournamentPlayerSchema>;

export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixture = z.infer<typeof insertFixtureSchema>;

export type LiveScore = typeof liveScores.$inferSelect;
export type InsertLiveScore = z.infer<typeof insertLiveScoreSchema>;

export type PlayerPerformance = typeof playerPerformances.$inferSelect;
export type InsertPlayerPerformance = z.infer<typeof insertPlayerPerformanceSchema>;

export type PlayerEvaluation = typeof playerEvaluations.$inferSelect;
export type InsertPlayerEvaluation = z.infer<typeof insertPlayerEvaluationSchema>;

export type TalentScout = typeof talentScouts.$inferSelect;
export type InsertTalentScout = z.infer<typeof insertTalentScoutSchema>;

export type StateSelection = typeof stateSelections.$inferSelect;
export type InsertStateSelection = z.infer<typeof insertStateSelectionSchema>;

export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;

export type ScholarshipApplication = typeof scholarshipApplications.$inferSelect;
export type InsertScholarshipApplication = z.infer<typeof insertScholarshipApplicationSchema>;
