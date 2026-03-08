

# Plan: Make Logo Significantly Larger

The current sizes (`h-12`, `h-14`, `h-20`) are too small to notice a difference. Increase them substantially:

**`src/components/AfriCertifyLogo.tsx`** — Update `sizeMap`:
- `sm`: `h-12` → `h-16` (64px, used in Navbar/Footer)
- `md`: `h-14` → `h-20` (80px, used in Dashboard sidebar)
- `lg`: `h-20` → `h-28` (112px, used in hero/landing sections)

This is a single-line change in the sizeMap object. No other files need modification.

