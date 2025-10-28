# Changelog

All notable changes to ScreenVS will be documented in this file.

## [Unreleased]

### Added

#### Communities & Invites (Phase 10)
- **CommunitiesPage Component** (`/features/communities/CommunitiesPage.tsx`)
  - Squad management interface
  - Responsive grid layout (1-col mobile, 2-col desktop)
  - Sticky header with glass morphism
  - Empty state with quick-join suggestions
  - localStorage persistence for squads
  - Confetti bursts on squad actions
- **SquadCard Component** (`/features/communities/SquadCard.tsx`)
  - Squad info display with emoji logo
  - Member avatars (up to 4 + overflow indicator)
  - Average efficiency stats with icon
  - Leader badge for top performers
  - Hover lift animation + border glow
- **CreateSquadModal Component** (`/features/communities/CreateSquadModal.tsx`)
  - Squad name input with validation
  - Emoji picker with 10 preset options
  - Generates mock invite links
  - Copies invite link to clipboard
  - Form validation and error states
- **JoinSquadModal Component** (`/features/communities/JoinSquadModal.tsx`)
  - Invite link input with validation
  - Link format checking
  - Mock squad joining flow
  - Error handling with red border
- **Mock Squad Data** (`mockData.ts`)
  - Squad, SquadMember interfaces
  - Default squads with members
  - Average efficiency calculations
- **Communities Copy** (`copy.ts`)
  - Header, empty state, and modal text
  - Quick-join suggestions array
  - Success/error toast messages
- **Communities Route** (`/communities`)
  - Fully functional page with all features
  - Accessible via bottom navigation
- **README-COMMUNITIES.md**
  - Complete feature documentation
  - Architecture overview
  - Test cases and user flows
  - Future enhancement roadmap

#### Pricing & Plans (Phase 9)
- **PricingPage Component** (`/features/pricing/PricingPage.tsx`)
  - Premium dark-themed pricing page
  - Two-tier pricing cards (Free Forever & Pro Mode)
  - Animated gradient border on Pro card
  - Hover lift effects on all cards
  - Current plan state with localStorage persistence
  - Confetti burst on Pro upgrade
  - Toast feedback for plan changes
- **FAQAccordion Component** (`/features/pricing/FAQAccordion.tsx`)
  - Collapsible FAQ with 5 questions
  - Smooth expand/collapse animation (300ms)
  - Rotating chevron indicator
  - All closed by default
- **Pricing Route** (`/pricing`)
  - Added to main App routing
  - Accessible throughout app
- **Mock Plan Data** (`mockData.ts`)
  - Plan options with features and pricing
  - Current plan state tracking
- **Pricing Copy** (`copy.ts`)
  - All pricing text centralized
  - Cheeky, confident tone
  - FAQ questions and answers
  - Toast messages for interactions
- **README-PRICING.md**
  - Complete feature documentation
  - Architecture overview
  - Test cases and acceptance criteria
  - Future enhancement roadmap
- Meme Bank and Roast Engine feature with safe humor system
- MemeBank.tsx component with user/community meme tabs
- MemeUploadForm.tsx for adding new memes with URL validation
- RoastEngine.tsx for generating personalized roasts
- 9 safe roast templates with dynamic placeholders
- Community meme pool with opt-in toggle
- Image error handling with fallback UI
- Copy and mock send functionality for roasts
- Memes page at /memes route with tabbed interface

### Added
- Player Card Profile feature with tier-based visual identity
- PlayerCard.tsx component with avatar, tier badge, and editable bio
- PlayerStatsGrid.tsx with animated count-up stats display
- MemeHistory.tsx for roast collection viewing
- Diamond tier support (95+ efficiency) with cyan gradient
- Tier system (Diamond/Gold/Silver/Bronze) with dynamic gradients
- Bio field with 80-character limit and localStorage persistence
- Grayscale avatar effect for low efficiency (<60)
- Confetti celebration for Gold+ tier achievement
- Stats grid with best streak, best week drop, top category, squads joined
- CTA buttons for leaderboard navigation and share card (mock)
- Profile copy added to copy.ts for tier messages and empty states
- Editable bio with auto-save on blur
- Meme history with modal preview
- Tier-specific motivational messages

### Added
- Sync Status and Connected Services feature
- SyncStatus.tsx component for connection state display
- ConnectedServices.tsx component for service management
- Mock reconnection functionality with toast feedback
- Collapsible troubleshooting section
- Real-time sync status updates
- Service toggle persistence via localStorage

### Added
- Power-Tips Carousel feature with gamified unlockable tips
- PowerTipsCarousel.tsx component with swipe navigation
- PowerTipCard.tsx component with unlock animations
- Tips page at /tips route
- 5 starter power-tips with action handlers (link, toast, tooltip)
- Unlock state persistence via localStorage
- Shimmer animation for unlocked cards
- Pagination dots and arrow navigation

### Added
- Efficiency Explainer component for data insights
- Donut chart for daily time breakdown (Productive/Unproductive/Neutral)
- 7-day mini-trend chart showing efficiency changes
- Dynamic summary sentences comparing today vs yesterday
- "Why?" toggle revealing efficiency calculation formula
- Count-up animations and confetti for Gold tier (≥80%)
- Auto-generated copy with competitive, humorous tone

### Added
- Initial project structure
- Core dashboard functionality
- Leaderboard system
- Basic profile page
- Authentication flow
- Mock data system
