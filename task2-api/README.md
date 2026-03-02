# Task 2: Doctor Booking API

A Node.js + Express REST API for managing doctor availability and patient appointments. This API provides endpoints for retrieving doctor profiles, checking availability slots, and creating bookings with validation.

## 📋 Project Overview

This backend service powers a medical appointment booking system with:
- Doctor management and filtering by specialty and location
- Real-time slot availability checking
- Appointment booking with conflict prevention
- Input validation using Zod schema validation
- CORS support for frontend integration
- UUID-based unique identifiers for bookings

## ✨ Features

- **Doctor Management**: Retrieve doctors with filtering by specialty and city
- **Slot Availability**: Get available time slots for specific doctors
- **Booking System**: Create appointments with automatic conflict detection
- **Validation**: Request validation using Zod for type safety
- **Error Handling**: Proper HTTP status codes and error messages
- **CORS Support**: Enable cross-origin requests for frontend consumption
- **Unique Identifiers**: UUID-based booking references for tracking

## 🛠️ Technology Stack

- **Node.js**: JavaScript runtime for server-side development
- **Express 5**: Web framework for building REST APIs
- **Zod**: TypeScript-first schema validation
- **CORS**: Cross-Origin Resource Sharing middleware
- **UUID**: Unique identifier generation
- **Nodemon**: Development server with auto-reload
- **ES Modules**: Modern JavaScript module system

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Navigate to the project directory**:
   ```bash
   cd task2-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

### Production Setup
```bash
npm start
```

## 🚀 Available Scripts

- `npm run dev` - Start development server with auto-reload (nodemon)
- `npm start` - Start production server
- `npm test` - Run tests (not yet configured)

## 📂 Project Structure

```
task2-api/
├── src/
│   ├── controllers/
│   │   └── doctors.controller.js    # Request handlers for doctor routes
│   ├── services/
│   │   └── doctor.service.js        # Business logic and data operations
│   ├── routes/
│   │   └── doctors.routes.js        # API route definitions
│   ├── data/
│   │   └── seed.js                  # Mock data: doctors, slots, bookings
│   ├── validators/
│   │   └── booking.validator.js     # Zod validation schemas
│   └── index.js                     # Express app setup and server start
├── package.json                     # Project dependencies and scripts
├── package-lock.json                # Locked dependency versions
└── .gitkeep                         # Directory placeholder
```

## 🔌 API Endpoints

### 1. Get All Doctors
**Endpoint**: `GET /doctors`

**Query Parameters**:
- `specialty` (optional): Filter by medical specialty (e.g., "Cardiology", "Orthopedics")
- `city` (optional): Filter by city (e.g., "Mumbai", "Bangalore")

**Example Requests**:
```bash
# Get all doctors
curl http://localhost:3001/doctors

# Filter by specialty
curl http://localhost:3001/doctors?specialty=Cardiology

# Filter by city
curl http://localhost:3001/doctors?city=Mumbai

# Filter by both
curl http://localhost:3001/doctors?specialty=Orthopedics&city=Bangalore
```

**Response Example**:
```json
[
  {
    "id": "doc_001",
    "name": "Dr. Rajesh Kumar",
    "specialty": "Cardiology",
    "city": "Mumbai",
    "experience": 15,
    "rating": 4.8
  },
  {
    "id": "doc_002",
    "name": "Dr. Priya Singh",
    "specialty": "Orthopedics",
    "city": "Bangalore",
    "experience": 12,
    "rating": 4.6
  }
]
```

---

### 2. Get Doctor Slots
**Endpoint**: `GET /doctors/:id/slots`

**URL Parameters**:
- `id` (required): Doctor ID

**Example Request**:
```bash
curl http://localhost:3001/doctors/doc_001/slots
```

**Response Example**:
```json
{
  "doctorId": "doc_001",
  "doctorName": "Dr. Rajesh Kumar",
  "slots": [
    {
      "datetime": "2026-03-05T10:00:00Z",
      "isBooked": false,
      "duration": 30
    },
    {
      "datetime": "2026-03-05T10:30:00Z",
      "isBooked": false,
      "duration": 30
    },
    {
      "datetime": "2026-03-05T11:00:00Z",
      "isBooked": true,
      "duration": 30
    }
  ]
}
```

**Error Response** (404):
```json
{
  "message": "Doctor not found"
}
```

---

### 3. Create Booking
**Endpoint**: `POST /bookings`

**Request Body**:
```json
{
  "doctorId": "doc_001",
  "slotDatetime": "2026-03-05T10:00:00Z",
  "patientName": "Ravi Sharma",
  "patientPhone": "+91 98765 43210"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "doc_001",
    "slotDatetime": "2026-03-05T10:00:00Z",
    "patientName": "Ravi Sharma",
    "patientPhone": "+91 98765 43210"
  }'
