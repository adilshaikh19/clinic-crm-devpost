# Clinic ERP System

A comprehensive multi-tenant web application for managing clinic operations including user management, patient records, appointments, and prescriptions.

## Latest Updates (v1.4.16)

### 🔧 Enhanced Authentication System - Dual Token Support
- **Flexible Authentication Middleware**: Enhanced authentication system with dual token support for improved API compatibility
  - **Authorization Header Support**: Primary authentication method using `Bearer` token in Authorization header
  - **Cookie Fallback**: Maintains backward compatibility with existing cookie-based authentication
  - **Enhanced Security**: Supports both web application and API client authentication patterns
  - **Improved Logging**: Comprehensive authentication flow logging for better debugging and monitoring
  - **Token Priority**: Authorization header takes precedence over cookies for modern API standards
  - **Cross-Platform Compatibility**: Enables mobile app integration and third-party API access
  - **Seamless Migration**: Existing cookie-based authentication continues to work without changes

### Previous Updates (v1.4.15)

### 🎨 UI/UX Enhancement - Optimized Sidebar Transition System
- **Streamlined DashboardLayout Component**: Enhanced sidebar transition performance with cleaner CSS implementation
  - **Simplified CSS Classes**: Removed redundant `dashboard-container` and `main-content-transition` classes for cleaner markup
  - **Unified Transition System**: Consolidated transition handling with single `transition-all duration-300 ease-in-out` class
  - **Optimized Performance**: Removed unnecessary `transform: translateZ(0)` GPU layer forcing for better browser optimization
  - **Cleaner Inline Styles**: Simplified style object with only essential `marginLeft` property for sidebar positioning
  - **Consistent Animation**: Maintained smooth 300ms transition timing while reducing CSS complexity
  - **Better Maintainability**: Reduced CSS specificity and improved code readability for future enhancements

### Previous Updates (v1.4.14)

### 🔧 Development Experience Enhancement - ResizeObserver Error Suppression
- **Aggressive ResizeObserver Error Handling**: Comprehensive solution to eliminate ResizeObserver console errors
  - **Complete Error Suppression**: Multi-layered approach to prevent ResizeObserver loop errors from appearing in console
  - **Safe ResizeObserver Wrapper**: Custom SafeResizeObserver class that wraps the native ResizeObserver with error handling
  - **RequestAnimationFrame Integration**: Uses requestAnimationFrame to prevent timing-related ResizeObserver loops
  - **Console Method Override**: Intelligent console.error and console.warn filtering to suppress ResizeObserver messages
  - **Global Error Handling**: Window error event listeners with capture phase for comprehensive error catching
  - **React DevTools Integration**: Special handling for React development tools to prevent ResizeObserver interference
  - **Production-Safe Implementation**: Environment-aware error handling that maintains debugging capabilities for non-ResizeObserver errors
  - **Multiple Suppression Layers**: 6-layer approach ensuring complete elimination of ResizeObserver console noise
  - **Developer Experience**: Clean console output during development without losing important error information

### Previous Updates (v1.4.13)

### 🔧 Enhanced Doctor Profile Management
- **Extended Doctor Information Fields**: Added comprehensive doctor profile management with professional credentials
  - **Medical License Number**: Track and display medical license information for regulatory compliance
  - **Professional Qualifications**: Store detailed educational and professional qualifications (e.g., MBBS, MD, PhD)
  - **Years of Experience**: Numeric field to track professional experience with validation (0-50 years)
  - **Enhanced User Creation**: CreateUser component now includes all doctor-specific fields with conditional display
  - **Improved Staff Display**: StaffList component shows doctor credentials with professional badges and indicators
  - **Complete Edit Functionality**: EditUser component supports full doctor profile editing with all new fields
  - **Backend Integration**: Full backend support with validation, storage, and retrieval of doctor credentials
  - **Professional UI Elements**: Enhanced visual display with color-coded badges for license, experience, and qualifications

### Previous Updates (v1.4.12)

### 🎨 Enhanced Prescription Viewing Interface
- **Professional ViewPrescription Component**: Enhanced prescription viewing with modern UI design
  - **Authentication Integration**: Added useAuth hook for user context and role-based functionality
  - **Enhanced Icon System**: Comprehensive Lucide React icons for better visual hierarchy
    - Medical context indicators (Stethoscope)
    - Navigation elements (ArrowLeft, Printer)
    - Information display icons (Calendar, User, Phone, MapPin, Mail)
  - **Professional Medical Layout**: Clean, print-ready prescription format suitable for clinical use
  - **Improved User Experience**: Better visual feedback and navigation patterns
  - **Responsive Design**: Mobile-friendly layout with professional medical document styling

### 🔧 Enhanced Clinic Registration System
- **Custom Clinic ID Support**: Users can now specify their own clinic identifiers during registration
  - **Real-time Availability Checking**: Instant validation of clinic ID availability as users type
  - **Format Validation**: Alphanumeric clinic IDs (3-20 characters) with comprehensive validation
  - **Visual Feedback**: Color-coded input fields (green for available, red for unavailable/invalid)
  - **Enhanced User Experience**: Clear guidance and error messages for clinic ID selection
  - **Backend Validation**: Server-side validation ensures clinic ID uniqueness and format compliance
  - **API Endpoint**: New `/auth/check-clinic-id/:clinicId` endpoint for availability checking

### Previous Updates (v1.4.11)

### 🎨 UI/UX Enhancement - Full-Width Patient Form Layout
- **Enhanced PatientForm Layout**: Improved form layout with better space utilization
  - **Full-Width Container**: Removed width constraints to allow form to utilize full available screen width
  - **Responsive Design**: Better adaptation to different screen sizes and resolutions
  - **Improved Space Utilization**: More comfortable form interaction on larger screens
  - **Enhanced User Experience**: Better use of available screen real estate for form content

### Previous Updates (v1.4.10)

### 🎨 UI/UX Enhancement - Advanced Patient Form Action Bar
- **Enhanced PatientForm Action Bar**: Professional form completion experience with advanced UX patterns
  - **Responsive Button Layout**: 
    - **Mobile-First Design**: Column layout on mobile, row layout on desktop for optimal usability
    - **Required Fields Indicator**: Helpful guidance text "All fields marked with * are required"
    - **Professional Spacing**: Improved padding and gap management between action elements
  - **Advanced Button Design**:
    - **Enhanced Cancel Button**: X icon integration with improved hover states and border transitions
    - **Sophisticated Submit Button**: Dynamic loading states with animated spinner and contextual messaging
    - **Visual Feedback System**: Enhanced shadow effects and hover animations for better user interaction
    - **Accessibility Features**: Proper disabled states with opacity changes and cursor management
  - **Form Field Improvements**:
    - **Medical Notes Enhancement**: Comprehensive placeholder text and improved textarea styling
    - **Hover Effects**: Consistent transition animations throughout form elements
    - **Visual Polish**: Better integration of form controls with overall design system

### Previous Updates (v1.4.9)

### 🎨 UI/UX Enhancement - Enterprise Patient Form Interface
- **Enterprise PatientForm Component**: Professional patient management interface with modern design architecture
  - **Split-Layout Architecture**: 
    - **Dedicated Header Section**: Full-width header with white background and bottom border separation
    - **Full-Width Layout**: Header section optimized with full container width (w-full) for maximum screen utilization
    - **Contextual Navigation**: Patient Management badge with 14px User icon and clear section identification
    - **Professional Typography**: Large title with descriptive subtitle for enhanced user guidance ("Edit Patient Information" vs "Add New Patient")
    - **Consistent Branding**: Proper spacing and alignment for enterprise-grade appearance
  - **Enhanced Form Design**:
    - **Modern Card Layout**: Single rounded-2xl card container with subtle shadows and clean borders
    - **Improved Message System**: Enhanced success/error messages with icons (PlusCircle for success, X for error)
    - **Professional Visual Hierarchy**: Better spacing between sections with consistent padding (p-6)
    - **Responsive Design**: Maintains existing grid layouts while improving overall visual structure
  - **Improved User Experience**:
    - **Visual Feedback System**: Color-coded message states with proper icon integration
    - **Enhanced Accessibility**: Better contrast and visual separation between header and form content
    - **Professional Action Bar**: Clean button layout with proper spacing at form bottom
    - **Consistent Design Language**: Matches enterprise CreateUser component styling patterns

