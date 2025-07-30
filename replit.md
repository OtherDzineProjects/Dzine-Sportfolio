# Sportfolio - Sports Management Platform

## Overview

Sportfolio is a comprehensive sports management platform designed for the Indian sports ecosystem. It connects athletes, coaches, facilities, and organizations through a blockchain-secured platform that handles user registration with approval workflows, facility management, event scheduling, live scoring, and certificate verification.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **Session Management**: Session-based authentication with stored tokens
- **API Design**: RESTful API endpoints under `/api` prefix

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### User Management & Approval System
- **Registration Flow**: All new users require admin approval before accessing the platform
- **Role-Based Access Control**: Hierarchical permission system with roles (Super Admin, Admin, Moderator, Facility Manager, User)
- **User Types**: Athletes, Coaches, Organizations, Facility Managers
- **Approval Workflow**: Pending → Approved/Rejected status with admin oversight

### Authentication & Authorization
- **JWT Token Authentication**: Secure token-based authentication
- **Permission System**: Module-based permissions (user, facility, fixtures, scoring)
- **Middleware Protection**: Route-level authentication and permission checks
- **Session Persistence**: Local storage for client-side auth state

### Subscription Management
- **Tiered Access**: Basic, Pro, Enterprise subscription levels
- **Feature Gating**: Tool access based on subscription tier
- **Tool Access Control**: Facility management, fixtures, scoring tools require Pro+

### Blockchain Integration
- **Certificate Verification**: Mock blockchain service for achievement certificates
- **Immutable Records**: Blockchain-secured achievement tracking
- **Hash Generation**: Certificate verification through blockchain hashes

## Data Flow

### User Registration & Approval
1. User submits registration form with user type selection
2. System creates pending approval record
3. Admin reviews and approves/rejects registration
4. Approved users gain access to platform features
5. Role-based permissions control feature access

### Facility Management
1. Facility managers create and manage sports facilities
2. Users browse available facilities by location and sport
3. Booking system handles facility reservations
4. Maintenance and revenue tracking for facility operators

### Event & Fixture Management
1. Organizations create sports events and tournaments
2. Athletes register for events and competitions
3. Fixture scheduling and match management
4. Live scoring system for real-time match updates

### Certificate System
1. Achievements trigger certificate generation
2. Blockchain hash verification for authenticity
3. Immutable record storage for credential verification
4. Public verification of sports achievements

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **Authentication**: bcryptjs for password hashing, jsonwebtoken for JWT
- **ORM**: drizzle-orm with drizzle-kit for database management
- **UI Framework**: React with @radix-ui components and tailwindcss
- **State Management**: @tanstack/react-query for server state
- **Form Handling**: react-hook-form with @hookform/resolvers
- **Date Handling**: date-fns for date manipulation
- **Validation**: zod for schema validation

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **Type Checking**: TypeScript compiler
- **Styling**: PostCSS with Tailwind CSS and autoprefixer

## Deployment Strategy

### Build Process
- **Frontend Build**: Vite builds React application to `dist/public`
- **Backend Build**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Environment Configuration
- **Database**: Requires DATABASE_URL environment variable
- **JWT**: Configurable JWT_SECRET for token signing
- **Development**: NODE_ENV=development for development mode
- **Production**: NODE_ENV=production for production deployment

### Startup Sequence
1. Database connection validation
2. Schema migration and seed data initialization
3. Express server setup with middleware
4. Route registration and error handling
5. Static file serving for production builds

### Scaling Considerations
- **Database**: PostgreSQL with connection pooling
- **Authentication**: Stateless JWT tokens for horizontal scaling
- **Assets**: Static file serving can be offloaded to CDN
- **API**: RESTful design supports load balancing

## Recent Changes
- July 30, 2025: **Enhanced Admin/Super Admin Approval System and Fixed Organization Workflows**
  - Clarified admin vs super admin rights with comprehensive role-based permissions
  - Fixed admin approval system to work for both Admin (level 4) and Super Admin (level 5) users
  - Enhanced organization creation approval workflow with orange highlighting and building icons
  - Assigned proper roles to 200+ Kerala sports organization admin accounts
  - Updated admin dashboards to clearly distinguish user registrations vs organization creation requests
  - Verified all admin approval APIs working correctly (/api/admin/approvals, approve/reject endpoints)
  - Created comprehensive admin rights documentation with working test credentials
  - Both admin types can now approve users, organizations, and manage accounts effectively
