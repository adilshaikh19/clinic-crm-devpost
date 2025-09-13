# Project Structure

## Root Directory Organization
```
clinic-erp-system/
├── backend/                 # Node.js/Express API server
├── frontend/               # React application
├── .kiro/                  # Kiro configuration and specs
└── README.md              # Project documentation
```

## Backend Structure
```
backend/
├── src/
│   ├── models/            # Mongoose schemas
│   │   ├── ActivityLog.js # Activity logging and audit trail
│   │   ├── Appointment.js
│   │   ├── Availability.js
│   │   ├── Clinic.js
│   │   ├── Patient.js
│   │   ├── Prescription.js
│   │   └── User.js
│   ├── routes/            # Express route handlers
│   │   ├── appointments.js # Appointment management
│   │   ├── auth.js        # Authentication routes
│   │   ├── availability.js # Doctor availability management
│   │   ├── clinic.js      # Clinic information management
│   │   ├── patients.js    # Patient management
│   │   ├── prescriptions.js # Prescription management
│   │   └── users.js       # User management with activity logging
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   ├── rbac.js        # Role-based access control
│   │   └── clinicIsolation.js # Multi-tenant data isolation
│   ├── controllers/       # Business logic
│   ├── utils/            # Helper functions
│   │   ├── jwt.js        # JWT utilities
│   │   ├── hash.js       # Password hashing
│   │   └── validation.js  # Input validation helpers
│   └── config/           # Configuration files
│       └── database.js    # MongoDB connection
├── tests/                # Test files
├── package.json
└── .env                  # Environment variables
```

## Frontend Structure
```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   │   ├── Login.js
│   │   │   └── ClinicRegistration.js
│   │   ├── admin/       # Admin dashboard components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── CreateUser.js
│   │   │   └── StaffList.js
│   │   ├── doctor/      # Doctor dashboard components
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── AppointmentList.js
│   │   │   └── CreatePrescription.js
│   │   ├── receptionist/ # Receptionist components
│   │   │   ├── ReceptionistDashboard.js
│   │   │   ├── PatientList.js
│   │   │   └── AppointmentForm.js
│   │   └── shared/      # Shared components
│   │       ├── ProtectedRoute.js
│   │       ├── Sidebar.js        # Enhanced navigation with icon system
│   │       ├── Navbar.js
│   │       ├── LoadingSpinner.js
│   │       └── PatientForm.js
│   ├── context/         # React Context providers
│   │   └── AuthContext.js
│   ├── services/        # API service functions
│   │   └── api.js
│   ├── utils/           # Helper functions
│   ├── styles/          # CSS files
│   └── App.js           # Main application component
├── public/              # Static assets
├── package.json
└── tailwind.config.js   # Tailwind CSS configuration
```

## Naming Conventions
- **Files**: PascalCase for React components, camelCase for utilities
- **Variables**: camelCase for JavaScript variables and functions
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Database**: camelCase for field names, consistent with JavaScript

## Key Architectural Patterns
- **Multi-tenant**: All data models include `clinicId` for isolation
- **Role-based**: Components and routes organized by user roles
- **RESTful API**: Standard HTTP methods and resource-based URLs
- **Component-based**: Modular React components with single responsibilities
- **Middleware-first**: Express middleware for authentication, validation, and data isolation

## File Organization Rules
- Group related functionality together (auth, admin, doctor, receptionist)
- Separate business logic (controllers) from route definitions
- Keep shared utilities and components in dedicated folders
- Maintain consistent folder structure between frontend and backend
- Use index.js files for clean imports where appropriate