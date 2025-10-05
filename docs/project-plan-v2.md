# Hyrox Workout Generator - V2 Project Plan

**Version:** 2.0  
**Created:** October 5, 2025  
**Status:** Planning Phase  
**MVP Completion:** ✅ Phase 1-5 Complete

---

## Executive Summary

With the MVP successfully deployed and functional, V2 focuses on **enhancing user experience, adding personalization, and building community features** that will make the app indispensable for serious Hyrox athletes.

**V2 Vision:** Transform from a personal training tool into a comprehensive Hyrox training platform with smart features, social elements, and deep performance insights.

---

## What We Learned from MVP

### ✅ What Worked Well:
- Clean, mobile-first UI with Cal AI aesthetic
- Simple workout generation (3 fitness levels)
- Easy performance logging with MM:SS inputs
- Progress tracking with visual indicators
- PWA capabilities for mobile installation

### 🎯 What Users Want Next (Opportunities):
- User authentication for multi-user support
- More detailed analytics and progress charts
- Ability to edit/delete workouts
- Custom workout templates
- Social features (compare with friends)
- More personalized workout generation
- Training plans (multi-week programs)

---

## V2 Feature Categories

We've organized V2 features into **4 major tracks** that can be developed in parallel or sequentially:

### Track 1: **Personalization & Intelligence** 🧠
Make workouts smarter and more adaptive to individual needs

### Track 2: **User Experience & Polish** ✨
Enhance existing features and improve usability

### Track 3: **Analytics & Insights** 📊
Deep performance analysis and trend visualization

### Track 4: **Community & Social** 👥
Connect athletes and enable friendly competition

---

## V2 Development Phases

### Phase 1: Authentication & Multi-User Support (Est. 2-3 hours)

**Goal:** Enable multiple users to have their own accounts and data

**Priority:** 🔥 HIGH - Foundation for all other multi-user features

**Features:**
1. **User Authentication** (NextAuth.js)
   - Email/password sign up and login
   - Password reset flow
   - Session management with JWT
   - Secure logout

2. **User Profiles**
   - Basic profile page (name, email, fitness level)
   - Edit profile functionality
   - Profile picture upload (optional)
   - Account settings

3. **Data Privacy & Isolation**
   - Ensure workouts are user-specific
   - Update all API routes to use authenticated user ID
   - Migration script for existing data

**Technical Tasks:**
- Install and configure NextAuth.js
- Add authentication middleware to API routes
- Update database queries to filter by user_id
- Create login/signup UI components
- Add protected route wrappers

**Deliverables:**
- ✅ Users can create accounts
- ✅ Users can log in/out securely
- ✅ Each user sees only their own workouts
- ✅ Profile management page

**Dependencies:** None (can start immediately)

**Estimated Effort:** 2-3 hours

---

### Phase 2: Workout Management (Est. 1-2 hours)

**Goal:** Give users full control over their workout history

**Priority:** 🔥 HIGH - Frequently requested feature

**Features:**
1. **Edit Workouts**
   - Edit logged performance data
   - Update workout notes
   - Change workout date/time

2. **Delete Workouts**
   - Delete individual workouts
   - Bulk delete (select multiple)
   - Confirmation dialog with warning

3. **Workout Notes & Comments**
   - Add notes to workouts (how it felt, conditions, etc.)
   - View notes in history
   - Search/filter by notes

4. **Favorite/Bookmark Workouts**
   - Mark favorite workouts
   - Filter history by favorites
   - Quick "Repeat this workout" button

**Technical Tasks:**
- Create PATCH `/api/workouts/:id` endpoint
- Create DELETE `/api/workouts/:id` endpoint
- Add edit modal component
- Add confirmation dialogs
- Update history UI with action buttons

**Deliverables:**
- ✅ Users can edit past workouts
- ✅ Users can delete unwanted workouts
- ✅ Users can add notes and favorites

**Dependencies:** Phase 1 (Authentication)

**Estimated Effort:** 1-2 hours

