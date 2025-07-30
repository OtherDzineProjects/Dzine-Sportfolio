# Sportfolio - Sports Management Platform

<p align="center">
  <img src="attached_assets/Sportfolio_logo with white back ground_1751832551423.png" alt="Sportfolio Logo" width="200"/>
</p>

<p align="center">
  <strong>A comprehensive blockchain-powered sports ecosystem platform revolutionizing athlete management and performance tracking</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-documentation">API</a> •
  <a href="#mobile-app">Mobile App</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 🌟 Overview

Sportfolio is a cutting-edge sports management platform designed specifically for the Indian sports ecosystem. It seamlessly connects athletes, coaches, facilities, and organizations through a secure, blockchain-powered platform that handles everything from user registration with approval workflows to live match scoring and certificate verification.

### 🎯 Key Highlights

- **17 Core Modules**: Complete sports management ecosystem
- **206 Kerala Organizations**: Pre-integrated hierarchical sports structure
- **Live Scoring System**: Real-time match updates and statistics
- **Mobile Application**: Full-featured React Native app for iOS and Android
- **Blockchain Integration**: Secure achievement certificates and verification
- **Role-Based Access**: Hierarchical permission system with 5 user levels

## ✨ Features

### 🏢 Core Modules

1. **Registration Management System**
   - Multi-stage approval workflow
   - User type selection (Athlete, Coach, Organization, Facility Manager)
   - Profile verification system

2. **Verification System**
   - 3-year photo verification cycle
   - Document validation
   - Blockchain-secured certificates

3. **Event Management**
   - Tournament creation and scheduling
   - Registration fee management
   - Participant tracking

4. **Live Scoring System**
   - Real-time match updates
   - Team statistics
   - Player performance tracking

5. **Facility Management**
   - Sports facility registration
   - Booking system
   - Maintenance tracking

6. **Performance Analytics**
   - Player statistics
   - Team performance metrics
   - Achievement tracking

7. **Financial Management**
   - Subscription tiers (Basic, Pro, Enterprise)
   - Payment processing
   - Revenue tracking

8. **Communication Hub**
   - In-platform messaging
   - Notification system
   - Event announcements

9. **Talent Scouting**
   - Player discovery
   - Performance-based recommendations
   - Scout networking

10. **Health & Safety**
    - Medical records management
    - Injury tracking
    - Safety protocols

11. **Scholarship Management**
    - Application processing
    - Eligibility tracking
    - Award management

12. **Inventory Management**
    - Equipment tracking
    - Resource allocation
    - Maintenance schedules

13. **Reporting & Analytics**
    - Comprehensive dashboards
    - Custom report generation
    - Data visualization

14. **Certificate Management**
    - Blockchain verification
    - Achievement certificates
    - Digital credentials

15. **Alumni Management**
    - Alumni network
    - Career tracking
    - Mentorship programs

16. **Team Management**
    - Squad creation
    - Member roles
    - Performance tracking

17. **Search & Discovery**
    - Advanced filtering
    - Organization search
    - Event discovery

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for state management
- **Wouter** for routing
- **Vite** build tool

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **JWT** authentication
- **bcryptjs** for password hashing
- **RESTful API** architecture

### Database
- **PostgreSQL** (Neon serverless)
- **Drizzle ORM**
- **Connection pooling**

### Mobile App
- **React Native** with Expo
- **React Native Paper** UI components
- **React Navigation** 6
- **AsyncStorage** for offline support

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sportfolio-platform.git
   cd sportfolio-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🚀 Usage

### Test Credentials

#### Super Admin
- **Email**: superadmin@sportfolio.com
- **Password**: SportfolioAdmin123

#### Organization Admin
- **Email**: emailcslkerala@gmail.com
- **Password**: CSLKerala

#### System Admin
- **Email**: mysportfolioindia@gmail.com
- **Password**: SportfolioIndia

#### Normal User (Athlete)
- **Email**: ahammedsukarno@gmail.com
- **Password**: test123

### Key Workflows

1. **User Registration**
   - Sign up as Athlete/Coach/Organization
   - Wait for admin approval
   - Complete sports interest questionnaire
   - Access platform features

2. **Event Management**
   - Create events (Organization Admin)
   - Set registration fees
   - Manage participants
   - Track event progress

3. **Live Scoring**
   - Start match
   - Update scores in real-time
   - Track player statistics
   - Generate match reports

## 📱 Mobile Application

The Sportfolio mobile app provides full platform functionality on iOS and Android devices.

### Features
- Complete authentication flow
- 5-screen tab navigation
- Real-time live scoring
- Offline support
- Push notifications

### Running the Mobile App
```bash
cd mobile-app
npm install
npm start
```

Use Expo Go app to scan the QR code and test on your device.

## 🔗 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/users` - List users (Admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/approve` - Approve user (Admin only)

### Organizations
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/:id` - Get organization details
- `PUT /api/organizations/:id` - Update organization

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event

### Live Scoring
- `GET /api/matches` - List matches
- `GET /api/matches/:id` - Get match details
- `POST /api/matches/:id/events` - Add match event
- `GET /api/matches/:id/live` - Get live match data

## 🤝 Contributing

We welcome contributions to Sportfolio! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain the existing code style
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kerala State Sports Council for organizational structure
- College Sports League Kerala for event framework
- All contributors who helped build this platform

## 📞 Support

For support, email mysportfolioindia@gmail.com or open an issue in the GitHub repository.

---

<p align="center">
  Made with ❤️ for the Indian Sports Community
</p>