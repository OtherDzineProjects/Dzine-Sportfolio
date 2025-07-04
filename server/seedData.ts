import { storage } from "./storage";

export async function seedInitialData() {
  try {
    console.log("Seeding initial data...");

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

    console.log("Seed data initialization complete!");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}