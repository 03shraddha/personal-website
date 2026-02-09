-- =====================================================
-- SUPABASE SETUP FOR PORTFOLIO WEBSITE
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. GUESTBOOK NOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS guestbook_notes (
    id BIGSERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guestbook_notes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read notes
CREATE POLICY "Anyone can read guestbook notes"
ON guestbook_notes FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert notes (anonymous guestbook)
CREATE POLICY "Anyone can insert guestbook notes"
ON guestbook_notes FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- 2. PHOTOS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS photos (
    id BIGSERIAL PRIMARY KEY,
    src TEXT NOT NULL,
    caption TEXT DEFAULT '',
    category TEXT DEFAULT 'polaroids',
    zoom INTEGER DEFAULT 100,
    pos_x INTEGER DEFAULT 0,
    pos_y INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read photos
CREATE POLICY "Anyone can read photos"
ON photos FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert photos (admin check done in frontend)
CREATE POLICY "Anyone can insert photos"
ON photos FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update photos
CREATE POLICY "Anyone can update photos"
ON photos FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow anyone to delete photos
CREATE POLICY "Anyone can delete photos"
ON photos FOR DELETE
TO anon, authenticated
USING (true);


-- 3. PAGE VIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    page_id TEXT UNIQUE NOT NULL,
    count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read page views
CREATE POLICY "Anyone can read page views"
ON page_views FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert page views
CREATE POLICY "Anyone can insert page views"
ON page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update page views
CREATE POLICY "Anyone can update page views"
ON page_views FOR UPDATE
TO anon, authenticated
USING (true);


-- 4. CONTENT ENTRIES TABLE (Calendar)
-- =====================================================
CREATE TABLE IF NOT EXISTS content_entries (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    source TEXT,
    category TEXT DEFAULT 'article',
    thoughts TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read content entries
CREATE POLICY "Anyone can read content entries"
ON content_entries FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert content entries
CREATE POLICY "Anyone can insert content entries"
ON content_entries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update content entries
CREATE POLICY "Anyone can update content entries"
ON content_entries FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow anyone to delete content entries
CREATE POLICY "Anyone can delete content entries"
ON content_entries FOR DELETE
TO anon, authenticated
USING (true);


-- 5. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    highlight TEXT DEFAULT 'blue',
    brief_description TEXT NOT NULL,
    expanded_content TEXT,
    github_url TEXT,
    demo_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read projects
CREATE POLICY "Anyone can read projects"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert projects (admin check done in frontend)
CREATE POLICY "Anyone can insert projects"
ON projects FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update projects
CREATE POLICY "Anyone can update projects"
ON projects FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow anyone to delete projects
CREATE POLICY "Anyone can delete projects"
ON projects FOR DELETE
TO anon, authenticated
USING (true);


-- =====================================================
-- STORAGE BUCKET FOR PHOTOS
-- =====================================================
-- Go to Storage in your Supabase Dashboard and:
-- 1. Click "New Bucket"
-- 2. Name it "photos"
-- 3. Make it PUBLIC (toggle on)
-- 4. Click "Create bucket"
--
-- Then add this policy (or do it via UI):

-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Allow public access to photos bucket
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
-- CREATE POLICY "Anyone can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
-- CREATE POLICY "Anyone can delete" ON storage.objects FOR DELETE USING (bucket_id = 'photos');