### Previous Updates (v1.4.8)

### 🎨 UI/UX Enhancement - Enterprise Staff Creation Interface
- **Enterprise CreateUser Component**: Professional staff creation interface with advanced UX patterns
  - **Split-Layout Architecture**: 
    - **Dedicated Header Section**: Full-width header with white background and bottom border separation
    - **Contextual Navigation**: Activity badge with 14px icon and clear section identification
    - **Professional Typography**: Large title with descriptive subtitle for enhanced user guidance
    - **Consistent Branding**: Proper spacing and alignment for enterprise-grade appearance
  - **Advanced Form Design**:
    - **Responsive Grid Layout**: 3-column personal info, 2-column role/password sections with mobile adaptation
    - **Real-time Validation**: Inline field validation with immediate feedback and error highlighting
    - **Enhanced Security UX**: Password visibility toggles with eye/eye-off icons for better usability
    - **Professional Card Design**: Rounded-2xl corners with subtle shadows and clean borders
  - **Improved User Experience**:
    - **Visual Feedback System**: Color-coded error states with red borders and background highlights
    - **Loading States**: Animated spinner with contextual loading messages during form submission
    - **Accessibility Features**: Proper ARIA labels, keyboard navigation, and screen reader support
    - **Professional Action Bar**: Clean button layout with proper spacing and visual hierarchy

### Previous Updates (v1.4.6)

### 🎨 UI/UX Enhancement - Premium Staff Creation Interface
- **Premium CreateUser Component**: Complete visual overhaul with modern design language
  - **Gradient Background**: Beautiful gradient background (gray-50 to gray-100) for enhanced visual appeal
  - **Centered Layout**: Improved max-width (3xl) with centered alignment for better focus
  - **Enhanced Header Design**: 
    - Centered header layout with improved typography hierarchy
    - Modern badge design with white background, shadow, and border
    - Larger Activity icon (16px) with distinct primary-600 color
    - Updated title "Add New Team Member" with descriptive subtitle
  - **Premium Card Design**: 
    - Rounded-3xl corners for modern aesthetic
    - Enhanced shadow-2xl for depth and premium feel
    - Improved border styling with gray-200
    - Overflow-hidden for clean edges
  - **Enhanced Message System**:
    - Larger message containers with improved padding (p-4)
    - Better icon sizing (20px) with proper positioning
    - Enhanced color schemes for success/error states
    - Improved typography with font-medium for better readability
  - **Refined Form Layout**: Maintained efficient grid system with enhanced visual polish
  - **Professional Visual Hierarchy**: Improved spacing, typography, and color consistency throughout

### Previous Updates (v1.4.5)

### 🎨 UI/UX Enhancement - Staff Creation Form
- **Modernized CreateUser Component**: Completely redesigned staff creation interface
  - **Compact Grid Layout**: Transformed from sectioned form to efficient grid-based layout
  - **Responsive Design**: Optimized 2-column grid for desktop, single column for mobile
  - **Streamlined Visual Design**: Reduced visual clutter with cleaner spacing and typography
  - **Enhanced Form Density**: More information visible at once without scrolling
  - **Improved Field Organization**: Logical grouping of related fields (name/phone, role/specialization, password fields)
  - **Consistent Icon Sizing**: Standardized 18px icons throughout the form for visual harmony
  - **Refined Error Handling**: Smaller, more subtle error messages with consistent styling
  - **Modern Card Design**: Clean white card with subtle shadows and rounded corners
  - **Compact Header**: Streamlined page header with badge-style section indicator

### Previous Updates (v1.4.4)

### 🎨 UI/UX Enhancement
- **Enhanced Sidebar User Experience**: Improved multi-tenant awareness in navigation
  - Added clinic ID display in user info section for better context awareness
  - Enhanced visual feedback for users working in multi-tenant environment
  - Improved user experience with clear clinic identification

### Previous Updates (v1.4.3)

### 🔧 Patient Prescription History Enhancement
- **Enhanced Patient Prescription Endpoint**: Improved `GET /patients/:id/prescriptions` endpoint
  - Added comprehensive doctor information lookup for each prescription
  - Implemented efficient doctor data fetching with unique ID mapping
  - Enhanced prescription responses include complete prescribing doctor details (name, email, specialization)
  - Optimized database queries using lean() for better performance
  - Improved data structure for frontend consumption with doctor context

### Previous Updates (v1.4.2)

### 🔧 Prescription System Enhancements
- **Enhanced Prescription Viewing**: Improved prescription detail endpoint with comprehensive data
  - Added complete patient information to prescription responses
  - Enhanced role-based access control for doctor-patient prescription access
  - Improved authorization logic with proper ObjectId string comparison
  - Added doctor information to prescription responses for complete context
  - Streamlined patient data validation and error handling
- **Patient Prescription History Enhancement**: Enhanced patient prescriptions endpoint (`GET /patients/:id/prescriptions`)
  - Added doctor information lookup for each prescription in patient history
  - Implemented efficient doctor data fetching with unique ID mapping
  - Enhanced prescription responses with complete prescribing doctor details
  - Improved data structure for frontend consumption with doctor context

### Previous Updates (v1.4.1)

#### 🔧 Database Query Improvements
- **Enhanced ObjectId Handling**: Improved ObjectId conversion in doctor dashboard stats endpoint
  - Added safe ObjectId validation before conversion
  - Implemented error handling with fallback to original values
  - Prevents crashes from invalid ObjectId formats
  - Ensures robust database queries for doctor statistics

### Previous Updates (v1.4.0)

#### 🆕 Payment System Enhancement
- **Streamlined Payment Model**: Simplified and optimized Payment schema for better performance
- **Multi-Currency Support**: Added support for USD, EUR, GBP, INR, CAD, and AUD currencies
- **Enhanced Payment Methods**: Expanded payment options including cash, card, insurance, bank transfer, check, and online
- **Payment Status Lifecycle**: Complete status management (pending, completed, failed, refunded, cancelled)
- **Flexible Payment Types**: Categorization by service type (consultation, procedure, medication, lab test, other)
- **Improved Indexing**: Optimized compound indexes for efficient clinic-based queries

#### 🔧 Technical Improvements
- Removed complex invoice item arrays for simplified payment tracking
- Added automatic invoice number generation capability
- Enhanced payment validation with comprehensive field validation
- Improved payment filtering by date, method, status, and patient
- Added payment history tracking per patient
- Standardized payment API responses with populated references

### Previous Updates (v1.3.0)

#### Reports and Analytics System
- **Comprehensive Dashboard Statistics**: Real-time clinic metrics including patient counts, appointment trends, and status distributions
- **Detailed Reports**: Four specialized report types (appointments, patients, prescriptions, revenue) with advanced filtering
- **Role-based Access**: Doctors see filtered data, admins have full access to all reports including revenue analytics
- **Frontend Integration**: Complete React components with ReportsDashboard and dynamic Report viewer
- **API Integration**: Full reportsAPI service with comprehensive endpoint coverage

