

# AfriCertify — Remaining Work Itemized by Phase

Based on a full codebase review, here is what exists and what still needs to be built, organized by your roadmap phases.

---

## What's DONE

| Area | Status |
|------|--------|
| Landing page (Hero, Features, Pricing, Footer) | Done (with futuristic animations) |
| Brand/Logo/Favicon | Done |
| Page transitions, CircuitBackground, NeonSpinner | Done |
| Auth: SignUp, SignIn, ResetPassword, email confirmation flow | Done |
| Auth context with roles (admin/issuer/recipient) | Done |
| DB: `profiles` and `user_roles` tables with RLS | Done |
| Auto-create profile + role on signup trigger | Done |
| Admin panel: view users, change roles | Done |
| Settings page: edit profile, change password | Done |
| DashboardLayout with role-based nav | Done |
| Protected + Admin route guards | Done |

---

## What's REMAINING

### Phase 4 — Database Schema (Core Tables)
All pages currently use **hardcoded mock data**. The following tables need to be created:

1. **`templates`** — certificate template designs (name, owner, layout JSON, colors, logo URL, created_at)
2. **`certificates`** — issued certificates (template_id, issuer_id, recipient_name, recipient_email, unique certificate_id/code, issue_date, status, metadata)
3. **`certificate_views`** — track verification/view events for analytics

### Phase 5 — Template Editor (Functional)
Currently a static UI mockup. Needs:

4. **Save/load templates** to the `templates` table
5. **Template design fields** wired to state (background color, logo upload, text positioning)
6. **Logo/image upload** using file storage
7. **AI-assisted template generation** (optional — use Lovable AI to suggest layouts)

### Phase 6 — Certificate Issuance (Functional)
Currently a static form. Needs:

8. **Single issuance** — form submits to `certificates` table, generates unique ID/QR code
9. **Bulk issuance** — CSV upload, parse rows, batch insert certificates
10. **Certificate PDF generation** — render template + recipient data into downloadable PDF
11. **Email delivery** — send certificate via email (edge function + email provider)

### Phase 7 — Certificates List (Dynamic)
Currently hardcoded data. Needs:

12. **Fetch certificates from DB** with search, filter, pagination
13. **Revoke certificate** functionality
14. **Resend email** action
15. **Download certificate** as PDF

### Phase 8 — Verification Page (Dynamic)
Currently shows a hardcoded "verified" result. Needs:

16. **Search by certificate ID** — input field to look up a certificate
17. **Public verification** — query `certificates` table (public RLS policy), display result or "not found"
18. **QR code scanning** support (link format)

### Phase 9 — Dashboard (Dynamic)
Currently all mock stats. Needs:

19. **Real stats** from DB (count certificates, templates, recipients, monthly activity)
20. **Recent activity** feed from actual certificate issuance records
21. **Dynamic greeting** using logged-in user's name

### Phase 10 — Analytics (Dynamic)
Currently hardcoded. Needs:

22. **Real analytics** — certificate views, shares, issuance trends from `certificate_views`
23. **Charts** using Recharts (already installed) with real data
24. **Date range filters**

### Phase 11 — Recipient Portfolio (Dynamic)
Currently hardcoded. Needs:

25. **Fetch recipient's certificates** from DB by logged-in user's email
26. **Share certificate** link generation
27. **Download certificate** PDF
28. **Public portfolio URL** (shareable link for recipients)

### Phase 12 — Certificate Detail Page
29. **Dynamic certificate detail** — fetch by ID, render template preview
30. **Social sharing** meta tags / Open Graph

### Phase 13 — Pricing & Payments (if applicable)
31. **Stripe integration** for paid plans
32. **Usage limits** enforcement (free tier certificate cap)
33. **Plan management** in Settings

### Phase 14 — Polish & Production Readiness
34. **Email verification flow** end-to-end testing
35. **Error boundaries** and loading states on all pages
36. **Mobile responsiveness** audit across all pages
37. **SEO** — meta tags, Open Graph for shared certificates
38. **Rate limiting** on public verification endpoint

---

## Suggested Build Order

I recommend tackling these in this sequence, one phase at a time:

1. **Database tables** (templates, certificates, certificate_views) — foundation for everything
2. **Template CRUD** — save/load/edit templates
3. **Certificate issuance** — single + bulk, with unique IDs
4. **Dynamic dashboard + certificates list** — wire up real data
5. **Verification page** — public lookup
6. **Recipient portfolio** — dynamic
7. **Analytics** — real charts
8. **PDF generation + email delivery** — edge functions
9. **Payments** (if needed)

Which phase would you like to start with?

