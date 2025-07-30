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
  ward: text("ward"), // Ward level details for precise location mapping
  panchayath: text("panchayath"), // Panchayath/Municipality/Corporation
  constituency: text("constituency"), // Assembly constituency
  coordinates: jsonb("coordinates").$type<{lat: number, lng: number}>(), // GPS coordinates for mapping
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

// Advertisement Management
export const advertisements = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  adType: text("ad_type").notNull(), // banner, video, sponsored_post, popup
  placement: text("placement").notNull(), // home_page, dashboard, profile, event_page
  targetAudience: jsonb("target_audience").$type<{
    userTypes: string[]; // athlete, coach, organization
    ageGroups: string[]; // 8-11, 12-18, 19-25, 26-35, 36-50, 50+
    districts: string[];
    sports: string[];
  }>(),
  sponsorId: integer("sponsor_id").references(() => users.id),
  organizationId: integer("organization_id").references(() => organizations.id),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  costPerView: decimal("cost_per_view", { precision: 5, scale: 2 }),
  totalViews: integer("total_views").default(0),
  totalClicks: integer("total_clicks").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("pending"), // pending, active, paused, completed, rejected
  clickUrl: text("click_url"), // URL to redirect when clicked
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// eCommerce System
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // equipment, apparel, accessories, supplements
  subcategory: text("subcategory"),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => organizations.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal("discount_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  minOrderQuantity: integer("min_order_quantity").default(1),
  maxOrderQuantity: integer("max_order_quantity"),
  images: jsonb("images").$type<string[]>(),
  videos: jsonb("videos").$type<string[]>(),
  specifications: jsonb("specifications").$type<{[key: string]: string}>(),
  tags: jsonb("tags").$type<string[]>(),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  dimensions: jsonb("dimensions").$type<{length: number, width: number, height: number}>(),
  shippingCost: decimal("shipping_cost", { precision: 8, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // pending, confirmed, shipped, delivered, cancelled, refunded
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 8, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 8, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 8, scale: 2 }).default("0"),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"), // card, upi, netbanking, cod
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }>(),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  trackingNumber: text("tracking_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  productSnapshot: jsonb("product_snapshot"), // Store product details at time of order
  createdAt: timestamp("created_at").defaultNow()
});



