# Welcome to your Lovable project

## 🚀 Bare-Bones Mode

This app is currently running in **bare-bones MVP mode** with minimal routes for core functionality:

- **Home** (`/`) - Welcome screen with quick actions
- **Log Catch** (`/catch-logging`) - Voice-enabled catch logging
- **Leaderboard** (`/leaderboard`) - Tournament standings
- **My Catches** (`/my-catches`) - Personal catch history  
- **Profile** (`/profile`) - User profile management

To restore full functionality, re-add the removed routes and components from the git history.

## Project info

**URL**: https://lovable.dev/projects/9d7cee6c-3c40-4703-a3f9-ef23dbe7f5ac

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9d7cee6c-3c40-4703-a3f9-ef23dbe7f5ac) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d7cee6c-3c40-4703-a3f9-ef23dbe7f5ac) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🔒 Lane Isolation & Security

### What is Lane Isolation?

Trophy Cast uses **lane isolation** to separate production and demo data. Each user has an `is_demo` flag in their profile that determines which "lane" of data they can access:

- **Production Lane** (`is_demo = false`): Real tournament data, real users
- **Demo Lane** (`is_demo = true`): Sandbox data for testing/demos

### Why is the Supabase Anon Key in the Repo?

**This is intentional and safe.** Lovable does not support `VITE_*` environment variables, so the Supabase anon key is hardcoded in:

- `src/integrations/supabase/client.ts`
- `scripts/smokeLane.mjs`

**Security is provided by:**
1. **Row Level Security (RLS)** policies on all tables
2. **Lane-safe views** that auto-filter by `is_demo`
3. **Lane-safe RPCs** that enforce user's lane membership
4. The anon key has no write permissions without RLS checks

Never use `service_role` key in client code.

### Lane-Safe Data Access

All Supabase queries must use lane-safe patterns:

#### ✅ Safe: Use Lane-Safe Views
```typescript
import { supabase } from "@/integrations/supabase/client";

// Automatically filtered by user's is_demo flag
const { data } = await supabase
  .from('v_aoy_standings_demo')
  .select('*')
  .order('aoy_rank');
```

#### ✅ Safe: Use Lane-Safe RPCs
```typescript
// RPC auto-filters by user's lane and club
const { data } = await supabase.rpc('aoy_for_current_user_demo');
const { data } = await supabase.rpc('event_points_for_current_user_demo', {
  p_event_id: eventId
});
```

#### ❌ Unsafe: Direct Table Queries
```typescript
// DON'T DO THIS - may leak cross-lane data!
const { data } = await supabase
  .from('aoy_standings')  // ❌ No auto-filtering
  .select('*');
```

### Available Lane-Safe Artifacts

#### Views (SECURITY INVOKER)
- `v_aoy_standings_demo` - AOY standings filtered by user's lane
  - Columns: `member_id`, `member_name`, `season_year`, `total_aoy_points`, `aoy_rank`, `boater_status`, `club_id`
  
- `v_event_points_demo` - Event points from tournament results
  - Columns: `event_id`, `member_id`, `member_name`, `place`, `aoy_points`, `season`

#### RPCs (SECURITY DEFINER)
- `aoy_for_current_user_demo(p_limit int)` - AOY for user's club
  - Returns: Same columns as `v_aoy_standings_demo`
  - Auto-filters by user's `is_demo` and `club_id`
  
- `event_points_for_current_user_demo(p_event_id uuid, p_limit int)` - Event points for user's club
  - Returns: `event_id`, `member_id`, `member_name`, `place`, `aoy_points`, `season`, `club_id`
  - Optional `p_event_id` filter

#### Helper Functions
- `get_user_is_demo()` - Returns current user's `is_demo` flag (used internally by RPCs)

### Running Lane Smoke Tests

Test that lane isolation is working:

```bash
node scripts/smokeLane.mjs
```

This will:
- ✅ Query `v_aoy_standings_demo` view
- ✅ Call `aoy_for_current_user_demo` RPC  
- ✅ Call `event_points_for_current_user_demo` RPC (with/without event filter)

Output will show ✅/❌/⚠️ for each test. Script never fails (exit 0) to avoid breaking CI.

### Seeding Demo Data

To add demo tournament data, use SQL with `is_demo = true`:

```sql
-- Insert demo club
INSERT INTO clubs (id, name, location, is_demo, created_by)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo Bass Club',
  'Demo Lake, AL',
  true,
  auth.uid()
);

-- Insert demo AOY standing
INSERT INTO aoy_standings (
  member_id, member_name, season_year, 
  total_aoy_points, aoy_rank, boater_status, 
  club_id, is_demo
)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Demo Angler',
  2025,
  1500,
  1,
  'Boater',
  '11111111-1111-1111-1111-111111111111',
  true  -- ✅ Critical: Keeps this in demo lane
);
```

**Important:** Always set `is_demo = true` for demo data and ensure your demo user profile has `is_demo = true`.

### Lane Badge

A visible badge shows the current lane in the app header:
- 🟢 **PRODUCTION** - Real data
- 🔵 **DEMO** - Sandbox data

See: `src/components/LaneBadge.tsx`

### For Contributors

When adding new features:

1. ✅ All new tables must include `is_demo boolean` column with RLS policies
2. ✅ Use lane-safe views or RPCs for all data queries
3. ✅ Test both production and demo lanes
4. ✅ Run `node scripts/smokeLane.mjs` before committing
5. ❌ Never bypass RLS with `service_role` key in client code

See `.github/pull_request_template.md` for full checklist.