```

**Success Response** (200):
```json
{
  "message": "Booking confirmed",
  "bookingRef": "BK-a1b2c3d4"
}
```

**Error Responses**:

Doctor Not Found (404):
```json
{
  "message": "Doctor not found"
}
```

Slot Not Found (404):
```json
{
  "message": "Slot not found"
}
```

Slot Already Booked (409):
```json
{
  "message": "Slot already booked"
}
```

---

## 📊 Data Models

### Doctor
```javascript
{
  id: string,           // Unique doctor identifier
  name: string,         // Full name
  specialty: string,    // Medical specialty
  city: string,         // Practice location
  experience: number,   // Years of experience
  rating: number        // Average rating (0-5)
}
```

### Slot
```javascript
{
  datetime: string,     // ISO 8601 datetime
  isBooked: boolean,    // Booking status
  duration: number      // Appointment duration in minutes
}
```

### Booking
```javascript
{
  bookingRef: string,       // Unique booking reference (BK-xxxxxxxx)
  doctorId: string,         // Associated doctor ID
  slotDatetime: string,     // Booked slot datetime
  patientName: string,      // Patient full name
  patientPhone: string      // Patient contact number
}
```

---

## ✅ Validation Rules

Using Zod schema validation for all incoming requests:

### Booking Validation
```javascript
{
  doctorId: string (required),
  slotDatetime: string ISO 8601 format (required),
  patientName: string (required, min 2 chars),
  patientPhone: string (required, valid format)
}
```

---

## 🔧 Core Services

### doctorService

#### `getDoctors(filters)`
Retrieves doctors with optional filtering.
- **Parameters**: `{ specialty?: string, city?: string }`
- **Returns**: Array of matching doctor objects

#### `getDoctorSlots(doctorId)`
Gets available and booked slots for a doctor.
- **Parameters**: `doctorId` (string)
- **Returns**: Object with doctor info and slots array
- **Throws**: 404 error if doctor not found

#### `createBooking(data)`
Creates a new appointment booking.
- **Parameters**: `{ doctorId, slotDatetime, patientName, patientPhone }`
- **Returns**: `{ message, bookingRef }`
- **Throws**: 404 if doctor/slot not found, 409 if slot already booked

---

## 🔐 Security Features

- **CORS**: Configured to accept requests from frontend origins
- **Input Validation**: Zod schema validation prevents invalid data
- **Error Handling**: Proper HTTP status codes and error messages
- **Data Isolation**: Slot booking prevents double-booking through status flags

---

## 📝 Development Workflow

1. **Start Development Server**: `npm run dev` for auto-reload
2. **Test Endpoints**: Use curl, Postman, or VS Code REST Client
3. **Check Logs**: Review console output for request details
4. **Validate Data**: All requests validated against Zod schemas

---

## 🚨 Troubleshooting

### Port Already in Use
If port 3001 is in use, edit `src/index.js`:
```javascript
const PORT = 3002; // or another available port
```

### CORS Errors
Ensure the frontend is making requests to `http://localhost:3001` or update CORS origin in `src/index.js`

### Module Not Found
- Run `npm install` to ensure all dependencies are installed
- Check all import paths in controller and service files

### Slot Already Booked
The slot is already reserved. Check available slots using `/doctors/:id/slots` endpoint

---

## 🧪 Testing the API

### Using curl
```bash
# Get all doctors
curl http://localhost:3001/doctors

# Get slots for a doctor
curl http://localhost:3001/doctors/doc_001/slots

# Create a booking
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "doc_001",
    "slotDatetime": "2026-03-05T10:00:00Z",
    "patientName": "John Doe",
    "patientPhone": "+91 98765 43210"
  }'
```

### Using Postman
1. Create a new request collection
2. Import the endpoints above
3. Test different filter combinations and booking scenarios

---

## � Running Locally - Complete Guide

### Full Setup from Scratch

```bash
# 1. Navigate to project directory
cd /Users/manasgoyal/medkura-assessment-manas/task2-api

# 2. Install dependencies
npm install

# 3. Verify installation
npm list express zod uuid cors

# 4. Start development server with auto-reload
npm run dev

# Server will output: "Server running on port 3001"
```

### Verify API is Running

```bash
# In another terminal, test the API
curl http://localhost:3001/doctors

# Or use Postman: GET http://localhost:3001/doctors
```

### Development Workflow

1. **Auto-reload**: Nodemon watches `src/` folder for changes
2. **Testing endpoints**: Use curl, Postman, or VS Code REST Client
3. **Console logs**: Check terminal output for request details and errors
4. **No build step**: Run server directly with Node.js

### Production Setup

```bash
# Start without auto-reload
npm start

# Or with custom port
PORT=8080 npm start
```

---

## 💡 Design Decisions

