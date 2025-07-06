import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seedInitialData() {
  try {
    console.log("Seeding initial data...");

    // Create sports categories first
    let defaultSportId = 1;
    try {
      const sportsCategories = await storage.getSportsCategories();
      if (sportsCategories.length === 0) {
        // Create basic sports categories using direct database
        await db.execute(sql`INSERT INTO sports_categories (name, type, description, icon, is_active) VALUES
          ('Football', 'team', 'Association Football', '⚽', true),
          ('Basketball', 'team', 'Basketball', '🏀', true),
          ('Volleyball', 'team', 'Volleyball', '🏐', true),
          ('Cricket', 'team', 'Cricket', '🏏', true),
          ('Athletics', 'individual', 'Track and Field Events', '🏃', true),
          ('Swimming', 'individual', 'Swimming', '🏊', true),
          ('Tennis', 'individual', 'Tennis', '🎾', true),
          ('Badminton', 'individual', 'Badminton', '🏸', true),
          ('Hockey', 'team', 'Field Hockey', '🏑', true),
          ('Multi-Sport', 'other', 'Multi-Sport Events and Leagues', '🏅', true)`);
        console.log("Created sports categories");
        
        // Get the updated list
        const updatedCategories = await storage.getSportsCategories();
        if (updatedCategories.length > 0) {
          defaultSportId = updatedCategories.find(c => c.name === 'Multi-Sport')?.id || updatedCategories[0].id;
        }
      } else {
        defaultSportId = sportsCategories.find(c => c.name === 'Multi-Sport')?.id || sportsCategories[0].id;
      }
      console.log(`Using sport category ID: ${defaultSportId}`);
    } catch (error) {
      console.log("Error with sports categories:", error);
      defaultSportId = 1; // fallback
    }

    // Create specific users first (or get existing ones)
    let sportsDirector = await storage.getUserByEmail("emailcslkerala@gmail.com");
    if (!sportsDirector) {
      sportsDirector = await storage.createUser({
        username: "sports_director",
        email: "emailcslkerala@gmail.com",
      password: "$2a$10$rQvI7o1H0tXGNNqAMeM8ZOWC3F8ZPqE4QIXcS7SuTc/eBXDNpLdIa", // CSLKerala
      firstName: "Sports",
      lastName: "Director",
      userType: "organization",
      phone: "+91-9876543210",
      city: "Thiruvananthapuram",
      district: "Thiruvananthapuram",
      approvalStatus: "approved",
      approvedBy: 1,
        sportsInterests: ["Football", "Volleyball", "Basketball", "Cricket", "Athletics (Track & Field)"]
      });
      console.log("Created Sports Director user");
    } else {
      console.log("Sports Director user already exists");
    }

    let adminUser = await storage.getUserByEmail("mysportfolioindia@gmail.com");
    if (!adminUser) {
      adminUser = await storage.createUser({
        username: "ahammed_sukarno",
        email: "mysportfolioindia@gmail.com", 
      password: "$2b$10$y2D9o3gsqcqWn1CP72DIdetdATW8HB5pTqYYoH5KDyckRGkc9UMRK", // SportfolioIndia
      firstName: "Ahammed Sukarno",
      lastName: "B",
      userType: "admin",
      phone: "+91-9123456789",
      city: "Kochi", 
      district: "Ernakulam",
      approvalStatus: "approved",
      approvedBy: 1,
        sportsInterests: ["Football", "Cricket", "Basketball", "Volleyball", "Boxing", "Swimming"]
      });
      console.log("Created Ahammed Sukarno admin user");
    } else {
      console.log("Ahammed Sukarno admin user already exists");
    }

    // Create default roles
    const roles = [
      {
        name: "Super Admin",
        description: "Full system access with all permissions",
        level: 5
      },
      {
        name: "Admin",
        description: "Administrative access for user and content management",
        level: 4
      },
      {
        name: "Moderator",
        description: "Content moderation and user approval access",
        level: 3
      },
      {
        name: "Facility Manager",
        description: "Facility management and booking oversight",
        level: 2
      },
      {
        name: "User",
        description: "Standard user access for platform features",
        level: 1
      }
    ];

    // Create permissions
    const permissions = [
      // User management
      { name: "user.create", module: "user", action: "create", description: "Create new users" },
      { name: "user.read", module: "user", action: "read", description: "View user information" },
      { name: "user.update", module: "user", action: "update", description: "Update user information" },
      { name: "user.delete", module: "user", action: "delete", description: "Delete users" },
      { name: "user.approve", module: "user", action: "approve", description: "Approve user registrations" },
      
      // Facility management
      { name: "facility.create", module: "facility", action: "create", description: "Create new facilities" },
      { name: "facility.read", module: "facility", action: "read", description: "View facility information" },
      { name: "facility.update", module: "facility", action: "update", description: "Update facility information" },
      { name: "facility.delete", module: "facility", action: "delete", description: "Delete facilities" },
      { name: "facility.manage", module: "facility", action: "manage", description: "Full facility management access" },
      
      // Event management
      { name: "event.create", module: "event", action: "create", description: "Create new events" },
      { name: "event.read", module: "event", action: "read", description: "View event information" },
      { name: "event.update", module: "event", action: "update", description: "Update event information" },
      { name: "event.delete", module: "event", action: "delete", description: "Delete events" },
      { name: "event.manage", module: "event", action: "manage", description: "Full event management access" },
      
      // Booking management
      { name: "booking.create", module: "booking", action: "create", description: "Create bookings" },
      { name: "booking.read", module: "booking", action: "read", description: "View booking information" },
      { name: "booking.update", module: "booking", action: "update", description: "Update booking information" },
      { name: "booking.delete", module: "booking", action: "delete", description: "Cancel bookings" },
      { name: "booking.approve", module: "booking", action: "approve", description: "Approve booking requests" },
      
      // Certificate management
      { name: "certificate.create", module: "certificate", action: "create", description: "Issue certificates" },
      { name: "certificate.read", module: "certificate", action: "read", description: "View certificates" },
      { name: "certificate.verify", module: "certificate", action: "verify", description: "Verify certificates" },
      
      // Admin functions
      { name: "admin.access", module: "admin", action: "access", description: "Access admin dashboard" },
      { name: "admin.manage_roles", module: "admin", action: "manage_roles", description: "Manage user roles" },
      { name: "admin.manage_permissions", module: "admin", action: "manage_permissions", description: "Manage permissions" },
      { name: "admin.system_config", module: "admin", action: "system_config", description: "Configure system settings" }
    ];

    // Create module configurations
    const moduleConfigs = [
      {
        moduleName: "facility_management",
        displayName: "Facility Management",
        description: "Manage sports facilities and bookings",
        isEnabled: true,
        requiredRole: "Facility Manager"
      },
      {
        moduleName: "event_management",
        displayName: "Event Management",
        description: "Organize and manage sports events",
        isEnabled: true,
        requiredRole: "Moderator"
      },
      {
        moduleName: "live_scoring",
        displayName: "Live Scoring",
        description: "Real-time match scoring system",
        isEnabled: true,
        requiredRole: "User"
      },
      {
        moduleName: "athlete_profiles",
        displayName: "Athlete Profiles",
        description: "Athlete profile and certification management",
        isEnabled: true,
        requiredRole: "User"
      },
      {
        moduleName: "blockchain_certificates",
        displayName: "Blockchain Certificates",
        description: "Blockchain-verified achievements and certificates",
        isEnabled: true,
        requiredRole: "Moderator"
      }
    ];

    // Insert roles
    const createdRoles = [];
    for (const role of roles) {
      try {
        const existingRole = await storage.getRoles();
        const roleExists = existingRole.find(r => r.name === role.name);
        if (!roleExists) {
          const createdRole = await storage.createRole(role);
          createdRoles.push(createdRole);
          console.log(`Created role: ${role.name}`);
        }
      } catch (error) {
        console.log(`Role ${role.name} might already exist`);
      }
    }

    // Insert permissions
    const createdPermissions = [];
    for (const permission of permissions) {
      try {
        const existingPermissions = await storage.getPermissions();
        const permissionExists = existingPermissions.find(
          p => p.module === permission.module && p.action === permission.action
        );
        if (!permissionExists) {
          const createdPermission = await storage.createPermission(permission);
          createdPermissions.push(createdPermission);
          console.log(`Created permission: ${permission.module}.${permission.action}`);
        }
      } catch (error) {
        console.log(`Permission ${permission.module}.${permission.action} might already exist`);
      }
    }

    // Insert module configurations
    for (const moduleConfig of moduleConfigs) {
      try {
        const existing = await storage.getModuleConfig(moduleConfig.moduleName);
        if (!existing) {
          await storage.createModuleConfig(moduleConfig);
          console.log(`Created module config: ${moduleConfig.moduleName}`);
        }
      } catch (error) {
        console.log(`Module config ${moduleConfig.moduleName} might already exist`);
      }
    }

    // Assign permissions to roles
    try {
      const allRoles = await storage.getRoles();
      const allPermissions = await storage.getPermissions();

      // Super Admin gets all permissions
      const superAdminRole = allRoles.find(r => r.name === "Super Admin");
      if (superAdminRole) {
        for (const permission of allPermissions) {
          try {
            await storage.assignRolePermission(superAdminRole.id, permission.id);
          } catch (error) {
            // Permission might already be assigned
          }
        }
      }

      // Admin gets most permissions except super admin functions
      const adminRole = allRoles.find(r => r.name === "Admin");
      if (adminRole) {
        const adminPermissions = allPermissions.filter(p => 
          p.module !== "admin" || p.action !== "system_config"
        );
        for (const permission of adminPermissions) {
          try {
            await storage.assignRolePermission(adminRole.id, permission.id);
          } catch (error) {
            // Permission might already be assigned
          }
        }
      }

      // Moderator gets user approval and content management permissions
      const moderatorRole = allRoles.find(r => r.name === "Moderator");
      if (moderatorRole) {
        const moderatorPermissions = allPermissions.filter(p => 
          p.action === "read" || 
          p.action === "approve" || 
          (p.module === "event" && p.action !== "delete") ||
          (p.module === "certificate")
        );
        for (const permission of moderatorPermissions) {
          try {
            await storage.assignRolePermission(moderatorRole.id, permission.id);
          } catch (error) {
            // Permission might already be assigned
          }
        }
      }

      // Facility Manager gets facility and booking permissions
      const facilityManagerRole = allRoles.find(r => r.name === "Facility Manager");
      if (facilityManagerRole) {
        const facilityPermissions = allPermissions.filter(p => 
          p.module === "facility" || 
          p.module === "booking" ||
          (p.module === "event" && p.action === "read")
        );
        for (const permission of facilityPermissions) {
          try {
            await storage.assignRolePermission(facilityManagerRole.id, permission.id);
          } catch (error) {
            // Permission might already be assigned
          }
        }
      }

      // User gets basic read permissions
      const userRole = allRoles.find(r => r.name === "User");
      if (userRole) {
        const userPermissions = allPermissions.filter(p => 
          p.action === "read" || 
          (p.module === "booking" && p.action === "create") ||
          (p.module === "certificate" && p.action === "read")
        );
        for (const permission of userPermissions) {
          try {
            await storage.assignRolePermission(userRole.id, permission.id);
          } catch (error) {
            // Permission might already be assigned
          }
        }
      }
    } catch (error) {
      console.log("Error assigning role permissions:", error);
    }

    // Create a default admin user if none exists
    try {
      const existingUsers = await storage.getUsers();
      const adminExists = existingUsers.find(u => u.email === "admin@sportfolio.com");
      
      if (!adminExists) {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        const adminUser = await storage.createUser({
          email: "admin@sportfolio.com",
          username: "admin",
          password: hashedPassword,
          firstName: "System",
          lastName: "Administrator",
          userType: "admin",
          approvalStatus: "approved",
          isActive: true
        });

        // Assign Super Admin role
        const allRoles = await storage.getRoles();
        const superAdminRole = allRoles.find((r: any) => r.name === "Super Admin");
        if (superAdminRole) {
          await storage.assignUserRole(adminUser.id, superAdminRole.id);
        }

        console.log("Created default admin user: admin@sportfolio.com / admin123");
      }

      // Create test user if none exists
      const testUserExists = existingUsers.find(u => u.email === "ahammedsukarno@gmail.com");
      if (!testUserExists) {
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.hash("test123", 10);
        
        const testUser = await storage.createUser({
          email: "ahammedsukarno@gmail.com",
          username: "ahammed",
          password: hashedPassword,
          firstName: "Ahmed",
          lastName: "Sukarno",
          userType: "athlete",
          approvalStatus: "approved",
          isActive: true
        });

        console.log("Created test user: ahammedsukarno@gmail.com / test123");
      }
    } catch (error) {
      console.log("Error creating default admin user:", error);
    }

    // Assign roles to our specific users
    try {
      const allRoles = await storage.getRoles();
      const adminRole = allRoles.find(r => r.name === "Admin");
      const userRole = allRoles.find(r => r.name === "User");
      
      if (adminRole && adminUser) {
        await storage.assignUserRole(adminUser.id, adminRole.id);
        console.log("Assigned Admin role to Ahammed Sukarno");
      }
      
      if (userRole && sportsDirector) {
        await storage.assignUserRole(sportsDirector.id, userRole.id);
        console.log("Assigned User role to Sports Director");
      }
    } catch (error) {
      console.log("Error assigning roles to specific users:", error);
    }

    // Create College Sports League Kerala organization and events
    try {
      const existingOrgs = await storage.getOrganizations();
      let cslOrganization = existingOrgs.find(o => o.name === "College Sports League Kerala");
      
      if (!cslOrganization) {
        cslOrganization = await storage.createOrganization({
          name: "College Sports League Kerala",
          type: "college",
          registrationNumber: "CSL-KER-2024-001",
          address: "Sports Authority of India Complex, Thiruvananthapuram",
          city: "Thiruvananthapuram",
          state: "Kerala",
          pincode: "695001",
          contactEmail: "emailcslkerala@gmail.com",
          contactPhone: "+91-9876543210",
          adminUserId: sportsDirector.id,
          website: "https://cslkerala.com",
          isVerified: true
        });

        console.log("Created College Sports League Kerala organization");
      } else {
        console.log("College Sports League Kerala organization already exists");
      }

      // Check and create events under this organization  
      const existingEvents = await storage.getEvents();
      const event2024Exists = existingEvents.find(e => e.name === "College Sports League Kerala 2024-2025");
      const event2025Exists = existingEvents.find(e => e.name === "College Sports League Kerala 2025-2026");

      if (!event2024Exists) {  
        const event2024 = await storage.createEvent({
          name: "College Sports League Kerala 2024-2025",
          sportId: defaultSportId,
          organizationId: cslOrganization.id,
          description: `Inaugural season of College Sports League Kerala featuring multiple sports disciplines with home and away formats. This pilot league introduces a revolutionary college sports system to enhance student-athlete experiences and promote Kerala as a preferred learning destination.

Key Features:
- Multiple sports disciplines (Football, Volleyball, Basketball, Cricket, Athletics)
- Home and away format for maximum match experience
- Student-athlete development focus
- Academic integration with sports excellence
- Revenue generation opportunities for colleges
- Professional sports pathway creation

Eligibility:
- Current degree/post-graduation students only
- Maximum age: 25 years
- Minimum required credits per semester
- No guest players allowed
- Amateur/professional athletes eligible
- Transparent selection process`,
          eventType: "tournament",
          startDate: new Date("2024-09-01"),
          endDate: new Date("2025-05-31"),
          registrationDeadline: new Date("2024-08-15"),
          maxParticipants: 100,
          organizerId: sportsDirector.id,
          entryFee: "0.00", // Free registration
          prizePool: "500000.00",
          isPublic: true,
          status: "upcoming",
          rules: {
            eligibilityCriteria: `Team Selection Criteria:
1. Players must be current degree/post-graduation students of the college
2. No guest players allowed
3. Maximum age of player: 25 years
4. Student-athletes of Amateur/professional status allowed
5. Student must have designated credits at end of each semester
6. Students with study extensions beyond normal academic years not allowed
7. Transparent selection process following SO guidelines
8. Team management by College Sports Clubs
9. Stipends and performance bonuses for student-athletes
10. Academic performance monitoring required`,
            additionalRules: `League Rules:
- Yearlong tournament with home and away format
- College Sports Clubs manage teams as charitable/cooperative societies
- Students manage daily operations under faculty guidance
- Revenue generation through sponsorships and partnerships
- Medical support and security arrangements mandatory
- Pitch preparation and referee arrangements by host colleges
- Alumni and community engagement encouraged`
          }
        });
        console.log("Created College Sports League Kerala 2024-2025 event");
      } else {
        console.log("College Sports League Kerala 2024-2025 event already exists");
      }

      if (!event2025Exists) {
        const event2025 = await storage.createEvent({
          name: "College Sports League Kerala 2025-2026",
          sportId: defaultSportId,
          organizationId: cslOrganization.id, 
          description: `Second season of College Sports League Kerala with expanded format and enhanced features. Building on the success of the inaugural season, this league introduces advanced competition structures and revenue models.

Enhanced Features:
- Expanded college participation
- Advanced pyramid league format
- Enhanced revenue models with registration fees
- Professional sports pathway integration
- Alumni engagement programs
- International collaboration opportunities
- Startup ecosystem integration through College Sports Clubs

Eligibility & Fees:
- Team Registration: ₹5,000 per team
- Individual Registration: ₹500 per team member
- Enhanced prize pool and rewards
- Professional development opportunities
- Industry partnerships and internships`,
          eventType: "tournament",
          startDate: new Date("2025-09-01"),
          endDate: new Date("2026-05-31"),
          registrationDeadline: new Date("2025-08-15"),
          maxParticipants: 200,
          organizerId: sportsDirector.id,
          entryFee: "5000.00", // ₹5,000 per team  
          prizePool: "1000000.00",
          isPublic: true,
          status: "upcoming",
          rules: {
            eligibilityCriteria: `Team Selection Criteria (Enhanced):
1. Players must be current degree/post-graduation students of the college
2. No guest players allowed
3. Maximum age of player: 25 years
4. Student-athletes of Amateur/professional status allowed
5. Student must have designated credits at end of each semester
6. Students with study extensions beyond normal academic years not allowed
7. Enhanced transparent selection process with digital tracking
8. Team management by registered College Sports Clubs
9. Performance-based stipends and bonuses
10. Academic excellence monitoring with sports integration
11. Industry mentor assignment for career development
12. Professional sports pathway evaluation`,
            additionalRules: `Enhanced League Rules:
- Full pyramid format with promotion/relegation
- Professional College Sports Club management
- Advanced revenue generation models
- Industry partnerships and internships
- Alumni network integration
- International collaboration opportunities
- Startup ecosystem through College Sports Clubs
- Digital platform for all operations
- Enhanced medical and safety protocols
- Professional broadcast and media coverage`,
            fees: {
              teamRegistration: 5000,
              memberRegistration: 500
            }
          }
        });
        console.log("Created College Sports League Kerala 2025-2026 event");
      } else {
        console.log("College Sports League Kerala 2025-2026 event already exists");
      }
    } catch (error) {
      console.log("Error creating organization and events:", error);
    }

    console.log("Seed data initialization complete!");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}