- July 30, 2025: **Integrated Official Sportfolio Branding and Fixed Authentication**
  - Added official Sportfolio logos across all major pages (home, login, signup, dashboard)
  - Implemented comprehensive navigation with prominent Sports Guide and Marketplace links
  - Created bright advertisement banner system on home page for revenue generation
  - Fixed all login credentials to work properly with test accounts for different user roles
  - Enhanced login page with quick test account buttons for easy access to different user types
  - Updated home page with professional header navigation and featured sections highlighting new functionality
  - Verified complete authentication flow working for Super Admin, Admin, Sports Director, and Athlete accounts
- July 26, 2025: **Created Complete Hybrid Mobile Application**
  - Built comprehensive React Native/Expo mobile app with full platform feature parity
  - Implemented 5-screen tab navigation: Home, Events, Teams, Facilities, Profile
  - Created authentication flow with Welcome, Login, and Signup screens
  - Integrated real-time live match scoring with 5-second polling
  - Added material design components with React Native Paper
  - Configured JWT authentication with secure token storage
  - Built search and filtering capabilities across all modules
  - Added pull-to-refresh and offline caching with TanStack Query
  - Created professional mobile UI with responsive design
  - Integrated with existing backend API endpoints for seamless data sync
- July 26, 2025: **Completed Comprehensive Testing of All 17 Requirements**
  - Systematically tested and verified all core platform modules
  - Confirmed working status of user authentication, profile management, organization creation
  - Validated facility management, team creation, event scheduling, and live scoring system
  - Tested search functionality, achievement tracking, and statistics systems
  - Verified 206 Kerala sports organizations with proper hierarchical structure
  - Confirmed live demo data with Kerala Warriors vs Chennai Champions match
  - All backend API endpoints tested and operational (25+ endpoints)
  - Created comprehensive testing report documenting full system functionality
- July 10, 2025: Completed organization creation flow with member tagging and Super Admin dashboard
  - Created comprehensive organization creation page with 3-step wizard including member tagging system
  - Built Super Admin dashboard with user approval workflow and comprehensive user management
  - Added Super Admin credentials (superadmin@sportfolio.com / SportfolioAdmin123) with exclusive access
  - Implemented sports interest popup for first-time users with flexible sports selection (no minimum requirement)
  - Enhanced home page with events display featuring subscription-based registration notices
  - Added organization creation API endpoints with approval workflow integration
  - Created dedicated routes for organization creation and Super Admin management
- July 8, 2025: Implemented profile photo verification system and organization management with completion tracking
  - Added profile photo upload with verification status (verified/pending/rejected/unverified)
  - Implemented 3-year photo verification renewal cycle system
  - Created organization logo upload and management features
  - Added registration/license number fields for organizations
  - Built profile completion percentage system with motivational progress tracking
  - Implemented DD/MM/YYYY date format for all date inputs
  - Fixed database compatibility issues and user authentication errors
  - Created mock API endpoints for photo and logo upload functionality
  - Enhanced user dashboard with completion statistics and progress bars
- July 6, 2025: Successfully implemented comprehensive seed data for College Sports League Kerala 2025-2026
  - Created Sports Director user (emailcslkerala@gmail.com) and Admin Ahammed Sukarno B (mysportfolioindia@gmail.com)
  - Established College Sports League Kerala organization with proper verification
  - Generated two events: 2024-2025 (free) and 2025-2026 (Rs. 5000/team + Rs. 500/member fees)
  - Populated 10 sports categories including dedicated Multi-Sport category for league events
  - Fixed database schema compliance issues and foreign key constraints
- January 4, 2025: Implemented comprehensive user dashboard system with profile management
- Added sports questionnaire with Olympic events coverage for analytics
- Created user organizations and achievements tracking with blockchain verification
- Enhanced database schema with profile fields, sports interests, and organization management
- Implemented intelligent routing based on user authentication and role
- Added professional landing page with modern design patterns
- Extended API routes for user profile updates and sports interests management

## Changelog
- January 4, 2025: User dashboard system with questionnaires and profile management completed
- June 29, 2025: Initial setup with approval system and role-based access control
- June 29, 2025: Backend integration and CORS configuration completed

## User Preferences

Preferred communication style: Simple, everyday language.