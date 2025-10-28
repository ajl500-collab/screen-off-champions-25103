# Changelog

All notable changes to ScreenVS will be documented in this file.

## [Unreleased]

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
