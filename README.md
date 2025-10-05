# Hyrox Workout Generator App

## Project Overview

This project aims to develop a dedicated, intelligent web application for Hyrox athletes to effectively plan and track their training. The app will address key pain points such as inconsistent workout planning, lack of integrated performance tracking, and limited personalized guidance in existing solutions.

### Core Features (MVP)
-   **Workout Generation Engine:** Generates Hyrox-specific workout plans with basic customization, variety, and progression across running and functional movements.
-   **Workout Logging & Tracking:** Allows users to log performance data for completed workouts and visualize basic progress trends over time.

### Technical Stack
-   **Frontend:** React/Next.js
-   **Backend:** Node.js (potentially within Next.js API routes or serverless functions)
-   **Database:** PostgreSQL
-   **Hosting:** Vercel (for frontend)

### Constraints
-   **Budget:** Free, utilizing free-tier services.
-   **Timeline:** MVP to be built within a few hours.
-   **Resources:** Solo project.

### Development Status
1.  ✅ Project Setup (repository, Next.js, PostgreSQL, Vercel)
2.  ✅ Detailed Technical Design for MVP
3.  ✅ **Phase 1: Foundation Setup** (Next.js initialized, database schema created in Supabase)
4.  ✅ **Phase 2: Workout Generation** (Complete - API, components, and UI integrated)
5.  ✅ **Phase 3: Workout Logging** (Complete - Log performance data and track results)
6.  ✅ **Phase 4: Progress View** (Complete - View workout history and track progress)
7.  ⏳ Phase 5: Polish & Deploy

### Latest Updates (October 5, 2025)

**Phase 4 Complete - Progress View & History** 
- ✅ API endpoint (`/api/workouts/history`) - Fetches workout history with stats
- ✅ `WorkoutCard` component - Expandable cards showing workout details
- ✅ `WorkoutList` component - List of all logged workouts
- ✅ History page (`/history`) - Complete progress tracking view
- ✅ Summary statistics - Total workouts, best time, average time, streak
- ✅ Bottom navigation bar - Easy switching between Home and Progress
- ✅ Expandable workout details - Tap to see all station/run times
- ✅ Cal AI-inspired design with clean cards and stats
- ✅ Build tested and passing (112 kB First Load JS)

**Phase 3 Complete - Workout Logging Feature** 
- ✅ Log performance data with MM:SS time inputs
- ✅ Auto-calculated overall time and success animations
- ✅ Workout status updates and completion badges

**Phase 2 Complete - Workout Generation Feature** 
- ✅ Generate personalized Hyrox workouts based on fitness level
- ✅ Beautiful workout display with all stations and runs

### Documentation
-   [Project Brief](docs/brief.md) - Complete project overview and requirements
-   [Architecture Document](docs/architecture.md) - Technical architecture and design
-   [Front-End Specification](docs/front-end-spec.md) - UI/UX design specification (Cal AI inspired)
-   [Project Plan](docs/project-plan.md) - High-level MVP development plan

