# TrophyCast Prototype Guide

## Investor Demo Flow

The prototype system provides a comprehensive overview of all TrophyCast features for investor demonstrations.

### Access the Prototype
Visit `/prototype` to see the main hub with all available screens.

### Demo Mode Control
Toggle between different user perspectives using the Demo Mode controls:
- **Off**: Regular view without demo data
- **Jake (Angler)**: Individual angler perspective with demo catches and data
- **President (Admin)**: Club administrator view with management capabilities

You can also control demo mode via URL parameters:
- `?demo=jake` for angler view
- `?demo=president` for admin view
- No parameter or `?demo=off` for regular view

### Screen Types

#### LIVE Screens (Fully Functional)
These link to existing, working features:
- Home Page (`/`)
- Tournament List (`/tournaments`)
- Tournament Detail (`/tournament/:id`)
- Leaderboard (`/leaderboard`)
- Profile Screen (`/profile`)
- Messages Inbox (`/messages`)
- Message Thread (`/messages/:id`)
- AI Coach Overview (`/ai-coach`)

#### STUB Screens (Prototype Placeholders)
These are demonstration screens with demo data:
- Angler Dashboard (`/prototype/angler`)
- President Dashboard (`/prototype/president`)
- Club Members Screen (`/prototype/club-members`)
- Club Events Screen (`/prototype/club-events`)

### Implementation Notes

- **Non-Destructive**: No existing files were modified except for adding a single route to App.tsx
- **Additive Only**: All prototype functionality is contained in `/src/features/prototype/`
- **Demo Data**: Stubs use read-only data from DemoModeProvider (no database writes)
- **Safe Backup**: Original App.tsx was backed up before modification

### Navigation
- All screens include a "Back to Prototype Hub" button
- Current demo mode is displayed in the header
- The main hub shows which screens are live vs. stubs
- Full navigation between all features works seamlessly

### Future Development
Replace stub screens with real implementations as features are built out. The hub will automatically reflect when stubs become live features by updating the screen configuration.