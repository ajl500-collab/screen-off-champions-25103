# Meme Bank + Roast Engine

## Overview

The **Meme Bank** and **Roast Engine** add playful, safe humor to ScreenVS through user-curated meme collections and personalized roast generation. The system combines user screen-time stats with funny templates to create shareable content that motivates without being mean-spirited.

## Components

### 1. MemeBank.tsx
Main meme gallery component featuring:
- **Tabs**: All Memes / My Memes view switcher
- **Community Pool Toggle**: Opt-in to moderated community memes
- **Grid Layout**: Responsive 2-col (mobile) / 3-col (desktop)
- **Delete Functionality**: Remove user memes with fade-out animation
- **Image Error Handling**: Fallback UI for broken images
- **Hover Effects**: Zoom-in on image hover (1.1x scale)

### 2. MemeUploadForm.tsx
Add new memes component with:
- **URL Validation**: Ensures https:// and valid image extensions (.jpg, .png, .webp)
- **Title Input**: 50-character limit with counter
- **Form Validation**: Prevents invalid submissions
- **Success Feedback**: Toast notification on successful add

### 3. RoastEngine.tsx
Roast generation component featuring:
- **Meme Selection**: Dropdown of all available memes
- **Target Name Input**: Personalize the roast recipient
- **Template System**: 9 safe roast templates with placeholders
- **Dynamic Variables**: Replaces {name}, {delta}, {hours} with real data
- **Preview Card**: Shows meme + generated text
- **Copy/Share**: Clipboard copy and mock send functionality

## Features

### Meme Management
- **Add Memes**: Via URL with title (stored in component state)
- **Delete Memes**: User memes only, with confirmation toast
- **Community Pool**: Toggle to include curated community memes
- **Image Loading**: Lazy loading with error fallback
- **Responsive Grid**: Adapts to screen size automatically

### Roast Generation
- **Template Selection**: Random pick from 9 safe templates
- **Placeholder Replacement**:
  - `{name}`: Target person's name
  - `{delta}`: Efficiency change percentage
  - `{hours}`: Unproductive hours from today's data
- **Real-time Preview**: Instant visual feedback
- **Share Options**: Copy to clipboard or mock send

### Safe Humor Guidelines
All templates follow these rules:
- ✅ Playful and light-hearted
- ✅ Focus on screen time behavior, not personal attacks
- ✅ Include supportive/motivational variants
- ❌ No personal insults or mean-spirited content
- ❌ No sensitive topics (appearance, identity, etc.)

## Mock Data

Located in `src/features/dashboard/mockData.ts`:

```typescript
export const mockMemesData: MockMemesData = {
  userMemes: [
    { id: 1, url: "https://...", title: "Focus Mode" },
    { id: 2, url: "https://...", title: "Infinite Scroll" },
    { id: 3, url: "https://...", title: "Notification Hell" },
  ],
  communityMemes: [
    { id: 101, url: "https://...", title: "Work Focus", isCommunity: true },
    { id: 102, url: "https://...", title: "Phone Addict", isCommunity: true },
    { id: 103, url: "https://...", title: "Squad Goals", isCommunity: true },
  ],
  roastTemplates: [
    { id: 1, template: "📱 {name}, your thumb's training for a marathon." },
    { id: 2, template: "🔥 {name}, you just hit a new PR in screen time." },
    // ... 7 more templates
  ],
};
```

## Copy Tone

From `src/features/dashboard/copy.ts`:

| Context          | Example                                                |
| ---------------- | ------------------------------------------------------ |
| Light Roast      | "Calm down, influencer."                               |
| Spicy            | "You could build a startup with those hours."          |
| Supportive       | "Roasted with love 🔥 — back on track tomorrow."      |
| Success Toast    | "Added to your bank 🔥"                                |
| Delete Toast     | "Deleted."                                             |
| Copy Success     | "Roast copied to clipboard 📋"                         |

## Usage

```tsx
// In Memes page
import { MemeBank } from "@/features/memes/MemeBank";
import { RoastEngine } from "@/features/memes/RoastEngine";

<Tabs>
  <TabsContent value="bank">
    <MemeBank />
  </TabsContent>
  <TabsContent value="roast">
    <RoastEngine />
  </TabsContent>
</Tabs>
```

## Responsive Design

- **Mobile**: 2-column meme grid, stacked form inputs
- **Desktop**: 3-column meme grid, side-by-side layouts
- **Tablet**: Adapts fluidly between breakpoints
- **Touch Targets**: All buttons meet 44px minimum

## Animations

- **Fade-in**: New memes appear with 300ms fade
- **Scale-out**: Deleted memes shrink and fade (300ms)
- **Hover Zoom**: Images scale to 110% on hover
- **Roast Preview**: Generated roasts fade in smoothly

## State Management

- **Component State**: User memes stored in MemeBank component
- **No Persistence**: Resets on page refresh (intentional for MVP)
- **Community Toggle**: Boolean state for pool visibility
- **Image Errors**: Set tracks failed image IDs

## Future Enhancements

- Backend integration with Supabase for persistent storage
- Real send functionality (Discord webhook, SMS, etc.)
- User-submitted community memes with moderation
- More roast templates with seasonal variations
- Meme favoriting and sorting
- Analytics on most-used memes

## Security Considerations

- **URL Validation**: Prevents XSS via strict URL checking
- **Content Moderation**: Manual review for community memes (future)
- **Safe Templates**: All roasts pre-approved and non-offensive
- **No User-Generated Text**: Templates only, no free-form roast text

---

**Related Documentation:**
- [Profile](./README-PROFILE.md)
- [Dashboard](./README-DASHBOARD.md)
- [Power Tips](./README-TIPS.md)
