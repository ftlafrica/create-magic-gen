
-- Templates table
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid NOT NULL,
  layout_json jsonb NOT NULL DEFAULT '{}',
  background_color text DEFAULT '#ffffff',
  logo_url text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can CRUD own templates" ON public.templates
  FOR ALL TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can view all templates" ON public.templates
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  template_id uuid REFERENCES public.templates(id) ON DELETE SET NULL,
  issuer_id uuid NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  course_name text,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issuers can CRUD own certificates" ON public.certificates
  FOR ALL TO authenticated
  USING (auth.uid() = issuer_id)
  WITH CHECK (auth.uid() = issuer_id);

CREATE POLICY "Admins can view all certificates" ON public.certificates
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can verify certificates" ON public.certificates
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Certificate views / verification logs
CREATE TABLE public.certificate_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id uuid REFERENCES public.certificates(id) ON DELETE CASCADE NOT NULL,
  viewer_ip text,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

ALTER TABLE public.certificate_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views" ON public.certificate_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Issuers can view own certificate views" ON public.certificate_views
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.certificates c
      WHERE c.id = certificate_id AND c.issuer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all certificate views" ON public.certificate_views
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for template assets
INSERT INTO storage.buckets (id, name, public) VALUES ('template-assets', 'template-assets', true);

CREATE POLICY "Authenticated users can upload template assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'template-assets');

CREATE POLICY "Anyone can view template assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'template-assets');

CREATE POLICY "Owners can delete own template assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'template-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
