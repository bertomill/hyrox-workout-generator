# Roxify V2 - Execution Roadmap 🚀

**Created:** October 5, 2025  
**Status:** Ready to Execute  
**New Name:** Roxify (formerly Hyrox Workout Generator)

---

## 🎯 Vision

Transform the app into **Roxify** - a smart, social, and adaptive Hyrox training platform that responds to how you're feeling, learns from your performance, and connects you with your training community.

---

## 📋 Development Sessions Plan

### **SESSION 1: Foundation & Rebrand** (Est. 3 hours) ⏳ IN PROGRESS

#### Part 1: Rebrand to Roxify (30 min) ✅ COMPLETE
- [x] Update app name in all files
- [x] New tagline: "Roxify: Train Smarter for Hyrox"
- [x] Update package.json (v2.0.0)
- [x] Update layout.tsx (header, title, metadata)
- [x] Update manifest.json (PWA name)
- [x] Update README.md
- [x] Update all documentation
- [x] Commit: "Rebrand to Roxify"
- [x] Pushed to production (Commit: 7c45664)

#### Part 2: Phase 1 - Authentication (2.5 hours)
- [ ] Install NextAuth.js and dependencies
- [ ] Configure NextAuth with email/password provider
- [ ] Create auth API routes (`/api/auth/[...nextauth]`)
- [ ] Add sign up page (`/signup`)
- [ ] Add login page (`/login`)
- [ ] Create user profile page (`/profile`)
- [ ] Add authentication middleware
- [ ] Update all API routes to use authenticated user
- [ ] Add "Sign Out" button
- [ ] Protect routes (redirect to login if not authenticated)
- [ ] Test full auth flow
- [ ] Commit: "Add authentication with NextAuth.js"

**Deliverables:**
- ✅ App rebranded as Roxify
- ✅ Users can create accounts
- ✅ Users can log in/out
- ✅ All workouts are user-specific
- ✅ Profile management

---

### **SESSION 2: Power User Features** (Est. 3 hours)

#### Part 1: Phase 2 - Workout Management (1 hour)
- [ ] Create PATCH `/api/workouts/:id` endpoint
- [ ] Create DELETE `/api/workouts/:id` endpoint
- [ ] Add edit button to workout cards
- [ ] Create edit workout modal
- [ ] Add delete button with confirmation dialog
- [ ] Add workout notes field
- [ ] Add favorite/bookmark toggle
- [ ] Filter history by favorites
- [ ] Test edit/delete flows
- [ ] Commit: "Add workout editing and deletion"

**Deliverables:**
- ✅ Edit past workouts
- ✅ Delete unwanted workouts
- ✅ Add notes to workouts
- ✅ Favorite workouts

#### Part 2: Phase 3 - Smart Generation V1 (2 hours)
- [ ] Add "How are you feeling?" selector (Fresh/Normal/Tired/Exhausted)
- [ ] Add intensity dial (Light/Moderate/Hard/Beast Mode)
- [ ] Add "Surprise Me" random generation button
- [ ] Add station preferences (checkboxes for exercises to avoid)
- [ ] Add workout duration selector (30/45/60/90 min)
- [ ] Enhance generation algorithm to use these inputs
- [ ] Add more variety to workout combinations
- [ ] Test all new generation options
- [ ] Commit: "Add smart, adaptive workout generation"

**Deliverables:**
- ✅ Mood-based generation
- ✅ Intensity selection
- ✅ Random "Surprise Me" workouts
- ✅ Station preferences
- ✅ More workout variety

---

### **SESSION 3: Templates & Analytics Preview** (Est. 2 hours)

#### Part 1: Phase 4 - Custom Templates (1 hour)
- [ ] Create workout templates database table
- [ ] Add "Save as Template" button after generation
- [ ] Create template library page
- [ ] Add "Use Template" button
- [ ] Allow editing templates
- [ ] Add template deletion
- [ ] Show template usage count
- [ ] Commit: "Add custom workout templates"

**Deliverables:**
- ✅ Save workouts as templates
- ✅ Template library
- ✅ Reuse templates anytime
- ✅ Edit/delete templates

#### Part 2: Analytics Preview (1 hour)
- [ ] Install Recharts library
- [ ] Create basic line chart for overall time trends
- [ ] Add chart to history page
- [ ] Show last 10 workouts trend
- [ ] Add PR detection logic
- [ ] Show current PRs on dashboard
- [ ] Commit: "Add basic performance charts and PR tracking"

**Deliverables:**
- ✅ Performance trend chart
- ✅ PR detection
- ✅ Visual progress indicators

---

### **SESSION 4: Deep Analytics** (Est. 2-3 hours) - FUTURE

#### Phase 5: Advanced Analytics
- [ ] Multiple chart types (line, bar, heatmap)
- [ ] Station-specific performance over time
- [ ] Run pace improvements
- [ ] Performance comparisons (month vs month)
- [ ] Statistics dashboard
- [ ] PR celebration animations
- [ ] Activity calendar heatmap
- [ ] Commit: "Add comprehensive analytics dashboard"

---

### **SESSION 5: Social Features** (Est. 3-4 hours) - FUTURE

#### Phase 6: Community & Social
- [ ] Friend system (add/accept/remove)
- [ ] Friend activity feed
- [ ] Leaderboards (weekly/monthly/all-time)
- [ ] Station-specific leaderboards
- [ ] Share workout to social media
- [ ] Generate shareable workout images
- [ ] Weekly challenges
- [ ] Challenge badges
- [ ] Commit: "Add social features and leaderboards"

