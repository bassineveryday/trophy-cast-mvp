# Trophy Cast Feature Directory Tree

## ASCII Tree Structure (Based on Router References)

```
src/
├── components/
│   ├── ui/                        # shadcn/ui components
│   │   ├── tooltip.tsx
│   │   ├── toaster.tsx
│   │   └── sonner.tsx
│   ├── demo/
│   │   └── DemoUserSwitcher.tsx
│   ├── admin/
│   │   └── AdminNavigation.tsx
│   ├── voice/
│   │   ├── VoiceToggle.tsx
│   │   └── ContextAwareFloatingButton.tsx
│   ├── UniversalHeader.tsx
│   ├── BottomNavigation.tsx
│   ├── ProtectedRoute.tsx
│   ├── Navigation.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── EnhancedBreadcrumb.tsx
│   └── SignatureTechniques.tsx
│
├── features/
│   ├── auth/
│   │   └── AuthPage.tsx           # ✓ ROUTED
│   │
│   ├── home/
│   │   ├── HomeDashboard.tsx      # ✓ ROUTED
│   │   ├── Homepage.tsx           # ❌ DEAD IMPORT
│   │   ├── StreamlinedHomepage.tsx # ❌ DEAD IMPORT  
│   │   └── Dashboard.tsx          # ✓ ROUTED
│   │
│   ├── profile/
│   │   ├── Profile.tsx            # ✓ ROUTED
│   │   ├── PublicProfile.tsx      # ✓ ROUTED
│   │   └── BadgeCollection.tsx    # ✓ ROUTED
│   │
│   ├── gear/
│   │   └── GearDashboard.tsx      # ✓ ROUTED
│   │
│   ├── ai-coach/
│   │   ├── AICoach.tsx            # ✓ ROUTED
│   │   ├── AICoachPreTrip.tsx     # ✓ ROUTED
│   │   ├── AICoachAtLake.tsx      # ✓ ROUTED
│   │   ├── AICoachAdjustedPlan.tsx # ✓ ROUTED
│   │   └── TournamentPlanReport.tsx # ✓ ROUTED
│   │
│   ├── admin/
│   │   ├── PlatformDashboard.tsx  # ✓ ROUTED
│   │   ├── UserImpersonationPanel.tsx # ✓ ROUTED
│   │   ├── SystemHealthDashboard.tsx # ✓ ROUTED
│   │   └── DatabaseExample.tsx    # ✓ ROUTED
│   │
│   ├── tournaments/
│   │   ├── TournamentDashboard.tsx # ✓ ROUTED
│   │   ├── TournamentDetail.tsx   # ✓ ROUTED
│   │   └── TournamentAlerts.tsx   # ✓ ROUTED
│   │
│   ├── catches/
│   │   ├── CatchLogging.tsx       # ✓ ROUTED
│   │   ├── CatchDetail.tsx        # ✓ ROUTED
│   │   ├── MyCatches.tsx          # ✓ ROUTED
│   │   └── CatchesThisMonth.tsx   # ✓ ROUTED
│   │
│   ├── clubs/
│   │   ├── ClubDashboard.tsx      # ✓ ROUTED
│   │   ├── ClubDashboardNew.tsx   # ❌ DEAD IMPORT
│   │   ├── ClubFeed.tsx           # ✓ ROUTED
│   │   ├── StreamlinedClubHub.tsx # ✓ ROUTED
│   │   ├── ClubDirectory.tsx      # ✓ IMPORTED (created by system)
│   │   ├── ClubManagementDashboard.tsx # ✓ ROUTED
│   │   ├── MemberImportPage.tsx   # ✓ ROUTED
│   │   └── organization/
│   │       └── ClubOrganizationHub.tsx # ✓ ROUTED
│   │
│   ├── messages/
│   │   ├── MessagesInbox.tsx      # ✓ ROUTED
│   │   ├── MessageThread.tsx      # ✓ ROUTED
│   │   ├── MessageNew.tsx         # ✓ ROUTED
│   │   └── ClubInboxDetail.tsx    # ✓ ROUTED
│   │
│   ├── leaderboard/
│   │   ├── Leaderboard.tsx        # ✓ ROUTED
│   │   ├── FirstPlaceFinishes.tsx # ✓ ROUTED
│   │   ├── SecondPlaceFinishes.tsx # ✓ ROUTED
│   │   ├── ThirdPlaceFinishes.tsx # ✓ ROUTED
│   │   ├── Top10Finishes.tsx      # ✓ ROUTED
│   │   └── Top20Finishes.tsx      # ✓ ROUTED
│   │
│   ├── plans/
│   │   └── Plans.tsx              # ✓ ROUTED (as MyPlans)
│   │
│   ├── sponsors/
│   │   └── SponsorDeals.tsx       # ✓ ROUTED
│   │
│   └── hybrid/
│       └── HybridDashboard.tsx    # ✓ ROUTED
│
├── layouts/
│   ├── MainLayout.tsx             # ✓ ROUTED
│   └── AICoachLayout.tsx          # ✓ ROUTED
│
├── contexts/
│   ├── AuthContext.tsx            # Used by ProtectedRoute
│   ├── DemoModeContext.tsx        # Used by layouts
│   ├── ContextAwareAIContext.tsx  # Used by layouts
│   └── VoiceContext.tsx           # Used by layouts
│
├── shared/
│   └── pages/
│       ├── Calendar.tsx           # ✓ ROUTED
│       └── NotFound.tsx           # ✓ ROUTED
│
└── integrations/
    └── supabase/
        └── client.ts              # Used by AuthContext
```

## Feature Status Legend

- ✅ **ROUTED**: Component has corresponding route in App.tsx
- ❌ **DEAD IMPORT**: Component imported but not routed  
- 📝 **PLANNED**: Referenced in comments but not implemented
- 🔄 **CREATED**: Generated by system during development

## Missing Planned Features (From Phase Comments)

### Phase 1: Demo System
- DemoModeToggle
- JakeDashboard  
- MikeDashboard

### Phase 2: Home Dashboard Components
- HeroWelcome
- CareerStatsCard
- BoatGearSnapshot
- ClubTiles
- TournamentsCarousel
- QuickActionsGrid
- ActivityFeed

### Phase 3: Profile Extensions
- SignatureTechniques (component exists, route missing)
- GearBoatDetails

### Phase 4: Gear Extensions  
- RodReelLookup
- ComboManager
- LineSetupTracker
- BoatProfile

### Phase 5: Newsletter
- NewsletterGenerator
- NewsletterUI

### Phase 6: AI Coach Extensions
- WeatherOverview
- SolunarTable
- CatchConditionCorrelation
- CoachingRecommendations

### Phase 7: Navigation
- Breadcrumbs (component referenced but missing)

### Phase 8: Admin Extensions
- DebugPanel
- FeatureFlagManager

## Import vs Route Alignment

| Feature | Import Status | Route Status | Issue |
|---------|---------------|--------------|-------|
| Homepage | ✅ Imported | ❌ No Route | Dead import |
| StreamlinedHomepage | ✅ Imported | ❌ No Route | Dead import |
| ClubDashboardNew | ✅ Imported | ❌ No Route | Dead import |
| All others | ✅ Imported | ✅ Routed | ✅ Aligned |