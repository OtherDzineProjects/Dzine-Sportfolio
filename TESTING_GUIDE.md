# User Creation and Approval System Testing Guide

## Overview
The approval system requires all new user registrations to be approved by an admin before users can access the platform.

## Testing Steps

### 1. Admin Login
- Navigate to `/auth`
- Login with admin credentials:
  - Email: `admin@sportfolio.com`
  - Password: `admin123`
- After login, you'll be redirected to `/dashboard`

### 2. Access Admin Dashboard
- Click "Admin" in the navigation bar or go to `/admin`
- You should see the Admin Dashboard with three tabs:
  - Pending Approvals
  - User Management  
  - Role Management

### 3. Test User Registration
- Open a new incognito/private browser window
- Navigate to `/auth`
- Switch to "Register" mode
- Fill out the registration form:
  - Email: `testuser@example.com`
  - Username: `testuser`
  - Password: `password123`
  - First Name: `Test`
  - Last Name: `User`
  - Phone: `1234567890`
  - User Type: `Athlete`
- Submit the form
- You should see: "Registration Submitted! Your account is pending approval."
- The form will switch back to login mode

### 4. Test Login Before Approval
- Try logging in with the test user credentials
- You should get an authentication error because the account is pending approval

### 5. Admin Approval Process
- Return to your admin browser window
- Go to `/admin` (Admin Dashboard)
- In the "Pending Approvals" tab, you should see the new user registration
- Click "Approve" on the pending request
- Add optional comments in the approval dialog
- Click "Approve" to confirm
- The user status should change to "Approved"

### 6. Test Login After Approval
- Return to the incognito window
- Try logging in with the test user credentials again
- Login should now succeed and redirect to `/dashboard`

### 7. Test User Rejection (Optional)
- Register another test user
- In admin dashboard, click "Reject" instead of "Approve"
- Provide a rejection reason
- Confirm rejection
- Test that the rejected user cannot login

## System Features to Verify

### Registration Flow
- ✅ New users cannot auto-login after registration
- ✅ Registration creates user with `approvalStatus: 'pending'`
- ✅ Approval request is created in the system
- ✅ Proper success message displayed

### Admin Dashboard
- ✅ Pending approvals list displays correctly
- ✅ User information shows in approval cards
- ✅ Approve/Reject buttons function
- ✅ Status updates reflect in User Management tab
- ✅ Role assignment works

### Authentication
- ✅ Pending users cannot login
- ✅ Approved users can login successfully
- ✅ Rejected users cannot login
- ✅ Admin users have full access

### Database Integration
- ✅ User records created with correct approval status
- ✅ Approval records linked to users
- ✅ Role assignments persist
- ✅ Permission system enforced

## Default Roles Created
1. **Super Admin** (Level 5) - Full system access
2. **Admin** (Level 4) - Administrative access
3. **Moderator** (Level 3) - Content moderation
4. **Facility Manager** (Level 2) - Facility management
5. **User** (Level 1) - Standard access

## Troubleshooting

### If Admin Dashboard Shows 401 Errors
- Ensure you're logged in as admin
- Check that admin user has proper role assignment
- Verify JWT token is valid

### If Approval Actions Don't Work
- Check browser console for API errors
- Verify admin permissions in database
- Ensure approval request exists

### If New Users Can't Register
- Check database connection
- Verify schema is up to date
- Check server logs for errors

## API Endpoints for Manual Testing

### Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser", 
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "userType": "athlete"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sportfolio.com",
    "password": "admin123"
  }'
```

### Get Pending Approvals (requires admin token)
```bash
curl -X GET http://localhost:5000/api/admin/approvals \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Approve User (requires admin token)
```bash
curl -X POST http://localhost:5000/api/admin/approvals/1/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comments": "Approved by admin"}'
```

The system now enforces a complete approval workflow ensuring platform security and proper user onboarding.