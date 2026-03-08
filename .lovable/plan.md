

# Plan: Enable Auto-Confirm, Enlarge Logo, and E2E Testing

## 1. Enable Auto-Confirm for Email Signups
Use the `cloud--configure_auth` tool to enable auto-confirm so testing can proceed without email verification.

## 2. Enlarge the Logo
The `AfriCertifyLogo` size map uses small heights (`h-9`, `h-11`, `h-16`). Increase all sizes:

**`src/components/AfriCertifyLogo.tsx`** — Update `sizeMap`:
- `sm`: `h-9` → `h-12`
- `md`: `h-11` → `h-14`  
- `lg`: `h-16` → `h-20`

## 3. E2E Testing
After enabling auto-confirm and deploying changes, use browser automation to:
- Navigate to `/signup`, create a test account
- Verify redirect to `/signin` or auto-login
- Sign in and check role-based redirect
- Navigate to `/settings`, verify profile form loads
- Sign out and confirm redirect

## Files Changed
| File | Change |
|------|--------|
| `src/components/AfriCertifyLogo.tsx` | Increase logo sizes |
| Auth config | Enable auto-confirm |

