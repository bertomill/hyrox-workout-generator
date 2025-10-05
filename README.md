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
5.  ⏳ Phase 3: Workout Logging
6.  ⏳ Phase 4: Progress View
7.  ⏳ Phase 5: Polish & Deploy

### Latest Updates (October 5, 2025)

**Phase 2 Complete - Workout Generation Feature** 
- ✅ Workout generation algorithm (`lib/workoutGenerator.ts`) - Generates Hyrox workouts based on fitness level
- ✅ API endpoint (`/api/workouts/generate`) - Saves workouts to database
- ✅ UI components created:
  - `Button` and `Card` primitives with Cal AI styling
  - `GeneratorForm` - Modal with fitness level selection
  - `WorkoutDisplay` - Beautiful workout display with stations and runs
- ✅ Main dashboard integrated - Generate and view workouts
- ✅ Custom design with branded colors (#E63946 primary red, #457B9D blue)
- ✅ Mobile-first responsive design
- ✅ Build tested and passing

### Documentation
-   [Project Brief](docs/brief.md) - Complete project overview and requirements
-   [Architecture Document](docs/architecture.md) - Technical architecture and design
-   [Front-End Specification](docs/front-end-spec.md) - UI/UX design specification (Cal AI inspired)
-   [Project Plan](docs/project-plan.md) - High-level MVP development plan

