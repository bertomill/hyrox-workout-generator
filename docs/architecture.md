# Architecture Document: Hyrox Workout Generator

**Version:** 1.0  
**Last Updated:** October 5, 2025  
**Status:** Draft

---

## 1. Overview

The Hyrox Workout Generator is a mobile-first Progressive Web App (PWA) designed to help Hyrox athletes generate personalized workouts and track their performance over time. The application prioritizes simplicity, speed, and mobile usability.

### 1.1 Design Principles

-   **Mobile-First:** Optimized for mobile devices with minimal page navigation
-   **Lightweight:** Fast loading times and efficient data usage
-   **Rapid Development:** Built to be deployed within hours using modern frameworks
-   **Free-Tier Friendly:** Designed to operate within free hosting and database tiers
-   **Progressive Enhancement:** Works as a web app, installable as PWA on iOS/Android

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│           User (Mobile Browser/PWA)             │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│         Next.js Application (Vercel)            │
│  ┌───────────────────────────────────────────┐  │
│  │  Frontend (React Components)              │  │
│  │  - Main Dashboard                         │  │
│  │  - Workout Generator                      │  │
│  │  - Workout Logger                         │  │
│  │  - History View                           │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  API Routes (Serverless Functions)        │  │
│  │  - /api/workouts/generate                 │  │
│  │  - /api/workouts/log                      │  │
│  │  - /api/workouts/history                  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ SQL
                  ▼
┌─────────────────────────────────────────────────┐
│    PostgreSQL Database (Supabase/Railway)       │
│  - users                                        │
│  - workouts                                     │
│  - workout_logs                                 │
└─────────────────────────────────────────────────┘
```

### 2.2 Architecture Style

-   **Monolithic Next.js Application:** Single application serving both frontend and backend
-   **Server-Side Rendering (SSR) / Static Generation:** For optimal performance
-   **API Routes:** Serverless functions for backend logic
-   **RESTful API:** Simple REST endpoints for data operations

---

## 3. Frontend Architecture

### 3.1 Page Structure (Minimalist Approach)

Given the mobile-first requirement, we're minimizing page count:

#### Primary Pages:
-   **`/` (index.tsx):** Main Dashboard/Hub
    -   Dynamic component rendering based on user state
    -   Sections: Generate Workout, Active Workout, Log Results, Quick Stats
    -   Tab or accordion-style navigation for different sections
-   **`/history` (history.tsx):** Workout History (Optional separate page)
    -   List of past workouts with filtering
    -   Detailed performance trends

### 3.2 Component Architecture

```
src/
├── pages/
│   ├── index.tsx              # Main dashboard
│   ├── history.tsx            # Workout history (optional)
│   ├── _app.tsx               # App wrapper
│   ├── _document.tsx          # Document wrapper
│   └── api/
│       └── workouts/
│           ├── generate.ts    # Generate workout endpoint
│           ├── log.ts         # Log workout endpoint
│           └── history.ts     # Get workout history endpoint
├── components/
│   ├── WorkoutGenerator/
│   │   ├── GeneratorForm.tsx  # Input form for workout generation
│   │   └── WorkoutDisplay.tsx # Display generated workout
│   ├── WorkoutLogger/
│   │   ├── LogForm.tsx        # Form to log workout results
│   │   └── StationInput.tsx   # Individual station input
│   ├── History/
│   │   ├── WorkoutList.tsx    # List of past workouts
│   │   ├── WorkoutCard.tsx    # Individual workout card
│   │   └── ProgressChart.tsx  # Simple progress visualization
│   ├── Layout/
│   │   ├── Header.tsx         # App header
│   │   ├── Navigation.tsx     # Mobile navigation
│   │   └── Layout.tsx         # Main layout wrapper
│   └── ui/
│       ├── Button.tsx         # Reusable button
│       ├── Input.tsx          # Reusable input
│       └── Card.tsx           # Reusable card
├── lib/
│   ├── db.ts                  # Database connection
│   ├── workoutGenerator.ts    # Workout generation logic
│   └── types.ts               # TypeScript types
└── styles/
    └── globals.css            # Global styles (Tailwind)
