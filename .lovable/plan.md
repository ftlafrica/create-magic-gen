

# Phase 3.5: E2E Testing, Settings Page, and Admin Panel

The user requested three things. Here is the plan for all three.

## 1. E2E Auth Flow Testing

I will manually test the sign-up, sign-in, dashboard redirect, and sign-out flows using browser automation tools. This includes:
- Navigate to `/signup`, create an account
- Verify redirect and confirmation message
- Sign in with the created credentials
- Check role-based redirect (issuer -> `/dashboard`, recipient -> `/portfolio`)
- Test sign-out returns to home

**Note:** Email confirmation is enabled by default. To test end-to-end without email verification, we may need to temporarily enable auto-confirm. I will check this during testing and report findings.

## 2. User Settings Page (`/settings`)

Currently `/settings` renders the Dashboard component. Create a dedicated `Settings.tsx` page.

**New file: `src/pages/Settings.tsx`**
- Wrapped in `DashboardLayout`
- Form with fields: Full Name, Organization, Avatar URL (text input for now)
- Pre-populated from `useAuth()` profile data
- On save: `supabase.from("profiles").update({...}).eq("id", user.id)`
- Success/error toast feedback
- Password change section: calls `supabase.auth.updateUser({ password })`

**Modified: `src/App.tsx`**
- Import `Settings` and use it for the `/settings` route instead of `Dashboard`

## 3. Admin Role Management Panel

**New file: `src/pages/AdminPanel.tsx`**
- Protected route, only accessible to users with `admin` role
- Displays a table of all users (profiles + roles)
- Admin can change a user's role via dropdown

**Database changes needed:**
- RLS policy on `profiles`: admins can SELECT all profiles
- RLS policy on `user_roles`: admins can SELECT and UPDATE all roles
- Use existing `has_role()` function for admin checks

**Migration SQL:**
```sql
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update roles
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert roles
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete roles
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
```

**New file: `src/pages/AdminPanel.tsx`**
- Fetch all profiles joined with roles
- Table with columns: Name, Email (from user metadata), Organization, Role, Actions
- Role change dropdown triggers update to `user_roles` table
- Only visible in nav for admin users

**Modified: `src/components/DashboardLayout.tsx`**
- Add "Admin" nav item (shield icon) visible only when `roles.includes("admin")`

**Modified: `src/App.tsx`**
- Add `/admin` route wrapped in `ProtectedRoute`

**New file: `src/components/AdminRoute.tsx`**
- Extends `ProtectedRoute` to also check for admin role, redirects non-admins

## Files Summary

| File | Action |
|------|--------|
| `src/pages/Settings.tsx` | Create - profile edit form + password change |
| `src/pages/AdminPanel.tsx` | Create - user/role management table |
| `src/components/AdminRoute.tsx` | Create - admin-only route guard |
| `src/App.tsx` | Modify - add Settings and Admin routes |
| `src/components/DashboardLayout.tsx` | Modify - add Admin nav for admin role |
| Migration | Add admin RLS policies for profiles and user_roles |