#### Technical Improvements
- Added complete `/reports` route system with 5 specialized endpoints
- Enhanced frontend with reports navigation and data visualization components
- Implemented role-based report filtering for data security
- Added comprehensive statistics aggregation with MongoDB pipelines
- Integrated reports into admin dashboard with quick access links
- **Code Consistency**: Standardized use of `req.user.userId` throughout all route handlers for consistent user identification

### Previous Updates (v1.2.0)

#### Enhanced User Management System
- **Activity Logging**: Complete audit trail for all user operations with ActivityLog model
- **User Status Management**: Activate/deactivate users with dedicated endpoints and UI controls
- **Profile Management**: Self-service profile and password updates with security validation
- **Doctor Dashboard Stats**: New statistics endpoint for doctor-specific metrics
- **Enhanced Security**: Improved permission controls and admin protection features

## Features

### Currently Implemented
- **Multi-tenant Architecture**: Each clinic operates independently with secure data isolation
- **Role-based Access Control**: Three distinct roles (Clinic Admin, Doctor, Receptionist)
- **User Authentication**: Secure login and clinic registration system
- **User Management**: Complete staff account creation and management by clinic admins
- **Patient Management**: Complete patient records and medical history tracking with receptionist interface
- **Dynamic Navigation**: Role-based sidebar navigation with contextual menu items
- **Admin Dashboard**: Comprehensive staff management interface with statistics
- **Receptionist Dashboard**: Patient management interface with search and statistics

### Recently Implemented
- **Prescription Management**: Complete digital prescription system with enhanced viewing interface
  - **Professional ViewPrescription Component**: Medical-grade prescription viewing with print functionality
  - **Enhanced UI Design**: Modern icon system with Lucide React icons for better visual hierarchy
  - **Authentication Integration**: Role-based access control with user context awareness
  - **Print-Ready Layout**: Professional medical document formatting suitable for clinical use
- **Appointment Management**: Complete appointment scheduling system with frontend and backend integration
  - **Enhanced CreateAppointment Component**: Professional appointment creation interface with modern UI design
    - **Enterprise Layout**: Split-layout architecture with dedicated header section and full-width design
    - **Enhanced Patient Information Section**: Improved form layout with icon integration and visual feedback
    - **Pre-filled Patient Support**: Automatic form population when booking for existing patients
    - **Responsive Grid Layout**: 4-column grid for patient information with mobile adaptation
    - **Professional Form Controls**: Enhanced input fields with icons, hover effects, and proper validation states
    - **Visual Status Indicators**: Clear badges for pre-filled data and contextual information
  - **DoctorAppointmentList Component**: Comprehensive appointment management interface for doctors
  - **Temporary Patient Booking**: Book appointments for walk-in patients without pre-registration
  - **Patient Registration from Appointments**: Convert temporary appointments to registered patients with one-click registration button
  - **Role-based Access**: Doctors see only their appointments, admin/receptionist see all clinic appointments
  - **Status Management**: Complete appointment lifecycle (scheduled, completed, cancelled, registered)
- **Reports and Analytics**: Comprehensive reporting system with dashboard statistics and detailed reports
- **Payment Management**: Streamlined payment and billing system with flexible payment tracking

### Planned Features
- **Prescription Management**: Digital prescription creation and tracking
- **Payment Dashboard**: Clinic-wide payment overview and analytics
- **Invoice Generation**: PDF invoice creation and automated delivery
- **Payment Reminders**: Automated due date notifications and payment tracking
- **Advanced Scheduling**: Calendar views and drag-and-drop appointment management
- **Enhanced Form Validation**: Real-time validation with inline error messages

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- **Enhanced JWT Authentication**: Dual token support (Authorization header + cookie fallback)
- bcrypt for password hashing

### Frontend
- React with React Router DOM
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management (AuthContext with useAuth hook)
- Lucide React for comprehensive icon system
- react-to-print for professional document printing

## Data Models

### Patient Model (Enhanced)
The Patient model has been significantly enhanced to support comprehensive medical record management:

**Core Information:**
- `clinicId` - Multi-tenant isolation
- `assignedDoctorId` - Reference to assigned doctor (ObjectId)
- `patientId` - Unique patient identifier within clinic
- `name`, `email`, `phone` - Basic contact information
- `dateOfBirth`, `gender` - Demographics

**Address Information:**
- Structured address object with `street`, `city`, `state`, `zipCode`, `country`

**Emergency Contact:**
- `name`, `relationship`, `phone` for emergency situations

**Medical History:**
- `allergies` - Array of known allergies
- `chronicConditions` - Array of ongoing medical conditions
- `currentMedications` - Array of current medications
- `bloodType` - Patient's blood type
- `notes` - Additional medical notes

**Features:**
- Compound index ensuring patient ID uniqueness within each clinic
- Optimized compound index for clinic isolation and doctor assignment queries
- Automatic `updatedAt` timestamp management
- Doctor assignment for role-based access control

### User Model (Enhanced)
- Multi-tenant user management with clinic isolation
- Role-based access (`clinic_admin`, `doctor`, `receptionist`)
- Email-based authentication with clinic-specific uniqueness
- **Enhanced Doctor Profiles**:
  - `specialization` - Medical specialization field
  - `licenseNumber` - Medical license number for regulatory compliance
  - `qualifications` - Educational and professional qualifications
  - `experience` - Years of professional experience (0-50 years)
- User status management with `isActive` field for account activation/deactivation

### Clinic Model
- Independent clinic registration and management
- Unique clinic identifiers for multi-tenant architecture
- Basic clinic information and contact details

### Appointment Model (Enhanced)
The Appointment model supports both registered patients and temporary walk-in appointments:

**Core Appointment Information:**
- `clinicId` - Multi-tenant isolation
- `appointmentId` - Unique appointment identifier
- `doctorId` - Reference to assigned doctor (ObjectId, required)
- `date` - Appointment date (required)
- `time` - Appointment time slot (required)
- `status` - Appointment status (`scheduled`, `completed`, `cancelled`, `registered`)
- `notes` - Additional appointment notes

**Patient Reference:**
- `patientId` - Reference to existing patient (ObjectId, optional)

**Temporary Patient Support (for walk-ins):**
When `patientId` is not provided, the appointment can store temporary patient data:
- `name`, `email`, `phone` - Basic contact information
- `dateOfBirth`, `gender` - Demographics
- `address` - Structured address object
- `emergencyContact` - Emergency contact information
- `medicalHistory` - Basic medical information
- `assignedDoctorId` - Doctor assignment for future patient registration

**Features:**
- Supports both pre-registered patients and walk-in appointments
- Automatic patient creation from temporary appointment data
- Status transition from `scheduled` to `registered` when temporary patient is converted
- Role-based access control (doctors see only their appointments)
- Compound indexing for efficient clinic-based queries

### Prescription Model (Enhanced)
The Prescription model provides comprehensive digital prescription management:

**Core Prescription Information:**
- `clinicId` - Multi-tenant isolation
- `prescriptionId` - Unique prescription identifier
- `patientId` - Reference to patient (String, required)
- `doctorId` - Reference to prescribing doctor (String, required)
- `medications` - Array of medication objects with detailed information
- `notes` - Additional doctor's notes and instructions
- `createdAt` - Automatic creation timestamp

**Medication Schema:**
Each medication in the medications array contains:
- `name` - Medication name (required, trimmed)
- `dosage` - Dosage information (required, trimmed)
- `frequency` - Frequency of administration (required, trimmed)
- `duration` - Duration of treatment (required, trimmed)

**Enhanced Features:**
- **Role-based Access Control**: Doctors can only view/create prescriptions for their assigned patients
- **Patient Data Integration**: Prescription responses now include complete patient information
- **Doctor Information**: Prescription responses include prescribing doctor details
- **Comprehensive Validation**: Server-side validation ensures data integrity
- **Clinic Isolation**: All prescriptions are strictly isolated by clinic

