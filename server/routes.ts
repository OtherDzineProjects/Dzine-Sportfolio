import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertAthleteProfileSchema, insertFacilityBookingSchema, insertEventSchema, insertUserApprovalSchema, insertRoleSchema, insertPermissionSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
  const role = user?.roleId ? await storage.getRole(user.roleId) : null;
  
  if (!role || role.level < 3) { // Admin level 3 or higher
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
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

  const httpServer = createServer(app);
  return httpServer;
}