---

### Phase 3: Advanced Analytics & Charts (Est. 2-3 hours)

**Goal:** Provide deep insights into performance trends and improvements

**Priority:** 🟡 MEDIUM - High value for serious athletes

**Features:**
1. **Enhanced Progress Charts**
   - Line charts for overall time trends
   - Station-specific performance over time
   - Run pace improvements
   - Volume tracking (total workouts per week/month)

2. **Personal Records (PRs)**
   - Automatic PR detection for each station
   - Best overall time tracking
   - PR celebration animations
   - PR history timeline

3. **Performance Comparisons**
   - Compare current month vs previous month
   - Year-over-year comparisons
   - Compare different fitness levels
   - Performance heatmap (activity calendar)

4. **Statistics Dashboard**
   - Total distance run
   - Total time training
   - Most improved station
   - Consistency metrics
   - Training volume graphs

**Technical Tasks:**
- Install charting library (Recharts or Chart.js)
- Create analytics calculation functions
- Build chart components
- Add statistics API endpoints
- Create dedicated analytics page

**Deliverables:**
- ✅ Beautiful, interactive charts
- ✅ PR tracking and celebrations
- ✅ Comprehensive statistics dashboard

**Dependencies:** Phase 1 (need user-specific data)

**Estimated Effort:** 2-3 hours

---

### Phase 4: Smart Workout Generation (Est. 3-4 hours)

**Goal:** Make workout generation more intelligent and personalized

**Priority:** 🟡 MEDIUM - Differentiating feature

**Features:**
1. **Adaptive Programming**
   - Analyze past performance to adjust difficulty
   - Progressive overload logic
   - Automatic deload weeks
   - Recovery-based recommendations

2. **Custom Workout Templates**
   - User-created workout templates
   - Save and reuse custom workouts
   - Template library
   - Share templates (future)

3. **Goal-Based Training**
   - Set specific goals (target time, improve specific station)
   - Generate workouts optimized for goals
   - Goal progress tracking
   - Goal achievement celebrations

4. **Variety & Preferences**
   - Set station preferences (love/hate certain exercises)
   - Equipment availability settings
   - Workout duration preferences (30min, 60min, 90min)
   - Intensity preferences

**Technical Tasks:**
- Enhance workout generation algorithm
- Create performance analysis functions
- Build template creation UI
- Add goal setting interface
- Create preferences page

**Deliverables:**
- ✅ Smarter, adaptive workouts
- ✅ Custom template system
- ✅ Goal-based training
- ✅ User preferences

**Dependencies:** Phase 3 (analytics for adaptation)

**Estimated Effort:** 3-4 hours

---

### Phase 5: Training Plans & Programs (Est. 4-5 hours)

**Goal:** Multi-week structured training programs

**Priority:** 🟢 MEDIUM-LOW - Power user feature

**Features:**
1. **Pre-Built Training Plans**
   - 4-week beginner plan
   - 8-week intermediate plan
   - 12-week advanced plan
   - Pre-competition taper plans

2. **Plan Management**
   - Enroll in a training plan
   - See current week in plan
   - Mark workouts as complete
   - Skip/reschedule workouts
   - Plan progress visualization

3. **Custom Plan Builder**
   - Create your own multi-week plan
   - Drag-and-drop workout scheduler
   - Rest day planning
   - Phase progression (build, peak, taper)

4. **Plan Analytics**
   - Training load tracking
   - Adherence rate
   - Plan completion rate
   - Fatigue monitoring

**Technical Tasks:**
- Design training_plans database schema
- Create plan enrollment system
- Build plan UI components
- Create plan generation logic
- Add calendar view component

**Deliverables:**
- ✅ Pre-built training plans
- ✅ Plan enrollment and tracking
- ✅ Custom plan creation
- ✅ Plan-specific analytics

**Dependencies:** Phase 4 (workout templates)

**Estimated Effort:** 4-5 hours

---

### Phase 6: Social Features & Community (Est. 3-4 hours)

