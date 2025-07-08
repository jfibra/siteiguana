# Module 1: Authentication System - Complete Prompt

Build a complete authentication system for Site Iguana, a subscription-based website creation platform. This module should be fully functional on its own.

## Project Overview
Site Iguana is a service where users can request custom websites, choose subscription plans, and manage their projects. This authentication module is the foundation that other modules will build upon.

## Authentication Features Required

### 1. User Registration
- Clean, modern registration form with fields:
  - First Name
  - Last Name  
  - Email Address
  - Password (with strength validation)
  - Confirm Password
  - Terms of Service acceptance checkbox
- Email verification workflow
- Success confirmation page
- Professional Site Iguana branding throughout

### 2. User Login
- Secure login form with email and password
- "Remember me" functionality
- Password visibility toggle
- Clear error messages for invalid credentials
- Forgot password link

### 3. Password Reset
- Forgot password flow with email verification
- Secure password reset form
- Password strength requirements
- Confirmation of successful reset

### 4. User Dashboard
- Protected dashboard accessible only to authenticated users
- Welcome message with user's name
- Navigation to other features (placeholders for now)
- Account settings link
- Logout functionality

### 5. Account Management
- User profile editing (name, email, phone, company)
- Password change functionality
- Account deletion option
- Profile picture upload capability

## Design Requirements

### Brand Identity
- **Company Name**: Site Iguana
- **Colors**: Green and orange theme (iguana-inspired)
- **Style**: Modern, professional, friendly
- **Logo**: Include iguana-themed imagery or iconography

### UI/UX Standards
- Fully responsive design (mobile-first)
- Clean, intuitive forms with proper validation
- Loading states for all async operations
- Toast notifications for success/error states
- Consistent styling across all auth pages
- Accessibility best practices (ARIA labels, keyboard navigation)

### Visual Elements
- Gradient backgrounds using brand colors
- Card-based layouts for forms
- Subtle animations and transitions
- Professional typography
- Clear visual hierarchy
- Success/error state indicators

## Technical Specifications

### Pages to Create
1. `/auth/register` - User registration
2. `/auth/login` - User login  
3. `/auth/forgot-password` - Password reset request
4. `/auth/reset-password` - Password reset form
5. `/auth/verify-email` - Email verification
6. `/dashboard` - Protected user dashboard
7. `/profile` - User profile management

### Form Validation
- Client-side validation with immediate feedback
- Server-side validation for security
- Password strength requirements (min 8 chars, uppercase, lowercase, number)
- Email format validation
- Real-time validation feedback

### Security Features
- Secure password hashing
- Email verification before account activation
- Rate limiting on login attempts
- CSRF protection
- Secure session management
- Password reset token expiration

### Error Handling
- Comprehensive error messages
- Graceful handling of network errors
- User-friendly error pages
- Logging for debugging

## User Flows

### Registration Flow
1. User visits registration page
2. Fills out registration form
3. Submits form with validation
4. Receives verification email
5. Clicks verification link
6. Account activated, redirected to dashboard

### Login Flow
1. User visits login page
2. Enters credentials
3. Successful login redirects to dashboard
4. Failed login shows error message

### Password Reset Flow
1. User clicks "Forgot Password"
2. Enters email address
3. Receives reset email
4. Clicks reset link
5. Sets new password
6. Redirected to login with success message

## Content and Copy

### Welcome Messages
- "Welcome to Site Iguana - Where Your Business Gets the Perfect Website"
- "Join thousands of businesses who trust Site Iguana for their online presence"
- "Get started with your professional website in minutes"

### Form Labels and Placeholders
- Use friendly, conversational language
- Clear instructions for each field
- Helpful error messages that guide users

### Success Messages
- "Welcome aboard! Check your email to verify your account"
- "Password updated successfully"
- "Profile saved successfully"

## Success Criteria
- [ ] All authentication flows work smoothly
- [ ] Forms are properly validated
- [ ] Design is responsive and accessible
- [ ] Email verification system functions
- [ ] Password reset system works
- [ ] User sessions are properly managed
- [ ] Error handling is comprehensive
- [ ] Site Iguana branding is consistent
- [ ] Performance is optimized
- [ ] Security best practices are implemented

## Deliverables
- Complete authentication system with all pages
- Responsive design optimized for all devices
- Email templates for verification and password reset
- Error handling and validation throughout
- Documentation for setup and configuration
- Test suite covering all authentication flows

This module should be production-ready and serve as the foundation for the entire Site Iguana platform.
