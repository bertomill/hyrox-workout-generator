# Roxify - Context Handoff Document

**Last Updated:** October 5, 2025  
**Current Status:** SESSION 1 COMPLETE ✅ | Ready for SESSION 2  
**Live URL:** https://hyrox-workout-generator-roan.vercel.app

---

## 🎯 PROJECT OVERVIEW

**Roxify** (formerly Hyrox Workout Generator) is an adaptive Hyrox training companion web app. Users generate smart workouts based on mood/energy, track performance, and compete with friends.

**Tech Stack:**
- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS v4
- Database: Supabase PostgreSQL
- Auth: Supabase Auth (email/password + Google OAuth)
- Hosting: Vercel (auto-deploy from main branch)

**Brand:**
- Name: Roxify
- Tagline: "Train Smarter for Hyrox"
- Colors: #E63946 (red), #457B9D (blue), #F77F00 (orange), #06D6A0 (green)
- Design: Cal AI-inspired aesthetic

---

## ✅ COMPLETED - SESSION 1 (3 hours)

### Part 1: Rebrand ✅
- Changed name from "Hyrox Workout Generator" to "Roxify"
- Updated all branding (package.json, layout, manifest, README)
- Version: 2.0.0
- Added apple-touch-icon.png (180x180)
- **Commits:** 7c45664 (rebrand), 824f0af (icon)

### Part 2: Authentication ✅
- **Supabase Auth** integration (switched from NextAuth.js)
- Email/password authentication
- Google OAuth ("Sign in with Google")
- Login page: `/login`
- Signup page: `/signup`
- Auth status in header with Sign In/Out buttons
- User welcome message showing name/email
- **Commits:** bf7329a (auth), 5d85c9a (Google OAuth)

**Files Created:**
- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/server.ts` - Server Supabase client
- `lib/supabase/middleware.ts` - Auth middleware helpers
- `middleware.ts` - Next.js middleware
- `app/login/page.tsx` - Login page
- `app/signup/page.tsx` - Signup page

**Files Updated:**
- `app/page.tsx` - Added auth integration, user state, sign out
- `package.json` - Supabase dependencies

---

## 🎯 NEXT UP - SESSION 2 (Ready to Start)

### Part 1: Smart Generation (2 hours) - **USER'S TOP PRIORITY**
**What the user wants:**
- "How am I feeling today?" selector (Fresh/Normal/Tired/Exhausted)
- Intensity dial (Light/Moderate/Hard/Beast Mode)
- "Surprise Me" random generation button
- Station preferences (checkboxes to avoid certain exercises)
- Workout duration selector (30/45/60/90 min)
- More variety in workout combinations

**Implementation Plan:**
1. Update `components/WorkoutGenerator/GeneratorForm.tsx`:
   - Add mood selector (4 options)
   - Add intensity slider/buttons
   - Add "Surprise Me" button
   - Add station preference checkboxes
   - Add duration selector
2. Update `lib/workoutGenerator.ts`:
   - Enhance algorithm to use mood/intensity
   - Add randomization logic
   - Add station filtering
   - Adjust workout length based on duration
3. Update API: `app/api/workouts/generate/route.ts`
   - Accept new parameters
   - Pass to generator

### Part 2: Workout Management (1 hour)
- Edit past workouts (modal with pre-filled data)
- Delete workouts (confirmation dialog)
- Add workout notes field
- Favorite/bookmark workouts
- Filter history by favorites

**Implementation:**
1. Create PATCH `/api/workouts/:id` endpoint
2. Create DELETE `/api/workouts/:id` endpoint
3. Add edit button to WorkoutCard
4. Add delete button with confirmation
5. Add notes field to workout schema

---

## 📂 KEY FILES STRUCTURE

```
app/
├── page.tsx                    # Main dashboard (auth integrated)
├── login/page.tsx             # Login page (email + Google)
├── signup/page.tsx            # Signup page (email + Google)
├── history/page.tsx           # Workout history view
├── api/
│   └── workouts/
│       ├── generate/route.ts  # Generate workout API
│       ├── log/route.ts       # Log workout API
│       └── history/route.ts   # Get history API
├── layout.tsx                 # Root layout (metadata)
└── globals.css                # Tailwind styles

components/
├── ui/
│   ├── Button.tsx            # Reusable button
│   ├── Card.tsx              # Reusable card
│   ├── TimeInput.tsx         # MM:SS input
│   └── ProgressRing.tsx      # Circular progress
├── WorkoutGenerator/
│   ├── GeneratorForm.tsx     # ⚠️ NEEDS ENHANCEMENT
│   └── WorkoutDisplay.tsx    # Display generated workout
├── WorkoutLogger/
│   └── LogForm.tsx           # Log performance
└── History/
    ├── WorkoutCard.tsx       # Individual workout card
    └── WorkoutList.tsx       # List of workouts

lib/
├── supabase/
│   ├── client.ts             # Browser client
│   ├── server.ts             # Server client
│   └── middleware.ts         # Auth helpers
├── db.ts                      # PostgreSQL connection
├── types.ts                   # TypeScript types
└── workoutGenerator.ts        # ⚠️ NEEDS ENHANCEMENT

