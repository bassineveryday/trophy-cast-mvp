# Trophy Cast MVP - Where Every Cast Counts

A focused MVP bass fishing tournament app built with React, Supabase, and modern web technologies.

## 🎣 Features

### 1. Authentication
- **Email/password sign-up and sign-in** via Supabase Auth
- Protected routes requiring authentication
- User profile management

### 2. Tournament Management
- **Create tournaments** (`/host/new-tournament`)
  - Tournament name, date, location, entry fee
  - Auto-generated tournament ID
- **List my tournaments** (`/host/my-tournaments`)
  - View all tournaments you've created
  - Quick access to leaderboards

### 3. Catch Logging (Voice-Enabled)
- **Log catches** (`/catch/log`)
  - Select tournament (optional)
  - Species, weight, length, notes
  - **Voice input** using Web Speech API for notes field
  - **Offline queue** - catches stored locally when offline, auto-sync when online
  - Real-time online/offline indicator

### 4. Real-Time Leaderboard
- **Live tournament leaderboard** (`/leaderboard/:tournamentId`)
  - Supabase realtime subscriptions
  - Fallback polling every 5 seconds
  - Top 10 anglers by total weight
  - Shows fish count, big fish, total weight
  - Auto-refreshes when new catches logged

### 5. Angler Profile
- **My Profile** (`/profile/me`)
  - Basic profile information
  - Career stats: tournaments, total fish, best weight
  - Create profile button if none exists

### 6. CSV Import (Admin UI)
- **CSV Import Preview** (`/admin/import-csv`)
  - Client-side CSV parsing and validation
  - Required columns: `tournament_id`, `angler_id`, `fish_count`, `weight_lbs`
  - Shows validation errors per row
  - Generates import instructions (SQL/JSON) for admin
  - **Does not execute imports** - admin must use Supabase UI or Edge Function

## 🎨 Branding

**Trophy Cast Official Colors:**
- **Trophy Gold**: `#D4AF37` - Success, trophies
- **Bass Green**: `#2E6E3D` - Nature, fishing
- **Lake Teal**: `#1FA38A` - Water, trust
- **Deep Navy**: `#0C1A23` - Professional, depth
- **Sand**: `#F5F1E6` - Warmth, beaches

**Fonts:**
- **Headings**: Montserrat (via Google Fonts)
- **Body**: Raleway (via Google Fonts)

**Tagline**: "Where Every Cast Counts"

## 🚀 Testing in Lovable Preview

1. **Sign up** at `/auth` with email/password
2. **Create a tournament**: Navigate to `/host/new-tournament`
3. **Log a catch**: Go to `/catch/log` and select your tournament
4. **View leaderboard**: Click on a tournament from `/host/my-tournaments`
5. **Test voice input**: Click mic button in catch logging notes field
6. **Test offline mode**: 
   - Open DevTools → Network tab → Go offline
   - Log a catch (it will queue)
   - Go back online → catch will auto-sync
7. **View profile**: Go to `/profile/me` and create profile if needed
8. **Admin CSV**: Upload CSV at `/admin/import-csv` to see validation

## 🗂 Project Structure

```
src/
├── features/
│   ├── auth/           # AuthPage with sign-in/sign-up
│   ├── catches/        # LogCatch (voice + offline queue)
│   ├── tournaments/    # NewTournament, MyTournaments
│   ├── leaderboard/    # TournamentLeaderboard (realtime)
│   ├── profile/        # MyProfile
│   └── admin/          # CSVImport (UI-only preview)
├── components/         # Shared UI components
├── contexts/           # AuthContext, VoiceContext
├── integrations/       # Supabase client
└── App.tsx            # Route definitions
```

## 🔒 Security

- **No service-role keys exposed** - all operations use anon key + RLS
- **Row-Level Security (RLS)** policies enforce access control
- **Protected routes** - authentication required for all features
- **Input validation** - zod schemas on forms

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with custom Trophy Cast design tokens
- **Backend**: Supabase (Auth, Database, Realtime)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Voice**: Web Speech API (browser native)
- **Offline**: localStorage queue with auto-sync

## 📊 Database Tables Used

- `tournaments` - tournament metadata
- `catches` - catch records (weight, species, tournament_id)
- `profiles` - user profile data
- `clubs` - fishing clubs (future enhancement)

## ⚠️ Known Limitations

1. **Voice input** requires browser support (Chrome/Edge recommended)
2. **CSV import** is UI-only - admin must manually import via Supabase
3. **No service-role operations** - all writes go through RLS policies
4. **Offline queue** uses localStorage (limited to ~5MB)
5. **Realtime** may have delays - fallback polling ensures updates

## 🎯 Next Steps (Post-MVP)

- Add photo uploads for catches
- Tournament brackets and scoring rules
- Club management and messaging
- Weather/solunar data integration
- AR measurement for catch length
- Tournament registration flow
- Payment processing for entry fees

## 📝 Notes

- This is a **Lovable-only MVP** - all features work within the Lovable preview
- **No external deployments** required during MVP phase
- Uses existing Supabase project connection
- All features are mobile-first and responsive
- Voice and offline features demonstrate PWA capabilities

## 🐛 Troubleshooting

**Auth issues**: Make sure email confirmation is disabled in Supabase Auth settings for testing

**Realtime not working**: Check Supabase project has realtime enabled, falls back to polling

**Voice not working**: Chrome/Edge only, requires HTTPS (Lovable preview is HTTPS)

**Offline queue not syncing**: Check browser console for network errors, queue stored in localStorage

---

## Project Info

**Lovable URL**: https://lovable.dev/projects/9d7cee6c-3c40-4703-a3f9-ef23dbe7f5ac

Built with ❤️ for serious anglers. **Where Every Cast Counts.**
