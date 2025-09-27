# Environment Variables Referenced by Trophy Cast Router/Auth

## Variables Found in Codebase

### Build/Development Environment
```bash
# Node.js environment detection (used in ErrorBoundary)
NODE_ENV=development

# Vite development mode detection (used in DemoUserSwitcher)  
# This is automatically set by Vite, no .env entry needed
# import.meta.env.DEV
```

### Hostname Detection
```bash
# No env variable needed - uses window.location.hostname
# Used in DemoUserSwitcher to detect lovableproject.com
```

## Supabase Configuration (Frontend)
- `SUPABASE_URL` – Project URL from Supabase settings
- `SUPABASE_ANON_KEY` – Public anon key (safe for frontend)

## Supabase Configuration (Backend / Server-only)
- `SUPABASE_SERVICE_ROLE_KEY` – Service role key (⚠️ **Do not expose to client code**)
- Used by server jobs for verification, scoring, and admin tasks

## Environment Variables NOT Found in Router/Auth Code
- No API keys or secrets referenced directly in router/auth components  
- No custom environment variables for feature flags or configuration
- Supabase configuration is handled via hardcoded client setup

## .env.example Template

```bash
# Development Environment
NODE_ENV=development

# Note: Vite automatically provides import.meta.env.DEV
# No additional environment variables needed for routing/auth functionality

# Supabase Configuration (Frontend)
# ⚠️ Note: Lovable does not support VITE_* variables
# Reference process.env.SUPABASE_URL and process.env.SUPABASE_ANON_KEY directly
SUPABASE_URL=...    # Project URL from Supabase settings
SUPABASE_ANON_KEY=... # Public anon key (safe for frontend)

# Supabase Configuration (Backend / Server-only)
# ⚠️ Do not expose to client code
SUPABASE_SERVICE_ROLE_KEY=... # Service role key for server operations
```

## Usage Context

### NODE_ENV
- **File**: `src/components/ErrorBoundary.tsx`
- **Usage**: Shows technical error details only in development
- **Code**: `process.env.NODE_ENV === 'development'`

### import.meta.env.DEV  
- **File**: `src/components/demo/DemoUserSwitcher.tsx`
- **Usage**: Shows demo user switcher only in development environments
- **Code**: `import.meta.env.DEV || window.location.hostname.includes('lovableproject.com')`

## Notes
- Routing and authentication logic do not directly reference environment variables
- Supabase client configuration may use environment variables but this is handled in separate integration files
- No sensitive keys or configuration exposed in router code
- Demo mode detection uses runtime hostname checking rather than environment variables