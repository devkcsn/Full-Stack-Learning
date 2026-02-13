# 🎓 AI Career Guidance Platform - Complete Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Authentication Flow](#authentication-flow)
8. [AI Features](#ai-features)
9. [How Things Work Together](#how-things-work-together)
10. [Setup & Installation](#setup--installation)
11. [Environment Variables](#environment-variables)
12. [File Structure](#file-structure)

---

## 🎯 Project Overview

**AI Career Guidance Platform** is a full-stack MERN (MongoDB, Express, React, Node.js) application that helps users discover suitable career paths based on their skills, interests, and education. It provides:

- 🔐 User authentication and profile management
- 🎯 Personalized career recommendations
- 💬 AI-powered career counseling chat
- 📚 Learning resources and career paths
- 📈 Visual progress tracking

---

## 🛠 Technology Stack

### **Frontend (Client)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework for building interactive interfaces |
| **React Router DOM** | 7.9.5 | Client-side routing and navigation |
| **Axios** | 1.13.1 | HTTP client for API requests |
| **Chart.js** | 4.5.1 | Data visualization for skill gaps and progress |
| **React-ChartJS-2** | 5.3.1 | React wrapper for Chart.js |
| **Vite** | 7.1.7 | Fast build tool and dev server |
| **ESLint** | 9.36.0 | Code quality and linting |

### **Backend (Server)**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express** | 5.1.0 | Web framework for REST APIs |
| **MongoDB** | - | NoSQL database |
| **Mongoose** | 8.19.2 | MongoDB ODM (Object Data Modeling) |
| **bcryptjs** | 3.0.3 | Password hashing for security |
| **jsonwebtoken** | 9.0.2 | JWT authentication tokens |
| **OpenAI** | 6.7.0 | AI-powered recommendations (optional) |
| **Multer** | 2.0.2 | File upload handling |
| **Socket.io** | 4.8.1 | Real-time communication (for chat) |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 17.2.3 | Environment variable management |

---

## 🏗 Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                 │
├─────────────────────────────────────────────────────────┤
│  Components:                                             │
│  - Navbar (Navigation)                                   │
│  - Auth Pages (Login, Register, ProfileSetup)           │
│  - Dashboard (Overview)                                  │
│  - Careers (Browse careers)                              │
│  - CareerDetail (Specific career info)                   │
│  - AIChat (Career counseling)                            │
│  - Profile (User settings)                               │
│  - SkillGap (Analysis & visualization)                   │
│                                                           │
│  Context: AuthContext (Global auth state)                │
│  Services: api.js (API communication)                    │
│  Utils: localStorage.js (Client-side storage)            │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS (REST API)
                           ▼
┌─────────────────────────────────────────────────────────┐
│              SERVER (Node.js + Express)                  │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                 │
│  - /api/auth    (Authentication)                         │
│  - /api/careers (Career data)                            │
│  - /api/ai      (AI recommendations & chat)              │
│                                                           │
│  Middleware:                                             │
│  - CORS (Cross-origin requests)                          │
│  - express.json() (JSON parsing)                         │
│  - authMiddleware (JWT verification)                     │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (MongoDB)                      │
├─────────────────────────────────────────────────────────┤
│  Collections:                                            │
│  - users         (User accounts & profiles)              │
│  - careers       (Career information)                    │
│  - recommendations (AI-generated suggestions)            │
│  - messages      (Chat history)                          │
│  - files         (Uploaded documents)                    │
└─────────────────────────────────────────────────────────┘
```

### **Application Flow**

1. **User Registration/Login** → JWT Token Generated → Stored in localStorage
2. **Profile Setup** → User adds education, interests, skills → Profile completed
3. **Dashboard** → Displays recommendations, skill gaps, progress
4. **Career Exploration** → Browse careers, view details, analyze skill gaps
5. **AI Chat** → Get personalized career advice
6. **Learning Path** → Follow recommendations to bridge skill gaps

---

## 💾 Database Models

### **1. User Model** (`models/User.js`)

```javascript
{
  name: String,              // User's full name
  email: String,             // Unique email (login credential)
  password: String,          // Bcrypt hashed password
  education: String,         // Educational background
  interests: [String],       // Career interests (e.g., "AI", "Web Dev")
  skills: [String],          // Current skills (e.g., "JavaScript", "Python")
  profileCompleted: Boolean, // Whether profile setup is done
  createdAt: Date           // Account creation timestamp
}
```

**Purpose**: Stores user account information and profile data for personalization.

### **2. Career Model** (`models/Career.js`)

```javascript
{
  careerName: String,        // Career title (e.g., "Software Developer")
  description: String,       // Detailed career description
  requiredSkills: [String],  // Skills needed for this career
  averageSalary: String,     // Expected salary range
  jobOutlook: String,        // Job market outlook
  resources: [{              // Learning resources
    title: String,
    url: String,
    type: String            // 'video', 'course', 'article', 'book'
  }],
  category: String,          // Career category (e.g., "Technology")
  createdAt: Date
}
```

**Purpose**: Contains comprehensive career information for matching and recommendations.

### **3. Recommendation Model** (`models/Recommendation.js`)

```javascript
{
  userId: ObjectId,           // Reference to User
  suggestedCareers: [{
    careerId: ObjectId,       // Reference to Career
    careerName: String,
    matchScore: Number,       // Compatibility score (0-100)
    reason: String           // Why this career is recommended
  }],
  missingSkills: [{
    skill: String,
    priority: String,         // 'high', 'medium', 'low'
    relatedCareers: [String]
  }],
  learningPath: [{
    skill: String,
    resources: [{
      title: String,
      url: String,
      type: String,
      estimatedTime: String
    }]
  }],
  timestamp: Date             // When recommendations were generated
}
```

**Purpose**: Stores AI-generated career recommendations and learning paths.

### **4. Message Model** (`models/Message.js`)

```javascript
{
  userId: ObjectId,           // Reference to User
  message: String,            // User's message
  reply: String,              // AI's response
  timestamp: Date             // Message timestamp
}
```

**Purpose**: Stores chat conversation history for context-aware responses.

### **5. File Model** (`models/File.js`)

```javascript
{
  userId: ObjectId,           // Reference to User
  filename: String,           // Original filename
  path: String,               // Server file path
  mimetype: String,           // File type
  size: Number,               // File size in bytes
  uploadedAt: Date
}
```

**Purpose**: Manages uploaded resume/portfolio files.

---

## 🔌 API Endpoints

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user account |
| POST | `/api/auth/login` | ❌ | Login and receive JWT token |
| GET | `/api/auth/profile` | ✅ | Get current user profile |
| PUT | `/api/auth/profile` | ✅ | Update user profile data |

**Example Request: Register**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Example Response: Register**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "profileCompleted": false
  }
}
```

### **Career Routes** (`/api/careers`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/careers` | ✅ | Get all available careers |
| GET | `/api/careers/:id` | ✅ | Get specific career details |

### **AI Routes** (`/api/ai`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/ai/recommendations` | ✅ | Get personalized career recommendations |
| POST | `/api/ai/skill-gap` | ✅ | Analyze skill gap for specific career |
| POST | `/api/ai/chat` | ✅ | Chat with AI career counselor |

**Example Request: Get Recommendations**
```json
GET /api/ai/recommendations
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response: Recommendations**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "suggestedCareers": [
    {
      "careerId": "507f191e810c19729de860ea",
      "careerName": "Full Stack Developer",
      "matchScore": 85,
      "reason": "Matches 5 of your skills and aligns with your interests"
    }
  ],
  "missingSkills": [
    {
      "skill": "Docker",
      "priority": "high",
      "relatedCareers": ["DevOps Engineer", "Cloud Architect"]
    }
  ],
  "learningPath": [...]
}
```

**Example Request: AI Chat**
```json
POST /api/ai/chat
{
  "message": "What skills should I learn for a data science career?",
  "conversationHistory": []
}
```

---

## 🎨 Frontend Components

### **1. AuthContext** (`context/AuthContext.jsx`)

**Purpose**: Global state management for authentication.

**Features**:
- Manages user login/logout state
- Persists authentication across page refreshes
- Provides `user`, `login`, `logout`, `updateUser` functions
- Loading state during authentication checks

**Usage**:
```javascript
const { user, login, logout, loading } = useAuth();
```

### **2. Navbar** (`components/Navbar.jsx`)

**Purpose**: Navigation menu for the application.

**Features**:
- Links to Dashboard, Careers, AI Chat, Profile
- Logout functionality
- User name display
- Responsive design

### **3. Auth Pages**

#### **Login** (`pages/Login.jsx`)
- Email/password form
- JWT token handling
- Redirect to dashboard on success
- Link to registration

#### **Register** (`pages/Register.jsx`)
- Name, email, password form
- Account creation
- Auto-login after registration
- Link to login

#### **ProfileSetup** (`pages/ProfileSetup.jsx`)
- Education selection
- Interest tags (multi-select)
- Skills input (multi-select)
- Profile completion tracking

### **4. Dashboard** (`pages/Dashboard.jsx`)

**Purpose**: Main overview page after login.

**Features**:
- Welcome message with user name
- Profile completion status
- Quick stats (skills count, interests)
- Career recommendation cards
- Skill gap visualization (Chart.js)
- Quick navigation to careers and chat

### **5. Careers** (`pages/Careers.jsx`)

**Purpose**: Browse all available career options.

**Features**:
- Search functionality (by name)
- Category filtering
- Salary range filtering
- Career cards with match scores
- Click to view details

### **6. CareerDetail** (`pages/CareerDetail.jsx`)

**Purpose**: Detailed information about a specific career.

**Features**:
- Full career description
- Required skills list
- Average salary information
- Job outlook
- Learning resources (videos, courses, articles)
- "Analyze Skill Gap" button
- Related careers

### **7. AIChat** (`pages/AIChat.jsx`)

**Purpose**: Interactive career counseling chatbot.

**Features**:
- Real-time chat interface
- Context-aware responses
- Message history
- Typing indicators
- Suggested questions
- Mobile-friendly

**Chat Capabilities**:
- Career path guidance
- Skill recommendations
- Learning resources
- Interview preparation
- Salary negotiation advice
- Remote work opportunities

### **8. Profile** (`pages/Profile.jsx`)

**Purpose**: User account management.

**Features**:
- View/edit personal information
- Update education, interests, skills
- Profile completion percentage
- Account statistics
- Clear recommendations cache

### **9. SkillGap** (`pages/SkillGap.jsx`)

**Purpose**: Visual analysis of skill gaps for a specific career.

**Features**:
- Radar chart showing skill coverage
- Bar chart comparing required vs. current skills
- Matching skills (green badges)
- Missing skills (red badges)
- Learning resources for each missing skill
- Match percentage calculation

---

## 🔐 Authentication Flow

### **Registration Process**

```
1. User fills registration form (name, email, password)
   ↓
2. POST /api/auth/register
   ↓
3. Server validates input
   ↓
4. Password hashed with bcryptjs (10 salt rounds)
   ↓
5. User saved to MongoDB
   ↓
6. JWT token generated (7-day expiration)
   ↓
7. Token + user data returned to client
   ↓
8. Client stores token in localStorage
   ↓
9. User redirected to profile setup
```

### **Login Process**

```
1. User enters email and password
   ↓
2. POST /api/auth/login
   ↓
3. Server finds user by email
   ↓
4. bcrypt.compare(password, hashedPassword)
   ↓
5. If valid: JWT token generated
   ↓
6. Token + user data returned
   ↓
7. Client stores in localStorage
   ↓
8. Redirect to dashboard
```

### **Protected Route Access**

```
1. User navigates to protected route (e.g., /dashboard)
   ↓
2. ProtectedRoute component checks for user
   ↓
3. If no user: Redirect to /login
   ↓
4. If user exists: Render requested component
   ↓
5. API requests include: Authorization: Bearer <token>
   ↓
6. Server middleware verifies JWT
   ↓
7. If valid: Process request
   ↓
8. If invalid/expired: Return 401 Unauthorized
```

### **JWT Token Structure**

```javascript
// Token Payload
{
  userId: "507f1f77bcf86cd799439011",
  iat: 1699000000,  // Issued at
  exp: 1699604800   // Expires (7 days)
}

// Signing
jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })

// Verification
jwt.verify(token, JWT_SECRET)
```

---

## 🤖 AI Features

### **1. Career Recommendations**

**Algorithm** (ai-mock.js):

```javascript
// Matching Algorithm
for each career:
  score = 0
  
  // Skill Matching (70% weight)
  matchingSkills = intersection(userSkills, careerRequiredSkills)
  skillScore = (matchingSkills.length / requiredSkills.length) * 70
  score += skillScore
  
  // Interest Matching (30% weight)
  if (userInterests overlap with career.category OR career.name):
    score += 30
  
  matchScore = round(score)  // 0-100

// Sort by score, return top 3
```

**Output**:
- Top 3 recommended careers with match scores
- Missing skills for each career
- Learning resources

### **2. Skill Gap Analysis**

**Process**:
1. Get user's current skills
2. Get target career's required skills
3. Compare: `matchingSkills = userSkills ∩ requiredSkills`
4. Calculate: `matchPercentage = (matching / required) * 100`
5. Identify missing skills
6. Suggest learning resources

**Visualization**:
- Radar Chart: Overall skill coverage
- Bar Chart: Skill-by-skill comparison
- Progress indicators

### **3. AI Chat (Mock Implementation)**

**How It Works**:

```javascript
// Pattern Matching
const lowerMessage = message.toLowerCase()

if (message includes 'skill' OR 'learn'):
  → Suggest high-demand skills
else if (message includes 'career' OR 'job'):
  → Analyze user profile, suggest career paths
else if (message includes 'interview'):
  → Provide interview preparation tips
else if (message includes 'salary'):
  → Salary negotiation advice
else:
  → General career counseling introduction
```

**Context Awareness**:
- Uses user's education, interests, skills in responses
- References specific skills from user profile
- Tailored advice based on experience level

**Switchable to Real OpenAI**:
The project includes `routes/ai.js` (real OpenAI integration) that can replace `ai-mock.js`:

```javascript
// In server.js
// Current: const aiRoutes = require('./routes/ai-mock');
// Real AI: const aiRoutes = require('./routes/ai');
```

---

## 🔄 How Things Work Together

### **Complete User Journey**

#### **Step 1: Registration & Profile Setup**

```
User visits app
   ↓
Register (/register)
   ↓
Email verification (if enabled)
   ↓
Profile Setup (/profile-setup)
   - Select education level
   - Choose interests (AI, Web Dev, Data Science, etc.)
   - Add skills (JavaScript, Python, SQL, etc.)
   ↓
Profile marked as complete
   ↓
Redirect to Dashboard
```

#### **Step 2: Getting Recommendations**

```
Dashboard loads
   ↓
GET /api/ai/recommendations
   ↓
Backend checks cache (valid for 24h)
   ↓
If no cache:
   - Load all careers from database
   - Calculate match scores
   - Identify missing skills
   - Generate learning paths
   - Save to Recommendation collection
   ↓
Return recommendations to frontend
   ↓
Display on Dashboard:
   - Top 3 career matches
   - Match percentages
   - Skill gap summary
   - Learning resources
```

#### **Step 3: Exploring Careers**

```
User clicks "Explore Careers"
   ↓
Navigate to /careers
   ↓
GET /api/careers (fetch all careers)
   ↓
Display career cards with:
   - Career name
   - Category
   - Salary range
   - Match score (if available)
   ↓
User can:
   - Search by name
   - Filter by category
   - Filter by salary range
   ↓
Click on career card
   ↓
Navigate to /career/:id
   ↓
GET /api/careers/:id
   ↓
Display full career details:
   - Description
   - Required skills
   - Job outlook
   - Learning resources
   - "Analyze Skill Gap" button
```

#### **Step 4: Skill Gap Analysis**

```
User clicks "Analyze Skill Gap"
   ↓
POST /api/ai/skill-gap
Body: { careerName: "Full Stack Developer" }
   ↓
Backend:
   - Fetch user skills
   - Fetch career required skills
   - Calculate matching vs missing
   - Return match percentage + lists
   ↓
Navigate to /skill-gap state
   ↓
Display visualizations:
   - Radar chart (overall coverage)
   - Bar chart (per-skill comparison)
   - Missing skills with resources
   - Action plan
```

#### **Step 5: AI Chat Interaction**

```
User navigates to /chat
   ↓
Chat interface loads
   ↓
User types: "What skills should I learn for AI?"
   ↓
POST /api/ai/chat
Body: {
  message: "What skills...",
  conversationHistory: [...]
}
   ↓
Backend (ai-mock.js):
   - Analyze message pattern
   - Fetch user profile (education, interests, skills)
   - Generate context-aware response
   - Consider conversation history
   ↓
Return AI response
   ↓
Display in chat interface
   ↓
User can continue conversation
```

### **Data Flow Diagram**

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  User    │ ─────→   │  React   │ ─────→   │  Express │
│ Browser  │          │  Client  │          │  Server  │
└──────────┘          └──────────┘          └──────────┘
     ↑                     ↑                      ↑
     │                     │                      │
     │                     │                      ↓
     │                     │                ┌──────────┐
     │                     │                │ MongoDB  │
     │                     │                └──────────┘
     │                     │                      ↑
     │                     ↓                      │
     │              ┌──────────┐                  │
     └──────────    │localStorage│                │
                    │  (Cache)  │ ────────────────┘
                    └──────────┘
```

**Request Flow**:
1. User action triggers API call from React
2. Axios adds JWT token to Authorization header
3. Server middleware verifies token
4. Controller processes request
5. Mongoose queries/updates MongoDB
6. Response sent back to client
7. React updates UI based on response
8. Optional: Cache data in localStorage

---

## 📦 Setup & Installation

### **Prerequisites**

- **Node.js**: v16 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **npm** or **yarn**: Package manager

### **Installation Steps**

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-career-guidance
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/career-guidance
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000

# Optional (for real OpenAI integration)
OPENAI_API_KEY=sk-your-openai-api-key
```

Create `client/.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Seed the database**
```bash
cd server
node seed.js
```

6. **Start the development servers**

**Terminal 1 (Backend)**:
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd client
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### **Using START.bat (Windows)**

For quick startup on Windows:
```bash
START.bat
```

This script automatically:
1. Starts MongoDB (if installed locally)
2. Starts the backend server
3. Starts the frontend dev server
4. Opens browser to http://localhost:5173

---

## 🔐 Environment Variables

### **Server Variables**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ | `mongodb://localhost:27017/career-guidance` | MongoDB connection string |
| `JWT_SECRET` | ✅ | `your_jwt_secret_key_here` | Secret key for JWT signing |
| `PORT` | ❌ | `5000` | Server port number |
| `OPENAI_API_KEY` | ❌ | - | OpenAI API key (for real AI) |
| `NODE_ENV` | ❌ | `development` | Environment mode |

### **Client Variables**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | `http://localhost:5000/api` | Backend API base URL |

---

## 📁 File Structure

```
ai-career-guidance/
│
├── client/                          # React Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── data/
│   │   │   └── careers.js           # Static career data (fallback)
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── ProfileSetup.jsx     # Profile completion
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Careers.jsx          # Career browsing
│   │   │   ├── CareerDetail.jsx     # Career details
│   │   │   ├── AIChat.jsx           # AI chatbot
│   │   │   ├── Profile.jsx          # User profile
│   │   │   └── SkillGap.jsx         # Skill analysis
│   │   ├── services/
│   │   │   └── api.js               # API client (Axios)
│   │   ├── utils/
│   │   │   └── localStorage.js      # Client storage helpers
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css                  # Global styles
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Base styles
│   ├── eslint.config.js             # ESLint configuration
│   ├── vite.config.js               # Vite configuration
│   ├── package.json
│   └── README.md
│
├── server/                          # Node.js Backend
│   ├── models/                      # MongoDB models
│   │   ├── User.js                  # User schema
│   │   ├── Career.js                # Career schema
│   │   ├── Recommendation.js        # Recommendation schema
│   │   ├── Message.js               # Chat message schema
│   │   └── File.js                  # File upload schema
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── career.js                # Career endpoints
│   │   ├── ai-mock.js               # Mock AI (no OpenAI needed)
│   │   ├── ai.js                    # Real AI (requires OpenAI)
│   │   ├── chat.js                  # Chat endpoints (optional)
│   │   └── files.js                 # File upload endpoints
│   ├── uploads/                     # Uploaded files storage
│   ├── server.js                    # Express server setup
│   ├── seed.js                      # Database seeding script
│   ├── test-openai.js               # OpenAI connection test
│   ├── package.json
│   └── .env                         # Environment variables
│
├── START.bat                        # Windows startup script
├── QUICK_FIX.md                     # Troubleshooting guide
├── QUICKSTART.md                    # Quick start guide
├── MIGRATION_GUIDE.md               # Migration documentation
├── MIGRATION_SUMMARY.md             # Migration summary
├── AI_CHAT_TROUBLESHOOTING.md       # Chat issues guide
├── AI_ISSUE_RESOLVED.md             # Resolved issues log
├── RECOMMENDATION_FIX.md            # Recommendation fixes
├── START_HERE.md                    # Getting started
├── README.md                        # Project overview
└── COMPLETE_GUIDE.md                # This file
```

---

## 🎯 Key Features Explained

### **1. Progressive Profile Building**

The app guides users through profile completion:
- Basic info (name, email) → Registration
- Education → Profile Setup
- Interests → Profile Setup
- Skills → Profile Setup
- Each step unlocks better recommendations

### **2. Intelligent Matching Algorithm**

Career recommendations use a weighted scoring system:
- **70%**: Skill matching (how many required skills user has)
- **30%**: Interest alignment (career category matches interests)
- **Result**: 0-100 match score for each career

### **3. Fallback System**

The app works offline or without OpenAI:
- localStorage cache for offline functionality
- Mock AI responses for chat (no API needed)
- Static career data as fallback
- Graceful degradation when backend is unavailable

### **4. Real-time Updates**

- AuthContext syncs user state across all components
- Profile changes immediately reflect in recommendations
- Chat messages appear in real-time
- No page refresh needed for most actions

### **5. Data Visualization**

Using Chart.js for insights:
- **Radar Chart**: Overall skill coverage (pentagon showing 5 key skills)
- **Bar Chart**: Individual skill comparison (matching vs required)
- **Progress Bars**: Profile completion percentage
- Color-coded: Green (good), Yellow (medium), Red (needs work)

---

## 🔧 Common Operations

### **Adding a New Career**

1. Add to database via MongoDB shell or seed script
2. Or use the careers route (if admin routes are implemented)

```javascript
// seed.js
{
  careerName: "Blockchain Developer",
  description: "Build decentralized applications...",
  requiredSkills: ["Solidity", "Ethereum", "Web3.js"],
  averageSalary: "$100k-$150k",
  jobOutlook: "Rapidly growing",
  resources: [...],
  category: "Technology"
}
```

### **Switching to Real OpenAI**

1. Get OpenAI API key from https://platform.openai.com
2. Add to `server/.env`: `OPENAI_API_KEY=sk-...`
3. Update `server/server.js`:
```javascript
// Change this:
const aiRoutes = require('./routes/ai-mock');
// To this:
const aiRoutes = require('./routes/ai');
```
4. Restart server

### **Deploying to Production**

**Backend** (Heroku, Railway, Render):
1. Set environment variables
2. Build: `npm install`
3. Start: `npm start`

**Frontend** (Vercel, Netlify):
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_API_URL` to production backend URL

**Database** (MongoDB Atlas):
1. Create free cluster
2. Get connection string
3. Update `MONGODB_URI` in production env

---

## 🐛 Troubleshooting

### **"Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Check IP whitelist

### **"401 Unauthorized" errors**
- Token expired (re-login)
- Missing Authorization header
- Invalid JWT_SECRET

### **"No careers found"**
- Run `node seed.js` to populate database
- Check MongoDB connection
- Verify careers collection exists

### **Chat not responding**
- Check if backend is running
- Look for errors in server console
- Ensure user profile is complete

### **Recommendations not loading**
- Clear cache: Profile page → "Clear Cache"
- Ensure user has skills and interests set
- Check backend logs for errors

---

## 📚 Additional Resources

- **React Documentation**: https://react.dev
- **Express Guide**: https://expressjs.com
- **MongoDB Manual**: https://docs.mongodb.com
- **Chart.js Docs**: https://www.chartjs.org
- **JWT.io**: https://jwt.io (JWT debugger)

---

## 🎓 Learning Path from This Project

By studying this codebase, you'll learn:

1. **Full-Stack Development**
   - React frontend with hooks and context
   - RESTful API design with Express
   - MongoDB database modeling

2. **Authentication & Security**
   - JWT token-based auth
   - Password hashing with bcrypt
   - Protected routes and middleware

3. **State Management**
   - React Context API
   - localStorage for persistence
   - Server-side caching

4. **API Integration**
   - Axios for HTTP requests
   - Error handling and fallbacks
   - Request/response interceptors

5. **Data Visualization**
   - Chart.js integration
   - Responsive charts
   - Data transformation

6. **AI/ML Concepts**
   - Recommendation algorithms
   - Skill matching logic
   - Context-aware responses

7. **Modern Dev Tools**
   - Vite for fast builds
   - ESLint for code quality
   - Hot module replacement

---

## 🚀 Next Steps & Enhancements

### **Potential Features**
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] File upload for resume analysis
- [ ] Video call integration for career counseling
- [ ] Job board integration (LinkedIn, Indeed APIs)
- [ ] Certificate tracking
- [ ] Learning progress tracking
- [ ] Community forums
- [ ] Mentor matching
- [ ] Interview prep with mock interviews
- [ ] Salary calculator
- [ ] Company reviews integration

### **Technical Improvements**
- [ ] Add TypeScript for type safety
- [ ] Implement Redis for caching
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add API rate limiting
- [ ] Implement WebSocket for real-time updates
- [ ] Add search engine optimization (SEO)
- [ ] Progressive Web App (PWA) features
- [ ] Internationalization (i18n)

---

## 📝 License

This project is for educational purposes. Feel free to use and modify as needed.

---

## 👨‍💻 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📧 Support

For questions or issues:
- Check troubleshooting guides
- Review existing documentation
- Create an issue on GitHub

---

**Made with ❤️ using the MERN Stack**

*Last Updated: November 2025*
