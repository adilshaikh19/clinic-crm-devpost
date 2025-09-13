# Product Overview

## Clinic ERP System

A comprehensive multi-tenant web application for managing clinic operations. The system enables clinic owners to digitally manage their entire workflow including staff, patients, appointments, and prescriptions.

### Core Features
- **Multi-tenant Architecture**: Each clinic operates independently with secure data isolation
- **Role-based Access Control**: Three distinct roles (Clinic Admin, Doctor, Receptionist) with specific permissions
- **Patient Management**: Complete patient records and medical history tracking
- **Appointment Scheduling**: Efficient booking system with doctor availability
- **Prescription Management**: Digital prescription creation and tracking
- **User Management**: Staff account creation and management by clinic admins

### Target Users
- **Clinic Owners/Admins**: Register clinics, manage staff, oversee operations
- **Doctors**: View appointments, create prescriptions, manage patient care
- **Receptionists**: Handle patient registration, book appointments, manage front desk operations

### Key Business Rules
- All data is strictly isolated by `clinicId` - no cross-clinic access
- Users can only access features appropriate to their role
- Each clinic maintains independent staff and patient databases
- Secure authentication required for all operations