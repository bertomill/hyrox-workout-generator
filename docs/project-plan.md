# Hyrox Workout Generator - MVP Project Plan ^ 

**Version:** 1.0  
**Created:** October 5, 2025  
**Timeline:** Few hours (rapid MVP build)  
**Status:** Ready to Start

---

## Project Overview

**Goal:** Build a functional MVP of the Hyrox Workout Generator that allows users to generate Hyrox-specific workouts and log their performance results. ^ 

**Scope:** Core features only - workout generation and logging with basic progress tracking. ^

**Success Criteria:**
- User can generate a Hyrox workout based on fitness level ^ 
- User can log workout results (station times, run times) ^ 
- User can view basic workout history ^ 
- App is deployed and accessible on mobile via PWA ^ 

---

## Prerequisites (Already Complete ✅) ^

- [x] GitHub repository created and connected to Vercel
- [x] PostgreSQL database provisioned and environment variables configured
- [x] Project Brief documented (`docs/brief.md`)
- [x] Architecture defined (`docs/architecture.md`)
- [x] UI/UX specification created (`docs/front-end-spec.md`)

---

## Development Phases

### Phase 1: Foundation Setup (Est. 30 minutes)

**Goal:** Initialize project infrastructure and basic structure ^

**Tasks:**
1. **Initialize Next.js project**
   - Run `npx create-next-app@latest` with TypeScript and Tailwind CSS
   - Configure Tailwind with custom colors from front-end spec
   - Set up folder structure per architecture document

2. **Database setup**
   - Create database schema (users, workouts, workout_logs tables)
   - Run SQL scripts to create tables and indexes
   - Test database connection from Next.js API routes

3. **Basic project structure**
   - Create `components/` folder structure (ui/, WorkoutGenerator/, WorkoutLogger/, Layout/)
   - Create `lib/` folder for utilities (db.ts, types.ts, workoutGenerator.ts)
   - Set up basic Layout component with placeholder navigation

**Deliverables:**
- Next.js app running locally on `http://localhost:3000`
- Database tables created and connection tested
- Basic folder structure in place

**Dependencies:** None

**Verification:**
- [ ] App loads without errors
- [ ] Can connect to PostgreSQL database
- [ ] Tailwind CSS is working

---

### Phase 2: Core Feature - Workout Generation (Est. 45-60 minutes)

**Goal:** Implement workout generation functionality ^ 

**Tasks:**

1. **Workout generation algorithm** (`lib/workoutGenerator.ts`)
   - Write function that generates Hyrox workout structure
   - Takes input: fitness level (beginner/intermediate/advanced)
   - Returns: JSONB structure with 8 stations + 8 runs
   - Use prescribed values from architecture doc (station distances, weights, etc.)

2. **API route: Generate workout** (`pages/api/workouts/generate.ts`)
   - POST endpoint that receives fitness level
   - Calls workout generator function
   - Saves workout to `workouts` table
   - Returns workout JSON to frontend

3. **UI Components:**
   - `GeneratorForm.tsx` - Simple modal with 3 fitness level buttons
   - `WorkoutDisplay.tsx` - Display generated workout in card format
   - `Button.tsx` and `Card.tsx` UI primitives

4. **Main Dashboard integration** (`pages/index.tsx`)
   - Show "Generate Workout" button/card
   - Open modal on click
   - Display generated workout after creation
   - Basic styling per front-end spec

**Deliverables:**
- Working workout generation flow (2 taps: open modal → select level → generate)
- Workout saved to database
- Workout displayed on screen with Cal AI aesthetic

**Dependencies:** Phase 1 complete

**Verification:**
- [ ] Can generate workout for each fitness level
- [ ] Workout saves to database correctly
- [ ] Workout displays properly on UI
- [ ] Modal opens and closes smoothly

---

### Phase 3: Core Feature - Workout Logging (Est. 45-60 minutes)

**Goal:** Implement workout result logging functionality

**Tasks:**

1. **API route: Log workout** (`pages/api/workouts/log.ts`)
   - POST endpoint that receives workout ID + performance data
   - Saves to `workout_logs` table
   - Updates workout status to 'completed'
   - Returns confirmation

2. **UI Components:**
   - `LogForm.tsx` - Form with inputs for all stations + runs
   - `StationInput.tsx` - Time input component (MM:SS format)
   - Input validation and auto-format

3. **Logging flow:**
   - "Log Workout" button on dashboard
   - Opens form with all 8 stations + 8 runs
   - Auto-advance through fields
   - Submit saves to database
   - Show success message

4. **Active workout state:**
   - Track current workout in component state
   - Show workout details
   - Allow logging from active workout view

**Deliverables:**
- Working workout logging flow
- All station/run times captured
- Data saved to database correctly
- Success feedback shown

**Dependencies:** Phase 2 complete

**Verification:**
- [ ] Can log time for each station and run
- [ ] Times validate properly (MM:SS format)
- [ ] Data saves to workout_logs table
- [ ] Success message displays

---

### Phase 4: Progress View (Est. 30-45 minutes)

