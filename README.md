# Roxify 💪⚡
## Train Smarter for Hyrox

Your adaptive Hyrox training companion. Generate smart workouts that respond to how you're feeling, track your performance, and compete with friends. Built with beautiful, Cal AI-inspired design.

### 🌐 Live Production App
**URL:** https://hyrox-workout-generator-roan.vercel.app  
*(Rebranded to Roxify - V2.0)*

### ✨ Core Features
**MVP Complete (V1.0):**
-   ✅ **Smart Workout Generation:** Hyrox-specific workouts for beginner, intermediate, and advanced athletes
-   ✅ **Performance Logging:** Track all 8 stations and 8 runs with easy MM:SS time inputs
-   ✅ **Progress Tracking:** Beautiful history view with stats and progress rings
-   ✅ **PWA Support:** Install as a mobile app on iOS and Android

**V2.0 In Progress:**
-   ✅ **User Accounts:** Multi-user support with Supabase Auth + Google OAuth
-   ✅ **API Auth Migration:** All API routes use authenticated users (UUID-based, RLS enabled)
-   ✅ **Smart Workout Generation:** Mood selector, intensity dial, duration picker, station preferences
-   ✅ **"Surprise Me" Feature:** Random adaptive workout generation
-   🚀 **Workout Management:** Edit and delete workouts, add notes
-   🚀 **Social Features:** Connect with friends, leaderboards, and challenges
-   🚀 **Advanced Analytics:** Deep performance insights and trend analysis
-   🚀 **Training Plans:** Multi-week structured programs
-   🚀 **Custom Templates:** Create and save your own workout templates

### 🛠️ Technical Stack
-   **Frontend:** Next.js 15 with TypeScript, React 19
-   **Styling:** Tailwind CSS v4 with custom branded colors
-   **Backend:** Next.js API Routes (serverless)
-   **Database:** Supabase PostgreSQL with Row Level Security (RLS)
-   **Authentication:** Supabase Auth (email/password + Google OAuth)
-   **Hosting:** Vercel with automatic deployments

### 🎨 Design System
-   **Primary Red:** #E63946 (Hyrox brand color)
-   **Secondary Blue:** #457B9D
-   **Accent Orange:** #F77F00
-   **Success Green:** #06D6A0
-   **Aesthetic:** Cal AI-inspired clean, modern UI with smooth animations

### 📱 PWA Features
-   Installable on iOS (Add to Home Screen)
-   Installable on Android (Install app prompt)
-   Custom app icon with lightning bolt design
-   Standalone display mode
-   App shortcuts for quick actions

### 🚀 Development Status

**V1.0 MVP - ALL PHASES COMPLETE! ✅**

1.  ✅ **Phase 1: Foundation Setup** - Next.js 15, Tailwind CSS v4, Supabase PostgreSQL
2.  ✅ **Phase 2: Workout Generation** - API routes, generator logic, UI components
3.  ✅ **Phase 3: Workout Logging** - Performance tracking, time inputs, completion status
4.  ✅ **Phase 4: Progress View** - History page, stats, workout cards
5.  ✅ **Phase 5: Polish & Deploy** - PWA setup, progress rings, production deployment

**V2.0 Roxify - IN PROGRESS 🔥**

- ✅ **Session 1:** Rebrand + Supabase Auth (COMPLETE!)
- ✅ **Session 2:** API Auth Migration + Smart Workout Generation (COMPLETE!)
- 📋 **Session 3:** Workout Management (Edit/Delete) + Custom Templates
- 📋 **Session 4:** Social Features, Training Plans, Mobile Polish

See [V2 Execution Roadmap](V2_EXECUTION_ROADMAP.md) for details.

### 🎉 Latest Updates (October 5, 2025)

