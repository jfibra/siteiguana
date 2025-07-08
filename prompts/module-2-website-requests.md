# Module 2: Website Request System - Complete Prompt

Build a comprehensive website request system for Site Iguana that allows users to submit detailed requests for custom websites through an intuitive multi-step wizard.

## Project Overview
This module enables users to request custom websites by providing business information, design preferences, and project requirements. The system should guide users through a smooth, professional process that collects all necessary information for website creation.

## Core Features Required

### 1. Website Request Wizard
Create a 5-step wizard that guides users through the request process:

#### Step 1: Business Information
- Business name (required)
- Business type/industry (dropdown with common options)
- Business description (textarea)
- Target audience description
- Primary website goals (dropdown: generate leads, sell products, showcase work, etc.)

#### Step 2: Design & Style Preferences
- Color scheme selection (visual color palette options)
- Website style preferences (modern, classic, minimalist, bold, etc.)
- Layout preferences (single page, multi-page, grid-based)
- Reference websites (optional field for inspiration links)

#### Step 3: Pages & Features
- Required pages checklist (Home, About, Contact, Services, Blog, etc.)
- Special features needed (e-commerce, booking system, gallery, etc.)
- Social media integration requirements
- Contact form specifications

#### Step 4: Content & Assets
- Content readiness (user provides content vs. needs help creating it)
- Logo upload capability
- Image/asset upload area
- Special content requirements

#### Step 5: Timeline & Budget
- Preferred timeline (urgent, standard, flexible)
- Budget range selection
- Additional requirements (open text field)
- Review and submit

### 2. Request Management
- Save progress functionality (localStorage for now)
- Request submission confirmation
- Email confirmation to user
- Request status tracking
- Edit/update submitted requests

### 3. Request Dashboard
- List of all user's website requests
- Status indicators (pending, in review, approved, in progress, completed)
- Request details view
- Action buttons (edit, duplicate, cancel)
- Progress tracking for approved requests

## Design Requirements

### User Experience
- Intuitive step-by-step progression
- Clear progress indicators
- Save and continue later functionality
- Visual design elements and examples
- Mobile-responsive throughout
- Smooth transitions between steps

### Visual Design
- Site Iguana branding (green/orange theme)
- Professional, modern interface
- Card-based step layouts
- Visual progress bar
- Icon usage for different sections
- Clean typography and spacing

### Interactions
- Smooth page transitions
- Form validation with immediate feedback
- File upload with progress indicators
- Tooltip help text for complex fields
- Confirmation dialogs for important actions

## Functional Specifications

### Form Components
- Multi-step wizard with navigation
- Dynamic form fields based on selections
- File upload components
- Color picker/palette selector
- Checkbox and radio button groups
- Text areas with character counts
- Dropdown menus with search capability

### Data Collection
- Comprehensive business information
- Design and style preferences
- Functional requirements
- Content and asset details
- Timeline and budget constraints
- Contact preferences

### Validation & Error Handling
- Step-by-step validation
- Required field enforcement
- File type and size validation
- Email format validation
- Graceful error messages
- Network error handling

## Content and User Guidance

### Help Text and Tooltips
- Helpful explanations for each step
- Examples of good business descriptions
- Design style explanations with visuals
- Feature descriptions and benefits
- Timeline and budget guidance

### Success Messages
- Step completion confirmations
- Final submission success page
- Email confirmation messages
- Progress update notifications

### Educational Content
- Tips for writing effective business descriptions
- Design style guide with examples
- Feature comparison charts
- Timeline expectation setting

## User Flows

### New Request Flow
1. User clicks "Request New Website"
2. Wizard guides through 5 steps
3. Progress is saved automatically
4. User reviews final submission
5. Confirmation and email sent
6. Request appears in dashboard

### Request Management Flow
1. User views request dashboard
2. Can filter/sort requests
3. Click to view detailed request
4. Edit or update if status allows
5. Track progress and updates

### Save and Resume Flow
1. User starts request but doesn't finish
2. Progress automatically saved
3. User returns later
4. Can resume from where they left off
5. Data pre-populated from saved state

## Advanced Features

### Smart Recommendations
- Suggest features based on business type
- Recommend design styles for industry
- Budget guidance based on requirements
- Timeline suggestions based on complexity

### Visual Design Tools
- Color palette generator
- Style preview examples
- Layout mockup previews
- Feature comparison tool

### Request Analytics
- Track completion rates by step
- Popular feature combinations
- Common business types and needs
- User behavior insights

## Validation Rules

### Required Information
- Business name and description
- At least one design preference
- Minimum set of required pages
- Contact information
- Budget range selection

### File Upload Restrictions
- Logo files: PNG, JPG, SVG max 5MB
- Asset files: Common image formats max 10MB each
- Maximum 10 files per request
- Virus scanning (if possible)

### Content Guidelines
- Business description: 50-500 characters
- Special requirements: 1000 character limit
- Reference URLs: Valid URL format
- Minimum information for processing

## Success Criteria
- [ ] Complete 5-step wizard functions smoothly
- [ ] All form validation works properly
- [ ] File uploads work reliably
- [ ] Progress saving and resuming works
- [ ] Request dashboard displays correctly
- [ ] Email confirmations are sent
- [ ] Mobile experience is excellent
- [ ] Loading states and errors handled
- [ ] Accessibility standards met
- [ ] Site Iguana branding consistent

## Integration Points
- Authentication system (users must be logged in)
- Email system for confirmations
- File storage for uploaded assets
- Request status management
- User dashboard integration

## Deliverables
- Complete website request wizard (5 steps)
- Request management dashboard
- File upload functionality
- Email confirmation system
- Mobile-responsive design
- Form validation throughout
- Progress saving mechanism
- Request status tracking
- User documentation
- Admin review interface (basic)

This module should provide a comprehensive, professional way for users to request custom websites while collecting all necessary information for the development team.
