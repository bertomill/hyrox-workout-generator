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
6.  ⏳ Phase 4: Progress View
7.  ⏳ Phase 5: Polish & Deploy

### Latest Updates (October 5, 2025)

**Phase 3 Complete - Workout Logging Feature** 
- ✅ API endpoint (`/api/workouts/log`) - Saves performance data to database
- ✅ `TimeInput` component - MM:SS format with auto-formatting and validation
- ✅ `LogForm` component - Complete form for all 8 stations + 8 runs
- ✅ Auto-calculated overall time from all segments
- ✅ Success feedback with celebration animation
- ✅ Workout status updates (pending → completed)
- ✅ Dynamic stats counter showing logged workouts
- ✅ Completion badge when workout is logged
- ✅ Build tested and passing (108 kB First Load JS)

**Phase 2 Complete - Workout Generation Feature** 
- ✅ Workout generation algorithm (`lib/workoutGenerator.ts`) - Generates Hyrox workouts based on fitness level
- ✅ API endpoint (`/api/workouts/generate`) - Saves workouts to database
- ✅ UI components: Button, Card, GeneratorForm, WorkoutDisplay
- ✅ Custom design with branded colors (#E63946 primary red, #457B9D blue)
- ✅ Mobile-first responsive design

### Documentation
-   [Project Brief](docs/brief.md) - Complete project overview and requirements
-   [Architecture Document](docs/architecture.md) - Technical architecture and design
-   [Front-End Specification](docs/front-end-spec.md) - UI/UX design specification (Cal AI inspired)
-   [Project Plan](docs/project-plan.md) - High-level MVP development plan