**Session 2 Complete - AI-Powered Smart Generation** ✅
- ✅ **AI-Powered Generation:** Vercel AI Gateway + OpenAI GPT-4o-mini generates truly adaptive workouts
- ✅ **Unified API:** Switch between AI providers (OpenAI, Anthropic, xAI) with minimal changes
- ✅ **Intelligent Adaptation:** AI considers mood, intensity, fitness level, and preferences
- ✅ **Fallback System:** Rule-based generation if AI unavailable
- ✅ **Spend Monitoring:** Track AI usage and costs through Vercel dashboard
- ✅ **API Auth Migration:** All routes use authenticated Supabase users with RLS
- ✅ **Mood Selector:** Fresh / Normal / Tired / Exhausted
- ✅ **Intensity Dial:** Light / Moderate / Hard / Beast Mode
- ✅ **Duration Picker:** 30 / 45 / 60 / 90 minute workouts
- ✅ **Station Preferences:** Exclude exercises you want to avoid
- ✅ **"Surprise Me" Button:** Random adaptive generation
- ✅ **Enhanced UI:** Cal AI-inspired design with smooth animations

**Session 1 Complete - Rebrand + Authentication** ✅
- ✅ Rebranded from "Hyrox Workout Generator" to "Roxify" (V2.0.0)
- ✅ Supabase Auth integration with email/password
- ✅ Google OAuth ("Sign in with Google")
- ✅ Login and Signup pages
- ✅ Auth status in header with user welcome message
- ✅ Sign In/Out functionality

### 🎉 Previous Updates

**Phase 5 Complete - Polish & Deploy** ✅
- ✅ PWA manifest.json with app icons configuration
- ✅ Enhanced metadata for iOS and Android PWA support
- ✅ Progress Ring component for visual polish
- ✅ Integrated progress rings in history page (completion rate, goals, streaks)
- ✅ App icons (SVG templates provided for conversion to PNG)
- ✅ Color consistency audit across all components
- ✅ Mobile-first responsive design verified
- ✅ Production deployment on Vercel
- ✅ Full MVP feature set deployed and working

**Phase 4 Complete - Progress View & History** ✅
- API endpoint (`/api/workouts/history`) - Fetches workout history with stats
- `WorkoutCard` component - Expandable cards showing workout details
- `WorkoutList` component - List of all logged workouts
- History page (`/history`) - Complete progress tracking view
- Summary statistics - Total workouts, best time, average time, streak
- Bottom navigation bar - Easy switching between Home and Progress

**Phase 3 Complete - Workout Logging Feature** ✅
- Log performance data with MM:SS time inputs
- Auto-calculated overall time and success animations
- Workout status updates and completion badges

**Phase 2 Complete - Workout Generation Feature** ✅
- Generate personalized Hyrox workouts based on fitness level
- Beautiful workout display with all stations and runs

### 📚 Documentation
-   [Project Brief](docs/brief.md) - Complete project overview and requirements
-   [Architecture Document](docs/architecture.md) - Technical architecture and design
-   [Front-End Specification](docs/front-end-spec.md) - UI/UX design specification (Cal AI inspired)
-   [Project Plan](docs/project-plan.md) - High-level MVP development plan
-   [PWA Icons Guide](public/ICONS_README.md) - Instructions for generating PWA icon files

### 🔧 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

### 🌍 Environment Variables

Required environment variables (already configured in Vercel):
```
# Database
POSTGRES_URL=your_supabase_connection_string
POSTGRES_URL_NON_POOLING=your_supabase_direct_connection_string

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Vercel AI Gateway (for AI-powered workout generation)
VERCEL_AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

**Note:** Without `VERCEL_AI_GATEWAY_API_KEY`, the app will fall back to rule-based workout generation (still functional!).

### 📱 Installing as PWA

**iOS (Safari):**
1. Visit https://hyrox-workout-generator-roan.vercel.app
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Visit https://hyrox-workout-generator-roan.vercel.app
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home screen"
4. Tap "Install"

### 🎯 Next Steps (Post-MVP)
- Generate actual PNG icon files from SVG templates
- User authentication with NextAuth.js
- Advanced analytics and charts
- Workout editing/deletion
- Data export functionality
- Social features and sharing
- Push notifications for workout reminders
- Enhanced offline mode

### 📊 Project Stats
- **Total Development Time:** ~4 hours (as planned!)
- **Total Components:** 10+ reusable components
- **API Routes:** 3 (generate, log, history)
- **Database Tables:** 3 (users, workouts, workout_logs)
- **First Load JS:** 112 kB (optimized!)

---

---

**Roxify - Built with ❤️ for the Hyrox community**  
**Train Smarter. Perform Better. Compete Together.**

