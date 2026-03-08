

# Plan: Further Enlarge Logo and Tighten Padding

One note: Tailwind doesn't have `h-25`, `h-29`, or `h-37` as standard classes. I'll use arbitrary values to match your intent:

**`src/components/AfriCertifyLogo.tsx`** — Update `sizeMap`:
- `sm`: `h-20` → `h-[100px]`
- `md`: `h-24` → `h-[116px]`
- `lg`: `h-32` → `h-[148px]`

**`src/components/Navbar.tsx`** — `py-2` → `py-1`

**`src/components/Footer.tsx`** — `py-8` → `py-4`

This will make the logo noticeably larger while keeping header/footer compact. The arbitrary Tailwind values give precise pixel control.