### Payment Model (Enhanced)
The Payment model provides streamlined payment and billing management:

**Core Payment Information:**
- `clinicId` - Multi-tenant isolation
- `paymentId` - Unique payment identifier within clinic
- `patientId` - Reference to patient (ObjectId, required)
- `appointmentId` - Optional reference to related appointment
- `amount` - Payment amount (required, minimum 0)
- `currency` - Payment currency (USD, EUR, GBP, INR, CAD, AUD)

**Payment Details:**
- `paymentMethod` - Payment method (`cash`, `card`, `insurance`, `bank_transfer`, `check`, `online`)
- `paymentType` - Type of service (`consultation`, `procedure`, `medication`, `lab_test`, `other`)
- `status` - Payment status (`pending`, `completed`, `failed`, `refunded`, `cancelled`)
- `description` - Optional payment description
- `invoiceNumber` - Optional invoice reference
- `notes` - Additional payment notes

**Date Management:**
- `dueDate` - Optional payment due date
- `paidDate` - Optional payment completion date
- `createdAt` - Automatic creation timestamp
- `updatedAt` - Automatic update timestamp

**User Tracking:**
- `createdBy` - Reference to staff member who created the payment record

**Features:**
- Compound indexes for efficient clinic-based queries
- Automatic timestamp management
- Flexible payment method and type categorization
- Multi-currency support with default USD
- Status-based payment lifecycle tracking

### Activity Log Model
- Comprehensive audit trail for all system operations
- Tracks create, update, delete, login, logout actions
- Supports multiple entity types (user, patient, appointment, prescription, clinic)
- Includes detailed descriptions and metadata for each action
- Clinic-isolated logging for multi-tenant security
- Optional IP address and user agent tracking for enhanced security
- Optimized indexes for efficient querying by clinic, user, entity, and date

### Payment Model (Streamlined)
The Payment model provides efficient payment and billing management:

**Core Payment Information:**
- `clinicId` - Multi-tenant isolation
- `paymentId` - Unique payment identifier within clinic
- `patientId` - Reference to patient (ObjectId, required)
- `appointmentId` - Optional reference to related appointment
- `amount` - Payment amount (required, minimum 0)
- `currency` - Payment currency with multi-currency support (USD, EUR, GBP, INR, CAD, AUD)

**Payment Classification:**
- `paymentMethod` - Method of payment (`cash`, `card`, `insurance`, `bank_transfer`, `check`, `online`)
- `paymentType` - Type of service (`consultation`, `procedure`, `medication`, `lab_test`, `other`)
- `status` - Payment lifecycle status (`pending`, `completed`, `failed`, `refunded`, `cancelled`)

**Additional Information:**
- `description` - Optional payment description
- `invoiceNumber` - Optional invoice reference number
- `notes` - Additional payment notes
- `dueDate` - Optional payment due date
- `paidDate` - Optional payment completion date
- `createdBy` - Reference to staff member who created the record

**Features:**
- Compound indexes for efficient clinic-based queries by patient, status, and date
- Automatic timestamp management with `createdAt` and `updatedAt`
- Flexible payment categorization system
- Multi-currency support with USD as default
- Status-based payment lifecycle tracking
- Clinic isolation for multi-tenant security

## Current Implementation Status

### Backend Components
- ✅ **Authentication System**: Complete with clinic registration and user login (email-based authentication with dual token support)
- ✅ **User Management**: Full CRUD operations for staff management
- ✅ **Multi-tenant Architecture**: Clinic isolation middleware implemented
- ✅ **Role-based Access Control**: RBAC middleware for route protection
- ✅ **Data Models**: Enhanced schemas with comprehensive patient management
  - **Patient Model**: Complete patient records with medical history, emergency contacts, and doctor assignments
  - **User Model**: Staff management with role-based permissions
  - **Clinic Model**: Multi-tenant clinic information
  - **Appointment Model**: Complete appointment scheduling with temporary patient support
  - **Payment Model**: Streamlined payment and billing management with multi-currency support
  - **Prescription Model**: Ready for implementation
- ✅ **Security**: Enhanced JWT authentication with dual token support, password hashing, input validation

### Recent Updates
- **Professional CreateUser Component**: Enterprise-grade staff creation interface with modern design architecture
  - **Split-Layout Architecture**: Dedicated header section with full-width design separated from form content
  - **Professional Visual Design**: Clean gray-50 background with white content areas and refined spacing
  - **Enterprise Header Design**: Full-width header with contextual badge, clear typography hierarchy, and professional branding
  - **Optimized Form Layout**: Responsive 3-column grid for personal information, 2-column for role/specialization and passwords
  - **Enhanced User Experience**: Real-time field validation with inline error messages and visual feedback
  - **Password Security Features**: Toggle visibility for password fields with eye/eye-off icons
  - **Consistent Design Language**: Standardized 18px icons, rounded-lg borders, and professional color palette
  - **Improved Accessibility**: Proper form labels, ARIA attributes, and keyboard navigation support
- **Enhanced Sidebar Component**: Improved user experience with clinic identification
  - **Clinic ID Display**: Added clinic ID visibility in the user info section for better multi-tenant awareness
  - **User Context Enhancement**: Users can now easily identify which clinic they're working in
  - **Improved Multi-tenant UX**: Enhanced visual feedback for multi-tenant environment navigation
- **Enhanced Protected Routes**: ProtectedRoute component now supports multi-role access control
  - **Multi-role Support**: Routes can now accept an array of allowed roles instead of just a single role
  - **Flexible Access Control**: Enables shared routes between multiple user types (e.g., admin and receptionist)
  - **Backward Compatibility**: Existing single-role route definitions continue to work unchanged
  - **Implementation**: `requiredRole={["clinic_admin", "doctor", "receptionist"]}` for multi-role access
- **Enhanced User Management System**: Complete overhaul of user management with advanced features
  - **Activity Logging**: All user operations (create, update, delete, activate/deactivate) are now logged with ActivityLog model
  - **User Status Management**: Added `isActive` field with dedicated activate/deactivate endpoints
  - **Profile Management**: Users can update their own profiles and passwords with security validation
  - **Doctor Dashboard Stats**: Comprehensive endpoint for doctor-specific statistics including:
    - Patient counts and appointment metrics (today, week, month, total)
    - Prescription statistics and trends
    - Upcoming appointments with patient details (next 5)
    - Recent patient history (last 10 completed appointments)
    - Appointment status distribution and completion/cancellation rates
    - Monthly appointment trends over 6-month period
    - **Enhanced ObjectId Handling**: Safe ObjectId conversion with validation and error fallback for robust database queries
  - **Enhanced Security**: Profile and password updates restricted to self or admin users
  - **Improved Error Handling**: Better validation and error messages for all user operations
  - **Role-based Access**: Multi-role support for user management operations
- **Patient List Component**: Complete PatientList component implementation for receptionists
  - Advanced search functionality across patient name, phone, and patient ID
  - Age calculation from date of birth with proper date handling
  - Doctor assignment display with specialization information
  - Quick action links for viewing, editing, and appointment booking
  - Patient statistics with gender breakdown and total counts
  - Responsive design with loading states and error handling
- **Patient Form Enhancement**: PatientForm component now supports both admin and receptionist roles for doctor assignment
  - Receptionists can now assign patients to doctors (previously admin-only feature)
  - Improved date handling for patient date of birth with proper ISO date formatting
  - Enhanced doctor fetching using userAPI instead of dedicated patient API endpoint
  - Better error handling and fallback for doctor list loading
