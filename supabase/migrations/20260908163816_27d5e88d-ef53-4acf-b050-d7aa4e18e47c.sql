
-- 1. Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- 2. Remove GraphQL API exposure
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql_public FROM anon, authenticated;
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql FROM anon, authenticated;

-- 3. certificate_views: only allow logging views for certificates that exist
DROP POLICY IF EXISTS "Anyone can insert views" ON public.certificate_views;
CREATE POLICY "Views can be logged for existing certificates"
ON public.certificate_views FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.certificates c WHERE c.id = certificate_id)
  AND viewer_ip IS NULL
);

-- 4. certificates: stop exposing recipient emails publicly
DROP POLICY IF EXISTS "Public can verify certificates" ON public.certificates;
REVOKE SELECT ON public.certificates FROM anon;

CREATE POLICY "Recipients can view own certificates"
ON public.certificates FOR SELECT TO authenticated
USING (lower(recipient_email) = lower(auth.jwt() ->> 'email'));

CREATE OR REPLACE VIEW public.certificate_verification
WITH (security_invoker = off) AS
SELECT id, certificate_code, recipient_name, course_name, issue_date, status, created_at
FROM public.certificates;

GRANT SELECT ON public.certificate_verification TO anon, authenticated;

-- 5. Storage: uploads must go into the user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload template assets" ON storage.objects;
CREATE POLICY "Users can upload own template assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'template-assets'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