```

### 3.3 State Management

-   **React State & Hooks:** For simple local state management
-   **Context API:** For sharing user session/auth state (if needed)
-   **No external state library:** To keep bundle size small for MVP

### 3.4 Styling Approach

-   **Tailwind CSS:** Utility-first CSS framework for rapid development
-   **Mobile-First Responsive Design:** Default mobile, scale up for larger screens
-   **Dark Mode Support:** Optional, using Tailwind's dark mode utilities

---

## 4. Backend Architecture

### 4.1 API Routes (Next.js Serverless Functions)

All backend logic is handled through Next.js API routes, which are deployed as serverless functions on Vercel.

#### Endpoints:

**POST /api/workouts/generate**
-   **Purpose:** Generate a new Hyrox workout
-   **Input:** User preferences (fitness level, target event, etc.)
-   **Output:** Generated workout object
-   **Logic:** Runs workout generation algorithm

**POST /api/workouts/log**
-   **Purpose:** Log a completed workout
-   **Input:** Workout ID, performance data
-   **Output:** Confirmation and updated workout record
-   **Logic:** Saves performance data to database

**GET /api/workouts/history**
-   **Purpose:** Retrieve workout history
-   **Input:** User ID (from session), optional filters
-   **Output:** Array of past workouts with performance data
-   **Logic:** Queries database for user's workout logs

### 4.2 Workout Generation Logic

Located in `lib/workoutGenerator.ts`:

-   **Algorithm:** Rule-based system for MVP
    -   Selects varied Hyrox stations (8 stations: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges, Wall Balls)
    -   Intersperses running segments (1km runs between stations)
    -   Adjusts intensity based on fitness level (beginner/intermediate/advanced)
    -   Ensures variety to prevent plateaus
-   **Future Enhancement:** AI/ML-based adaptive programming

### 4.3 Database Operations

-   **ORM/Query Builder:** Consider using Prisma or raw SQL with pg library
-   **Connection Pooling:** For efficient database connections in serverless environment

---

## 5. Database Schema

### 5.1 PostgreSQL Schema (Initial Design)

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    fitness_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Workouts Table
```sql
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workout_details JSONB NOT NULL, -- Stores full workout structure
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example `workout_details` JSONB structure:**
```json
{
    "fitnessLevel": "intermediate",
    "stations": [
        {"name": "SkiErg", "distance": "1000m", "order": 1},
        {"name": "Sled Push", "distance": "50m", "weight": "102kg", "order": 2},
        {"name": "Sled Pull", "distance": "50m", "weight": "78kg", "order": 3},
        {"name": "Burpee Broad Jumps", "distance": "80m", "order": 4},
        {"name": "Rowing", "distance": "1000m", "order": 5},
        {"name": "Farmers Carry", "distance": "200m", "weight": "2x24kg", "order": 6},
        {"name": "Sandbag Lunges", "distance": "100m", "weight": "20kg", "order": 7},
        {"name": "Wall Balls", "reps": "100", "weight": "6kg", "order": 8}
    ],
    "runs": [
        {"distance": "1km", "order": 0},
        {"distance": "1km", "order": 2},
        {"distance": "1km", "order": 4},
        {"distance": "1km", "order": 6},
        {"distance": "1km", "order": 8},
        {"distance": "1km", "order": 10},
        {"distance": "1km", "order": 12},
        {"distance": "1km", "order": 14}
    ]
}
```