- **Patient API Integration**: Patient management routes are now properly mounted and accessible via `/patients` endpoints
- **Authentication Consistency**: System now consistently uses `email` field for user authentication across all components (validation, routes, and frontend)
- **User Model Enhancement**: User schema uses `email` field with automatic lowercase transformation for consistency
- **Login Form Fix**: Frontend login component now properly uses `email` field instead of `username` for consistency
- **Appointment Management System**: Complete backend implementation with advanced features
  - **Enhanced CreateAppointment Interface**: Professional appointment creation with enterprise UI design (see CREATE-APPOINTMENT-ENHANCEMENT.md)
  - **Temporary Patient Support**: Book appointments for walk-in patients without pre-registration
  - **Patient Registration Workflow**: Convert temporary appointments to registered patients with automatic patient creation
  - **Role-based Access**: Doctors see only their appointments, admins and receptionists see all clinic appointments
  - **Flexible Booking**: Support both existing patient appointments and new patient walk-ins
  - **Status Management**: Track appointment lifecycle (scheduled, completed, cancelled, registered)
  - **Doctor Scheduling**: Query appointments by doctor and date for schedule management

### Backend API Implementation
- ✅ **Patient Management**: Complete CRUD operations with role-based access control
  - Patient creation with doctor assignment
  - Medical history tracking (allergies, conditions, medications, blood type)
  - Emergency contact management
  - Role-based data filtering (doctors see only assigned patients)
  - Comprehensive validation and error handling
- ✅ **User Management**: Complete staff management system with comprehensive features
  - User activation/deactivation functionality with status management
  - Profile and password update capabilities with security validation
  - Activity logging for all user operations (create, update, delete, activate/deactivate)
  - Doctor dashboard statistics with detailed metrics and trends
  - Enhanced ObjectId handling with safe conversion and error fallback
  - Role-based access control for all user operations
  - Enhanced security with admin protection features
- ✅ **Authentication**: Secure login and clinic registration
- ✅ **Appointment Management**: Complete appointment scheduling system
  - Appointment booking with existing patients
  - Temporary patient appointments (walk-in support)
  - Patient registration from temporary appointments
  - Role-based appointment access (doctors see only their appointments)
  - Appointment status management (scheduled, completed, cancelled, registered)
  - Doctor-specific appointment queries by date
- ✅ **Reports and Analytics**: Comprehensive reporting and statistics system
  - Dashboard statistics with overview metrics
  - Appointments report with filtering by date, status, and doctor
  - Patients report with demographic analysis and age grouping
  - Prescriptions report with medication frequency tracking
  - Revenue report based on completed appointments (simulated)
  - Role-based report access with data filtering
- ✅ **Payment Management**: Streamlined payment and billing system
  - Payment record creation with comprehensive validation
  - Multi-currency support (USD, EUR, GBP, INR, CAD, AUD)
  - Flexible payment methods (cash, card, insurance, bank transfer, check, online)
  - Payment status lifecycle management (pending, completed, failed, refunded, cancelled)
  - Patient-specific payment history tracking
  - Role-based payment access control
  - Invoice data generation (PDF generation ready)
- ✅ **Prescription Management**: Complete digital prescription system
  - Prescription creation with medication details (name, dosage, frequency, duration)
  - Role-based access control (doctors can only prescribe for assigned patients)
  - Enhanced prescription viewing with patient and doctor information
  - Prescription listing with filtering and search capabilities
  - Patient-specific prescription history with doctor information lookup
  - Doctor's notes and additional instructions support
  - Efficient doctor data fetching for prescription history endpoints

### Frontend Components
- ✅ **Authentication**: Login and clinic registration forms with AuthContext and useAuth hook
- ✅ **Admin Dashboard**: Enhanced staff management with comprehensive features
  - Staff creation, viewing, editing, and status management
  - User activation/deactivation functionality
  - Statistics and overview cards
  - Debug logging for API troubleshooting
- ✅ **User Creation Interface**: Professional staff creation form with enterprise-grade design
  - **Split-Layout Architecture**: Dedicated header section with full-width design separated from form content
  - **Professional Visual Design**: Clean gray-50 background with white content areas and refined spacing
  - **Enterprise Header Design**: Full-width header with contextual badge, clear typography hierarchy, and professional branding
  - **Responsive Grid System**: 3-column layout for personal info, 2-column for role/passwords, single column on mobile
  - **Enhanced Form Validation**: Real-time field validation with inline error messages and visual feedback indicators
  - **Password Security Features**: Toggle visibility for password fields with eye/eye-off icons for better UX
  - **Consistent Design Language**: Standardized 18px icons, rounded-lg borders, and professional color palette
  - **Improved Accessibility**: Proper form labels, ARIA attributes, and keyboard navigation support
  - **Professional Action Bar**: Clean button layout with loading states and proper visual hierarchy
  - **Enhanced Error Handling**: Contextual error messages with icons and proper color codingonsistent Icon System**: Standardized 18px Lucide React icons throughout the form
  - **Refined Error Handling**: Subtle, compact error messages with consistent styling
  - **Real-time Field Validation**: Immediate error feedback with field-specific validation clearing
  - **Password Visibility Controls**: Toggle buttons for both password and confirm password fields
  - **Role-specific Fields**: Dynamic specialization field display for doctor role selection
  - **Responsive Layout**: Mobile-first design that adapts seamlessly to different screen sizes
- ✅ **User Creation Form**: Modernized staff creation form with enhanced validation and UX:
  - **Comprehensive Client-side Validation**: Required field validation (name, email, password)
  - **Advanced Email Validation**: Regex pattern validation with real-time feedback
  - **Password Security**: Confirmation matching and minimum 6-character requirement
  - **Role-specific Fields**: Dynamic specialization field for doctor role selection
  - **Enhanced Visual Feedback**: Status icons (`CheckCircle`, `AlertCircle`) for success/error states
  - **Password Visibility Controls**: Toggle buttons with `Eye`/`EyeOff` icons for both password fields
  - **Compact Grid Design**: Efficient 2-column responsive layout replacing sectioned design
  - **Real-time Validation**: Field-specific error clearing when user starts typing
  - **Streamlined Error Display**: Compact error messages with consistent 12px icons
  - **Modern Form Controls**: Standardized input styling with 18px icons and consistent spacing
  - **Loading States**: Animated spinner with descriptive loading text
  - **Success/Error Messaging**: Prominent feedback messages with appropriate icons
- ✅ **Shared Patient Form**: Comprehensive patient creation and editing form component with:
  - Complete patient information (personal details, address, emergency contact)
  - Medical history tracking (allergies, conditions, medications, blood type)
  - Role-based doctor assignment (admin and receptionist can assign doctors)
  - Enhanced date handling and form validation
  - Automatic doctor list filtering from user API
- ✅ **Receptionist Components**: Dedicated receptionist interface components:
  - **PatientList**: Complete patient management interface with real-time search, age calculation, and quick actions
  - **PatientForm**: Wrapper component for enterprise PatientForm with receptionist-specific navigation and success handling
- ✅ **Patient Management Interface**: Complete patient management system with:
  - Real-time patient search by name, phone, or patient ID
  - Comprehensive patient information display with age calculation
  - Doctor assignment visibility with specialization details
  - Quick action buttons for viewing, editing, and appointment booking
  - Patient statistics dashboard with gender and total counts
  - Responsive table design with proper error handling
- ✅ **Doctor Components**: Doctor-specific interface components:
  - **DoctorAppointmentList**: Comprehensive appointment management interface with:
    - Real-time appointment filtering by patient name, status, and date
    - Appointment status management (scheduled, completed, cancelled, registered)
    - **Patient Registration from Appointments**: One-click patient registration for walk-in appointments
    - Patient contact information display
    - Quick action buttons for viewing, editing, and registering patients
    - Responsive table design with loading states and error handling
    - Integration with appointmentAPI service
