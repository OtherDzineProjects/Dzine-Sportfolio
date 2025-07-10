# Event Organizer Dashboard Demo Guide

## Complete Flow Demonstration

### Step 1: User Creates Organization with Sports Interest & Facility Selection

**Organization Creation Process:**
1. **Login** → Admin user (mysportfolioindia@gmail.com / SportfolioIndia)
2. **Sports Popup** → Select sports interests (flexible selection - minimum 1)
3. **Dashboard** → Click "Create Organization" 
4. **Organization Wizard** → 3-step process:
   - **Basic Info**: Name, type, description, registration number
   - **Location & Contact**: Address, phone, email, district
   - **Sports & Facilities**: Select offered sports and available facilities

**Key Features:**
- Member tagging system for team building
- Sports selection from Kerala categories (Football, Basketball, Cricket, etc.)
- Facility availability selection (Indoor Stadium, Outdoor Ground, Swimming Pool, etc.)
- Upload organization logo
- Admin approval workflow

### Step 2: Event Organizer Views Organization Data

**Event Organizer Dashboard URL**: `/event-organizer`

**Features Available:**
1. **Event Selection Dropdown**
   - Choose from available events (College Sports League Kerala 2024-2025, 2025-2026)
   - Filter organizations by event eligibility

2. **Organization Overview**
   - Eligible organizations count
   - Total members across organizations
   - Sports offered summary
   - Facility types available

3. **Detailed Organization Table**
   - Organization name and type
   - Location (city, district)
   - Member count
   - Sports offered (with badges)
   - Facilities available (with badges)
   - Contact information (email, phone)
   - Approval status

### Step 3: Admin Downloads Organization Data

**Export Functionality:**
1. **Export All Data Button** → Downloads comprehensive JSON file
2. **Event-Specific Export** → Select event and export filtered data

**Export Contents:**
```json
{
  "timestamp": "2025-07-10T11:40:00.000Z",
  "event": "College Sports League Kerala 2025-2026",
  "exportData": [
    {
      "organizationId": 1,
      "organizationName": "Kerala Sports Academy",
      "organizationType": "academy",
      "district": "Thiruvananthapuram",
      "city": "Thiruvananthapuram",
      "sportsOffered": ["Football", "Basketball", "Swimming"],
      "facilitiesAvailable": ["Indoor Stadium", "Swimming Pool"],
      "memberCount": 25,
      "membersSportsInterests": [
        {
          "memberName": "John Doe",
          "memberRole": "athlete",
          "sportsInterests": ["Football", "Basketball"],
          "facilityPreferences": ["Indoor Stadium"]
        }
      ]
    }
  ],
  "summary": {
    "totalOrganizations": 1,
    "totalMembers": 25,
    "allSportsOffered": ["Football", "Basketball", "Swimming"],
    "allFacilitiesAvailable": ["Indoor Stadium", "Swimming Pool"]
  }
}
```

## API Endpoints for Organizers

1. **Export Organization Data**
   ```
   GET /api/admin/organizations/export
   Authorization: Bearer <admin-token>
   ```

2. **Event Organization Statistics**
   ```
   GET /api/admin/events/{eventId}/organization-stats
   Authorization: Bearer <admin-token>
   ```

## Demo Access Points

- **Event Organizer Dashboard**: http://localhost:5000/event-organizer
- **User Dashboard**: http://localhost:5000/user-dashboard-clean
- **Organization Creation**: http://localhost:5000/create-organization
- **Admin Login**: mysportfolioindia@gmail.com / SportfolioIndia

## Use Cases for Event Organizers

1. **Event Planning**: View eligible organizations and their capabilities
2. **Capacity Planning**: Check member counts and facility availability
3. **Communication**: Access organization contact information
4. **Requirements Matching**: Match event needs with organization offerings
5. **Data Export**: Download comprehensive data for offline analysis
6. **Finalization**: Review and finalize participant list with complete details