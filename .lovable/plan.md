

# Plan: Enlarge Logo Without Increasing Header/Footer Padding

The issue is that the Navbar has `py-4` padding, so a taller logo pushes the header height up. The fix is two-fold:

1. **Increase logo size further** in `AfriCertifyLogo.tsx`:
   - `sm`: `h-16` → `h-20` (80px)
   - `md`: `h-20` → `h-24` (96px)
   - `lg`: `h-28` → `h-32` (128px)

2. **Reduce Navbar padding** to compensate for the larger logo:
   - `py-4` → `py-2` in `Navbar.tsx` (line 13)

3. **Reduce Footer top padding** similarly:
   - `py-12` → `py-8` in `Footer.tsx` (line 6)

This gives a visually larger logo while keeping the header and footer compact.

| File | Change |
|------|--------|
| `src/components/AfriCertifyLogo.tsx` | Bump all sizes up one tier |
| `src/components/Navbar.tsx` | `py-4` → `py-2` |
| `src/components/Footer.tsx` | `py-12` → `py-8` |

