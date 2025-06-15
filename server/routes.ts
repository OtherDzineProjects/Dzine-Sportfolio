import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertAthleteProfileSchema, insertFacilityBookingSchema, insertEventSchema } from "@shared/schema";
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
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
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
        password: hashedPassword
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
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

  const httpServer = createServer(app);
  return httpServer;
}
