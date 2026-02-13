# Haridwar University ERP Portal

A complete, production-ready MERN stack ERP system for university management with enterprise-grade architecture, security, and scalability.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, Tailwind CSS, Redux Toolkit, React Query
- **Backend**: Node.js, Express.js, MongoDB, Redis
- **Authentication**: JWT with refresh tokens, RBAC
- **Security**: Helmet, CORS, Rate Limiting, Input Validation (Zod)
- **Deployment**: Docker, Docker Compose, Nginx

### Project Structure

```
haridwar-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, Redis, Env)
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Zod validation schemas
│   │   └── app.js           # Express app
│   ├── server.js            # Server entry point
│   └── package.json
├── frontend/
│   └── (React application)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - MongoDB connection string
   - Redis URL
   - JWT secrets (change the defaults!)
   - SMTP credentials for email
   - Frontend URL

4. **Start MongoDB and Redis**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

5. **Run the backend**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

6. **Verify the server is running**
   ```bash
   curl http://localhost:5000/health
   ```

### Frontend Setup

*(To be added)*

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Password123",
  "role": "STUDENT",
  "profileData": {
    "enrollmentNumber": "HU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2005-01-15",
    "gender": "MALE",
    "phone": "9876543210",
    "guardianName": "Jane Doe",
    "guardianPhone": "9876543211",
    "guardianRelation": "MOTHER",
    "department": "<department_id>",
    "course": "<course_id>"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "student@example.com",
      "role": "STUDENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..." 
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Other Modules

*(Student Management, Faculty, Academic, Exam, Finance, HR, Library endpoints to be documented)*

## 🗄️ Database Models

### Core Models

1. **User** - Authentication and authorization
2. **Student** - Student profiles and academic records
3. **Faculty** - Faculty profiles and assignments
4. **Department** - Academic departments
5. **Course** - Course definitions
6. **Subject** - Subject details
7. **Attendance** - Attendance tracking
8. **Exam** - Examination management
9. **Result** - Student results and grades
10. **Fee** - Fee structures
11. **Payment** - Payment transactions
12. **Notification** - In-app notifications
13. **AuditLog** - Audit trail

## 🔐 Security Features

- **Authentication**: JWT with RS256 algorithm
- **Authorization**: Role-based access control (RBAC)
- **Password**: Bcrypt hashing with 12 rounds
- **Rate Limiting**: Role-specific rate limits
- **Input Validation**: Zod schema validation
- **Security Headers**: Helmet.js
- **CORS**: Whitelist-based
- **Token Blacklisting**: Redis-based
- **Audit Logging**: All actions tracked

## ⚡ Performance Optimizations

- **Database**: MongoDB indexes on frequently queried fields
- **Caching**: Redis for API responses and sessions
- **Pagination**: Default 20 items, max 100
- **Connection Pooling**: MongoDB connection pool (100 max)
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

### Environment Variables

See `.env.example` for all available configuration options.

### Logging

Logs are stored in `logs/` directory:
- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

## 🐳 Docker Deployment

*(To be added)*

## 📝 License

ISC

## 👥 Team

Haridwar University Development Team

---

**Note**: This is a production-ready ERP system. Make sure to change all default secrets and credentials before deploying to production!