**Goal:** Connect athletes and enable friendly competition

**Priority:** 🟢 MEDIUM-LOW - Community building

**Features:**
1. **Friend System**
   - Add friends by email or username
   - Friend requests and acceptance
   - View friends' recent workouts (privacy settings)
   - Friend activity feed

2. **Leaderboards**
   - Weekly/monthly leaderboards
   - Station-specific leaderboards
   - Friends-only leaderboards
   - Global leaderboards (opt-in)

3. **Workout Sharing**
   - Share workout results on social media
   - Generate shareable workout images
   - Copy workout link
   - Share templates with friends

4. **Challenges**
   - Weekly challenges (e.g., "Complete 5 workouts")
   - Station-specific challenges
   - Friend challenges (1v1 comparisons)
   - Challenge badges and rewards

**Technical Tasks:**
- Create friends database schema
- Build leaderboard queries
- Add social UI components
- Create sharing functionality
- Build challenge system

**Deliverables:**
- ✅ Friend connections
- ✅ Leaderboards
- ✅ Workout sharing
- ✅ Weekly challenges

**Dependencies:** Phase 1 (authentication)

**Estimated Effort:** 3-4 hours

---

### Phase 7: Mobile App Enhancements (Est. 2-3 hours)

**Goal:** Better mobile experience and offline capabilities

**Priority:** 🟡 MEDIUM - Improves daily use

**Features:**
1. **Enhanced PWA Features**
   - Generate proper PNG icons
   - Splash screens
   - Install prompts
   - App shortcuts

2. **Offline Mode**
   - Service worker for offline caching
   - Queue actions when offline
   - Sync when back online
   - Offline workout generation

3. **Push Notifications**
   - Workout reminders
   - PR celebrations
   - Friend activity notifications
   - Challenge updates

4. **Quick Actions**
   - Timer/stopwatch for workouts
   - Quick log from notification
   - Widget-style data display
   - Dark mode toggle

**Technical Tasks:**
- Generate icon PNG files
- Implement service worker
- Set up push notification service
- Build timer component
- Add dark mode support

**Deliverables:**
- ✅ Complete PWA with icons
- ✅ Offline functionality
- ✅ Push notifications
- ✅ Enhanced mobile UX

**Dependencies:** None

**Estimated Effort:** 2-3 hours

---

### Phase 8: Data Export & Integration (Est. 1-2 hours)

**Goal:** Give users control over their data

**Priority:** 🟢 LOW - Nice to have

**Features:**
1. **Data Export**
   - Export all workouts as CSV
   - Export as JSON
   - PDF workout reports
   - Email weekly summaries

2. **Wearable Integration** (Future)
   - Strava integration
   - Garmin Connect
   - Apple Health
   - Google Fit

3. **Import Data**
   - Import workouts from CSV
   - Import from other fitness apps
   - Bulk data import

**Technical Tasks:**
- Create export functions
- Build PDF generator
- Add CSV parsing
- Create integration API connectors

**Deliverables:**
- ✅ Multiple export formats
- ✅ Data import capability
- ✅ Wearable integrations (basic)

**Dependencies:** Phase 1 (user data)

**Estimated Effort:** 1-2 hours

---

## Quick Wins (Can Do Anytime)

These are small improvements that can be done independently:

### UI/UX Polish
- [ ] Dark mode
- [ ] Loading skeletons instead of spinners
- [ ] Better error messages
- [ ] Onboarding tutorial for new users
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

### Performance
- [ ] Image optimization (if adding images)
- [ ] Code splitting optimization
- [ ] Database query optimization
- [ ] Caching strategies

### Content
- [ ] Exercise form videos/GIFs
- [ ] Hyrox station explanations
- [ ] Training tips and articles
- [ ] FAQ page
- [ ] About/Help section

---

## Feature Priority Matrix

