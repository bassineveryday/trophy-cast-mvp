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

## Environment Variables NOT Found
- No Supabase configuration environment variables referenced in routing code
- No API keys or secrets referenced in router/auth components  
- No custom environment variables for feature flags or configuration

## .env.example Template

```bash
# Development Environment
NODE_ENV=development

# Note: Vite automatically provides import.meta.env.DEV
# No additional environment variables needed for routing/auth functionality

# Supabase configuration (if needed for auth context)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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