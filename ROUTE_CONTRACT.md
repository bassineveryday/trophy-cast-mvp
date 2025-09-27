# Trophy Cast Router Contract

## Route Summary
- **Total Routes**: 45 (42 protected, 3 public)
- **Auth Redirect**: `/auth` (for all protected routes)
- **Layout Patterns**: MainLayout (main app), AICoachLayout (ai-coach), No Layout (auth, 404)

## Public Routes (No Protection)

| Path | Layout | Component | Notes |  
|------|--------|-----------|-------|
| `/auth` | None | AuthPage | Standalone auth page |
| `*` | None | NotFound | 404 fallback |

## Protected Routes

### MainLayout Routes (Protected + MainLayout wrapper)

#### Phase 2: Home & Dashboard
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/` (index) | HomeDashboard | `/auth` |
| `/legacy-dashboard` | Dashboard | `/auth` |

#### Phase 3: Profile & Achievements  
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/profile` | Profile | `/auth` |
| `/anglers/:anglerId` | PublicProfile | `/auth` |
| `/badges` | BadgeCollection | `/auth` |

#### Phase 4: Gear Management
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/gear` | GearDashboard | `/auth` |

#### Performance Tracking & Leaderboards
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/leaderboard` | Leaderboard | `/auth` |
| `/tournament-finishes/first-place` | FirstPlaceFinishes | `/auth` |
| `/tournament-finishes/second-place` | SecondPlaceFinishes | `/auth` |
| `/tournament-finishes/third-place` | ThirdPlaceFinishes | `/auth` |
| `/tournament-finishes/top-10` | Top10Finishes | `/auth` |
| `/tournament-finishes/top-20` | Top20Finishes | `/auth` |

#### Tournament Management
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/tournaments` | TournamentDashboard | `/auth` |
| `/tournament/:tournamentId` | TournamentDetail | `/auth` |
| `/tournament-alerts` | TournamentAlerts | `/auth` |

#### Catch Management
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/catch-logging` | CatchLogging | `/auth` |
| `/tournament/:tournamentId/catch/:catchId` | CatchDetail | `/auth` |
| `/my-catches` | MyCatches | `/auth` |
| `/catches-this-month` | CatchesThisMonth | `/auth` |
| `/catches` | Dashboard | `/auth` |

#### Messaging & Communication
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/messages` | MessagesInbox | `/auth` |
| `/messages/new` | MessageNew | `/auth` |
| `/messages/:threadId` | MessageThread | `/auth` |
| `/messages/club/:itemId` | ClubInboxDetail | `/auth` |

#### Club Management & Social
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/clubs` | StreamlinedClubHub | `/auth` |
| `/clubs/:id/manage` | ClubManagementDashboard | `/auth` |
| `/clubs/:id/import` | MemberImportPage | `/auth` |
| `/club-dashboard` | ClubDashboard | `/auth` |
| `/club-feed` | ClubFeed | `/auth` |
| `/club-organization` | ClubOrganizationHub | `/auth` |
| `/clubs/demo-alabama-bass-chapter-12/manage` | ClubManagementDashboard | `/auth` |

#### Planning & Strategy
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/plans` | MyPlans | `/auth` |
| `/my-plans` | MyPlans | `/auth` |

#### Partnerships & Monetization
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/sponsor-deals` | SponsorDeals | `/auth` |

#### Phase 8: Admin Tools
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/admin/dashboard` | PlatformDashboard | `/auth` |
| `/admin/impersonation` | UserImpersonationPanel | `/auth` |
| `/admin/system` | SystemHealthDashboard | `/auth` |
| `/admin/users` | PlatformDashboard | `/auth` |
| `/admin/clubs` | PlatformDashboard | `/auth` |
| `/admin/debug` | SystemHealthDashboard | `/auth` |
| `/admin/features` | SystemHealthDashboard | `/auth` |

#### Development & Utilities
| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/hybrid` | HybridDashboard | `/auth` |
| `/calendar` | Calendar | `/auth` |
| `/database-example` | DatabaseExample | `/auth` |

### AICoachLayout Routes (Protected + AICoachLayout wrapper)

| Path | Component | Auth Redirect |
|------|-----------|---------------|
| `/ai-coach` (index) | AICoach | `/auth` |
| `/ai-coach/pre-trip` | AICoachPreTrip | `/auth` |
| `/ai-coach/tournament-plan` | TournamentPlanReport | `/auth` |
| `/ai-coach/at-lake` | AICoachAtLake | `/auth` |
| `/ai-coach/adjusted-plan` | AICoachAdjustedPlan | `/auth` |

## Global Navigation Components

### Present on ALL routes (including auth)
- **UniversalHeader**: Shows on all routes including `/auth`
- **BottomNavigation**: Shows on all routes except `/auth` and `/ai-coach/*`

### Context Providers (Global Wrapping)
1. QueryClientProvider
2. TooltipProvider  
3. AuthProvider
4. DemoModeProvider
5. BrowserRouter

## Route Protection Behavior
- **Protected routes** without auth → Redirect to `/auth` with `state.from` = attempted route
- **Auth success** → Redirect to `state.from` or default `/dashboard`  
- **Loading state** → Shows LoadingSpinner component