- ✅ **Navigation System**: Enhanced sidebar navigation with role-based menu items
  - **Dynamic Menu Structure**: Role-specific navigation items with collapsible sidebar support
  - **Icon Integration**: Comprehensive icon system using Lucide React icons including:
    - `FileText` for prescription management features
    - `Clock` for doctor availability scheduling
    - `LayoutDashboard`, `Users`, `Calendar`, `BarChart2` for core functionality
    - `FilePlus`, `List` for action-specific menu items
    - `Settings`, `User`, `LogOut` for user management features
    - `Stethoscope` for clinic branding
    - `CheckCircle`, `AlertCircle` for status indicators and feedback
    - `Eye`, `EyeOff` for password visibility toggles
    - `UserIcon`, `Mail`, `Lock`, `Phone`, `Briefcase`, `PlusCircle`, `XCircle` for form components
    - `Loader2` for loading states and `Activity` for section headers
  - **Submenu Support**: Expandable menu sections for complex feature areas
  - **Active State Management**: Visual indicators for current page and menu sections
  - **Code Quality**: Clean, maintainable code with improved template literal formatting
- ✅ **Error Handling**: Robust error handling with user-friendly messages and comprehensive data validation
- ✅ **Protected Routes**: Enhanced role-based route protection with multi-role support and comprehensive route coverage for all user roles
- ✅ **Shared Components**: Enhanced sidebar with comprehensive icon system, navbar, loading spinner, dashboard layout, enterprise PatientForm
  - **Sidebar Component**: Role-based navigation with collapsible design and icon integration
    - Dynamic menu structure based on user role (admin, doctor, receptionist)
  - **Enterprise PatientForm**: Professional patient management interface with modern design architecture
    - Split-layout architecture with dedicated header section and contextual navigation
    - Enhanced form design with modern card layout and improved message system
    - Professional visual hierarchy with consistent branding and responsive design
    - Comprehensive icon system using Lucide React icons (FileText, Clock, LayoutDashboard, FilePlus, List, Settings, User, LogOut, Stethoscope, CheckCircle, AlertCircle, Eye, EyeOff, etc.)
    - Expandable submenu support for complex feature areas
    - Active state management with visual indicators
    - User profile display with role-based information and clinic ID visibility
    - Multi-tenant awareness with clinic identification in user info section
    - Clean, readable code formatting for better maintainability
- ✅ **Doctor Dashboard**: Basic implementation with user context integration and debug information
- ✅ **Receptionist Dashboard**: Enhanced dashboard with patient management quick actions and navigation links
- ✅ **Appointment System**: Complete appointment management system with frontend and backend integration
  - Doctor-specific AppointmentList component for viewing and managing appointments
  - Backend API with temporary patient support and patient registration workflow
  - Role-based appointment access (doctors see only their appointments)
- ✅ **Reports System**: Complete reports and analytics system with frontend components
  - ReportsDashboard component for report navigation
  - Report component for displaying filtered data
  - API integration with reportsAPI service
  - Dashboard statistics integration
- ✅ **Payment System**: Complete payment management frontend components
  - PatientPayments component for payment history and management
  - CreatePaymentModal for adding new payments
  - Payment status badges and method icons
  - Payment summary cards with statistics
  - Role-based payment management controls
  - API integration with paymentAPI service
- ✅ **Prescription System**: Complete prescription management frontend components
  - **CreatePrescription Component**: Comprehensive prescription creation form with:
    - Medication autocomplete with common medications database
    - Dynamic medication fields with add/remove functionality
    - Dosage suggestions and frequency templates
    - Doctor's notes and additional instructions
    - Form validation and error handling
  - **PrescriptionsList Component**: Doctor's prescription management interface with:
    - Real-time search by patient name or medication
    - Date filtering (today, week, month, all time)
    - Prescription preview with medication summary
    - Quick actions for viewing and printing prescriptions
  - **CreatePrescriptionPage Component**: Dedicated prescription creation page with patient context
  - **ViewPrescription Component**: Detailed prescription view with print functionality
  - **Patient Integration**: Prescription creation and viewing integrated into patient detail pages
- ⏳ **Appointment Creation Frontend**: Appointment booking forms planned

## Frontend API Services

The frontend uses a centralized API service architecture with dedicated service modules for different features:

### Authentication API (`authAPI`)
- User login and clinic registration
- **Enhanced JWT Token Management**: Supports both cookie-based and Authorization header authentication
- Session handling with dual authentication method support
- **API Compatibility**: Ready for mobile app integration and third-party API access

### User Management API (`userAPI`)
- Staff creation, viewing, editing, and deletion
- User status management (activate/deactivate)
- Profile and password updates
- Doctor dashboard statistics

### Patient Management API (`patientAPI`)
- Patient CRUD operations
- Medical history management
- Doctor assignment
- Patient search and filtering

### Appointment Management API (`appointmentAPI`)
- Appointment creation with patient and temporary patient support
- Appointment listing with role-based filtering
- Appointment updates including status changes and patient registration
- Appointment deletion (admin/receptionist only)
- Doctor-specific appointment queries by date
- Integration with DoctorAppointmentList component

### Reports API (`reportsAPI`)
- Dashboard statistics
- Detailed reports (appointments, patients, prescriptions, revenue)
- Role-based data filtering

### Prescription API (`prescriptionAPI`)
- **Prescription Creation**: Create prescriptions with detailed medication information
- **Prescription Listing**: Get all prescriptions with role-based filtering (doctors see only their prescriptions)
- **Patient Prescription History**: Get patient-specific prescriptions with enhanced doctor information
- **Enhanced Data Structure**: All prescription endpoints now include complete doctor details for better frontend integration
- **Patient-specific Prescriptions**: Retrieve prescription history for specific patients
- **Enhanced Prescription Viewing**: Get single prescription with complete patient and doctor information
- **Role-based Access Control**: Doctors can only access prescriptions for their assigned patients
- **Medication Management**: Support for multiple medications per prescription with detailed specifications

### Payment API (`paymentAPI`)
- Payment record management
- Patient payment history
- Invoice data generation
- Payment status updates

### Clinic API (`clinicAPI`)
- Clinic information management

### Availability API (`availabilityAPI`)
- Doctor availability management with Clock icon integration
- Schedule setting and retrieval
- Integration with doctor dashboard navigation

### API Configuration
The frontend API service (`frontend/src/services/api.js`) is configured with:
- **Cookie-based Authentication**: Uses `withCredentials: true` for automatic cookie handling
- **Backend Compatibility**: Works seamlessly with the enhanced dual authentication middleware
- **Automatic Token Management**: Handles authentication tokens transparently
- **Error Handling**: Includes response interceptors for 401 authentication errors

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clinic-erp-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   # Create .env file in the backend directory
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the frontend development server
   npm start
   ```



### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/clinic-erp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
NODE_ENV=development
```

**Note**: The server expects the `.env` file to be located in the backend directory (`backend/.env`). When running the server from the backend directory, dotenv will automatically locate this file.

## Application Routes

### Public Routes
- `/login` - User authentication
- `/register` - Clinic registration
- `/unauthorized` - Access denied page

### Protected Routes (Role-based)

The application uses an enhanced ProtectedRoute component that supports both single-role and multi-role access control:

**Single Role Example:**
```jsx
<ProtectedRoute requiredRole="clinic_admin">
  <AdminDashboard />
</ProtectedRoute>
```

**Multi-Role Example:**
```jsx
<ProtectedRoute requiredRole={["clinic_admin", "doctor", "receptionist"]}>
  <ReportsDashboard />
</ProtectedRoute>
```

#### Clinic Admin Routes
- `/admin` - Admin dashboard
- `/admin/users` - Staff management
- `/admin/patients` - Patient overview
- `/admin/appointments` - Appointment management
- `/reports` - Reports dashboard (accessible to admin, doctor, and receptionist)
- `/reports/:reportType` - Specific report views (appointments, patients, prescriptions, revenue)
  - All roles can access reports with role-based data filtering
  - Revenue reports restricted to admin users via API-level permissions