middleware.ts                  # Next.js middleware
```

---

## 🗄️ DATABASE SCHEMA

**Table: users** (managed by Supabase Auth)
- Standard Supabase auth.users table
- user_metadata includes: name, fitness_level

**Table: workouts**
```sql
id SERIAL PRIMARY KEY
user_id INTEGER (references users)
date_generated TIMESTAMP
workout_details JSONB (stations + runs)
status VARCHAR ('pending'|'completed'|'skipped')
created_at TIMESTAMP
```

**Table: workout_logs**
```sql
id SERIAL PRIMARY KEY
workout_id INTEGER
user_id INTEGER
date_completed TIMESTAMP
performance_data JSONB (station times, run times)
overall_time INTEGER (seconds)
notes TEXT
created_at TIMESTAMP
```

---

## 🔑 ENVIRONMENT VARIABLES

**Required (already configured in .env):**
```
POSTGRES_URL=<supabase_connection_string>
POSTGRES_URL_NON_POOLING=<supabase_direct>
NEXT_PUBLIC_SUPABASE_URL=<supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<supabase_service_key>
SUPABASE_JWT_SECRET=<jwt_secret>
```

**Vercel Environment Variables:** ✅ Already configured

---

## 💻 DEVELOPMENT WORKFLOW

### Local Development:
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run lint         # Check linting
```

### Git Workflow:
```bash
git add -A
git commit -m "✨ Feature: Description"
git push origin main   # Auto-deploys to Vercel
```

### Current Branch: `main`
### Latest Commit: `5d85c9a` (Google OAuth)

---

## 🎨 DESIGN SYSTEM

### Colors:
- Primary: `#E63946` (red) - buttons, CTAs
- Secondary: `#457B9D` (blue) - accents
- Accent: `#F77F00` (orange) - streaks, highlights
- Success: `#06D6A0` (green) - completions

### Typography:
- Font: System default (Inter-like)
- Headings: Bold, tight leading
- Body: Regular, readable

### Components:
- Buttons: Rounded (`rounded-lg`), active scale effect
- Cards: White background, subtle shadow, rounded corners
- Inputs: Border on focus, ring effect
- Modals: Bottom slide-up animation (mobile-first)

---

## 📝 IMPORTANT DECISIONS MADE

1. **Auth Choice:** Supabase Auth instead of NextAuth.js
   - Reason: Already using Supabase, better integration
   
2. **No Phone Auth:** User decided against it for MVP

3. **Google OAuth:** Added, working perfectly

4. **Workout Generation:** Currently simple (3 fitness levels)
   - Next: Make it adaptive and mood-based

5. **User Model:** No hardcoded user ID anymore
   - All features now multi-user ready

---

## ⚠️ KNOWN ISSUES / TODO

1. **API Routes NOT Updated for Auth Yet**
   - `app/api/workouts/generate/route.ts` - still uses hardcoded userId: 1
   - `app/api/workouts/log/route.ts` - still uses hardcoded userId: 1
   - `app/api/workouts/history/route.ts` - still uses hardcoded userId: 1
   - **MUST FIX** before Session 2

2. **Workout Generator Needs Enhancement**
   - Currently only takes fitness level
   - Needs mood, intensity, duration, preferences

3. **No Workout Editing/Deletion Yet**
   - Can only view history, not modify

---

## 🚀 IMMEDIATE NEXT STEPS (Start Here in New Context)

### Step 1: Update API Routes for Auth
**Priority:** CRITICAL (blocks multi-user functionality)

Update these 3 files to get authenticated user:
```typescript
// app/api/workouts/generate/route.ts
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Use user.id instead of hardcoded 1
  // ... rest of code
}
```

Repeat for:
- `app/api/workouts/log/route.ts`
- `app/api/workouts/history/route.ts`

### Step 2: Enhance Workout Generator
Read and update these files:
1. `components/WorkoutGenerator/GeneratorForm.tsx` - Add UI for new inputs
2. `lib/workoutGenerator.ts` - Enhance algorithm
3. `app/api/workouts/generate/route.ts` - Accept new parameters

### Step 3: Test Everything
```bash
npm run build    # Should pass
npm run dev      # Test locally
```

---

## 📚 REFERENCE DOCUMENTS

- **V2 Full Plan:** `docs/project-plan-v2.md`
- **V2 Execution Roadmap:** `V2_EXECUTION_ROADMAP.md`
- **Original MVP Plan:** `docs/project-plan.md`
- **Architecture:** `docs/architecture.md`
- **Phase 5 Summary:** `PHASE_5_COMPLETE.md`

---

## 💬 USER'S PREFERENCES

1. **Wants smart, adaptive workouts** - mood-based, random variety
2. **Wants social features** - compete with friends, leaderboards
3. **Wants training plans** - multi-week programs
4. **Likes rapid development** - "let's go quick because we can"
5. **Updates README before commits** - stated preference

---

## 🎯 SESSION 2 GOALS SUMMARY

**What to Build:**
1. ✅ Mood-based workout generation
2. ✅ Intensity selection
3. ✅ Random "Surprise Me" button
4. ✅ Station preferences (avoid certain exercises)
5. ✅ Duration selector (30/45/60/90 min)
6. ✅ Edit/delete workouts
7. ✅ Workout notes

**Estimated Time:** 3 hours  
**Status:** Ready to start!

---

## 🔥 QUICK START COMMAND FOR NEW CONTEXT

Use this prompt in the new context:

```
I'm continuing work on Roxify (Hyrox training app). We just completed SESSION 1 (rebrand + Supabase auth with Google OAuth). 

SESSION 1 is deployed and working at: https://hyrox-workout-generator-roan.vercel.app

Ready to start SESSION 2: Smart Workout Generation + Workout Management.

CRITICAL FIRST STEP: Update the 3 API routes (generate, log, history) to use authenticated Supabase user instead of hardcoded userId: 1.

Then enhance workout generation with:
- Mood selector (Fresh/Normal/Tired/Exhausted)
- Intensity dial
- "Surprise Me" random button
- Station preferences
- Duration selector (30/45/60/90 min)

Please read CONTEXT_HANDOFF.md for full details and let's start with fixing the API auth!
```

---

**Last Updated:** October 5, 2025  
**Version:** 2.0.0  
**Status:** ✅ Ready for SESSION 2
