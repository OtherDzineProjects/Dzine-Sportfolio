import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// Skill Verifications table for external verification system
export const skillVerifications = pgTable("skill_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  skillName: text("skill_name").notNull(),
  skillCategory: text("skill_category").notNull(),
  verifierId: integer("verifier_id"), // User who verified the skill
  verifierName: text("verifier_name"),
  verifierOrganization: text("verifier_organization"),
  status: text("status").default("pending"), // pending, verified, rejected
  evidence: jsonb("evidence").$type<string[]>(), // URLs to certificates, videos, etc.
  verificationNotes: text("verification_notes"),
  blockchainHash: text("blockchain_hash"), // For immutable verification
  requestedAt: timestamp("requested_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  isActive: boolean("is_active").default(true)
});

// Guardian Relationships table
export const guardianRelationships = pgTable("guardian_relationships", {
  id: serial("id").primaryKey(),
  guardianId: integer("guardian_id").notNull(), // Adult guardian
  dependentId: integer("dependent_id").notNull(), // Child or elderly dependent
  relationshipType: text("relationship_type").notNull(), // parent, guardian, caretaker
  accessLevel: text("access_level").default("full"), // full, limited, view_only
  isActive: boolean("is_active").default(true),
  approvedBy: integer("approved_by"), // Admin who approved the relationship
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at")
});

// Medical clearance records
export const medicalClearances = pgTable("medical_clearances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorId: integer("doctor_id"), // Medical professional who issued clearance
  doctorName: text("doctor_name").notNull(),
  hospitalOrClinic: text("hospital_or_clinic"),
  clearanceType: text("clearance_type").notNull(), // general, sports_specific, event_specific
  validUntil: timestamp("valid_until"),
  restrictions: jsonb("restrictions").$type<string[]>(),
  notes: text("notes"),
  documentUrl: text("document_url"),
  blockchainHash: text("blockchain_hash"),
  issuedAt: timestamp("issued_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});

export type SkillVerification = typeof skillVerifications.$inferSelect;
export type InsertSkillVerification = typeof skillVerifications.$inferInsert;

export type GuardianRelationship = typeof guardianRelationships.$inferSelect;
export type InsertGuardianRelationship = typeof guardianRelationships.$inferInsert;

export type MedicalClearance = typeof medicalClearances.$inferSelect;
export type InsertMedicalClearance = typeof medicalClearances.$inferInsert;