#### Doctor Routes
- `/doctor` - Doctor dashboard with comprehensive statistics
- `/doctor/appointments` - Personal appointments management with DoctorAppointmentList component
  - View and filter appointments by status and date
  - Update appointment status (scheduled, completed, cancelled, registered)
  - **Patient Registration**: Convert walk-in appointments to registered patients with one-click
  - Access patient contact information
  - Role-based filtering (doctors see only their appointments)
- `/doctor/patients` - Assigned patients management
- `/doctor/prescriptions` - Comprehensive prescription management with FileText icon navigation
  - **PrescriptionsList**: View all doctor's prescriptions with search and filtering
  - **Real-time Search**: Filter by patient name or medication
  - **Date Filtering**: Filter by today, week, month, or all time
  - **Prescription Preview**: View medication summary and doctor's notes
  - **Quick Actions**: View detailed prescription and print functionality
- `/doctor/prescriptions/new` - Create new prescription page
- `/doctor/prescriptions/:id` - View detailed prescription with print option
- `/doctor/patients/:patientId/prescriptions/new` - Create prescription for specific patient
- `/doctor/availability` - Doctor availability management with Clock icon navigation

#### Receptionist Routes
- `/receptionist` - Receptionist dashboard
- `/receptionist/patients` - Patient list and management interface
- `/receptionist/patients/new` - Add new patient
- `/receptionist/patients/:id` - View patient details
- `/receptionist/patients/:id/edit` - Edit patient information
- `/receptionist/appointments` - Appointment booking
- `/receptionist/appointments/new` - Book new appointment (with patient pre-selection)
- `/receptionist/schedule` - Schedule management

## Usage

1. **Register a Clinic**: Visit `/register` to create a new clinic account
2. **Login**: Use your clinic credentials at `/login`
3. **Role-based Access**: 
   - **Clinic Admin**: Access `/admin` to manage staff and view all clinic data
   - **Doctor**: Access `/doctor` to view appointments and create prescriptions
   - **Receptionist**: Access `/receptionist` to manage patients and book appointments

Each role is automatically redirected to their appropriate dashboard after login.

### Appointment Workflow

#### For Existing Patients
1. Create appointment with `patientId` reference
2. Appointment is immediately in `scheduled` status
3. Update appointment status as needed (`completed`, `cancelled`)

#### For Walk-in Patients (Temporary Appointments)
1. Create appointment without `patientId`, include patient details directly
2. Appointment starts in `scheduled` status with temporary patient data
3. When ready to register the patient:
   - Update appointment status to `registered`
   - System automatically creates new patient record
   - Links appointment to new patient and clears temporary data
4. If patient already exists (matched by phone), links to existing patient record

## API Endpoints

### Currently Implemented

#### Authentication
- `POST /auth/register-clinic` - Register new clinic (requires clinicId, clinicName, address, contactInfo, adminName, adminEmail, adminPassword)
- `GET /auth/check-clinic-id/:clinicId` - Check clinic ID availability and format validation
- `POST /auth/login` - User login (requires email, password, and clinicId)
- `GET /auth/debug/users` - Debug endpoint to list all users (development only)

#### User Management
- `POST /users` - Create new user (doctor/receptionist) with enhanced doctor fields and activity logging
  - **Doctor Fields**: `specialization`, `licenseNumber`, `qualifications`, `experience`
  - **Validation**: Professional credentials validation with experience range (0-50 years)
- `GET /users` - Get all clinic staff with complete profile information (excludes admin users from list)
- `GET /users/:id` - Get specific user with all profile fields including doctor credentials
- `PUT /users/:id` - Update user information (admin only) with enhanced doctor fields and activity logging
- `PUT /users/:id/status` - Activate/deactivate user (admin only) with activity logging
- `DELETE /users/:id` - Delete user (admin only) with activity logging
- `PUT /users/profile/:id` - Update user profile (self or admin) with doctor credentials support
- `PUT /users/password/:id` - Update user password (self or admin)
- `GET /users/doctor/dashboard-stats` - Get comprehensive doctor dashboard statistics with:
  - Patient and appointment counts (today, week, month, total)
  - Prescription statistics
  - Upcoming appointments with patient details
  - Recent patients and appointment history
  - Appointment status distribution and completion rates
  - Monthly appointment trends (6-month history)

#### System
- `GET /health` - Health check endpoint

#### Patient Management (Implemented)
- `POST /patients` - Add new patient with comprehensive medical information
- `GET /patients` - Get all clinic patients (filtered by assigned doctor for doctors)
- `GET /patients/:id` - Get specific patient with full medical history
- `PUT /patients/:id` - Update patient information and medical records
- `DELETE /patients/:id` - Delete patient (admin and receptionist only)
- `GET /patients/doctors/list` - Get available doctors for patient assignment
- `GET /patients/:id/prescriptions` - Get patient prescriptions with enhanced doctor information
  - Returns prescription history with complete prescribing doctor details
  - Efficient doctor data lookup using unique ID mapping
  - Role-based access: doctors see only prescriptions for their assigned patients

#### Appointment Management (Implemented)
- `POST /appointments` - Create appointment with comprehensive validation
  - Supports both existing patients (with patientId) and temporary walk-ins (with patient details)
  - Role-based creation: doctors can only create their own appointments
  - Automatic appointment ID generation
  - Validates doctor assignment and clinic isolation
- `GET /appointments` - Get all appointments with role-based filtering
  - Doctors see only their own appointments
  - Admin and receptionist see all clinic appointments
  - Populated with patient and doctor information
  - Sorted by date and time
- `GET /appointments/:id` - Get specific appointment details with populated references
- `PUT /appointments/:id` - Update appointment with advanced features
  - Standard updates: date, time, status, notes
  - Patient registration workflow: converts temporary appointments to registered patients
  - Automatic patient creation from temporary appointment data
  - Links existing patients by phone number matching
  - Role-based access control
- `DELETE /appointments/:id` - Delete appointment (admin and receptionist only)
- `GET /appointments/doctor/:doctorId/date/:date` - Get appointments for specific doctor on specific date
  - Used for schedule management and availability checking
  - Returns appointments sorted by time

#### Reports and Analytics (Implemented)
- `GET /reports/dashboard-stats` - Get comprehensive dashboard statistics
- `GET /reports/appointments` - Get appointments report with filtering and summary statistics
- `GET /reports/patients` - Get patients report with demographic analysis
- `GET /reports/prescriptions` - Get prescriptions report with medication frequency analysis
- `GET /reports/revenue` - Get revenue report based on completed appointments (admin only)

#### Prescription Management (Implemented)
- `POST /prescriptions` - Create new prescription (doctors only)
  - Validates patient assignment to doctor
  - Supports multiple medications per prescription
  - Requires medication details: name, dosage, frequency, duration
  - Optional doctor's notes and instructions
  - Automatic prescription ID generation
- `GET /prescriptions` - Get all prescriptions with role-based filtering
  - Doctors see only their own prescriptions
  - Admin and receptionist see all clinic prescriptions
  - Populated with doctor information
  - Sorted by creation date (newest first)
- `GET /prescriptions/:id` - Get specific prescription with enhanced data
  - **Enhanced Response**: Includes complete patient and doctor information
  - **Role-based Access**: Doctors can only view prescriptions for their assigned patients
  - **Authorization Validation**: Proper ObjectId comparison for secure access control
  - Returns prescription with populated patient and doctor details
- `GET /prescriptions/patient/:id` - Get all prescriptions for specific patient
  - Role-based access: doctors see only for their assigned patients
  - Populated with doctor information for each prescription
  - Sorted by creation date

