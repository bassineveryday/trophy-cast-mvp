# TrophyCast Feature Inventory

Generated: 2025-09-27

## Providers & Shell

### Top-Level Providers (App.tsx)
- **QueryClientProvider** - TanStack React Query for data fetching
- **TooltipProvider** - Radix UI tooltip system
- **AuthProvider** - Custom Supabase auth context
- **DemoModeProvider** - Demo mode switching (Jake/President roles)
- **BrowserRouter** - React Router DOM routing

### Layout Providers
- **MainLayout** (wraps most app routes):
  - ContextAwareAIProvider - AI assistant context
  - VoiceProvider - Voice interaction context  
  - Navigation component
  - Toast notifications (Toaster + Sonner)

- **AICoachLayout** (wraps /ai-coach/* routes):
  - Same AI + Voice providers
  - Specialized AI coach header/navigation
  - VoiceToggle and ContextAwareFloatingButton

## Route Map

| Path | Component | Protected | Status |
|------|-----------|-----------|---------|
| `/auth` | AuthPage | No | ✅ EXISTS |
| `/` | Homepage | Yes | ✅ EXISTS |
| `/dashboard` | Dashboard | Yes | ✅ EXISTS |
| `/leaderboard` | Leaderboard | Yes | ✅ EXISTS |
| `/tournament-finishes/first-place` | FirstPlaceFinishes | Yes | ✅ EXISTS |
| `/tournament-finishes/second-place` | SecondPlaceFinishes | Yes | ✅ EXISTS |
| `/tournament-finishes/third-place` | ThirdPlaceFinishes | Yes | ✅ EXISTS |
| `/tournament-finishes/top-10` | Top10Finishes | Yes | ✅ EXISTS |
| `/tournament-finishes/top-20` | Top20Finishes | Yes | ✅ EXISTS |
| `/tournaments` | TournamentDashboard | Yes | ✅ EXISTS |
| `/tournament/:tournamentId` | TournamentDetail | Yes | ✅ EXISTS |
| `/tournament-alerts` | TournamentAlerts | Yes | ✅ EXISTS |
| `/catch-logging` | CatchLogging | Yes | ✅ EXISTS |
| `/tournament/:tournamentId/catch/:catchId` | CatchDetail | Yes | ✅ EXISTS |
| `/my-catches` | MyCatches | Yes | ✅ EXISTS |
| `/catches-this-month` | CatchesThisMonth | Yes | ✅ EXISTS |
| `/profile` | Profile | Yes | ✅ EXISTS |
| `/anglers/:anglerId` | PublicProfile | Yes | ✅ EXISTS |
| `/badges` | BadgeCollection | Yes | ✅ EXISTS |
| `/messages` | MessagesInbox | Yes | ✅ EXISTS |
| `/messages/new` | MessageNew | Yes | ✅ EXISTS |
| `/messages/:threadId` | MessageThread | Yes | ✅ EXISTS |
| `/messages/club/:itemId` | ClubInboxDetail | Yes | ✅ EXISTS |
| `/clubs` | ClubDashboardNew | Yes | ✅ EXISTS |
| `/club-dashboard` | ClubDashboard | Yes | ✅ EXISTS |
| `/club-feed` | ClubFeed | Yes | ✅ EXISTS |
| `/plans` | MyPlans | Yes | ✅ EXISTS |
| `/my-plans` | MyPlans | Yes | ✅ EXISTS |
| `/sponsor-deals` | SponsorDeals | Yes | ✅ EXISTS |
| `/calendar` | Calendar | Yes | ✅ EXISTS |
| `/database-example` | DatabaseExample | Yes | ✅ EXISTS |
| `/catches` | Dashboard (redirect) | Yes | ✅ EXISTS |
| `/ai-coach` | AICoach | Yes | ✅ EXISTS |
| `/ai-coach/pre-trip` | AICoachPreTrip | Yes | ✅ EXISTS |
| `/ai-coach/tournament-plan` | TournamentPlanReport | Yes | ✅ EXISTS |
| `/ai-coach/at-lake` | AICoachAtLake | Yes | ✅ EXISTS |
| `/ai-coach/adjusted-plan` | AICoachAdjustedPlan | Yes | ✅ EXISTS |
| `*` | NotFound | No | ✅ EXISTS |

## Features by Area

### Home & Dashboard
- **Homepage** (`src/features/home/Homepage.tsx`) - Main landing page with overview widgets
- **Dashboard** (`src/features/home/Dashboard.tsx`) - User dashboard with stats and quick actions

### Authentication
- **AuthPage** (`src/features/auth/AuthPage.tsx`) - Sign in/up forms with Supabase auth

### Profile Management
- **Profile** (`src/features/profile/Profile.tsx`) - User profile editing
- **PublicProfile** (`src/features/profile/PublicProfile.tsx`) - View other anglers' profiles
- **BadgeCollection** (`src/features/profile/BadgeCollection.tsx`) - Achievement badges display
- **EditProfile** (`src/features/profile/EditProfile.tsx`) - Profile editing component
- **EditSignatureTechniques** (`src/features/profile/EditSignatureTechniques.tsx`) - Technique preferences
- **ProfileActivity** (`src/features/profile/ProfileActivity.tsx`) - Activity feed
- **ProfileMessages** (`src/features/profile/ProfileMessages.tsx`) - Profile messaging

### AI Coach
- **AICoach** (`src/features/ai-coach/AICoach.tsx`) - Main AI assistant interface
- **AICoachPreTrip** (`src/features/ai-coach/AICoachPreTrip.tsx`) - Pre-tournament planning
- **AICoachAtLake** (`src/features/ai-coach/AICoachAtLake.tsx`) - Real-time lake assistance
- **AICoachAdjustedPlan** (`src/features/ai-coach/AICoachAdjustedPlan.tsx`) - Dynamic plan updates
- **TournamentPlanReport** (`src/features/ai-coach/TournamentPlanReport.tsx`) - Tournament strategy reports

### Tournaments
- **TournamentDashboard** (`src/features/tournaments/TournamentDashboard.tsx`) - Tournament management
- **TournamentDetail** (`src/features/tournaments/TournamentDetail.tsx`) - Individual tournament view
- **TournamentAlerts** (`src/features/tournaments/TournamentAlerts.tsx`) - Tournament notifications

### Catches
- **CatchLogging** (`src/features/catches/CatchLogging.tsx`) - Log new catches
- **CatchDetail** (`src/features/catches/CatchDetail.tsx`) - Individual catch details
- **MyCatches** (`src/features/catches/MyCatches.tsx`) - Personal catch history
- **CatchesThisMonth** (`src/features/catches/CatchesThisMonth.tsx`) - Monthly catch summary

### Clubs
- **ClubDashboard** (`src/features/clubs/ClubDashboard.tsx`) - Club management interface
- **ClubDashboardNew** (`src/features/clubs/ClubDashboardNew.tsx`) - Enhanced club dashboard
- **ClubFeed** (`src/features/clubs/ClubFeed.tsx`) - Club activity feed

### Leaderboards
- **Leaderboard** (`src/features/leaderboard/Leaderboard.tsx`) - Main leaderboard interface
- **FirstPlaceFinishes** (`src/features/leaderboard/FirstPlaceFinishes.tsx`) - 1st place statistics
- **SecondPlaceFinishes** (`src/features/leaderboard/SecondPlaceFinishes.tsx`) - 2nd place statistics  
- **ThirdPlaceFinishes** (`src/features/leaderboard/ThirdPlaceFinishes.tsx`) - 3rd place statistics
- **Top10Finishes** (`src/features/leaderboard/Top10Finishes.tsx`) - Top 10 statistics
- **Top20Finishes** (`src/features/leaderboard/Top20Finishes.tsx`) - Top 20 statistics

### Messages
- **MessagesInbox** (`src/features/messages/MessagesInbox.tsx`) - Message inbox interface
- **MessageThread** (`src/features/messages/MessageThread.tsx`) - Individual conversation view
- **MessageNew** (`src/features/messages/MessageNew.tsx`) - Compose new messages
- **ClubInboxDetail** (`src/features/messages/ClubInboxDetail.tsx`) - Club-specific messaging

### Plans
- **Plans** (`src/features/plans/Plans.tsx`) - Fishing plan management

### Sponsors
- **SponsorDeals** (`src/features/sponsors/SponsorDeals.tsx`) - Sponsor offers and deals

### Admin
- **DatabaseExample** (`src/features/admin/DatabaseExample.tsx`) - Database testing interface

### Shared/Utility
- **Calendar** (`src/shared/pages/Calendar.tsx`) - Calendar component
- **NotFound** (`src/shared/pages/NotFound.tsx`) - 404 error page

## Data & Integrations

### Supabase Integration
- **Client**: `src/integrations/supabase/client.ts` - Main Supabase client configuration
- **Types**: `src/integrations/supabase/types.ts` - Auto-generated TypeScript types
- **Database Service**: `src/lib/database.ts` - CRUD operations for clubs, tournaments, catches, profiles

### Supabase Usage Patterns Found
- **Authentication**: `supabase.auth` (signIn, signUp, signOut, getUser, onAuthStateChange)
- **Database**: `supabase.from()` (select, insert, update, delete operations)
- **Storage**: `supabase.storage` (file uploads for avatars)
- **Realtime**: `supabase.removeChannel()` (live data subscriptions)

### External APIs
- No external API integrations detected

## Contexts & Hooks

### Contexts
- **AuthContext** (`src/contexts/AuthContext.tsx`):
  - Properties: `user`, `session`, `profile`, `loading`, `signUp`, `signIn`, `signOut`
  - Manages Supabase authentication state and user profiles

- **DemoModeContext** (`src/contexts/DemoModeContext.tsx`):
  - Properties: `enabled`, `role`, `setRole`, `demoUser`, `demoClub`, `demoTournament`, `demoCatches`
  - Manages demo mode functionality for testing

- **ContextAwareAIContext** (`src/contexts/ContextAwareAIContext.tsx`):
  - AI assistant context for contextual help

- **VoiceContext** (`src/contexts/VoiceContext.tsx`):
  - Voice interaction functionality

### Custom Hooks
- **useCatches** (`src/hooks/useCatches.ts`) - Catch data management
- **useClubMembership** (`src/hooks/useClubMembership.ts`) - Club membership operations
- **useClubs** (`src/hooks/useClubs.ts`) - Club data operations
- **useProfile** (`src/hooks/useProfile.ts`) - Profile data management
- **useProfileData** (`src/hooks/useProfileData.ts`) - Extended profile operations
- **useRoles** (`src/hooks/useRoles.ts`) - User role management
- **useSignatureTechniques** (`src/hooks/useSignatureTechniques.ts`) - Fishing technique preferences
- **useTournaments** (`src/hooks/useTournaments.ts`) - Tournament data operations
- **use-mobile** (`src/hooks/use-mobile.tsx`) - Mobile device detection
- **use-toast** (`src/hooks/use-toast.ts`) - Toast notification system

## Component Library

### Core UI Components (Radix + shadcn/ui)
All components in `src/components/ui/` - 46 production-ready components including:
- Forms, inputs, dialogs, navigation, data display, feedback components
- Full accessibility and theming support

### Custom Components
- **Navigation** (`src/components/Navigation.tsx`) - Main app navigation
- **Voice Components** (`src/components/voice/`) - Voice interaction UI
- **Demo Components** (`src/components/demo/`) - Demo mode features
- **Profile Components** - Avatar, header, stats displays
- **Tournament Components** - Calendar, quick actions
- **Loading & Status** - Spinners, status bars, shimmer effects

## Scripts (package.json)

- **dev** - Start development server with Vite
- **build** - Production build
- **build:dev** - Development build
- **lint** - ESLint code linting  
- **preview** - Preview production build

## Architecture Notes

### State Management
- **TanStack React Query** for server state
- **React Context** for global app state (auth, demo mode)
- **Local state** with useState/useReducer for component state

### Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component system
- **CSS variables** for theming
- **Responsive design** throughout

### Data Flow
- **Supabase** for backend (database, auth, storage)
- **Row Level Security (RLS)** policies for data access
- **Real-time subscriptions** for live updates
- **Optimistic updates** with React Query

### Development Features
- **TypeScript** for type safety
- **ESLint** for code quality
- **Vite** for fast development
- **Hot module replacement** for dev experience