#### Workout Logs Table
```sql
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_completed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performance_data JSONB NOT NULL, -- Stores performance for each station
    overall_time INTEGER, -- Total time in seconds
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example `performance_data` JSONB structure:**
```json
{
    "stations": [
        {"name": "SkiErg", "time": "3:45", "order": 1},
        {"name": "Sled Push", "time": "1:20", "order": 2},
        {"name": "Sled Pull", "time": "1:35", "order": 3},
        {"name": "Burpee Broad Jumps", "time": "2:10", "order": 4},
        {"name": "Rowing", "time": "3:30", "order": 5},
        {"name": "Farmers Carry", "time": "1:45", "order": 6},
        {"name": "Sandbag Lunges", "time": "2:30", "order": 7},
        {"name": "Wall Balls", "time": "4:00", "order": 8}
    ],
    "runs": [
        {"distance": "1km", "time": "4:30", "order": 0},
        {"distance": "1km", "time": "4:35", "order": 2},
        {"distance": "1km", "time": "4:40", "order": 4},
        {"distance": "1km", "time": "4:45", "order": 6},
        {"distance": "1km", "time": "4:50", "order": 8},
        {"distance": "1km", "time": "4:55", "order": 10},
        {"distance": "1km", "time": "5:00", "order": 12},
        {"distance": "1km", "time": "5:05", "order": 14}
    ],
    "overallTime": "75:30"
}
```

### 5.2 Indexes

```sql
-- Improve query performance
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_workout_id ON workout_logs(workout_id);
CREATE INDEX idx_workout_logs_date_completed ON workout_logs(date_completed);
```

---

## 6. Data Flow

### 6.1 Workout Generation Flow

1.  User opens app → Main Dashboard loads
2.  User selects "Generate Workout" → Opens GeneratorForm component
3.  User inputs preferences (fitness level) → Submits form
4.  Frontend sends POST request to `/api/workouts/generate`
5.  API route runs workout generation algorithm
6.  New workout saved to `workouts` table
7.  Workout data returned to frontend
8.  WorkoutDisplay component renders the generated workout

### 6.2 Workout Logging Flow

1.  User completes a workout
2.  User selects "Log Workout" → Opens LogForm component
3.  User inputs performance data for each station and run
4.  Frontend sends POST request to `/api/workouts/log` with performance data
5.  API route saves data to `workout_logs` table
6.  Updates workout status to 'completed' in `workouts` table
7.  Confirmation returned to frontend
8.  UI updates to show logged workout

### 6.3 History View Flow

1.  User navigates to History section/page
2.  Frontend sends GET request to `/api/workouts/history`
3.  API route queries `workout_logs` table for user's history
4.  Returns array of past workouts with performance data
5.  Frontend renders WorkoutList with individual WorkoutCards
6.  ProgressChart component visualizes trends

---

## 7. Technology Stack

### 7.1 Frontend
-   **Framework:** Next.js 14+ (React 18+)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** React Hooks + Context API
-   **Data Fetching:** Native fetch API / SWR (for caching)
-   **Charts:** Recharts or Chart.js (for progress visualization)

### 7.2 Backend
-   **Runtime:** Node.js (via Next.js API Routes)
-   **API Style:** REST
-   **Database Client:** pg (node-postgres) or Prisma ORM

### 7.3 Database
-   **Database:** PostgreSQL 14+
-   **Hosting:** Supabase (free tier) or Railway (free tier)

### 7.4 Hosting & Deployment
-   **Frontend Hosting:** Vercel (free tier)
-   **Serverless Functions:** Vercel Serverless Functions
-   **CDN:** Vercel Edge Network
-   **Domain:** Custom domain or Vercel subdomain

### 7.5 Development Tools
-   **Package Manager:** npm or pnpm
-   **Version Control:** Git + GitHub
-   **Code Quality:** ESLint + Prettier
-   **TypeScript:** For type safety

---

## 8. Deployment Architecture

### 8.1 Vercel Deployment

-   **Build Command:** `next build`
-   **Output Directory:** `.next`
-   **Environment Variables:**
    -   `DATABASE_URL`: PostgreSQL connection string
    -   `NEXTAUTH_SECRET`: (if using authentication)
    -   `NEXTAUTH_URL`: App URL

### 8.2 Environment Configuration

**.env.local (Development):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/hyrox_dev
```

**.env.production (Vercel):**
```
DATABASE_URL=<production-database-url>
```

### 8.3 CI/CD Pipeline

-   **Automatic Deployments:** GitHub integration with Vercel
-   **Preview Deployments:** For pull requests
-   **Production Deployment:** On push to main branch

---

## 9. Security Considerations

### 9.1 Authentication (Future)

-   **Initial MVP:** Single user (no authentication required)
-   **Phase 2:** Implement NextAuth.js for email/password authentication
-   **Session Management:** JWT-based sessions

### 9.2 API Security

-   **Input Validation:** Validate all user inputs in API routes
-   **SQL Injection Prevention:** Use parameterized queries
-   **Rate Limiting:** Consider implementing rate limiting for API routes (future)

### 9.3 Data Protection

-   **HTTPS Only:** Enforced by Vercel
-   **Environment Variables:** Sensitive data stored securely in Vercel
-   **No Client-Side Secrets:** Database credentials never exposed to frontend

---

## 10. Performance Considerations

### 10.1 Frontend Optimization

-   **Code Splitting:** Next.js automatic code splitting
-   **Image Optimization:** Next.js Image component (if using images)
-   **Lazy Loading:** Components loaded on-demand
-   **PWA Caching:** Service worker for offline capability

### 10.2 Database Optimization

-   **Indexes:** On frequently queried columns
-   **Connection Pooling:** Efficient connection management
-   **JSONB Queries:** Optimize JSONB queries with GIN indexes if needed

### 10.3 API Optimization

-   **Response Caching:** Cache workout history responses
-   **Minimal Data Transfer:** Only return necessary data
-   **Serverless Cold Start:** Accept initial latency for cost savings

---

## 11. Future Enhancements

### 11.1 Phase 2 Features
-   Advanced analytics and trend analysis
-   AI-based workout adaptation
-   Multi-user support with authentication
-   Social features (sharing workouts, leaderboards)

### 11.2 Technical Improvements
-   Real-time updates (WebSockets)
-   Native mobile apps (React Native)
-   Integration with fitness wearables
-   Advanced caching strategies

---

## 12. Constraints & Assumptions

### 12.1 Constraints
-   **Budget:** Free tier services only
-   **Timeline:** MVP built within a few hours
-   **Resources:** Solo developer project

### 12.2 Assumptions
-   User will primarily access via mobile browser/PWA
-   Manual data entry is acceptable for MVP
-   Simple workout generation algorithm sufficient initially
-   Free database tier can support up to 100 users

---

**Document End**
