# Sportfolio Mobile App

A comprehensive hybrid mobile application for the Sportfolio sports management platform, built with React Native and Expo.

## Features

### 🔐 Authentication
- Welcome screen with branding
- User login and registration
- JWT token-based authentication
- Secure token storage with Expo SecureStore

### 🏠 Dashboard
- Personalized welcome with user info
- Live match scores with real-time updates
- Upcoming events overview
- Quick action buttons
- Team and achievement statistics

### 🏆 Events Management
- Browse all events with search and filters
- Event details with registration info
- Status tracking (upcoming, ongoing, completed)
- Registration with fee handling
- Create new events

### 👥 Teams Management
- View all teams with sport categories
- Team details and member rosters
- Join teams and manage memberships
- Create new teams
- Sport-specific filtering

### 🏟️ Facilities
- Discover sports facilities
- Location-based search
- Facility details and amenities
- Booking system integration
- Ratings and reviews

### 👤 Profile
- User profile management
- Statistics overview
- Settings and preferences
- Achievement tracking
- Account management

## Technical Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build system
- **React Navigation**: Screen navigation
- **React Native Paper**: Material Design components
- **TanStack Query**: Data fetching and caching
- **React Hook Form**: Form handling

### Backend Integration
- **Axios**: HTTP client for API calls
- **JWT Authentication**: Secure user sessions
- **Real-time Updates**: Live match score polling
- **Offline Support**: Query caching for offline access

## Architecture

### Navigation Structure
```
App
├── Auth Navigator
│   ├── Welcome Screen
│   ├── Login Screen
│   └── Signup Screen
└── Main Tab Navigator
    ├── Home (Dashboard)
    ├── Events
    ├── Teams
    ├── Facilities
    └── Profile
```

### State Management
- **React Context**: Global authentication state
- **TanStack Query**: Server state management
- **Local State**: Component-level state with hooks

### API Integration
- **Base URL**: Configurable for dev/prod environments
- **Authentication**: JWT tokens in headers
- **Error Handling**: Automatic token refresh and logout
- **Caching**: Optimistic updates and background refresh

## Setup Instructions

### Prerequisites
- Node.js (16+)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator
- Physical device with Expo Go app

### Installation
```bash
cd mobile-app
npm install
```

### Development
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Configuration

#### API Endpoint
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-domain.com/api'; // Production
```

#### App Configuration
Modify `app.json` for:
- App name and slug
- Bundle identifiers
- Permissions
- Build settings

## Features Implementation

### Authentication Flow
1. **Welcome Screen**: App introduction and navigation
2. **Login**: Email/password authentication with JWT
3. **Signup**: User registration with approval workflow
4. **Auto-login**: Persistent sessions with secure storage

### Real-time Features
- **Live Matches**: 5-second polling for score updates
- **Push Notifications**: Event reminders and match updates
- **Offline Support**: Cached data access without internet

### Search & Filtering
- **Global Search**: Events, teams, facilities
- **Smart Filters**: Sport categories, status, location
- **Sort Options**: Date, relevance, popularity

### User Experience
- **Material Design**: Native look and feel
- **Pull-to-refresh**: Data synchronization
- **Loading States**: Skeleton screens and indicators
- **Error Handling**: User-friendly error messages

## Build & Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
# Configure app.json for production
expo build:android --release-channel production
expo build:ios --release-channel production
```

### App Store Deployment
1. **iOS**: Upload to App Store Connect
2. **Android**: Upload to Google Play Console
3. **Over-the-Air Updates**: Expo updates for instant deployment

## Integration with Web Platform

### Shared Features
- **User Accounts**: Same authentication system
- **Data Sync**: Real-time synchronization
- **Cross-platform**: Seamless experience across devices

### API Compatibility
- **REST APIs**: Full compatibility with web platform
- **Data Models**: Shared TypeScript interfaces
- **Authentication**: JWT tokens work across platforms

## Performance Optimizations

### Bundle Size
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Lazy load screens
- **Asset Optimization**: Compressed images and icons

### Runtime Performance
- **React Query**: Efficient data caching
- **Lazy Loading**: On-demand component loading
- **Memory Management**: Automatic cleanup

### Network Optimization
- **Request Deduplication**: Prevent duplicate API calls
- **Background Sync**: Update data when app becomes active
- **Offline Caching**: Store essential data locally

## Future Enhancements

### Planned Features
- **Push Notifications**: Real-time match and event updates
- **Camera Integration**: Photo uploads for profiles and teams
- **Maps Integration**: Facility locations with directions
- **Social Features**: Follow teams and share achievements
- **Analytics**: Performance tracking and insights

### Technical Improvements
- **Biometric Authentication**: Fingerprint/Face ID login
- **Dark Theme**: System theme support
- **Accessibility**: Screen reader and navigation improvements
- **Testing**: Unit and integration test coverage

## Contributing

### Development Guidelines
1. Follow React Native best practices
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add loading states for all async operations
5. Test on both iOS and Android platforms

### Code Structure
- **Screens**: Individual app screens
- **Components**: Reusable UI components
- **Services**: API and utility functions
- **Navigation**: Screen routing configuration
- **Types**: TypeScript interface definitions

The mobile app provides a complete native experience for the Sportfolio platform, enabling users to manage their sports activities on the go with full feature parity to the web application.