---

### **SESSION 6: Training Plans** (Est. 4-5 hours) - FUTURE

#### Phase 7: Multi-Week Programs
- [ ] Training plans database schema
- [ ] Pre-built plans (4/8/12 week)
- [ ] Plan enrollment system
- [ ] Weekly plan view
- [ ] Plan progress tracking
- [ ] Custom plan builder
- [ ] Plan calendar view
- [ ] Commit: "Add training plans and programs"

---

### **SESSION 7: Mobile Polish** (Est. 2 hours) - FUTURE

#### Phase 8: PWA Enhancements
- [ ] Generate PNG icons from SVG templates
- [ ] Add splash screens
- [ ] Implement service worker
- [ ] Offline mode
- [ ] Dark mode toggle
- [ ] Push notification setup
- [ ] Timer/stopwatch component
- [ ] Commit: "Complete PWA setup with offline support"

---

## 🎯 Priority Features (Your "Must Haves")

Based on our conversation, here's what you said was critical:

### Tomorrow Needs (Session 1-3):
1. ✅ **Own account** → Phase 1: Authentication
2. ✅ **Edit/delete workouts** → Phase 2: Workout Management
3. ✅ **Performance charts** → Phase 5: Analytics (basic in Session 3)
4. ✅ **Custom templates** → Phase 4: Templates
5. ✅ **Smart generation** → Phase 3: Adaptive workouts

### Exciting Features (Session 4-7):
1. 🧠 **Smarter workouts** → Phase 3: Mood-based, random, adaptive
2. 📊 **Deep analytics** → Phase 5: Comprehensive charts
3. 👥 **Social features** → Phase 6: Friends, leaderboards, challenges
4. 📅 **Training plans** → Phase 7: Multi-week programs
5. 📱 **Better mobile** → Phase 8: Icons, offline, dark mode

---

## 🎨 Roxify Branding

### Name & Tagline
- **Name:** Roxify
- **Tagline:** "Train Smarter for Hyrox"
- **Alternative:** "Roxify: Your Adaptive Hyrox Coach"

### Brand Colors (Keep Current)
- Primary Red: #E63946
- Secondary Blue: #457B9D
- Accent Orange: #F77F00
- Success Green: #06D6A0

### Icon
- Lightning bolt on red background (existing design)
- Keep the Cal AI-inspired aesthetic

---

## 📊 Success Metrics

### After Session 1-3 (Immediate):
- [ ] Multiple users can create accounts
- [ ] Users can edit their workout history
- [ ] Smart generation offers 4+ workout variations
- [ ] Users create and reuse custom templates
- [ ] Basic charts show progress trends

### After Session 4-7 (V2 Complete):
- [ ] 50+ active users
- [ ] 10+ friend connections
- [ ] Users complete training plans
- [ ] 80%+ feature adoption rate

---

## 🔄 Development Workflow

### For Each Session:
1. **Start:** Review this roadmap
2. **Code:** Build the features
3. **Test:** Verify everything works
4. **Commit:** Descriptive commit messages
5. **Update:** Check off completed items here
6. **Deploy:** Push to production (Vercel auto-deploys)

### Commit Message Format:
```
✨ [Feature] Brief description

- Bullet point of changes
- Another change
- Final change
```

Example:
```
✨ Add authentication with NextAuth.js

- Set up NextAuth with email/password provider
- Create sign up and login pages
- Add user profile management
- Protect API routes with authentication
- Update all queries to use authenticated user ID
```

---

## 📝 Notes & Decisions

### Key Decisions Made:
- ✅ **Name:** Roxify (better than Hyrox Workout Generator)
- ✅ **Pace:** Rapid development (2-4 hour sessions)
- ✅ **Focus:** Smart generation + social features
- ✅ **Priority:** Auth → Management → Smart Gen → Templates → Analytics → Social → Plans

### Technical Choices:
- **Auth:** NextAuth.js (email/password, JWT sessions)
- **Charts:** Recharts (React-friendly, good docs)
- **Templates:** Store in database as JSONB
- **Social:** Friend system with privacy controls
- **Plans:** Calendar-based with drag-drop (future)

### Future Considerations:
- Monetization: Keep free, maybe sponsorship later
- Scaling: Current stack should handle 1000+ users
- Native app: Not needed, PWA is sufficient
- Wearables: Phase 8+ integration

---

## 🚀 Current Status

**Active Session:** SESSION 1 - Foundation & Rebrand  
**Current Task:** ✅ Rebrand Complete - Ready for Authentication  
**Next Up:** Install NextAuth.js and set up user authentication

**Session 1 Progress:**
- ✅ Part 1: Rebrand to Roxify (Complete - Deployed)
- ⏳ Part 2: Authentication (Ready to start)  

---

## 💬 Communication

**Update this file after each session:**
- Check off completed tasks
- Add any issues/blockers encountered
- Note decisions made
- Update timelines if needed

**Reference docs:**
- Full V2 Plan: `docs/project-plan-v2.md`
- Original Plan: `docs/project-plan.md`
- Architecture: `docs/architecture.md`

---

**Let's build Roxify! 💪⚡**

**Last Updated:** October 5, 2025
