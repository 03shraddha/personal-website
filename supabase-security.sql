-- =====================================================
-- SECURITY LOCKDOWN (Nov 2026)
-- Run this once in Supabase Dashboard > SQL Editor.
--
-- Before: RLS was on, but every table had "anyone can insert/update/delete"
-- policies, so any visitor could change the site with the public anon key.
-- After: anyone can still read, and anyone can still sign the guestbook.
-- Every other write needs a signed-in Supabase Auth user whose email
-- matches ADMIN_EMAIL below and is confirmed.
--
-- Also do these in the dashboard:
--   1. Authentication > Users > Add user: create your admin user with ADMIN_EMAIL.
--   2. Authentication > Sign In / Providers: turn OFF "Allow new users to sign up".
-- =====================================================

-- Admin check. SECURITY DEFINER so it can read auth.users.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
      AND lower(u.email) = lower('meetshraddhakulkarni@gmail.com')  -- ADMIN_EMAIL
      AND u.email_confirmed_at IS NOT NULL
  );
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Drop every existing policy on the site tables, so no old open policy survives.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('guestbook_notes', 'photos', 'page_views', 'content_entries', 'projects')
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

ALTER TABLE public.guestbook_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;

-- Public read on all site tables
CREATE POLICY "public read" ON public.guestbook_notes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.photos          FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.page_views      FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.content_entries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.projects        FOR SELECT TO anon, authenticated USING (true);

-- Guestbook: anyone can add a note of 1 to 1000 characters. Only admin can edit or delete.
CREATE POLICY "anyone can sign" ON public.guestbook_notes FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(btrim(message)) BETWEEN 1 AND 1000);
CREATE POLICY "admin update" ON public.guestbook_notes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete" ON public.guestbook_notes FOR DELETE TO authenticated USING (public.is_admin());

-- Photos, content entries, projects: admin only for every write
CREATE POLICY "admin insert" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin update" ON public.photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete" ON public.photos FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "admin insert" ON public.content_entries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin update" ON public.content_entries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete" ON public.content_entries FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "admin insert" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin update" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete" ON public.projects FOR DELETE TO authenticated USING (public.is_admin());

-- Page views: no direct writes. The counter only moves through the function below,
-- which now only accepts page 'main' (before, anyone could create unlimited rows).
CREATE OR REPLACE FUNCTION public.increment_page_view(page_id_param TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF page_id_param IS DISTINCT FROM 'main' THEN
    RAISE EXCEPTION 'unknown page';
  END IF;
  INSERT INTO public.page_views (page_id, count)
  VALUES (page_id_param, 1)
  ON CONFLICT (page_id)
  DO UPDATE SET count = public.page_views.count + 1, updated_at = NOW()
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- Storage bucket "photos": public read stays, uploads and deletes are admin only.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (coalesce(qual, '') || coalesce(with_check, '')) LIKE '%photos%'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "photos public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'photos');
CREATE POLICY "photos admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'photos' AND public.is_admin());
CREATE POLICY "photos admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'photos' AND public.is_admin());
CREATE POLICY "photos admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'photos' AND public.is_admin());

-- Clean up after the intrusion: remove the test project, and restore
-- "Resource Extraction and GDP per Capita Trajectories" (id 11), which was deleted.
-- Its old description was longer. Edit it from the site if you remember the rest.
DELETE FROM public.projects WHERE id = 16 AND name = 'SECURITY_TEST_DELETE_ME';
INSERT INTO public.projects (id, name, highlight, brief_description, github_url, live_url, sort_order)
VALUES (11, 'Resource Extraction and GDP per Capita Trajectories', 'peach',
        'what happens to a country''s economy after it strikes oil, diamonds, or copper?',
        'https://github.com/03shraddha/resource-vs-gdp', 'https://03shraddha.github.io/resource-vs-gdp/', 12)
ON CONFLICT (id) DO NOTHING;

-- Check: this should list only the policies created above.
SELECT schemaname, tablename, policyname, cmd, roles FROM pg_policies
WHERE schemaname IN ('public', 'storage') ORDER BY 1, 2, 3;
