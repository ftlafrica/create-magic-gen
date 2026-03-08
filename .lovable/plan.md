

# Plan: Fix Navbar Covering the Hero Banner

The navbar logo (`sm` = 120px) makes the fixed header too tall, covering the hero content. Two changes needed:

1. **Reduce logo size in navbar** — `AfriCertifyLogo.tsx` `sm` size is 120px which is excessive for a navbar. Reduce to `h-16` (64px) for `sm`, keeping `md` and `lg` for other contexts.

2. **Increase hero top padding** — In `Hero.tsx`, change `pt-20` to `pt-24` or `pt-28` to ensure content clears the navbar.

| File | Change |
|------|--------|
| `src/components/AfriCertifyLogo.tsx` | `sm`: `h-[120px]` → `h-16` (64px) |
| `src/components/Hero.tsx` | `pt-20` → `pt-28` |

This keeps the logo prominent but prevents the navbar from blocking the hero section.

