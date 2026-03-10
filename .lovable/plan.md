

# Phase 2: Logo Update, Favicon, Futuristic Animations, and Hero Refinement

## 1. Logo and Favicon Update

- Copy `AfriCertify_Logo_2.png` to `src/assets/africertify-logo.png` (replacing current)
- Copy `AfriCertify_Favicon.png` to `public/favicon.png` (replacing current)
- No component changes needed -- `AfriCertifyLogo.tsx` already imports from the same path

## 2. Hero UI Refinement

- Redesign the hero with a more dramatic, futuristic layout:
  - Add animated floating circuit-pattern particles in the background (CSS-only with keyframes)
  - Refine the gradient to use deeper blues with gold/neon accents matching the new logo's gold "AC"
  - Add a floating glow orb animation behind the hero image
  - Stagger text animations for headline words for a cinematic reveal effect
  - Add a subtle grid/scan-line overlay for a cyberpunk feel
  - Improve the stat counters with animated count-up effect using framer-motion

## 3. Futuristic Animations Across the App

### Page Transitions
- Wrap routes in `AnimatePresence` with fade+slide transitions between pages in `App.tsx`

### Animated Background Component
- Create a reusable `CircuitBackground` component with CSS-animated floating dots and connection lines
- Apply to Hero section and Dashboard background

### Enhanced Card Interactions
- Add glow-on-hover effect to all Cards (Features, Pricing, Dashboard stats)
- Scale-up with border glow on hover using Tailwind + CSS transitions

### Futuristic Loading Spinner
- Create a `NeonSpinner` component with orbiting rings animation for use across the app

### CSS Keyframes to Add (in tailwind.config.ts)
- `float` -- gentle vertical bob for floating elements
- `glow-pulse` -- neon glow intensity cycling
- `scan-line` -- horizontal scan effect for cyberpunk feel
- `circuit-flow` -- animated dashes along circuit paths

### Typography Hover Effects
- Add subtle letter-spacing expansion on heading hover via CSS class

### Dashboard Enhancements
- Stagger card entrance animations with increasing delays
- Add pulsing glow borders on stat cards

## 4. Low Data Mode Foundation
- Add a CSS class `.reduce-motion` that disables all custom animations
- Respect `prefers-reduced-motion` media query globally in CSS

## Files to Change

| File | Change |
|------|--------|
| `src/assets/africertify-logo.png` | Replace with new logo |
| `public/favicon.png` | Replace with new favicon |
| `src/components/Hero.tsx` | Redesign with circuit bg, staggered text, refined colors |
| `src/components/CircuitBackground.tsx` | New -- animated particle/circuit CSS component |
| `src/components/NeonSpinner.tsx` | New -- futuristic loading spinner |
| `src/components/PageTransition.tsx` | New -- AnimatePresence wrapper |
| `src/App.tsx` | Wrap routes with PageTransition |
| `src/index.css` | Add keyframes, glow utilities, reduced-motion support |
| `tailwind.config.ts` | Add float, glow-pulse, scan-line keyframes and animations |
| `src/components/Features.tsx` | Enhanced hover glow effects |
| `src/components/Pricing.tsx` | Enhanced card animations |
| `src/components/Navbar.tsx` | Subtle backdrop glow refinement |
| `src/pages/Dashboard.tsx` | Enhanced stat card animations |