#### Payment Management (Implemented)
- `POST /payments` - Create new payment record with validation
- `GET /payments` - Get all clinic payments with filtering (date, method, status, patient)
- `GET /payments/:id` - Get specific payment details with populated references
- `PUT /payments/:id` - Update payment status and notes (admin and receptionist only)
- `DELETE /payments/:id` - Delete payment record (admin only)
- `GET /payments/patient/:patientId` - Get all payments for specific patient
- `GET /payments/:id/invoice` - Generate invoice data for payment (PDF generation placeholder)

### Planned Features (Not Yet Implemented)

#### Prescription Management
- `POST /prescriptions` - Create prescription (doctors only)
- `GET /prescriptions` - Get prescriptions (role-filtered)
- `GET /patients/:id/prescriptions` - Get patient prescriptions

#### Payment System Enhancements
- `GET /payments/dashboard` - Clinic-wide payment dashboard with analytics
- `POST /payments/:id/invoice/generate` - Generate PDF invoice
- `POST /payments/:id/reminder` - Send payment reminder
- `GET /payments/analytics` - Advanced payment analytics and trends

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build
```

## Architecture Details

### State Management
- **AuthContext**: Centralized authentication state management using React Context API
- **useAuth Hook**: Custom hook providing authentication methods and user state
  - `user` - Current authenticated user object
  - `login(token, userData)` - Authenticate user and store credentials
  - `logout()` - Clear authentication state and automatically redirect to login page
  - `isAuthenticated()` - Check if user is logged in
  - `hasRole(role)` - Verify user role permissions
  - `loading` - Authentication loading state

### Component Architecture
- **Dashboard Components**: Role-specific dashboards with user context integration
- **Protected Routes**: Enhanced route-level authentication and role-based access control
  - **Multi-role Support**: ProtectedRoute component now accepts both single role strings and arrays of roles
  - **Flexible Access Control**: Routes can be accessible to multiple user roles simultaneously
  - **Backward Compatibility**: Maintains support for existing single-role route definitions
- **Shared Components**: Reusable UI components with enterprise-grade styling
  - **Enterprise PatientForm**: Professional patient management form with modern design architecture
    - Split-layout architecture with dedicated header section and contextual navigation
    - Enhanced form design with modern card layout and improved message system
    - Role-based doctor assignment (admin and receptionist access)
    - Complete medical history management with professional visual hierarchy
    - Enhanced date handling and validation with consistent branding
    - Automatic doctor list filtering from user API

### Middleware Architecture
- **Authentication Middleware**: JWT token verification and user context loading
- **RBAC Middleware**: Streamlined role-based access control with simplified permission checking
- **Clinic Isolation Middleware**: Multi-tenant data filtering to ensure clinic-specific access

## Reports and Analytics System

### Dashboard Statistics
The reports system provides comprehensive analytics accessible via `/reports/dashboard-stats`:

- **Overview Metrics**: Total patients, doctors, appointments, and prescriptions
- **Time-based Statistics**: Today's, this week's, and this month's appointment counts
- **New Patient Tracking**: Monthly patient registration statistics
- **Appointment Status Distribution**: Breakdown by scheduled, completed, cancelled status
- **Daily Trends**: 7-day appointment trend analysis

### Detailed Reports

#### Appointments Report (`/reports/appointments`)
- **Filtering Options**: Date range, status, doctor assignment
- **Data Includes**: Patient details, doctor information, appointment status
- **Summary Statistics**: Total appointments, status breakdown, doctor distribution
- **Role-based Access**: Doctors see only their appointments

#### Patients Report (`/reports/patients`)
- **Filtering Options**: Registration date range, assigned doctor, gender
- **Demographic Analysis**: Gender distribution, age group categorization
- **Doctor Assignment**: Patient distribution by assigned doctor
- **Age Groups**: 0-18, 19-35, 36-50, 51-65, 65+ categorization

#### Prescriptions Report (`/reports/prescriptions`)
- **Filtering Options**: Date range, doctor, patient
- **Medication Analysis**: Frequency tracking of prescribed medications
- **Doctor Statistics**: Prescription count by doctor
- **Patient Correlation**: Prescription history by patient

#### Revenue Report (`/reports/revenue`) - Admin Only
- **Monthly Revenue Tracking**: 12-month revenue analysis
- **Appointment-based Calculation**: Revenue simulation based on completed appointments
- **Trend Analysis**: Monthly appointment and revenue trends
- **Total Metrics**: Cumulative revenue and appointment statistics

### Frontend Components
- **ReportsDashboard**: Main reports navigation interface
- **Report**: Dynamic report viewer with filtering capabilities
- **API Integration**: Complete reportsAPI service for data fetching

## Security Features

- **JWT-based Authentication**: Secure token-based authentication with automatic user context loading
- **Password Hashing**: bcrypt for secure password storage with current password verification for updates
- **Role-based Access Control**: Enhanced RBAC with multi-role support for flexible route-level permission enforcement
- **Multi-tenant Data Isolation**: Automatic clinic-based data filtering to prevent cross-tenant access
- **Input Validation**: Comprehensive request validation and sanitization
  - **Clinic ID Validation**: Alphanumeric format (3-20 characters), uniqueness checking, real-time availability
  - **Email Validation**: Format validation with normalization and uniqueness within clinic scope
  - **Password Security**: Minimum length requirements with secure hashing
  - **Role Validation**: Restricted role assignment with proper authorization checks
- **Activity Logging**: Complete audit trail for all user management operations
- **User Status Management**: Secure activation/deactivation with admin-only access
- **Profile Security**: Users can only modify their own profiles unless they have admin privileges
- **Admin Protection**: Prevents deletion or status changes of admin users
- **Reports Security**: Role-based report access with data filtering for doctors
- **Payment Security**: Role-based payment management with clinic isolation and user tracking
- **Consistent User Identification**: Standardized `req.user.userId` usage across all endpoints for secure user identification

## Troubleshooting

### Common Development Issues

#### ResizeObserver Console Errors
**Issue**: ResizeObserver loop completed with undelivered notifications errors appearing in browser console during development.

**Solution**: The application includes comprehensive ResizeObserver error suppression in `frontend/src/index.js`:

- **Automatic Handling**: The error suppression is automatically active and requires no configuration
- **Multi-Layer Protection**: 6 different suppression mechanisms ensure complete error elimination
- **Safe Implementation**: Only ResizeObserver errors are suppressed; other important errors remain visible
- **Development-Friendly**: Maintains full debugging capabilities for actual application issues

**Technical Details**:
- Custom SafeResizeObserver wrapper class with requestAnimationFrame integration
- Console method overrides with intelligent message filtering
- Global error event listeners with capture phase handling
- React DevTools integration for development environment
- Production-safe implementation with environment awareness

This fix eliminates the common ResizeObserver console noise that can occur with modern React applications using dynamic layouts and responsive components.

**For detailed technical information**, see [RESIZEOBSERVER-FIX-TECHNICAL.md](./RESIZEOBSERVER-FIX-TECHNICAL.md).

#### Authentication Issues
**Issue**: Users unable to login or session not persisting.

**Solutions**:
- Verify backend server is running on correct port (default: 3001)
- Check MongoDB connection in backend logs
- Ensure cookies are enabled in browser
- Verify CORS configuration for cross-origin requests

#### Database Connection Issues
**Issue**: MongoDB connection failures.

**Solutions**:
- Verify MongoDB Atlas connection string in `.env` file
- Check network connectivity and firewall settings
- Ensure database user has proper permissions
- Verify IP whitelist settings in MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

This project follows the specifications defined in `.kiro/specs/clinic-erp-system/requirements.md`. Please refer to the requirements document for detailed acceptance criteria and implementation guidelines.

## License

MIT License