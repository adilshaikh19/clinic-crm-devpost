# Technology Stack

## Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, express-validator for input validation
- **Middleware**: cors for cross-origin requests

## Frontend
- **Framework**: React (JavaScript)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Development Tools
- **Testing**: Jest for unit tests, React Testing Library for component tests
- **Documentation**: Swagger/OpenAPI for API documentation
- **Environment**: dotenv for environment variable management

## Common Commands

### Backend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run with environment variables
npm start
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Key Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT implementation
- `express-validator` - Input validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `uuid` - Unique identifier generation

### Frontend
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP requests
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Icon library with comprehensive icon set (FileText, Clock, LayoutDashboard, FilePlus, List, Settings, User, LogOut, Stethoscope, CheckCircle, AlertCircle, Eye, EyeOff, etc.)

## Environment Variables
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)