| Phase | Feature | Priority | Impact | Effort | ROI |
|-------|---------|----------|--------|--------|-----|
| 1 | Authentication | 🔥 High | High | 2-3h | ⭐⭐⭐⭐⭐ |
| 2 | Workout Management | 🔥 High | Medium | 1-2h | ⭐⭐⭐⭐ |
| 7 | PWA Icons | 🟡 Medium | Medium | 30min | ⭐⭐⭐⭐ |
| 3 | Advanced Analytics | 🟡 Medium | High | 2-3h | ⭐⭐⭐⭐ |
| 4 | Smart Generation | 🟡 Medium | High | 3-4h | ⭐⭐⭐ |
| 5 | Training Plans | 🟢 Low | High | 4-5h | ⭐⭐⭐ |
| 6 | Social Features | 🟢 Low | Medium | 3-4h | ⭐⭐ |
| 8 | Data Export | 🟢 Low | Low | 1-2h | ⭐⭐ |

---

## Recommended Development Path

### Option A: **User-Focused Path** (Recommended for Solo Use Growth)
1. Phase 1: Authentication (multi-user support)
2. Phase 2: Workout Management (edit/delete)
3. Phase 3: Advanced Analytics (insights)
4. Phase 4: Smart Generation (personalization)
5. Phase 5: Training Plans (structure)

**Why:** Builds depth for individual users before social features

### Option B: **Growth-Focused Path** (For Community Building)
1. Phase 1: Authentication
2. Phase 6: Social Features (friend system, leaderboards)
3. Phase 2: Workout Management
4. Phase 3: Advanced Analytics
5. Phase 4: Smart Generation

**Why:** Enables network effects and viral growth early

### Option C: **Quick Wins Path** (For Immediate Impact)
1. Phase 7: PWA Enhancements (icons, offline)
2. Phase 1: Authentication
3. Phase 2: Workout Management
4. Phase 3: Advanced Analytics

**Why:** Completes existing features first, then adds new capabilities

---

## Technical Debt & Infrastructure

### Before Starting V2:
- [ ] Add comprehensive error logging (Sentry or similar)
- [ ] Set up automated testing (Jest + React Testing Library)
- [ ] Add database migrations system (Prisma Migrate)
- [ ] Set up staging environment
- [ ] Add performance monitoring

### During V2:
- [ ] Refactor shared components
- [ ] Improve type safety
- [ ] Add API documentation
- [ ] Create component storybook

---

## Success Metrics for V2

### User Engagement:
- **Target:** 200+ active users within 6 months
- **Metric:** 3+ workouts logged per user per week
- **Metric:** 50%+ user retention after 30 days

### Feature Adoption:
- **Target:** 80%+ users try new analytics features
- **Target:** 50%+ users create custom templates
- **Target:** 30%+ users connect with friends

### Performance:
- **Target:** <2s page load time
- **Target:** 99%+ uptime
- **Target:** <100ms API response time

---

## Budget Considerations

### Still Free Tier?
- **Vercel:** Should handle 1000+ users
- **Supabase:** May need paid tier after 500MB data
- **Alternative:** Consider sponsors or $5/month tier

### When to Consider Paid Services:
- Push notifications (OneSignal free tier: 10k subscribers)
- Email sending (SendGrid free tier: 100 emails/day)
- File storage for profile pics (Cloudinary free tier: 25GB)
- Error tracking (Sentry free tier: 5k events/month)

---

## Open Questions to Discuss

1. **Which path do you want to take?** User-focused, growth-focused, or quick wins?
2. **Authentication priority?** Is multi-user support your #1 need?
3. **Social features?** Do you want to train alone or build a community?
4. **Training plans?** Is structured programming important to you?
5. **Timeline?** Same rapid approach or more relaxed development?
6. **Monetization?** Keep 100% free or consider premium features later?

---

## Next Steps

**Let's discuss:**
1. Which features excite you most?
2. What would you personally use right away?
3. What would your training partners want?
4. Should we start with Phase 1 (Authentication)?

---

**Ready to build V2? Let's prioritize and start coding! 💪⚡**

---

**Document End**