### 1. **Service Layer Architecture**
- **Decision**: Separate service layer (`doctor.service.js`) from controllers
- **Why**: Decouples business logic from HTTP handlers, enables easy reuse, simplifies testing, follows Single Responsibility Principle.

### 2. **Mock Data in Memory**
- **Decision**: Store doctors and slots in `seed.js` array, not a database
- **Why**: Rapid prototyping without database setup, serves as clear API contract specification, easy to understand data structure.

### 3. **Zod Validation**
- **Decision**: Validate all incoming requests with Zod schemas
- **Why**: Runtime type safety, clear error messages for invalid data, prevents invalid data reaching business logic.

### 4. **UUID for Booking References**
- **Decision**: Use `uuid` library to generate unique booking IDs
- **Why**: Guarantees uniqueness without database, industry-standard approach, prevents ID collisions.

### 5. **Query Parameter Filtering**
- **Decision**: Filter doctors by `specialty` and `city` query parameters
- **Why**: Flexible filtering, allows multiple search combinations, reduces response payload size.

### 6. **Status Codes**
- **Decision**: Return proper HTTP status codes (200, 404, 409)
- **Why**: Clients can handle errors appropriately, RESTful standard, enables proper error handling on frontend.

### 7. **CORS Middleware**
- **Decision**: Enable CORS for all origins in development
- **Why**: Allows frontend on different port (5173) to call API (3001), required for localhost development.

### 8. **Slot Mutation**
- **Decision**: Mark slot as booked by mutating `slot.isBooked = true`
- **Why**: Simple, prevents double-booking, visible to subsequent requests for same doctor.

---

## ⏳ Future Improvements (With More Time)

### 1. **Database Integration**
- Replace in-memory data with PostgreSQL/MongoDB
- Implement proper data persistence
- Add migrations and seeding scripts
- Transaction support for booking operations

### 2. **Authentication & Security**
- JWT-based authentication
- Role-based access control (doctor, patient, admin)
- Rate limiting to prevent abuse
- Input sanitization
- HTTPS/TLS in production

### 3. **Advanced Features**
- Doctor availability management (recurring schedules)
- Booking cancellation and rescheduling
- Patient profile management
- Appointment reminders
- Multi-language support

### 4. **API Improvements**
- Pagination for doctor/booking lists
- Sorting and advanced filtering
- Request/response compression
- API versioning (v1, v2)
- OpenAPI/Swagger documentation

### 5. **Testing**
- Unit tests with Jest
- Integration tests for endpoints
- Mock data fixtures
- Test coverage reporting
- Postman collection for manual testing

### 6. **Error Handling**
- Global error middleware
- Structured error responses
- Logging system (Winston, Pino)
- Error tracking (Sentry)
- Health check endpoint

### 7. **Deployment**
- Environment configuration (.env files)
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Load balancing support
- Monitoring and alerting

### 8. **Performance**
- Caching layer (Redis)
- Database indexing on doctor_id, datetime
- Query optimization
- Connection pooling

---

## 📝 Assumptions Made

### 1. **Data Model**
- Assumed `doctorId` is a unique identifier (string format)
- Assumed `slotDatetime` is ISO 8601 format
- Assumed each slot is 30 minutes long
- Assumed one slot = one appointment (no overlapping bookings)

### 2. **Business Rules**
- Assumed no user authentication needed (open API)
- Assumed bookings are permanent (no cancellations implemented)
- Assumed slot availability is fixed (no dynamic scheduling)
- Assumed phone numbers are stored as-is (no validation of format)

### 3. **API Behavior**
- Assumed `GET /doctors` returns all doctors if no filters provided
- Assumed filtering is AND operation (both specialty AND city must match)
- Assumed slot unavailability means doctor not in database (returns 404)
- Assumed only one booking per slot (mutual exclusion via `isBooked` flag)

### 4. **Error Handling**
- Assumed missing required fields return error message
- Assumed all error responses include descriptive message
- Assumed no retry logic needed on client side

### 5. **Scale & Load**
- Assumed small to medium patient volume (< 1000 doctors)
- Assumed < 100 concurrent users
- Assumed no high-frequency real-time updates

### 6. **Medical Domain**
- Assumed doctors have specialty (Cardiology, Orthopedics, etc.)
- Assumed city represents physical location where doctor practices
- Assumed experience is measured in years
- Assumed rating is on 0-5 scale

### 7. **Development Environment**
- Assumed Node.js v18+ available
- Assumed npm used as package manager
- Assumed localhost port 3001 is available
- Assumed no database server setup needed

### 8. **Frontend Integration**
- Assumed frontend runs on different port (5173 for Vite)
- Assumed frontend makes CORS-enabled requests
- Assumed frontend handles error messages from API

---

## �📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Zod Validation](https://zod.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)

---

## 📝 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

Doctor Booking API - Task 2