**Goal:** Basic workout history and progress tracking

**Tasks:**

1. **API route: Get history** (`pages/api/workouts/history.ts`)
   - GET endpoint that fetches user's workout logs
   - Returns array of workouts with performance data
   - Sort by date (most recent first)

2. **UI Components:**
   - `WorkoutList.tsx` - List of past workouts
   - `WorkoutCard.tsx` - Individual workout summary card
   - `ProgressChart.tsx` - Simple chart showing basic trend (optional for MVP)

3. **Progress/History page** (`pages/history.tsx` or tab on index)
   - Fetch and display workout history
   - Show date, overall time, basic stats
   - Expandable cards for details

4. **Bottom navigation:**
   - Create tab bar with Home/Progress/Settings
   - Navigation between views
   - Active state styling

**Deliverables:**
- Workout history displays correctly
- Can view past workout details
- Basic navigation works

**Dependencies:** Phase 3 complete

**Verification:**
- [ ] History page shows all logged workouts
- [ ] Can tap to see workout details
- [ ] Navigation works smoothly
- [ ] Data loads correctly from API

---

### Phase 5: Polish & Deploy (Est. 30 minutes)

**Goal:** Final touches and production deployment

**Tasks:**

1. **Visual polish:**
   - Apply colors from front-end spec consistently
   - Add circular progress indicators (Progress Ring component)
   - Ensure spacing/padding matches Cal AI aesthetic
   - Test mobile responsive design

2. **PWA setup:**
   - Add manifest.json for PWA
   - Configure app icons
   - Test "Add to Home Screen" on iOS

3. **Deploy to Vercel:**
   - Push code to GitHub main branch
   - Verify automatic Vercel deployment
   - Test production build with real database
   - Verify environment variables are set

4. **Quick testing:**
   - Test full flow: generate → log → view history
   - Check on actual mobile device
   - Verify database operations work in production

**Deliverables:**
- App deployed to Vercel with custom domain
- PWA installable on iOS
- All core features working in production

**Dependencies:** Phase 4 complete

**Verification:**
- [ ] App accessible via Vercel URL
- [ ] Can install as PWA on iPhone
- [ ] All features work in production
- [ ] No console errors

---

## Post-MVP Enhancements (Future)

**Nice-to-haves not in MVP:**
- User authentication (NextAuth.js)
- Advanced charts/analytics
- Workout editing/deletion
- Export workout data
- Social features
- Push notifications
- Offline mode improvements

---

## Risk Mitigation

### Potential Blockers & Solutions:

1. **Database connection issues in serverless environment**
   - Solution: Use connection pooling, test early in Phase 1

2. **Time constraints (few hours)**
   - Solution: Stick strictly to MVP scope, use Tailwind defaults where possible

3. **Complex workout generation logic**
   - Solution: Keep algorithm simple initially, hard-code station prescriptions

4. **Mobile UI/UX challenges**
   - Solution: Test frequently on actual device, use Cal AI screenshots as reference

5. **PWA configuration**
   - Solution: Use Next.js PWA plugin, test only on primary platform (iOS)

---

## Development Guidelines

### Best Practices:
- **Commit frequently** - After each phase or major feature
- **Test as you go** - Don't wait until the end
- **Mobile-first** - Test on phone constantly
- **Keep it simple** - Resist feature creep, MVP only
- **Use Tailwind utilities** - Avoid custom CSS where possible
- **Reference front-end spec** - Follow colors, spacing, typography exactly

### When Stuck:
- Check architecture document for technical guidance
- Review front-end spec for design decisions
- Refer to Cal AI screenshots for visual inspiration
- Keep MVP scope in mind - simplest solution wins

---

## Success Metrics (Post-Launch)

**Immediate (Day 1):**
- App deployed and accessible
- Can complete full workflow: generate → log → view

**Short-term (Week 1):**
- Personal use validates core functionality
- No critical bugs blocking usage
- App feels fast and responsive on mobile

**Medium-term (Month 1):**
- Consistent personal usage (dogfooding)
- Ready to share with early adopters (training partners)

---

## Team Roles

**Developer (You):** Full-stack implementation of all phases

**Product Manager (John):** This project plan, requirements clarification

**Business Analyst (Mary):** Project brief, requirements gathering (complete)

**UX Expert (Sally):** Front-end specification, design system (complete)

**Architect:** Technical architecture, system design (complete)

---

## Timeline Summary

| Phase | Description | Est. Time |
|-------|-------------|-----------|
| 1 | Foundation Setup | 30 min |
| 2 | Workout Generation | 45-60 min |
| 3 | Workout Logging | 45-60 min |
| 4 | Progress View | 30-45 min |
| 5 | Polish & Deploy | 30 min |
| **Total** | **End-to-End MVP** | **~3-4 hours** |

---

## Getting Started

**Next immediate steps:**

1. Review this plan with development team (you!)
2. Confirm Phase 1 approach
3. Start with `npx create-next-app@latest`
4. Follow phases sequentially
5. Update this document with actual progress

**Ready to build? Let's do this! 💪**

---

**Document End**
