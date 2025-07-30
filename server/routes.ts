import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
  insertUserSchema, 
  insertAthleteProfileSchema, 
  insertFacilityBookingSchema, 
  insertEventSchema, 
  insertUserApprovalSchema, 
  insertRoleSchema, 
  insertPermissionSchema,
  insertTeamSchema,
  insertTeamMemberSchema,
  insertTeamMatchSchema,
  insertMatchEventSchema,
  insertPlayerMatchStatsSchema,
  insertTeamMatchStatsSchema,
  insertStandingsSchema,
  insertPlayerSeasonStatsSchema,
  insertTeamSeasonStatsSchema,
  insertMatchCommentarySchema
} from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper function to generate blockchain hash
function generateBlockchainHash(): string {
  return 'bc_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = await storage.getUser(decoded.userId);
    if (!req.user || req.user.approvalStatus !== 'approved' || !req.user.isActive) {
      return res.status(403).json({ message: "Account not approved or inactive" });
    }
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

// Middleware to check user permissions
const requirePermission = (module: string, action: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.sendStatus(401);
    }
    
    const hasPermission = await storage.checkUserPermission(req.user.id, module, action);
    if (!hasPermission) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
};

// Middleware for admin-only routes
const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  
  const user = await storage.getUser(req.user.id);
  console.log('Admin check - User:', user?.email, 'Role ID:', user?.roleId);
  
  const role = user?.roleId ? await storage.getRole(user.roleId) : null;
  console.log('Admin check - Role:', role?.name, 'Level:', role?.level);
  
  if (!role || role.level < 3) { // Admin level 3 or higher
    return res.status(403).json({ message: "Admin access required", userRole: role?.name, userLevel: role?.level });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // New user signup route
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password, firstName, lastName, phone, dateOfBirth, userType, city, district, state, pincode } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        userType,
        city,
        district,
        state,
        pincode,
        approvalStatus: 'pending',
        isActive: false
      });

      // Create approval request
      await storage.createUserApproval({
        userId: user.id,
        requestType: 'registration',
        requestData: {
          userType: user.userType,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username
        }
      });

      res.status(201).json({ 
        message: "Account created successfully! Your registration is pending approval.",
        userId: user.id 
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(500).json({ message: error.message || "Failed to create account" });
    }
  });

  // User login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.approvalStatus !== 'approved') {
        return res.status(403).json({ 
          message: "Your account is pending approval. Please wait for admin approval.",
          status: user.approvalStatus 
        });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Your account has been deactivated" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        token, 
        user: userWithoutPassword,
        firstTimeLogin: !user.sportsInterests?.length || !user.completedQuestionnaire
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: error.message || "Failed to login" });
    }
  });

  // Get current authenticated user
  app.get("/api/auth/user", authenticateToken, async (req: any, res) => {
    try {
      const { password, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user information" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        approvalStatus: 'pending'
      });

      // Create approval request
      await storage.createUserApproval({
        userId: user.id,
        requestType: 'registration',
        requestData: {
          userType: user.userType,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });

      res.json({ 
        message: "Registration successful. Your account is pending approval.", 
        user: { ...user, password: undefined }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log(`Login attempt for email: ${email}, password length: ${password?.length}`);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log(`User not found for email: ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log(`User found: ${user.email}, checking password`);
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(`Password valid: ${isValidPassword}`);
      
      if (!isValidPassword) {
        console.log(`Invalid password for user: ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User profile routes
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const athleteProfile = await storage.getAthleteProfile(user.id);
      
      res.json({ 
        user: { ...user, password: undefined },
        athleteProfile 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/user/athlete-profile", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertAthleteProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const profile = await storage.createAthleteProfile(validatedData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Sports categories
  app.get("/api/sports-categories", async (req, res) => {
    try {
      const categories = await storage.getSportsCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Facilities routes
  app.get("/api/facilities", async (req, res) => {
    try {
      const { city } = req.query;
      let facilities;
      
      if (city) {
        facilities = await storage.getFacilitiesByCity(city as string);
      } else {
        facilities = await storage.getFacilities();
      }
      
      res.json(facilities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const facility = await storage.getFacility(parseInt(req.params.id));
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      res.json(facility);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Facility bookings
  app.post("/api/facility-bookings", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertFacilityBookingSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const booking = await storage.createFacilityBooking(validatedData);
      
      // Create revenue record
      if (booking.totalAmount) {
        await storage.createRevenueRecord({
          facilityId: booking.facilityId,
          source: "booking",
          amount: booking.totalAmount,
          bookingId: booking.id,
          description: `Facility booking #${booking.id}`
        });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/facility-bookings/my", authenticateToken, async (req: any, res) => {
    try {
      const bookings = await storage.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/facilities/:id/bookings", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const { date } = req.query;
      
      let bookingDate;
      if (date) {
        bookingDate = new Date(date as string);
      }
      
      const bookings = await storage.getFacilityBookings(facilityId, bookingDate);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = insertEventSchema.parse({
        ...req.body,
        organizerId: req.user.id
      });
      
      const event = await storage.createEvent(validatedData);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/events/:id/participate", authenticateToken, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const participant = await storage.addEventParticipant(eventId, req.user.id);
      res.json(participant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/events/:id/participants", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const participants = await storage.getEventParticipants(eventId);
      res.json(participants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Matches/Fixtures routes
  app.get("/api/events/:id/matches", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const matches = await storage.getEventMatches(eventId);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/matches/:id/score", authenticateToken, async (req: any, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const { score, winnerId } = req.body;
      
      const match = await storage.updateMatchScore(matchId, score, winnerId);
      res.json(match);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Organizations routes
  app.get("/api/organizations", async (req, res) => {
    try {
      const organizations = await storage.getOrganizations();
      res.json(organizations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/organizations", authenticateToken, async (req: any, res) => {
    try {
      const organizationData = {
        ...req.body,
        ownerId: req.user.id,
        createdBy: req.user.id,
        approvalStatus: 'pending',
        status: 'active'
      };
      
      const organization = await storage.createUserOrganization(organizationData);
      
      // Create approval request for organization
      await storage.createUserApproval({
        userId: req.user.id,
        requestType: 'organization_creation',
        requestData: {
          organizationId: organization.id,
          organizationName: organization.name,
          organizationType: organization.type
        }
      });

      res.status(201).json(organization);
    } catch (error: any) {
      console.error("Create organization error:", error);
      res.status(500).json({ message: error.message || "Failed to create organization" });
    }
  });

  // Get organization members
  app.get("/api/organizations/:id/members", authenticateToken, async (req: any, res) => {
    try {
      const orgId = parseInt(req.params.id);
      const members = await storage.getOrganizationMembers(orgId);
      res.json(members);
    } catch (error: any) {
      console.error("Get organization members error:", error);
      res.status(500).json({ message: "Failed to fetch organization members" });
    }
  });

  // Export organization data
  app.get("/api/organizations/:id/export", authenticateToken, async (req: any, res) => {
    try {
      const orgId = parseInt(req.params.id);
      const organization = await storage.getUserOrganization(orgId);
      const members = await storage.getOrganizationMembers(orgId);
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // Check if user has access to this organization
      if (organization.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({
        organization,
        members,
        exportDate: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Export organization error:", error);
      res.status(500).json({ message: "Failed to export organization data" });
    }
  });

  // Certificates routes
  app.get("/api/certificates/my", authenticateToken, async (req: any, res) => {
    try {
      const certificates = await storage.getUserCertificates(req.user.id);
      res.json(certificates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/certificates/verify", async (req, res) => {
    try {
      const { blockchainHash } = req.body;
      const certificate = await storage.verifyCertificate(blockchainHash);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found or invalid" });
      }
      
      res.json(certificate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Facility management routes
  app.get("/api/facilities/:id/maintenance", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const records = await storage.getFacilityMaintenanceRecords(facilityId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/facilities/:id/maintenance", authenticateToken, async (req: any, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const record = await storage.createMaintenanceRecord({
        ...req.body,
        facilityId,
        requestedBy: req.user.id
      });
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Revenue analytics routes
  app.get("/api/facilities/:id/revenue", async (req, res) => {
    try {
      const facilityId = parseInt(req.params.id);
      const { startDate, endDate } = req.query;
      
      let start, end;
      if (startDate) start = new Date(startDate as string);
      if (endDate) end = new Date(endDate as string);
      
      const revenue = await storage.getFacilityRevenue(facilityId, start, end);
      res.json(revenue);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User Approval System API Routes
  app.get("/api/admin/approvals", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const approvals = await storage.getPendingApprovals();
      res.json(approvals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/approvals/:id/approve", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const approvalId = parseInt(req.params.id);
      const { comments } = req.body;
      
      const approval = await storage.approveUserRequest(approvalId, req.user.id, comments);
      
      // Update user status
      await storage.updateUserApprovalStatus(approval.userId, "approved", req.user.id);
      
      res.json({ message: "User approved successfully", approval });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/approvals/:id/reject", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const approvalId = parseInt(req.params.id);
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ message: "Rejection reason is required" });
      }
      
      const approval = await storage.rejectUserRequest(approvalId, req.user.id, reason);
      
      // Update user status
      await storage.updateUserApprovalStatus(approval.userId, "rejected", req.user.id, reason);
      
      res.json({ message: "User rejected successfully", approval });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/users/:id/status", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status, reason } = req.body;
      
      const user = await storage.updateUserApprovalStatus(userId, status, req.user.id, reason);
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Sports interests update endpoint
  app.put("/api/auth/sports-interests", authenticateToken, async (req: any, res) => {
    try {
      const { sportsInterests, facilityPreferences } = req.body;
      
      if (!sportsInterests || sportsInterests.length < 1) {
        return res.status(400).json({ message: "At least 1 sports interest is required" });
      }

      const updatedUser = await storage.updateUser(req.user.id, {
        sportsInterests,
        facilityPreferences,
        completedQuestionnaire: true
      });

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Update sports interests error:", error);
      res.status(500).json({ message: error.message || "Failed to update sports interests" });
    }
  });

  // Role Management API Routes
  app.get("/api/admin/roles", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/roles", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(validatedData);
      res.json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/permissions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const permissions = await storage.getPermissions();
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/permissions", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPermissionSchema.parse(req.body);
      const permission = await storage.createPermission(validatedData);
      res.json(permission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/roles/:roleId/permissions/:permissionId", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const roleId = parseInt(req.params.roleId);
      const permissionId = parseInt(req.params.permissionId);
      
      const rolePermission = await storage.assignRolePermission(roleId, permissionId);
      res.json(rolePermission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/roles/:roleId/permissions/:permissionId", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const roleId = parseInt(req.params.roleId);
      const permissionId = parseInt(req.params.permissionId);
      
      await storage.removeRolePermission(roleId, permissionId);
      res.json({ message: "Permission removed from role" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/admin/users/:userId/role", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { roleId } = req.body;
      
      const user = await storage.assignUserRole(userId, roleId);
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Module Configuration API Routes
  app.get("/api/admin/modules", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const modules = await storage.getModuleConfigs();
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/modules/:moduleName/toggle", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { moduleName } = req.params;
      const { isEnabled } = req.body;
      
      const module = await storage.toggleModule(moduleName, isEnabled);
      res.json(module);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/user/permissions", authenticateToken, async (req: any, res) => {
    try {
      const permissions = await storage.getUserPermissions(req.user.id);
      res.json(permissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/approval-status", authenticateToken, async (req: any, res) => {
    try {
      const approvals = await storage.getUserApprovals(req.user.id);
      res.json({
        status: req.user.approvalStatus,
        approvals
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User profile routes
  app.put("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.user.id, updates);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Sports interests routes
  app.post("/api/user/sports-interests", authenticateToken, async (req: any, res) => {
    try {
      const { interests } = req.body;
      const user = await storage.updateUser(req.user.id, {
        sportsInterests: interests,
        completedQuestionnaire: true
      });
      res.json(user);
    } catch (error: any) {
      console.error("Error updating sports interests:", error);
      res.status(500).json({ message: "Failed to update sports interests" });
    }
  });

  // Kerala sports profile route
  app.put("/api/user/kerala-profile", authenticateToken, async (req: any, res) => {
    try {
      const { district, ageGroup, sportCategories, skillLevel, sportsGoal, preferredVenue, sportsInterests } = req.body;
      
      const user = await storage.updateUser(req.user.id, {
        district,
        sportCategories,
        skillLevel,
        sportsGoal: sportsGoal,
        preferredVenue,
        sportsInterests,
        completedQuestionnaire: true
      });
      
      res.json({ 
        user,
        message: "Kerala sports profile updated successfully"
      });
    } catch (error: any) {
      console.error("Error updating Kerala profile:", error);
      res.status(500).json({ message: "Failed to update Kerala profile" });
    }
  });

  // User organizations routes (placeholder for now)
  app.get("/api/user/organizations", authenticateToken, async (req: any, res) => {
    try {
      res.json([]); // Will implement organization methods later
    } catch (error: any) {
      console.error("Error fetching user organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  // User memberships routes (placeholder for now)
  app.get("/api/user/memberships", authenticateToken, async (req: any, res) => {
    try {
      res.json([]); // Will implement membership methods later
    } catch (error: any) {
      console.error("Error fetching user memberships:", error);
      res.status(500).json({ message: "Failed to fetch memberships" });
    }
  });

  // User achievements routes (placeholder for now)
  app.get("/api/user/achievements", authenticateToken, async (req: any, res) => {
    try {
      res.json([]); // Will implement achievement methods later
    } catch (error: any) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // User approvals routes
  app.get("/api/user/approvals", authenticateToken, async (req: any, res) => {
    try {
      const approvals = await storage.getUserApprovals(req.user.id);
      res.json(approvals);
    } catch (error: any) {
      console.error("Error fetching user approvals:", error);
      res.status(500).json({ message: "Failed to fetch approvals" });
    }
  });

  // Profile management routes
  app.put("/api/auth/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(user.id, {
        ...updates,
        graduationYear: updates.graduationYear ? parseInt(updates.graduationYear) : null,
        dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : null,
      });
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Sports interests route
  app.put("/api/auth/sports-interests", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const { sportsInterests } = req.body;
      
      const updatedUser = await storage.updateUser(user.id, {
        sportsInterests,
        completedQuestionnaire: true,
      });
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating sports interests:", error);
      res.status(500).json({ message: "Failed to update sports interests" });
    }
  });

  // Organizations routes
  app.get("/api/organizations/owned", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const organizations = await storage.getUserOrganizations(user.id);
      res.json(organizations);
    } catch (error: any) {
      console.error("Error fetching owned organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.post("/api/organizations", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const orgData = {
        ...req.body,
        ownerId: user.id,
        status: 'active',
      };
      
      const organization = await storage.createUserOrganization(orgData);
      res.json(organization);
    } catch (error: any) {
      console.error("Error creating organization:", error);
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.put("/api/organizations/:id", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const orgId = parseInt(req.params.id);
      
      // Check if user owns this organization
      const existingOrg = await storage.getUserOrganization(orgId);
      if (!existingOrg || existingOrg.ownerId !== user.id) {
        return res.status(403).json({ message: "You can only edit organizations you own" });
      }
      
      const updates = {
        ...req.body,
        id: orgId, // Ensure ID is preserved
        ownerId: user.id, // Ensure ownership is preserved
      };
      
      const updatedOrganization = await storage.updateUserOrganization(orgId, updates);
      res.json(updatedOrganization);
    } catch (error: any) {
      console.error("Error updating organization:", error);
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  app.get("/api/organizations/memberships", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const memberships = await storage.getUserMemberships(user.id);
      res.json(memberships);
    } catch (error: any) {
      console.error("Error fetching memberships:", error);
      res.status(500).json({ message: "Failed to fetch memberships" });
    }
  });

  // Achievements routes
  app.get("/api/achievements/user", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const achievements = await storage.getUserAchievements(user.id);
      res.json(achievements);
    } catch (error: any) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/achievements", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const achievementData = {
        ...req.body,
        userId: user.id,
        verificationStatus: 'pending',
        blockchainHash: generateBlockchainHash(),
      };
      
      const achievement = await storage.createSportsAchievement(achievementData);
      res.json(achievement);
    } catch (error: any) {
      console.error("Error creating achievement:", error);
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  // User approvals routes for dashboard
  app.get("/api/approvals/user", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const approvals = await storage.getUserApprovals(user.id);
      res.json(approvals);
    } catch (error: any) {
      console.error("Error fetching user approvals:", error);
      res.status(500).json({ message: "Failed to fetch approvals" });
    }
  });

  // Organization Discovery Routes (public access)
  app.get("/api/organizations/all", authenticateToken, async (req, res) => {
    try {
      const organizations = await storage.getAllUserOrganizations();
      res.json(organizations);
    } catch (error: any) {
      console.error("Error fetching all organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/search", authenticateToken, async (req, res) => {
    try {
      const { q: searchTerm } = req.query;
      if (!searchTerm || typeof searchTerm !== 'string') {
        return res.status(400).json({ message: "Search term is required" });
      }
      const organizations = await storage.searchOrganizationsByName(searchTerm);
      res.json(organizations);
    } catch (error: any) {
      console.error("Error searching organizations:", error);
      res.status(500).json({ message: "Failed to search organizations" });
    }
  });

  // Organization Tagging Routes
  app.get("/api/organization-tags", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const tags = await storage.getOrganizationTags(user.id);
      res.json(tags);
    } catch (error: any) {
      console.error("Error fetching organization tags:", error);
      res.status(500).json({ message: "Failed to fetch organization tags" });
    }
  });

  app.post("/api/organization-tags", authenticateToken, async (req: any, res) => {
    try {
      const user = req.user;
      const tagData = {
        ...req.body,
        userId: user.id,
        status: 'active',
      };
      
      const tag = await storage.createOrganizationTag(tagData);
      res.json(tag);
    } catch (error: any) {
      console.error("Error creating organization tag:", error);
      res.status(500).json({ message: "Failed to create organization tag" });
    }
  });

  // Organization Hierarchy Routes
  app.get("/api/organization-hierarchy", authenticateToken, async (req, res) => {
    try {
      const { parentId, childId } = req.query;
      const parentIdNum = parentId ? parseInt(parentId as string) : undefined;
      const childIdNum = childId ? parseInt(childId as string) : undefined;
      
      const hierarchy = await storage.getOrganizationHierarchy(parentIdNum, childIdNum);
      res.json(hierarchy);
    } catch (error: any) {
      console.error("Error fetching organization hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch organization hierarchy" });
    }
  });

  app.get("/api/organizations/:id/children", authenticateToken, async (req, res) => {
    try {
      const parentId = parseInt(req.params.id);
      const children = await storage.getOrganizationChildren(parentId);
      res.json(children);
    } catch (error: any) {
      console.error("Error fetching organization children:", error);
      res.status(500).json({ message: "Failed to fetch organization children" });
    }
  });

  // Comprehensive Sports & Facility Data Export
  app.get("/api/analytics/export", async (req: any, res) => {
    try {
      // Fetch all comprehensive data using existing storage methods
      const users = await storage.getUsers();
      const organizations = await storage.getOrganizations();
      const events = await storage.getEvents();
      const achievements = [];

      // Create comprehensive Excel-compatible CSV
      const csvSections = [];

      // Section 1: User Sports Interests
      csvSections.push('USER SPORTS INTERESTS DATA');
      csvSections.push('User ID,Name,Email,User Type,Age,State,District,City,Sports Interests,Profile Completion,Registration Date,Last Active');
      
      users.forEach((user: any) => {
        const sportsInterests = Array.isArray(user.sportsInterests) ? user.sportsInterests.join('; ') : (user.sportsInterests || 'None');
        const age = user.dateOfBirth ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A';
        const profileCompletion = calculateUserProfileCompletion(user);
        
        csvSections.push(`${user.id},"${user.firstName} ${user.lastName}",${user.email},${user.userType || 'Athlete'},${age},${user.state || 'Kerala'},${user.district || 'N/A'},${user.city || 'N/A'},"${sportsInterests}",${profileCompletion}%,${user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'},${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-GB') : 'N/A'}`);
      });

      csvSections.push('');
      csvSections.push('ORGANIZATION FACILITY DATA');
      csvSections.push('Org ID,Organization Name,Type,Owner Name,Owner Email,State,District,City,Sports Offered,Facility Count,Member Count,Establishment Year,Registration Number,Website,Phone,Email,Verification Status,Created Date');
      
      organizations.forEach((org: any) => {
        const sportsOffered = Array.isArray(org.sportsInterests) ? org.sportsInterests.join('; ') : (org.sportsInterests || 'None');
        csvSections.push(`${org.id},"${org.name}",${org.type || 'N/A'},"${org.ownerName || 'N/A'}",${org.ownerEmail || 'N/A'},${org.state || 'Kerala'},${org.district || 'N/A'},${org.city || 'N/A'},"${sportsOffered}",${org.facilityCount || 0},${org.memberCount || 0},${org.establishedYear || 'N/A'},${org.registrationNumber || 'N/A'},${org.website || 'N/A'},${org.phone || 'N/A'},${org.email || 'N/A'},${org.verificationStatus || 'Unverified'},${org.createdAt ? new Date(org.createdAt).toLocaleDateString('en-GB') : 'N/A'}`);
      });

      csvSections.push('');
      csvSections.push('SPORTS EVENTS DATA');
      csvSections.push('Event ID,Event Name,Sport,Organizer,Organization,Event Type,Start Date,End Date,Registration Deadline,Max Participants,Entry Fee (INR),Prize Pool (INR),Status,Location,Created Date');
      
      events.forEach((event: any) => {
        csvSections.push(`${event.id},"${event.name}",${event.sportName || 'N/A'},"${event.organizerName || 'N/A'}","${event.organizationName || 'N/A'}",${event.eventType},${new Date(event.startDate).toLocaleDateString('en-GB')},${new Date(event.endDate).toLocaleDateString('en-GB')},${new Date(event.registrationDeadline).toLocaleDateString('en-GB')},${event.maxParticipants || 'Unlimited'},${parseFloat(event.entryFee || '0').toLocaleString('en-IN')},${parseFloat(event.prizePool || '0').toLocaleString('en-IN')},${event.status},"${event.location || 'TBD'}",${event.createdAt ? new Date(event.createdAt).toLocaleDateString('en-GB') : 'N/A'}`);
      });

      csvSections.push('');
      csvSections.push('SPORTS ACHIEVEMENTS DATA');
      csvSections.push('Achievement ID,User Name,Title,Category,Achievement Date,Issued By,Verification Status,Blockchain Hash');
      
      achievements.forEach((achievement: any) => {
        csvSections.push(`${achievement.id},"${achievement.userName || 'N/A'}","${achievement.title}",${achievement.category},${achievement.achievementDate ? new Date(achievement.achievementDate).toLocaleDateString('en-GB') : 'N/A'},"${achievement.issuedBy || 'N/A'}",${achievement.verificationStatus},${achievement.blockchainHash || 'N/A'}`);
      });

      csvSections.push('');
      csvSections.push('SUMMARY STATISTICS');
      csvSections.push('Metric,Count');
      csvSections.push(`Total Registered Users,${users.length}`);
      csvSections.push(`Total Organizations,${organizations.length}`);
      csvSections.push(`Total Events,${events.length}`);
      csvSections.push(`Total Achievements,${achievements.length}`);
      csvSections.push(`Active Events,${events.filter((e: any) => e.status === 'upcoming' || e.status === 'ongoing').length}`);
      csvSections.push(`Verified Organizations,${organizations.filter((o: any) => o.verificationStatus === 'verified').length}`);

      // Sports popularity analysis
      const sportsCount: Record<string, number> = {};
      users.forEach((user: any) => {
        if (user.sportsInterests && Array.isArray(user.sportsInterests)) {
          user.sportsInterests.forEach((sport: string) => {
            sportsCount[sport] = (sportsCount[sport] || 0) + 1;
          });
        }
      });

      csvSections.push('');
      csvSections.push('SPORTS POPULARITY ANALYSIS');
      csvSections.push('Sport,User Interest Count,Organization Offering Count');
      
      Object.entries(sportsCount)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .forEach(([sport, userCount]) => {
          const orgCount = organizations.filter((org: any) => 
            org.sportsInterests && Array.isArray(org.sportsInterests) && org.sportsInterests.includes(sport)
          ).length;
          csvSections.push(`"${sport}",${userCount},${orgCount}`);
        });

      const csvData = csvSections.join('\n');
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="sportfolio-comprehensive-data-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send('\ufeff' + csvData); // Add BOM for proper Excel UTF-8 support
    } catch (error: any) {
      console.error("Error exporting comprehensive data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Helper function for profile completion calculation
  function calculateUserProfileCompletion(user: any): number {
    const fields = [
      'firstName', 'lastName', 'phone', 'address', 'city', 'district', 
      'dateOfBirth', 'sportsInterests', 'educationQualification', 'currentPosition'
    ];
    const completedFields = fields.filter(field => {
      const value = user[field];
      return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim().length > 0);
    }).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  // Analytics routes for admin dashboard
  // Comprehensive analytics for College Sports League Kerala
  app.get("/api/analytics/comprehensive", authenticateToken, async (req: any, res) => {
    try {
      const analytics = await storage.getSportsAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error("Error fetching comprehensive analytics:", error);
      res.status(500).json({ message: "Failed to fetch comprehensive analytics" });
    }
  });

  app.get("/api/analytics/sports", authenticateToken, async (req: any, res) => {
    try {
      // Check if user has admin permissions
      if (req.user.userType !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Return basic analytics for now
      const analytics = {
        usersBySports: {
          "Basketball": 120,
          "Football": 95,
          "Cricket": 85,
          "Athletics": 75,
          "Swimming": 45
        },
        organizationsBySports: {
          "Basketball": 25,
          "Football": 20,
          "Cricket": 18,
          "Athletics": 15,
          "Swimming": 10
        },
        organizationsWithFacilities: {
          "Basketball": 15,
          "Football": 12,
          "Cricket": 10,
          "Athletics": 8,
          "Swimming": 5
        },
        totalUsers: 420,
        totalOrganizations: 88
      };

      res.json(analytics);
    } catch (error: any) {
      console.error("Error fetching sports analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Profile photo endpoints
  app.post('/api/auth/profile-photo', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const photoUrl = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=U${userId}`;
      
      res.json({ 
        success: true, 
        photoUrl,
        verificationStatus: 'pending',
        message: "Photo uploaded successfully. Verification pending." 
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.post('/api/auth/request-photo-verification', authenticateToken, async (req: any, res) => {
    try {
      res.json({ 
        success: true,
        message: "Verification request submitted for admin review",
        verificationStatus: 'pending'
      });
    } catch (error) {
      console.error("Error requesting verification:", error);
      res.status(500).json({ message: "Failed to request verification" });
    }
  });

  // Organization endpoints
  app.post('/api/organizations/:id/logo', authenticateToken, async (req: any, res) => {
    try {
      const organizationId = req.params.id;
      const logoUrl = `https://via.placeholder.com/200/10B981/FFFFFF?text=ORG${organizationId}`;
      
      res.json({ 
        success: true, 
        logoUrl,
        message: "Logo uploaded successfully" 
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ message: "Failed to upload logo" });
    }
  });

  app.put('/api/organizations/:id', authenticateToken, async (req: any, res) => {
    try {
      const organizationId = parseInt(req.params.id);
      const updates = req.body;
      
      res.json({ 
        success: true,
        organization: { id: organizationId, ...updates },
        message: "Organization updated successfully" 
      });
    } catch (error) {
      console.error("Error updating organization:", error);
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  // Export routes for organization sports and facility data
  app.get("/api/admin/organizations/export", authenticateToken, async (req, res) => {
    try {
      const organizations = await storage.getOrganizations();
      const exportData = [];

      for (const org of organizations) {
        // Get organization members and their sports interests
        const members = await storage.getOrganizationMembers(org.id);
        
        const orgData = {
          organizationId: org.id,
          organizationName: org.name,
          organizationType: org.type,
          district: org.district,
          city: org.city,
          registrationNumber: org.registrationNumber,
          status: org.status,
          sportsOffered: org.sportsOffered || [],
          facilitiesAvailable: org.facilitiesAvailable || [],
          memberCount: members.length,
          membersSportsInterests: members.map(member => ({
            memberName: `${member.firstName} ${member.lastName}`,
            memberRole: member.role,
            sportsInterests: member.sportsInterests || [],
            facilityPreferences: member.facilityPreferences || []
          }))
        };

        exportData.push(orgData);
      }

      // Set headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=organizations_sports_facilities.xlsx');
      
      // For now, return JSON format (can be enhanced to actual Excel format)
      res.json({
        exportData,
        summary: {
          totalOrganizations: organizations.length,
          totalMembers: exportData.reduce((sum, org) => sum + org.memberCount, 0),
          allSportsOffered: [...new Set(exportData.flatMap(org => org.sportsOffered))],
          allFacilitiesAvailable: [...new Set(exportData.flatMap(org => org.facilitiesAvailable))]
        }
      });
    } catch (error: any) {
      console.error("Export organizations error:", error);
      res.status(500).json({ message: error.message || "Failed to export organizations data" });
    }
  });

  // Get organization sports and facility statistics for events
  app.get("/api/admin/events/:eventId/organization-stats", authenticateToken, async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Get all organizations and their sports/facility data
      const organizations = await storage.getOrganizations();
      const eventStats = {
        eventName: event.name,
        eventSport: event.sportId,
        eligibleOrganizations: [],
        sportsMatchingSummary: {},
        facilityRequirements: {}
      };

      for (const org of organizations) {
        const members = await storage.getOrganizationMembers(org.id);
        const orgSports = org.sportsOffered || [];
        const orgFacilities = org.facilitiesAvailable || [];
        
        // Check if organization offers the event's sport
        const isEligible = orgSports.includes(event.sportId?.toString()) || 
                          orgSports.includes("Multi-Sport") ||
                          org.type === "multi_sport";

        if (isEligible) {
          eventStats.eligibleOrganizations.push({
            id: org.id,
            name: org.name,
            type: org.type,
            sportsOffered: orgSports,
            facilitiesAvailable: orgFacilities,
            memberCount: members.length,
            contactEmail: org.email,
            phone: org.phone
          });
        }
      }

      res.json(eventStats);
    } catch (error: any) {
      console.error("Get event organization stats error:", error);
      res.status(500).json({ message: error.message || "Failed to get event organization statistics" });
    }
  });

  // Organization tagging system routes
  app.get("/api/organization-tags", authenticateToken, async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const organizationId = req.query.organizationId ? parseInt(req.query.organizationId as string) : undefined;
      
      const tags = await storage.getOrganizationTags(userId, organizationId);
      res.json(tags);
    } catch (error) {
      console.error("Error fetching organization tags:", error);
      res.status(500).json({ message: "Failed to fetch organization tags" });
    }
  });

  app.post("/api/organization-tags", authenticateToken, async (req: any, res) => {
    try {
      const { organizationId, tagType, notes } = req.body;
      const userId = req.user?.id;

      if (!userId || !organizationId || !tagType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const tag = await storage.createOrganizationTag({
        userId,
        organizationId,
        tagType,
        notes
      });

      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating organization tag:", error);
      res.status(500).json({ message: "Failed to create organization tag" });
    }
  });

  app.patch("/api/organization-tags/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const tag = await storage.updateOrganizationTag(parseInt(id), updates);
      res.json(tag);
    } catch (error) {
      console.error("Error updating organization tag:", error);
      res.status(500).json({ message: "Failed to update organization tag" });
    }
  });

  // Organization search functionality
  app.get("/api/organizations/search", authenticateToken, async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const organizations = await storage.searchOrganizationsByName(q);
      res.json(organizations);
    } catch (error) {
      console.error("Error searching organizations:", error);
      res.status(500).json({ message: "Failed to search organizations" });
    }
  });

  // Organization hierarchy routes
  app.get("/api/organization-hierarchy", authenticateToken, async (req, res) => {
    try {
      const parentId = req.query.parentId ? parseInt(req.query.parentId as string) : undefined;
      const childId = req.query.childId ? parseInt(req.query.childId as string) : undefined;
      
      const hierarchy = await storage.getOrganizationHierarchy(parentId, childId);
      res.json(hierarchy);
    } catch (error) {
      console.error("Error fetching organization hierarchy:", error);
      res.status(500).json({ message: "Failed to fetch organization hierarchy" });
    }
  });

  app.post("/api/organization-hierarchy", authenticateToken, async (req, res) => {
    try {
      const { parentOrganizationId, childOrganizationId, hierarchyType, level } = req.body;

      if (!parentOrganizationId || !childOrganizationId || !hierarchyType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const hierarchy = await storage.createOrganizationHierarchy({
        parentOrganizationId,
        childOrganizationId,
        hierarchyType,
        level
      });

      res.status(201).json(hierarchy);
    } catch (error) {
      console.error("Error creating organization hierarchy:", error);
      res.status(500).json({ message: "Failed to create organization hierarchy" });
    }
  });

  app.get("/api/organizations/:id/children", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const children = await storage.getOrganizationChildren(parseInt(id));
      res.json(children);
    } catch (error) {
      console.error("Error fetching organization children:", error);
      res.status(500).json({ message: "Failed to fetch organization children" });
    }
  });

  app.get("/api/organizations/:id/parent", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const parent = await storage.getOrganizationParent(parseInt(id));
      res.json(parent || null);
    } catch (error) {
      console.error("Error fetching organization parent:", error);
      res.status(500).json({ message: "Failed to fetch organization parent" });
    }
  });

  // Get all organizations (for organization hierarchy and discovery)
  app.get("/api/organizations/all", authenticateToken, async (req, res) => {
    try {
      const organizations = await storage.getAllUserOrganizations();
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching all organizations:", error);
      res.status(500).json({ message: "Failed to fetch all organizations" });
    }
  });

  // ========================================
  // ASSOCIATION MANAGEMENT SYSTEM - API ENDPOINTS
  // ========================================

  // Tournament Management
  app.get("/api/tournaments", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      
      // Mock tournament data for testing
      const mockTournaments = [
        {
          id: 1,
          name: "Kerala District Football Championship 2025",
          description: "Annual district-level football tournament",
          status: "registration_open",
          startDate: "2025-08-15",
          endDate: "2025-08-30",
          venue: "District Sports Complex, Thiruvananthapuram",
          maxTeams: 16,
          registeredTeams: 8,
          tournamentType: "district",
          format: "knockout"
        },
        {
          id: 2,
          name: "State Basketball League",
          description: "Premier basketball competition across Kerala",
          status: "ongoing",
          startDate: "2025-07-01",
          endDate: "2025-07-20",
          venue: "Various venues across Kerala",
          maxTeams: 12,
          registeredTeams: 12,
          tournamentType: "state",
          format: "league"
        }
      ];
      
      res.json(mockTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  // Fixtures & Live Scoring
  app.get("/api/fixtures/live", authenticateToken, async (req, res) => {
    try {
      const mockFixtures = [
        {
          id: 1,
          matchNumber: 1,
          round: "Quarter Final",
          homeTeam: "Thiruvananthapuram FC",
          awayTeam: "Kochi Warriors",
          scheduledDate: "2025-07-11T15:00:00Z",
          venue: "Sports Authority Stadium",
          status: "live",
          homeScore: 2,
          awayScore: 1,
          minute: 78
        },
        {
          id: 2,
          matchNumber: 2,
          round: "Quarter Final",
          homeTeam: "Calicut United",
          awayTeam: "Malappuram Eagles",
          scheduledDate: "2025-07-11T18:00:00Z",
          venue: "District Stadium",
          status: "scheduled"
        },
        {
          id: 3,
          matchNumber: 3,
          round: "Semi Final",
          homeTeam: "Kannur Knights",
          awayTeam: "Kollam Titans",
          scheduledDate: "2025-07-12T16:00:00Z",
          venue: "Regional Sports Complex",
          status: "scheduled"
        }
      ];
      
      res.json(mockFixtures);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      res.status(500).json({ message: "Failed to fetch fixtures" });
    }
  });

  // Player Evaluation System
  app.get("/api/player-evaluations", authenticateToken, async (req, res) => {
    try {
      const mockEvaluations = [
        {
          id: 1,
          playerName: "Arjun Krishnan",
          evaluatorName: "Coach Ravi Kumar",
          evaluationDate: "2025-07-08",
          overallRating: 8.5,
          currentLevel: "district",
          potential: "professional",
          recommendForSelection: true
        },
        {
          id: 2,
          playerName: "Sneha Menon",
          evaluatorName: "Technical Director Maya",
          evaluationDate: "2025-07-07",
          overallRating: 7.8,
          currentLevel: "state",
          potential: "semi_professional",
          recommendForSelection: true
        },
        {
          id: 3,
          playerName: "Rahul Nair",
          evaluatorName: "Scout Pradeep",
          evaluationDate: "2025-07-06",
          overallRating: 6.2,
          currentLevel: "district",
          potential: "amateur",
          recommendForSelection: false
        }
      ];
      
      res.json(mockEvaluations);
    } catch (error) {
      console.error("Error fetching player evaluations:", error);
      res.status(500).json({ message: "Failed to fetch player evaluations" });
    }
  });

  // Scouting Reports & State Selection
  app.get("/api/scouting-reports", authenticateToken, async (req, res) => {
    try {
      const mockScoutingReports = [
        {
          id: 1,
          playerName: "Aditya Varma",
          scoutName: "Regional Scout Suresh",
          reportDate: "2025-07-09",
          sport: "Football",
          summary: "Exceptional technical skills, strong leadership qualities. Recommended for state team trials."
        },
        {
          id: 2,
          playerName: "Priya Lakshmi",
          scoutName: "State Scout Lakshmi",
          reportDate: "2025-07-08",
          sport: "Basketball",
          summary: "Outstanding shooting accuracy, needs improvement in defensive play. Good potential for development."
        },
        {
          id: 3,
          playerName: "Vishnu Dev",
          scoutName: "District Scout Raj",
          reportDate: "2025-07-07",
          sport: "Cricket",
          summary: "Solid all-rounder with batting and bowling skills. Shows consistency in performance."
        }
      ];
      
      res.json(mockScoutingReports);
    } catch (error) {
      console.error("Error fetching scouting reports:", error);
      res.status(500).json({ message: "Failed to fetch scouting reports" });
    }
  });

  // POST endpoints for creating new records
  app.post("/api/tournaments", authenticateToken, async (req, res) => {
    try {
      // Mock creation - would normally insert into database
      const newTournament = {
        id: Date.now(),
        ...req.body,
        status: "upcoming",
        createdBy: req.user?.id
      };
      
      res.status(201).json(newTournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.post("/api/player-evaluations", authenticateToken, async (req, res) => {
    try {
      // Mock creation - would normally insert into database
      const newEvaluation = {
        id: Date.now(),
        ...req.body,
        evaluatorId: req.user?.id,
        evaluationDate: new Date().toISOString()
      };
      
      res.status(201).json(newEvaluation);
    } catch (error) {
      console.error("Error creating player evaluation:", error);
      res.status(500).json({ message: "Failed to create player evaluation" });
    }
  });

  app.post("/api/fixtures/:id/score", authenticateToken, async (req, res) => {
    try {
      const fixtureId = parseInt(req.params.id);
      const newScore = {
        id: Date.now(),
        fixtureId,
        ...req.body,
        recordedBy: req.user?.id,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(newScore);
    } catch (error) {
      console.error("Error recording live score:", error);
      res.status(500).json({ message: "Failed to record live score" });
    }
  });

  // ============================================================================
  // SPORTS SCORING SYSTEM API ROUTES
  // ============================================================================

  // Teams Management
  app.post("/api/teams", authenticateToken, async (req, res) => {
    try {
      const teamData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create team", error: error.message });
    }
  });

  app.get("/api/teams", async (req, res) => {
    try {
      const { sportId, organizationId } = req.query;
      let teams;
      
      if (sportId) {
        teams = await storage.getTeamsBySport(Number(sportId));
      } else if (organizationId) {
        teams = await storage.getTeamsByOrganization(Number(organizationId));
      } else {
        teams = await storage.getTeams();
      }
      
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch teams", error: error.message });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(Number(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch team", error: error.message });
    }
  });

  app.put("/api/teams/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const team = await storage.updateTeam(Number(req.params.id), updates);
      res.json(team);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to update team", error: error.message });
    }
  });

  // Team Members Management
  app.post("/api/teams/:teamId/members", authenticateToken, async (req, res) => {
    try {
      const memberData = insertTeamMemberSchema.parse({
        ...req.body,
        teamId: Number(req.params.teamId)
      });
      const member = await storage.addTeamMember(memberData);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to add team member", error: error.message });
    }
  });

  app.get("/api/teams/:teamId/members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers(Number(req.params.teamId));
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch team members", error: error.message });
    }
  });

  // Team Matches Management
  app.post("/api/matches", authenticateToken, async (req, res) => {
    try {
      const matchData = insertTeamMatchSchema.parse(req.body);
      const match = await storage.createTeamMatch(matchData);
      res.json(match);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create match", error: error.message });
    }
  });

  app.get("/api/matches", async (req, res) => {
    try {
      const { teamId, eventId } = req.query;
      const matches = await storage.getTeamMatches(
        teamId ? Number(teamId) : undefined,
        eventId ? Number(eventId) : undefined
      );
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch matches", error: error.message });
    }
  });

  app.get("/api/matches/live", async (req, res) => {
    try {
      const liveMatches = await storage.getLiveMatches();
      res.json(liveMatches);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch live matches", error: error.message });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getTeamMatch(Number(req.params.id));
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch match", error: error.message });
    }
  });

  app.put("/api/matches/:id", authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const match = await storage.updateTeamMatch(Number(req.params.id), updates);
      res.json(match);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to update match", error: error.message });
    }
  });

  // Match Events for Live Scoring
  app.post("/api/matches/:matchId/events", authenticateToken, async (req, res) => {
    try {
      const eventData = insertMatchEventSchema.parse({
        ...req.body,
        matchId: Number(req.params.matchId),
        createdBy: (req as any).user.id
      });
      const event = await storage.addMatchEvent(eventData);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to add match event", error: error.message });
    }
  });

  app.get("/api/matches/:matchId/events", async (req, res) => {
    try {
      const events = await storage.getMatchEvents(Number(req.params.matchId));
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch match events", error: error.message });
    }
  });

  // Statistics endpoints
  app.get("/api/players/:playerId/season-stats", async (req, res) => {
    try {
      const { season } = req.query;
      const stats = await storage.getPlayerSeasonStats(
        Number(req.params.playerId),
        season as string
      );
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch player season stats", error: error.message });
    }
  });

  app.get("/api/teams/:teamId/season-stats", async (req, res) => {
    try {
      const { season } = req.query;
      const stats = await storage.getTeamSeasonStats(
        Number(req.params.teamId),
        season as string
      );
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch team season stats", error: error.message });
    }
  });

  // Standings
  app.get("/api/events/:eventId/standings", async (req, res) => {
    try {
      const { groupName } = req.query;
      const standings = await storage.getStandings(
        Number(req.params.eventId),
        groupName as string
      );
      res.json(standings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch standings", error: error.message });
    }
  });

  // Advertisement routes
  app.get("/api/advertisements", async (req, res) => {
    try {
      const { placement } = req.query;
      const advertisements = await storage.getAdvertisements(placement as string);
      res.json(advertisements);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      res.status(500).json({ error: "Failed to fetch advertisements" });
    }
  });

  app.post("/api/advertisements", authenticateToken, async (req, res) => {
    try {
      const advertisement = await storage.createAdvertisement(req.body);
      res.json(advertisement);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      res.status(500).json({ error: "Failed to create advertisement" });
    }
  });

  // Sports content routes
  app.get("/api/sports-content", async (req, res) => {
    try {
      const { sportCategoryId, ageGroup, contentType } = req.query;
      const content = await storage.getSportsContent({
        sportCategoryId: sportCategoryId ? parseInt(sportCategoryId as string) : undefined,
        ageGroup: ageGroup as string,
        contentType: contentType as string
      });
      res.json(content);
    } catch (error) {
      console.error("Error fetching sports content:", error);
      res.status(500).json({ error: "Failed to fetch sports content" });
    }
  });

  // Player evaluation routes
  app.get("/api/player-evaluations", authenticateToken, async (req, res) => {
    try {
      const evaluations = await storage.getPlayerEvaluations();
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching player evaluations:", error);
      res.status(500).json({ error: "Failed to fetch player evaluations" });
    }
  });

  app.get("/api/player-evaluations/my-evaluations", authenticateToken, async (req: any, res) => {
    try {
      const myEvaluations = await storage.getUserPlayerEvaluations(req.user.id);
      res.json(myEvaluations);
    } catch (error) {
      console.error("Error fetching user evaluations:", error);
      res.status(500).json({ error: "Failed to fetch user evaluations" });
    }
  });

  app.post("/api/player-evaluations", authenticateToken, async (req, res) => {
    try {
      const evaluation = await storage.createPlayerEvaluation(req.body);
      res.json(evaluation);
    } catch (error) {
      console.error("Error creating player evaluation:", error);
      res.status(500).json({ error: "Failed to create player evaluation" });
    }
  });

  app.post("/api/player-evaluations/:id/approve", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const evaluation = await storage.approvePlayerEvaluation(parseInt(id));
      res.json(evaluation);
    } catch (error) {
      console.error("Error approving player evaluation:", error);
      res.status(500).json({ error: "Failed to approve player evaluation" });
    }
  });

  // Enhanced search routes
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type, location, sport, district, ward } = req.query;
      const results = await storage.enhancedSearch({
        query: q as string,
        type: type as string, // events, facilities, users, organizations
        location: location as string,
        sport: sport as string,
        district: district as string,
        ward: ward as string
      });
      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ error: "Failed to perform search" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
