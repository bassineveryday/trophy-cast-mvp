# React App Structure Refactoring

## New File/Folder Structure

### ✅ Feature-Based Organization

```
src/
├── features/                    # Feature-based organization
│   ├── home/                   # Home & Dashboard features
│   │   ├── Homepage.tsx        
│   │   └── Dashboard.tsx       
│   │
│   ├── ai-coach/               # AI Coach feature flows
│   │   ├── AICoach.tsx         
│   │   ├── AICoachPreTrip.tsx  
│   │   ├── AICoachAtLake.tsx   
│   │   ├── AICoachAdjustedPlan.tsx
│   │   └── TournamentPlanReport.tsx
│   │
│   ├── tournaments/            # Tournament management
│   │   ├── TournamentDetail.tsx
│   │   └── TournamentAlerts.tsx
│   │
│   ├── catches/                # Catch logging & management
│   │   ├── CatchLogging.tsx    
│   │   ├── CatchDetail.tsx     
│   │   └── MyCatches.tsx       
│   │
│   ├── profile/                # User profile & achievements
│   │   ├── Profile.tsx         
│   │   └── BadgeCollection.tsx 
│   │
│   ├── clubs/                  # Club features
│   │   ├── ClubDashboard.tsx   
│   │   └── ClubFeed.tsx        
│   │
│   ├── leaderboard/            # Performance & standings
│   │   ├── Leaderboard.tsx     
│   │   ├── FirstPlaceFinishes.tsx
│   │   ├── SecondPlaceFinishes.tsx
│   │   ├── ThirdPlaceFinishes.tsx
│   │   ├── Top10Finishes.tsx   
│   │   └── Top20Finishes.tsx   
│   │
│   ├── plans/                  # Tournament plans
│   │   └── Plans.tsx           
│   │
│   └── sponsors/               # Sponsor features
│       └── SponsorDeals.tsx    
│
├── layouts/                    # Layout components
│   ├── MainLayout.tsx          # Main app layout with shared context
│   └── AICoachLayout.tsx       # AI Coach specialized layout
│
├── shared/                     # Shared/utility components
│   └── pages/                  
│       ├── Calendar.tsx        
│       └── NotFound.tsx        
│
├── components/                 # Reusable UI components
│   ├── ui/                     # shadcn components
│   ├── voice/                  # Voice interaction components
│   └── [other components]      
│
├── contexts/                   # React contexts
├── hooks/                      # Custom hooks
├── lib/                        # Utilities
├── data/                       # Mock data
└── utils/                      # Helper functions
```

## ✅ Layout System

### MainLayout (`src/layouts/MainLayout.tsx`)
- **Purpose**: Wraps all main application pages
- **Provides**: 
  - `ContextAwareAIProvider` and `VoiceProvider` context
  - Global toast notifications (`Toaster` & `Sonner`)
  - Shared UI elements for main app flow
- **Used by**: Most application routes

### AICoachLayout (`src/layouts/AICoachLayout.tsx`)
- **Purpose**: Specialized layout for AI Coach feature flows
- **Provides**:
  - Consistent AI Coach header with navigation
  - Voice controls (`VoiceToggle`)
  - Demo notices and AI-specific UI
  - Context-aware AI floating button
- **Used by**: All `/ai-coach/*` routes

## ✅ Optimized Context Providers

### App Level (Global)
- `QueryClientProvider` - React Query for API state
- `TooltipProvider` - UI tooltips

### MainLayout Level
- `ContextAwareAIProvider` - Context-aware AI interactions
- `VoiceProvider` - Voice commands and controls

### Removed Redundancy
- Eliminated duplicate `VoiceProvider` wrappers in individual pages
- Consolidated toast providers in `MainLayout`

## ✅ Nested Route Structure

```tsx
<Routes>
  {/* Main Application Routes */}
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Homepage />} />
    <Route path="dashboard" element={<Dashboard />} />
    
    {/* Leaderboard & Performance Tracking */}
    <Route path="leaderboard" element={<Leaderboard />} />
    <Route path="tournament-finishes/first-place" element={<FirstPlaceFinishes />} />
    
    {/* Tournament Management */}
    <Route path="tournament/:tournamentId" element={<TournamentDetail />} />
    
    {/* Catch Management */}
    <Route path="catch-logging" element={<CatchLogging />} />
    <Route path="my-catches" element={<MyCatches />} />
    
    {/* Profile & Club Features */}
    <Route path="profile" element={<Profile />} />
    <Route path="club-dashboard" element={<ClubDashboard />} />
    
    {/* Plans & Sponsors */}
    <Route path="plans" element={<MyPlans />} />
    <Route path="sponsor-deals" element={<SponsorDeals />} />
  </Route>

  {/* AI Coach Feature Routes - Specialized Layout */}
  <Route path="/ai-coach" element={<AICoachLayout />}>
    <Route index element={<AICoach />} />
    <Route path="pre-trip" element={<AICoachPreTrip />} />
    <Route path="tournament-plan" element={<TournamentPlanReport />} />
    <Route path="at-lake" element={<AICoachAtLake />} />
    <Route path="adjusted-plan" element={<AICoachAdjustedPlan />} />
  </Route>

  {/* Standalone Pages */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## ✅ Benefits Achieved

### 1. **Clear Feature Separation**
- Related pages grouped by functionality
- Easy to locate and modify feature-specific code
- Better code organization for team collaboration

### 2. **Shared Context Management**
- Context providers at optimal scope levels
- Reduced provider nesting complexity
- Better performance with scoped contexts

### 3. **Layout Consistency**
- `MainLayout` provides consistent shared UI
- `AICoachLayout` creates specialized AI coach experience
- Eliminated code duplication across pages

### 4. **Scalable Routing**
- Nested routes support feature flows
- Clear URL structure (`/ai-coach/pre-trip`)
- Easy to add new features within existing structure

### 5. **Maintainability**
- Clear file naming and organization
- Commented route groups in App.tsx
- Separation of concerns between layouts and features

## ✅ Migration Notes

### Import Path Updates
- All page imports now use feature-based paths
- Layout components imported from `/layouts/`
- Shared components from `/shared/`

### Context Provider Changes
- `VoiceProvider` moved to layout level
- Removed individual `VoiceProvider` wrappers from pages
- `ContextAwareAIProvider` now at `MainLayout` level

### Route Structure Changes
- AI Coach routes nested under `/ai-coach` with `AICoachLayout`
- Main routes wrapped with `MainLayout`
- Standalone pages (like `NotFound`) remain unwrapped

This refactoring creates a more maintainable, scalable, and organized React application structure that follows modern best practices for feature-based architecture.