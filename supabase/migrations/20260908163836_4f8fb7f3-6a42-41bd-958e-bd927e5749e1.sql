
DROP VIEW IF EXISTS public.certificate_verification;

-- Public verification uses column-level grants: emails and metadata stay hidden
CREATE POLICY "Public can verify certificates (limited columns)"
ON public.certificates FOR SELECT TO anon
USING (true);

GRANT SELECT (id, certificate_code, recipient_name, course_name, issue_date, status, created_at)
ON public.certificates TO anon;