// Sports Content Management for Home Page
export const sportsContent = pgTable("sports_content", {
  id: serial("id").primaryKey(),
  sportCategoryId: integer("sport_category_id").references(() => sportsCategories.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull(), // rules, health_benefits, court_details, equipment
  ageGroup: text("age_group"), // 8-11, 12-18, 19-25, 26-35, 36-50, 50+
  benefits: jsonb("benefits").$type<{
    health: string[];
    educational: string[];
    financial: string[];
  }>(),
  images: jsonb("images").$type<string[]>(),
  videos: jsonb("videos").$type<string[]>(),
  isPublished: boolean("is_published").default(false),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Profile Privacy & Social Features
export const profileSettings = pgTable("profile_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  isPublicProfile: boolean("is_public_profile").default(false),
  allowPublicSearch: boolean("allow_public_search").default(true),
  approvalRequired: boolean("approval_required").default(false), // For viewing non-public profiles
  allowFollowing: boolean("allow_following").default(true),
  showAchievements: boolean("show_achievements").default(true),
  showStats: boolean("show_stats").default(true),
  showUpcomingEvents: boolean("show_upcoming_events").default(true),
  showCompletedEvents: boolean("show_completed_events").default(true),
  contactPrivacy: text("contact_privacy").default("friends"), // public, friends, private
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const profileViewRequests = pgTable("profile_view_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  profileOwnerId: integer("profile_owner_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  message: text("message"),
  responseMessage: text("response_message"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const userFollows = pgTable("user_follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id).notNull(),
  followingId: integer("following_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Enhanced Event Dashboard System
export const eventDashboards = pgTable("event_dashboards", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull().unique(),
  totalParticipants: integer("total_participants").default(0),
  totalMatches: integer("total_matches").default(0),
  completedMatches: integer("completed_matches").default(0),
  results: jsonb("results").$type<{
    winners: {position: number, participantId: number, name: string}[];
    statistics: {[key: string]: any};
    highlights: string[];
  }>(),
  downloadableReports: jsonb("downloadable_reports").$type<{
    excelUrl?: string;
    pdfUrl?: string;
    participantsList?: string;
    resultsSummary?: string;
  }>(),
  eventHighlights: jsonb("event_highlights").$type<{
    images: string[];
    videos: string[];
    bestMoments: string[];
  }>(),
  financialSummary: jsonb("financial_summary").$type<{
    totalRevenue: number;
    expenses: number;
    profit: number;
    breakdown: {[category: string]: number};
  }>(),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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

// Player evaluation and scouting - Enhanced version
export const playerEvaluations = pgTable("player_evaluations", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  evaluatorId: integer("evaluator_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  matchId: integer("match_id").references(() => matches.id),
  sportCategoryId: integer("sport_category_id").references(() => sportsCategories.id).notNull(),
  evaluatorRole: text("evaluator_role").default("coach"), // "coach", "scout", "selector", "technical_director"
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  fixtureId: integer("fixture_id").references(() => fixtures.id),
  evaluationDate: timestamp("evaluation_date").defaultNow(),
  
  // Flexible skill system using JSON
  technicalSkills: jsonb("technical_skills").$type<{[skill: string]: number}>(), // 1-10 rating
  physicalAttributes: jsonb("physical_attributes").$type<{[attribute: string]: number}>(),
  mentalAttributes: jsonb("mental_attributes").$type<{[attribute: string]: number}>(),
  
  // Core attributes
  tacticalUnderstanding: integer("tactical_understanding").default(5), // 1-10
  leadership: integer("leadership").default(5), // 1-10
  teamwork: integer("teamwork").default(5), // 1-10
  
  // Assessment text
  strengths: text("strengths"),
  weaknesses: text("weaknesses"),
  recommendations: text("recommendations"),
  
  // Overall assessment
  currentLevel: text("current_level"), // "district", "state", "national", "international"  
  potentialLevel: text("potential_level").default("intermediate"), // beginner, intermediate, advanced, professional, elite
  overallRating: decimal("overall_rating", { precision: 3, scale: 1 }).default("5.0"), // 1.0-10.0
  
  // Approval workflow
  isApproved: boolean("is_approved").default(false),
  approvedBy: integer("approved_by").references(() => users.id),
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

// ============================================================================
// COMPREHENSIVE SPORTFOLIO CONFIGURATION MODULES
// 13 Major Systems: Registration, Verification, Events, Notifications, etc.
// ============================================================================

// A. REGISTRATION MANAGEMENT SYSTEM - Enhanced User & Organization Management

// User Skills and Services
export const userSkills = pgTable("user_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  skillName: text("skill_name").notNull(),
  skillLevel: text("skill_level"), // "beginner", "intermediate", "advanced", "expert"
  yearsOfExperience: integer("years_of_experience"),
  certificationLevel: text("certification_level"),
  verificationStatus: text("verification_status").default("unverified"), // "unverified", "pending", "verified", "rejected"
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userServices = pgTable("user_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceName: text("service_name").notNull(),
  serviceCategory: text("service_category"), // "coaching", "training", "consulting", "officiating"
  serviceDescription: text("service_description"),
  serviceRate: decimal("service_rate", { precision: 10, scale: 2 }),
  rateType: text("rate_type"), // "hourly", "daily", "monthly", "per_session"
  availability: jsonb("availability").default({}), // schedule availability
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userAwards = pgTable("user_awards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  awardName: text("award_name").notNull(),
  awardType: text("award_type"), // "medal", "trophy", "certificate", "recognition"
  awardLevel: text("award_level"), // "local", "district", "state", "national", "international"
  awardingBody: text("awarding_body"),
  awardDate: date("award_date"),
  description: text("description"),
  verificationStatus: text("verification_status").default("unverified"),
  verifiedBy: integer("verified_by").references(() => users.id),
  documents: jsonb("documents").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userDocuments = pgTable("user_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // "academic", "skill", "verification", "medical"
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url"),
  documentNumber: text("document_number"),
  issuingAuthority: text("issuing_authority"),
  issueDate: date("issue_date"),
  expiryDate: date("expiry_date"),
  verificationStatus: text("verification_status").default("pending"),
  verifiedBy: integer("verified_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const userReferences = pgTable("user_references", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  referenceName: text("reference_name").notNull(),
  referencePosition: text("reference_position"),
  referenceOrganization: text("reference_organization"),
  referenceContact: text("reference_contact"),
  referenceEmail: text("reference_email"),
  relationshipType: text("relationship_type"), // "coach", "colleague", "supervisor", "mentor"
  yearsKnown: integer("years_known"),
  recommendationLetter: text("recommendation_letter"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Organization Departments and Enhanced Management
export const organizationDepartments = pgTable("organization_departments", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  departmentName: text("department_name").notNull(),
  departmentCode: text("department_code"),
  departmentHead: integer("department_head").references(() => users.id),
  description: text("description"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  establishedDate: date("established_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const organizationDepartmentUsers = pgTable("organization_department_users", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").references(() => organizationDepartments.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id),
  position: text("position"),
  joinDate: date("join_date").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const organizationServices = pgTable("organization_services", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  serviceName: text("service_name").notNull(),
  serviceCategory: text("service_category"),
  serviceDescription: text("service_description"),
  serviceRate: decimal("service_rate", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const organizationAchievements = pgTable("organization_achievements", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => userOrganizations.id).notNull(),
  achievementTitle: text("achievement_title").notNull(),
  achievementType: text("achievement_type"),
  achievementLevel: text("achievement_level"),
  achievementDate: date("achievement_date"),
  description: text("description"),
  recognizedBy: text("recognized_by"),
  documents: jsonb("documents").default([]),
  createdAt: timestamp("created_at").defaultNow()
});

// B. VERIFICATION MANAGEMENT SYSTEM
export const verificationTypes = pgTable("verification_types", {
  id: serial("id").primaryKey(),
  verificationName: text("verification_name").notNull(),
  verificationCategory: text("verification_category"),
  description: text("description"),
  requiredDocuments: jsonb("required_documents").$type<string[]>(),
  verificationProcess: text("verification_process"),
  validityPeriod: integer("validity_period"), // in months
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const verificationRequests = pgTable("verification_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  verificationTypeId: integer("verification_type_id").references(() => verificationTypes.id).notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id),
  requestDate: timestamp("request_date").defaultNow(),
  status: text("status").default("pending"), // "pending", "in_review", "approved", "rejected", "expired"
  assignedExecutive: integer("assigned_executive").references(() => users.id),
  submittedDocuments: jsonb("submitted_documents").default([]),
  reviewNotes: text("review_notes"),
  approvalDate: timestamp("approval_date"),
  expiryDate: timestamp("expiry_date"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// C. EVENT MANAGEMENT SYSTEM - Enhanced
export const eventVenues = pgTable("event_venues", {
  id: serial("id").primaryKey(),
  venueName: text("venue_name").notNull(),
  venueType: text("venue_type"), // "stadium", "ground", "hall", "complex"
  address: text("address"),
  city: text("city"),
  district: text("district"),
  state: text("state"),
  pincode: text("pincode"),
  capacity: integer("capacity"),
  facilities: jsonb("facilities").$type<string[]>(),
  contactPerson: text("contact_person"),
  contactNumber: text("contact_number"),
  venueManager: integer("venue_manager").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const eventActivities = pgTable("event_activities", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  activityName: text("activity_name").notNull(),
  activityType: text("activity_type"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  venueId: integer("venue_id").references(() => eventVenues.id),
  maxParticipants: integer("max_participants"),
  registrationFee: decimal("registration_fee", { precision: 10, scale: 2 }),
  description: text("description"),
  requirements: jsonb("requirements").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// D. NOTIFICATION MANAGEMENT SYSTEM
export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  templateName: text("template_name").notNull(),
  templateType: text("template_type"), // "email", "sms", "push"
  subject: text("subject"),
  content: text("content").notNull(),
  variables: jsonb("variables").$type<string[]>(), // dynamic variables like {userName}, {eventName}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  templateId: integer("template_id").references(() => notificationTemplates.id),
  notificationType: text("notification_type"), // "email", "sms", "push", "in_app"
  subject: text("subject"),
  content: text("content").notNull(),
  status: text("status").default("pending"), // "pending", "sent", "delivered", "failed", "read"
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  errorMessage: text("error_message"),
  priority: text("priority").default("normal"), // "low", "normal", "high", "urgent"
  createdAt: timestamp("created_at").defaultNow()
});

// E. SYSTEM CONFIGURATIONS - Extended
export const documentTypes = pgTable("document_types", {
  id: serial("id").primaryKey(),
  typeName: text("type_name").notNull(),
  category: text("category"), // "personal", "academic", "professional", "verification"
  description: text("description"),
  requiredFields: jsonb("required_fields").$type<string[]>(),
  validityPeriod: integer("validity_period"), // in months
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const imageTypes = pgTable("image_types", {
  id: serial("id").primaryKey(),
  typeName: text("type_name").notNull(),
  category: text("category"), // "profile", "document", "venue", "event"
  maxSize: integer("max_size"), // in KB
  allowedFormats: jsonb("allowed_formats").$type<string[]>(),
  dimensions: text("dimensions"), // "width x height"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const awardTypes = pgTable("award_types", {
  id: serial("id").primaryKey(),
  awardName: text("award_name").notNull(),
  awardCategory: text("award_category"), // "achievement", "participation", "excellence"
  awardLevel: text("award_level"), // "local", "district", "state", "national", "international"
  awardingBody: text("awarding_body"),
  criteria: text("criteria"),
  monetaryValue: decimal("monetary_value", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// F. FACILITY MANAGEMENT SYSTEM - Enhanced
export const facilityTypes = pgTable("facility_types", {
  id: serial("id").primaryKey(),
  typeName: text("type_name").notNull(),
  category: text("category"), // "indoor", "outdoor", "aquatic", "specialized"
  description: text("description"),
  standardEquipment: jsonb("standard_equipment").$type<string[]>(),
  capacityRange: text("capacity_range"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Note: facilityBookings table already exists in the schema above

// G. REVIEW MANAGEMENT SYSTEM
export const reviewTypes = pgTable("review_types", {
  id: serial("id").primaryKey(),
  reviewName: text("review_name").notNull(),
  reviewCategory: text("review_category"), // "event", "organization", "user", "facility"
  description: text("description"),
  ratingScale: integer("rating_scale").default(5), // 1-5, 1-10, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const reviewQuestions = pgTable("review_questions", {
  id: serial("id").primaryKey(),
  reviewTypeId: integer("review_type_id").references(() => reviewTypes.id).notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type"), // "rating", "text", "multiple_choice", "yes_no"
  options: jsonb("options").$type<string[]>(), // for multiple choice questions
  isRequired: boolean("is_required").default(false),
  order: integer("order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  reviewTypeId: integer("review_type_id").references(() => reviewTypes.id).notNull(),
  entityId: integer("entity_id").notNull(), // ID of event, organization, user, or facility being reviewed
  entityType: text("entity_type").notNull(), // "event", "organization", "user", "facility"
  overallRating: decimal("overall_rating", { precision: 3, scale: 2 }),
  reviewContent: text("review_content"),
  responses: jsonb("responses").default({}), // answers to review questions
  isPublic: boolean("is_public").default(true),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// H. FUND MANAGEMENT SYSTEM
export const fundTypes = pgTable("fund_types", {
  id: serial("id").primaryKey(),
  fundName: text("fund_name").notNull(),
  fundCategory: text("fund_category"), // "government", "private", "sponsorship", "grant"
  description: text("description"),
  eligibilityCriteria: text("eligibility_criteria"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const fundAllocations = pgTable("fund_allocations", {
  id: serial("id").primaryKey(),
  fundTypeId: integer("fund_type_id").references(() => fundTypes.id).notNull(),
  allocatedTo: text("allocated_to"), // "organization", "department", "event", "individual"
  entityId: integer("entity_id").notNull(), // ID of the entity receiving funds
  allocatedAmount: decimal("allocated_amount", { precision: 15, scale: 2 }).notNull(),
  allocatedBy: integer("allocated_by").references(() => users.id).notNull(),
  allocationDate: date("allocation_date").defaultNow(),
  purpose: text("purpose"),
  utilizationDeadline: date("utilization_deadline"),
  status: text("status").default("allocated"), // "allocated", "utilized", "returned", "expired"
  utilizationReport: text("utilization_report"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// I. NEWS FEED MANAGEMENT SYSTEM
export const newsPosts = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  organizationId: integer("organization_id").references(() => userOrganizations.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postType: text("post_type"), // "news", "announcement", "update", "achievement"
  targetAudience: text("target_audience"), // "all", "location", "organization", "skill", "service"
  targetCriteria: jsonb("target_criteria").default({}), // filtering criteria
  images: jsonb("images").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  isPublished: boolean("is_published").default(false),
  publishDate: timestamp("publish_date"),
  isPinned: boolean("is_pinned").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// J. MENU SECURITY SYSTEM
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  menuName: text("menu_name").notNull(),
  menuPath: text("menu_path"),
  parentMenuId: integer("parent_menu_id").references(() => menus.id),
  icon: text("icon"),
  order: integer("order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const menuRoleMappings = pgTable("menu_role_mappings", {
  id: serial("id").primaryKey(),
  menuId: integer("menu_id").references(() => menus.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  canView: boolean("can_view").default(true),
  canEdit: boolean("can_edit").default(false),
  canDelete: boolean("can_delete").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// K. CERTIFICATE MANAGEMENT SYSTEM
export const certificateTypes = pgTable("certificate_types", {
  id: serial("id").primaryKey(),
  certificateName: text("certificate_name").notNull(),
  certificateCategory: text("certificate_category"), // "achievement", "participation", "completion", "qualification"
  template: text("template"), // certificate template design
  requiredFields: jsonb("required_fields").$type<string[]>(),
  validityPeriod: integer("validity_period"), // in months, null for lifetime
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Note: certificates table already exists in the schema above

// ============================================================================
// L. SPORTS SCORING SYSTEM - Enhanced Team & Statistics Management
// ============================================================================

// Team Management
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"), // abbreviation like "CSK", "MI"
  organizationId: integer("organization_id").references(() => userOrganizations.id),
  sportCategoryId: integer("sport_category_id").references(() => sportsCategories.id).notNull(),
  teamType: text("team_type").default("club"), // "club", "institutional", "district", "state", "national"
  homeVenue: text("home_venue"),
  foundedYear: integer("founded_year"),
  logo: text("logo"),
  primaryColor: text("primary_color"),
  secondaryColor: text("secondary_color"),
  description: text("description"),
  coachId: integer("coach_id").references(() => users.id),
  captainId: integer("captain_id").references(() => users.id),
  viceCaptainId: integer("vice_captain_id").references(() => users.id),
  managerId: integer("manager_id").references(() => users.id),
  status: text("status").default("active"), // "active", "inactive", "disbanded"
  isVerified: boolean("is_verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Team Members/Roster
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  position: text("position"), // goalkeeper, defender, midfielder, forward, etc.
  jerseyNumber: integer("jersey_number"),
  joinDate: timestamp("join_date").defaultNow(),
  leaveDate: timestamp("leave_date"),
  isActive: boolean("is_active").default(true),
  isStarter: boolean("is_starter").default(false),
  memberType: text("member_type").default("player"), // "player", "coach", "manager", "support_staff"
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Enhanced Match System for Team Sports
export const teamMatches = pgTable("team_matches", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  tournamentId: integer("tournament_id"), // for tournament structures
  homeTeamId: integer("home_team_id").references(() => teams.id).notNull(),
  awayTeamId: integer("away_team_id").references(() => teams.id).notNull(),
  facilityId: integer("facility_id").references(() => facilities.id),
  matchType: text("match_type").default("regular"), // "regular", "playoff", "final", "friendly"
  round: text("round"), // "group_stage", "round_16", "quarter_final", "semi_final", "final"
  matchNumber: integer("match_number"),
  scheduledTime: timestamp("scheduled_time").notNull(),
  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),
  status: text("status").default("scheduled"), // "scheduled", "live", "completed", "cancelled", "postponed"
  winnerTeamId: integer("winner_team_id").references(() => teams.id),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  extraTimeScore: jsonb("extra_time_score"), // for sports with overtime
  penaltyScore: jsonb("penalty_score"), // for penalty shootouts
  matchDetails: jsonb("match_details").default({}), // sport-specific details
  weather: text("weather"),
  attendance: integer("attendance"),
  refereeId: integer("referee_id").references(() => users.id),
  assistantReferee1Id: integer("assistant_referee1_id").references(() => users.id),
  assistantReferee2Id: integer("assistant_referee2_id").references(() => users.id),
  notes: text("notes"),
  liveStreamUrl: text("live_stream_url"),
  highlightsUrl: text("highlights_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Live Match Events (Goals, Cards, Substitutions, etc.)
export const matchEvents = pgTable("match_events", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => teamMatches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  playerId: integer("player_id").references(() => users.id),
  eventType: text("event_type").notNull(), // "goal", "card", "substitution", "timeout", "injury", "penalty"
  eventSubtype: text("event_subtype"), // "yellow_card", "red_card", "field_goal", "free_throw", etc.
  minute: integer("minute"),
  period: text("period"), // "first_half", "second_half", "overtime", "set1", "set2", etc.
  description: text("description"),
  points: integer("points").default(0), // points awarded for this event
  assistedBy: integer("assisted_by").references(() => users.id),
  replacedPlayerId: integer("replaced_player_id").references(() => users.id), // for substitutions
  coordinates: jsonb("coordinates"), // field position for location-based events
  videoTimestamp: integer("video_timestamp"), // seconds from match start
  isReversed: boolean("is_reversed").default(false), // if event was reversed/cancelled
  reversedAt: timestamp("reversed_at"),
  reversedBy: integer("reversed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id).notNull()
});

// Player Statistics per Match
export const playerMatchStats = pgTable("player_match_stats", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => teamMatches.id).notNull(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  minutesPlayed: integer("minutes_played").default(0),
  isStarter: boolean("is_starter").default(false),
  position: text("position"),
  jerseyNumber: integer("jersey_number"),
  // General Stats
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  points: integer("points").default(0),
  // Sport-specific stats (stored as JSON for flexibility)
  sportSpecificStats: jsonb("sport_specific_stats").default({}),
  // Performance metrics
  rating: decimal("rating", { precision: 3, scale: 1 }), // out of 10
  passAccuracy: decimal("pass_accuracy", { precision: 5, scale: 2 }), // percentage
  // Disciplinary
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  fouls: integer("fouls").default(0),
  // Timestamps
  timeIn: timestamp("time_in"),
  timeOut: timestamp("time_out"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Team Statistics per Match
export const teamMatchStats = pgTable("team_match_stats", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => teamMatches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  isHome: boolean("is_home").notNull(),
  finalScore: integer("final_score").default(0),
  possession: decimal("possession", { precision: 5, scale: 2 }), // percentage
  shots: integer("shots").default(0),
  shotsOnTarget: integer("shots_on_target").default(0),
  corners: integer("corners").default(0),
  fouls: integer("fouls").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  offside: integer("offside").default(0),
  // Sport-specific team stats
  sportSpecificStats: jsonb("sport_specific_stats").default({}),
  formationUsed: text("formation_used"),
  tacticalApproach: text("tactical_approach"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Season/Tournament Standings
export const standings = pgTable("standings", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  groupName: text("group_name"), // for group stage tournaments
  position: integer("position"),
  matchesPlayed: integer("matches_played").default(0),
  wins: integer("wins").default(0),
  draws: integer("draws").default(0),
  losses: integer("losses").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  goalDifference: integer("goal_difference").default(0),
  points: integer("points").default(0),
  // Additional stats
  homeWins: integer("home_wins").default(0),
  homeDraws: integer("home_draws").default(0),
  homeLosses: integer("home_losses").default(0),
  awayWins: integer("away_wins").default(0),
  awayDraws: integer("away_draws").default(0),
  awayLosses: integer("away_losses").default(0),
  form: text("form"), // last 5 matches: "WWLDW"
  streak: text("streak"), // current streak: "3W", "2L", etc.
  // Sport-specific standings data
  sportSpecificStats: jsonb("sport_specific_stats").default({}),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Player Season Statistics
export const playerSeasonStats = pgTable("player_season_stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => users.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  eventId: integer("event_id").references(() => events.id), // season/tournament
  sportCategoryId: integer("sport_category_id").references(() => sportsCategories.id).notNull(),
  season: text("season").notNull(), // "2024-25", "2025"
  // Appearances
  matchesPlayed: integer("matches_played").default(0),
  minutesPlayed: integer("minutes_played").default(0),
  starts: integer("starts").default(0),
  substitutions: integer("substitutions").default(0),
  // Performance
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  points: integer("points").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 1 }),
  // Disciplinary
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  // Sport-specific seasonal stats
  sportSpecificStats: jsonb("sport_specific_stats").default({}),
  // Records and achievements
  personalBests: jsonb("personal_bests").default({}),
  seasonAwards: jsonb("season_awards").default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Team Season Statistics
export const teamSeasonStats = pgTable("team_season_stats", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  eventId: integer("event_id").references(() => events.id),
  sportCategoryId: integer("sport_category_id").references(() => sportsCategories.id).notNull(),
  season: text("season").notNull(),
  // Match record
  matchesPlayed: integer("matches_played").default(0),
  wins: integer("wins").default(0),
  draws: integer("draws").default(0),
  losses: integer("losses").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  // Performance metrics
  averagePossession: decimal("average_possession", { precision: 5, scale: 2 }),
  averageRating: decimal("average_rating", { precision: 3, scale: 1 }),
  cleanSheets: integer("clean_sheets").default(0),
  biggestWin: text("biggest_win"),
  biggestDefeat: text("biggest_defeat"),
  longestWinStreak: integer("longest_win_streak").default(0),
  longestUnbeatenStreak: integer("longest_unbeaten_streak").default(0),
  // Rankings and achievements
  finalPosition: integer("final_position"),
  highestPosition: integer("highest_position"),
  trophiesWon: jsonb("trophies_won").default([]),
  // Sport-specific team seasonal stats
  sportSpecificStats: jsonb("sport_specific_stats").default({}),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Live Match Commentary/Timeline
export const matchCommentary = pgTable("match_commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => teamMatches.id).notNull(),
  minute: integer("minute"),
  period: text("period"),
  commentaryText: text("commentary_text").notNull(),
  commentaryType: text("commentary_type").default("general"), // "general", "goal", "card", "substitution", "highlight"
  playerId: integer("player_id").references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  isAutomated: boolean("is_automated").default(false), // if generated from match events
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id).notNull()
});

// ============================================================================
// INSERT SCHEMAS FOR COMPREHENSIVE MODULES
// ============================================================================

// A. Registration Management System Insert Schemas
export const insertUserSkillSchema = createInsertSchema(userSkills).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertUserServiceSchema = createInsertSchema(userServices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertUserAwardSchema = createInsertSchema(userAwards).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertUserDocumentSchema = createInsertSchema(userDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertUserReferenceSchema = createInsertSchema(userReferences).omit({
  id: true,
  createdAt: true
});
export const insertOrganizationDepartmentSchema = createInsertSchema(organizationDepartments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertOrganizationDepartmentUserSchema = createInsertSchema(organizationDepartmentUsers).omit({
  id: true,
  createdAt: true
});
export const insertOrganizationServiceSchema = createInsertSchema(organizationServices).omit({
  id: true,
  createdAt: true
});
export const insertOrganizationAchievementSchema = createInsertSchema(organizationAchievements).omit({
  id: true,
  createdAt: true
});

// B. Verification Management System Insert Schemas
export const insertVerificationTypeSchema = createInsertSchema(verificationTypes).omit({
  id: true,
  createdAt: true
});
export const insertVerificationRequestSchema = createInsertSchema(verificationRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// C. Event Management System Insert Schemas
export const insertEventVenueSchema = createInsertSchema(eventVenues).omit({
  id: true,
  createdAt: true
});
export const insertEventActivitySchema = createInsertSchema(eventActivities).omit({
  id: true,
  createdAt: true
});

// D. Notification Management System Insert Schemas
export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});

// E. System Configurations Insert Schemas
export const insertDocumentTypeSchema = createInsertSchema(documentTypes).omit({
  id: true,
  createdAt: true
});
export const insertImageTypeSchema = createInsertSchema(imageTypes).omit({
  id: true,
  createdAt: true
});
export const insertAwardTypeSchema = createInsertSchema(awardTypes).omit({
  id: true,
  createdAt: true
});

// F. Facility Management System Insert Schemas
export const insertFacilityTypeSchema = createInsertSchema(facilityTypes).omit({
  id: true,
  createdAt: true
});
// Note: insertFacilityBookingSchema already exists in the schema above

// G. Review Management System Insert Schemas
export const insertReviewTypeSchema = createInsertSchema(reviewTypes).omit({
  id: true,
  createdAt: true
});
export const insertReviewQuestionSchema = createInsertSchema(reviewQuestions).omit({
  id: true,
  createdAt: true
});
export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// H. Fund Management System Insert Schemas
export const insertFundTypeSchema = createInsertSchema(fundTypes).omit({
  id: true,
  createdAt: true
});
export const insertFundAllocationSchema = createInsertSchema(fundAllocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// I. News Feed Management System Insert Schemas
export const insertNewsPostSchema = createInsertSchema(newsPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// J. Menu Security System Insert Schemas
export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true
});
export const insertMenuRoleMappingSchema = createInsertSchema(menuRoleMappings).omit({
  id: true,
  createdAt: true
});

// K. Certificate Management System Insert Schemas
export const insertCertificateTypeSchema = createInsertSchema(certificateTypes).omit({
  id: true,
  createdAt: true
});
// Note: insertCertificateSchema already exists in the schema above

// L. Sports Scoring System Insert Schemas
export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true
});
export const insertTeamMatchSchema = createInsertSchema(teamMatches).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertMatchEventSchema = createInsertSchema(matchEvents).omit({
  id: true,
  createdAt: true
});
export const insertPlayerMatchStatsSchema = createInsertSchema(playerMatchStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertTeamMatchStatsSchema = createInsertSchema(teamMatchStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertStandingsSchema = createInsertSchema(standings).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});
export const insertPlayerSeasonStatsSchema = createInsertSchema(playerSeasonStats).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});
export const insertTeamSeasonStatsSchema = createInsertSchema(teamSeasonStats).omit({
  id: true,
  createdAt: true,
  lastUpdated: true
});
export const insertMatchCommentarySchema = createInsertSchema(matchCommentary).omit({
  id: true,
  createdAt: true
});

// ============================================================================
// EXPORT TYPES FOR COMPREHENSIVE MODULES
// ============================================================================

// A. Registration Management System Types
export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;

export type UserService = typeof userServices.$inferSelect;
export type InsertUserService = z.infer<typeof insertUserServiceSchema>;

export type UserAward = typeof userAwards.$inferSelect;
export type InsertUserAward = z.infer<typeof insertUserAwardSchema>;

export type UserDocument = typeof userDocuments.$inferSelect;
export type InsertUserDocument = z.infer<typeof insertUserDocumentSchema>;

export type UserReference = typeof userReferences.$inferSelect;
export type InsertUserReference = z.infer<typeof insertUserReferenceSchema>;

export type OrganizationDepartment = typeof organizationDepartments.$inferSelect;
export type InsertOrganizationDepartment = z.infer<typeof insertOrganizationDepartmentSchema>;

export type OrganizationDepartmentUser = typeof organizationDepartmentUsers.$inferSelect;
export type InsertOrganizationDepartmentUser = z.infer<typeof insertOrganizationDepartmentUserSchema>;

export type OrganizationService = typeof organizationServices.$inferSelect;
export type InsertOrganizationService = z.infer<typeof insertOrganizationServiceSchema>;

export type OrganizationAchievement = typeof organizationAchievements.$inferSelect;
export type InsertOrganizationAchievement = z.infer<typeof insertOrganizationAchievementSchema>;

// B. Verification Management System Types
export type VerificationType = typeof verificationTypes.$inferSelect;
export type InsertVerificationType = z.infer<typeof insertVerificationTypeSchema>;

export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type InsertVerificationRequest = z.infer<typeof insertVerificationRequestSchema>;

// C. Event Management System Types
export type EventVenue = typeof eventVenues.$inferSelect;
export type InsertEventVenue = z.infer<typeof insertEventVenueSchema>;

export type EventActivity = typeof eventActivities.$inferSelect;
export type InsertEventActivity = z.infer<typeof insertEventActivitySchema>;

// D. Notification Management System Types
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// E. System Configurations Types
export type DocumentType = typeof documentTypes.$inferSelect;
export type InsertDocumentType = z.infer<typeof insertDocumentTypeSchema>;

export type ImageType = typeof imageTypes.$inferSelect;
export type InsertImageType = z.infer<typeof insertImageTypeSchema>;

export type AwardType = typeof awardTypes.$inferSelect;
export type InsertAwardType = z.infer<typeof insertAwardTypeSchema>;

// F. Facility Management System Types
export type FacilityType = typeof facilityTypes.$inferSelect;
export type InsertFacilityType = z.infer<typeof insertFacilityTypeSchema>;

// Note: FacilityBooking and InsertFacilityBooking types already exist above

// G. Review Management System Types
export type ReviewType = typeof reviewTypes.$inferSelect;
export type InsertReviewType = z.infer<typeof insertReviewTypeSchema>;

export type ReviewQuestion = typeof reviewQuestions.$inferSelect;
export type InsertReviewQuestion = z.infer<typeof insertReviewQuestionSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// H. Fund Management System Types
export type FundType = typeof fundTypes.$inferSelect;
export type InsertFundType = z.infer<typeof insertFundTypeSchema>;

export type FundAllocation = typeof fundAllocations.$inferSelect;
export type InsertFundAllocation = z.infer<typeof insertFundAllocationSchema>;

// I. News Feed Management System Types
export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;

// J. Menu Security System Types
export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;

export type MenuRoleMapping = typeof menuRoleMappings.$inferSelect;
export type InsertMenuRoleMapping = z.infer<typeof insertMenuRoleMappingSchema>;

// K. Certificate Management System Types
export type CertificateType = typeof certificateTypes.$inferSelect;
export type InsertCertificateType = z.infer<typeof insertCertificateTypeSchema>;

// Note: Certificate and InsertCertificate types already exist above

// L. Sports Scoring System Types
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type TeamMatch = typeof teamMatches.$inferSelect;
export type InsertTeamMatch = z.infer<typeof insertTeamMatchSchema>;

export type MatchEvent = typeof matchEvents.$inferSelect;
export type InsertMatchEvent = z.infer<typeof insertMatchEventSchema>;

export type PlayerMatchStats = typeof playerMatchStats.$inferSelect;
export type InsertPlayerMatchStats = z.infer<typeof insertPlayerMatchStatsSchema>;

export type TeamMatchStats = typeof teamMatchStats.$inferSelect;
export type InsertTeamMatchStats = z.infer<typeof insertTeamMatchStatsSchema>;

export type Standings = typeof standings.$inferSelect;
export type InsertStandings = z.infer<typeof insertStandingsSchema>;

export type PlayerSeasonStats = typeof playerSeasonStats.$inferSelect;
export type InsertPlayerSeasonStats = z.infer<typeof insertPlayerSeasonStatsSchema>;

export type TeamSeasonStats = typeof teamSeasonStats.$inferSelect;
export type InsertTeamSeasonStats = z.infer<typeof insertTeamSeasonStatsSchema>;

export type MatchCommentary = typeof matchCommentary.$inferSelect;
export type InsertMatchCommentary = z.infer<typeof insertMatchCommentarySchema>;

