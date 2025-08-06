# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cutmeets is a frontend-only UI prototype for a Japanese beauty salon matching platform built with Next.js 15.4.2, React 19, and TypeScript. This is a pure frontend implementation with no backend functionality.

## Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # ESLint checking
```

## Architecture Overview

### App Router Structure (Next.js 15)
- **Route Groups**: Three main areas with separate layouts
  - `src/app/(web)/` - Main website with Header/Footer layout
  - `src/app/admin/` - Admin interface with sidebar layout
  - `src/app/assistant/` - Assistant hairdresser dashboard
- **Frontend Only**: No API routes or backend functionality

### Component Organization
```
_components/
├── catalog/      # Hair style catalog components
├── client/       # Client-side interactive components
├── common/       # Shared UI (Header, Footer, Loading)
├── payment/      # Payment forms and history
├── profile/      # Profile cards and application system
├── providers/    # Context providers (Auth, Booking)
├── review/       # Review system components
└── search/       # Advanced search interface
```

### Key Libraries & Dependencies
- **UI Icons**: @heroicons/react
- **Date Handling**: date-fns
- **Styling**: Tailwind CSS v4
- **TypeScript**: Strict type checking enabled
- **Note**: bcryptjs, jsonwebtoken, and joi are installed but not used (frontend-only)

### Frontend Architecture
- Static UI components only
- No authentication or data persistence
- All data is hardcoded in components
- Ready for future backend integration

### Path Mapping
- `@/*` points to `./src/*`

## Frontend Pages Overview

### Main Website (`/src/app/(web)/`)
- Landing page with hero section
- User registration flow (UI only)
- Search interface (static results)
- Profile pages (static data)
- Booking pages (no functionality)
- Favorites page (no persistence)
- Contact form (no submission)

### Admin Dashboard (`/src/app/admin/`)
- Dashboard layout with sidebar
- Static statistics display
- User management UI (no functionality)
- Content moderation interface

### Assistant Dashboard (`/src/app/assistant/`)
- Dashboard for hairdressers
- Booking management UI
- Schedule interface
- Earnings display (static)

## Important Patterns & Conventions

### Server vs Client Components
- Default to Server Components for better performance
- Use `'use client'` only when needed (interactivity, browser APIs)
- Keep providers and interactive components in `_components/client/`

### Japanese Text Optimization
```css
/* Applied via text-ja class */
word-break: keep-all;
line-break: strict;
font-feature-settings: "palt" 1;
```

### Component Data Pattern
```typescript
// Components use static data
const mockData = [
  { id: 1, name: "Example" },
  // ...
];
```

### Type Safety
- Strict TypeScript configuration
- Type definitions in component files or dedicated `.types.ts`
- Use interfaces for props and API responses

## Project Status & Roadmap

### Current Implementation
- ✅ **UI/UX**: Complete frontend with responsive design
- ✅ **Component Library**: Reusable components with TypeScript
- ✅ **Routing**: All pages created with static content
- 🔄 **Registration Flow**: Step 1 UI completed
- ❌ **Backend**: No backend functionality
- ❌ **Data Persistence**: No database or storage
- ❌ **Authentication**: UI only, no actual auth

### Frontend-Only Limitations
1. **No Data Persistence**: All data resets on refresh
2. **No Authentication**: Login/register are UI mockups
3. **No API Calls**: All data is hardcoded
4. **No File Upload**: Image upload UI only
5. **No Real Features**: Search, booking, payment are static

### Performance Optimizations Applied
- Dynamic imports for heavy components
- Font optimization with Next.js font system
- Image optimization with next/image
- Tailwind CSS v4 for minimal CSS bundle
- Server Components by default

## Common Development Tasks

### Adding a New Page
1. Create page.tsx in appropriate route folder
2. Use existing layout (web/admin/assistant)
3. Import components from `_components/`
4. Follow Server Component pattern by default

### Creating New Components
1. Add component in appropriate `_components/` folder
2. Use TypeScript interfaces for props
3. Include static mock data if needed
4. Export from index.ts

### Working with Components
1. Check existing components first
2. Use TypeScript interfaces for props
3. Place in appropriate component folder
4. Export from index.ts for clean imports

### Styling Guidelines
- Use Tailwind CSS classes
- Apply `text-ja` class for Japanese text
- Mobile-first responsive design
- Keep custom CSS minimal

## File Structure Conventions

### Route Organization
```
(web)/          # Public pages with main layout
├── booking/    # Booking-related pages
├── profile/    # User profiles
├── search/     # Search and listings
└── catalog/    # Style galleries

admin/          # Admin dashboard
assistant/      # Assistant dashboard
api/            # All API routes
```

### Component Naming
- PascalCase for components (ProfileCard.tsx)
- Descriptive names (SearchFilters not Filters)
- Group related components in folders
- Use index.ts for barrel exports