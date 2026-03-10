

# Pre-built Template Gallery with Tier-Gated Access

## Overview
Create 14 futuristic certificate templates as a browsable gallery, with tier-based access controls for templates, uploads, and AI generation.

## Tier Rules

| Feature | Freemium | Premium ($29/mo) | Business/Enterprise |
|---|---|---|---|
| Pre-built templates | 2 free | All 14 | All 14 |
| Upload custom templates | 0 | Up to 7 | Unlimited |
| AI-generate templates (prompts) | 0 | 3 credits | Unlimited |

## 14 Template Designs

**Free (2):**
1. **Neon Circuit** -- Dark navy + neon blue circuit-board border
2. **Golden Prestige** -- Black + gold gradients, serif typography

**Premium (12):**
3. **Aurora Gradient** -- Purple-to-teal gradient, glass-morphism
4. **Minimal Mono** -- Clean white, geometric border
5. **Cosmic Night** -- Deep purple, starfield dots, glowing text
6. **Emerald Academy** -- Forest green + gold, classic academic
7. **Sunset Blaze** -- Coral-to-orange gradient, bold type
8. **Ice Crystal** -- Cool blue, frosted glass effect
9. **Sahara Gold** -- Warm sand tones, African-inspired patterns
10. **Digital Wave** -- Cyan-to-indigo, wave pattern border
11. **Royal Crest** -- Deep burgundy, ornamental crest border
12. **Carbon Fiber** -- Dark gray carbon texture, sharp modern lines
13. **Ocean Depth** -- Deep teal, subtle underwater gradient
14. **Crimson Honor** -- Dark red-to-black, bold serif, ribbon accent

## Implementation

### 1. Create `src/data/prebuiltTemplates.ts`
Define all 14 templates as static constants with: `id`, `name`, `description`, `tier` ("free" | "premium"), `backgroundColor`, `textColor`, `fontFamily`, `fontSize`, `alignment`, `borderStyle`, `thumbnailGradient` (CSS gradient for card preview).

### 2. Create `src/pages/TemplateGallery.tsx`
- Grid of 14 template cards with mini CSS-rendered previews
- "Free" and "Premium" badges on cards
- Click opens a preview modal; "Use This Template" clones to user's `templates` table
- Free-tier users see lock overlay + upgrade prompt on premium templates
- Tier check is client-side for now (all users = free unless subscription tracking is added later)

### 3. Update `src/components/Pricing.tsx`
Update feature lists to reflect the new template rules:
- Freemium: "2 pre-built templates"
- Premium: "All 14 templates", "Upload up to 7 custom templates", "3 AI template generation credits"
- Business: "All 14 templates", "Unlimited custom uploads", "Unlimited AI generation"
- Enterprise: same as Business + custom features

### 4. Update `src/pages/Templates.tsx`
- Add a "Browse Gallery" button linking to `/template-gallery`
- Show upload count vs limit for Premium users (future enforcement)

### 5. Add route in `src/App.tsx`
- `/template-gallery` as a protected route

### 6. AI Generation (edge function -- future-ready stub)
- Add a "Generate with AI" button in the gallery (disabled for free users, 3 credits for Premium, unlimited for Business)
- The actual AI edge function using Lovable AI (`google/gemini-3.1-flash-image-preview`) to generate certificate backgrounds from prompts will be wired up as part of this work
- Create `supabase/functions/generate-template/index.ts` that takes a text prompt, calls the image model, uploads the result to `template-assets` bucket, and returns the URL

### Technical Notes
- No database migration needed for the 14 static templates (they're constants, cloned on use)
- AI generation credits tracking can be done client-side initially or via a simple counter in the `profiles` table (would need a migration to add `ai_credits_used` column) -- we can keep it simple with client-side for now
- The gallery uses the same `TemplateLayout` interface as the editor

