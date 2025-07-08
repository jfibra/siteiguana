# Module 1: Authentication & User Management System

## Complete Project Prompt

Create a complete authentication and user management system for Site Iguana, a website subscription service platform. This module should be a fully functional authentication system with user registration, login, password management, and profile management.

## Project Overview

Site Iguana is a subscription-based service where customers can request custom websites. Users sign up, choose plans, request websites, and manage their ongoing subscriptions. This authentication module is the foundation that handles all user-related functionality.

## Core Features Required

### 1. User Registration & Login
- **Registration Form**: Email, password, first name, last name, company name (optional)
- **Login Form**: Email and password authentication
- **Email Verification**: Send confirmation emails for new registrations
- **Password Requirements**: Minimum 8 characters, at least one number, one uppercase letter
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Show loading indicators during authentication processes

### 2. Password Management
- **Forgot Password**: Email-based password reset flow
- **Password Reset**: Secure token-based password reset with expiration
- **Password Change**: Allow logged-in users to change their password
- **Password Strength Indicator**: Visual feedback on password strength

### 3. User Profile Management
- **Profile Editing**: Update personal information (name, email, company, phone)
- **Profile Picture**: Upload and manage profile images
- **Account Settings**: Email preferences, notification settings
- **Account Status**: View account status and creation date

### 4. Admin User Management
- **Admin Dashboard**: View all users, their roles, and status
- **User Search**: Search users by name, email, or company
- **User Actions**: Activate/deactivate accounts, reset passwords, change roles
- **User Details**: View detailed user information and activity history

### 5. Role-Based Access Control
- **User Roles**: Regular user and admin roles
- **Protected Routes**: Restrict access based on user roles
- **Permission Checks**: Verify user permissions for specific actions
- **Admin-Only Features**: Certain features only accessible to admins

## User Interface Requirements

### Design Style
- **Modern & Clean**: Professional business appearance using green and orange color scheme
- **Mobile Responsive**: Works perfectly on all device sizes
- **Site Iguana Branding**: Use iguana-themed colors and imagery
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation

### Key Pages/Components
1. **Login Page** - Clean login form with "forgot password" link
2. **Registration Page** - Step-by-step registration with validation
3. **Dashboard** - Welcome page after login with navigation to other features
4. **Profile Page** - Comprehensive profile management interface
5. **Admin Panel** - User management interface for administrators
6. **Email Templates** - Professional email templates for verification and reset

### Visual Elements
- **Loading Spinners**: Smooth loading animations
- **Success/Error Messages**: Toast notifications for feedback
- **Form Validation**: Inline validation with helpful messages
- **Profile Pictures**: Avatar display with upload functionality
- **Data Tables**: Clean tables for admin user management

## Functional Requirements

### Authentication Flow
1. **New User Registration**:
   - User fills registration form
   - System validates all fields
   - Account created with "pending" status
   - Verification email sent
   - User clicks email link to activate account
   - Account activated and user can login

2. **Password Reset Flow**:
   - User enters email on forgot password page
   - System sends reset email with secure token
   - User clicks email link and enters new password
   - Password updated and user can login

3. **Profile Management**:
   - Users can update their information
   - Changes are validated and saved
   - Profile pictures are uploaded and stored
   - Email changes require re-verification

### Admin Features
1. **User Overview**: Dashboard showing total users, active users, recent registrations
2. **User Management**: Search, filter, and manage all user accounts
3. **Bulk Actions**: Perform actions on multiple users at once
4. **User Impersonation**: Ability to login as a user for support purposes
5. **Activity Monitoring**: Track user login activity and changes

### Security Features
1. **Secure Password Storage**: Passwords properly hashed and salted
2. **Session Management**: Secure session handling with appropriate timeouts
3. **CSRF Protection**: Protection against cross-site request forgery
4. **Rate Limiting**: Prevent brute force attacks on login forms
5. **Email Verification**: Ensure email addresses are valid and owned
6. **Secure Password Recovery**: Time-limited, single-use reset tokens

## Technical Specifications

### Email System
- **Verification Emails**: Welcome email with account activation link
- **Password Reset**: Secure reset link with 1-hour expiration
- **Profile Changes**: Notification emails for important account changes
- **Admin Notifications**: Alerts for admin actions and new user registrations

### File Upload
- **Profile Pictures**: Support JPG, PNG, GIF formats up to 5MB
- **Image Processing**: Automatic resizing and optimization
- **Secure Storage**: Files stored securely with proper access controls

### Data Validation
- **Email Validation**: RFC-compliant email validation
- **Password Security**: Enforce strong password requirements
- **Input Sanitization**: Prevent XSS and injection attacks
- **File Validation**: Verify uploaded files are safe images

## User Experience Guidelines

### Registration Experience
- **Simple Process**: Minimal required fields, optional company info
- **Clear Progress**: Show users what step they're on
- **Helpful Validation**: Real-time feedback on form fields
- **Professional Messaging**: Clear, friendly error messages and instructions

### Login Experience
- **Quick Access**: Fast, straightforward login process
- **Remember Me**: Option to stay logged in on trusted devices
- **Error Handling**: Clear messages for wrong credentials or account issues
- **Recovery Options**: Easy access to password reset and account help

### Profile Management
- **Intuitive Interface**: Easy-to-use profile editing forms
- **Visual Feedback**: Show what has changed and what's saved
- **Image Upload**: Drag-and-drop or click-to-upload profile pictures
- **Account Security**: Easy password changes with security confirmations

## Success Criteria

### Functionality
- [ ] Users can successfully register new accounts
- [ ] Email verification system works reliably
- [ ] Login/logout functions properly
- [ ] Password reset flow is secure and functional
- [ ] Profile updates save correctly
- [ ] Admin panel allows proper user management
- [ ] Role-based permissions work correctly

### Performance
- [ ] Pages load in under 2 seconds
- [ ] Forms respond immediately to user input
- [ ] File uploads process quickly
- [ ] Email delivery is reliable and fast

### Security
- [ ] All passwords are securely hashed
- [ ] Sessions are properly managed
- [ ] Email verification prevents fake accounts
- [ ] Admin actions are properly logged
- [ ] File uploads are secure

### User Experience
- [ ] Mobile experience is smooth and responsive
- [ ] Error messages are helpful and clear
- [ ] Success feedback is immediate and obvious
- [ ] Navigation is intuitive throughout

## Deliverables

1. **Complete Authentication System** - Registration, login, logout functionality
2. **User Profile Management** - Full profile editing with image upload
3. **Admin User Management** - Complete admin panel for user administration
4. **Email System** - All authentication-related emails working
5. **Security Implementation** - All security features properly implemented
6. **Responsive Design** - Works perfectly on all devices
7. **Documentation** - Clear setup and usage instructions

This authentication module should be production-ready and serve as the foundation for the entire Site Iguana platform. Users should have a smooth, professional experience from their first visit through ongoing account management.
