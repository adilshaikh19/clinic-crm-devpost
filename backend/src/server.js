require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const prescriptionRoutes = require("./routes/prescriptions");
const clinicRoutes = require("./routes/clinic");
const availabilityRoutes = require("./routes/availability");
const reportRoutes = require("./routes/reports");
const paymentRoutes = require("./routes/payments");

const cookieParser = require("cookie-parser");

const app = express();

// Middleware
// Configure CORS to allow credentials and specific frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://cliniprac.netlify.app",
  "http://localhost:3000",
  "https://cliniprac.binarylabs.site",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin) and allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log the rejected origin for debugging
    console.log(`CORS rejected origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/clinic", clinicRoutes);
app.use("/availability", availabilityRoutes);
app.use("/reports", reportRoutes);
app.use("/payments", paymentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Clinic ERP API is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    statusCode: 500,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

const PORT = process.env.PORT || 3001;
connectDB(); // Connect to MongoDB

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
