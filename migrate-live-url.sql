-- Step 1: Add the live_url column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT;

-- Step 2: Populate live_url and clean brief_description for existing projects

UPDATE projects SET
    live_url = 'https://indian-duolingo-1.onrender.com/',
    brief_description = 'Duolingo supports only two Indian languages, so I built an Indian version that teaches Hindi, Kannada, Tamil, Telugu, Bengali, and Marathi through interactive exercises.'
WHERE id = 7;

UPDATE projects SET
    live_url = 'https://civic-dashboard-kappa.vercel.app/',
    brief_description = 'Turned BBMP complaint data into an interactive map showing how many complaints were made, resolved and still pending'
WHERE id = 5;

UPDATE projects SET
    live_url = 'https://03shraddha.github.io/blr-metro/',
    brief_description = 'Explore Bengaluru metro ridership patterns across every hour of the day'
WHERE id = 10;

UPDATE projects SET
    live_url = 'https://reading-links-fed4e.web.app/',
    brief_description = 'I built a map where you can see what people are reading worldwide'
WHERE id = 9;

UPDATE projects SET
    live_url = 'https://samachar-scan.vercel.app/',
    brief_description = 'Chat directly with newspapers in 22 Indian languages'
WHERE id = 2;

UPDATE projects SET
    live_url = 'https://03shraddha.github.io/resource-vs-gdp/',
    brief_description = 'what happens to a country''s economy after it strikes oil, diamonds, or copper? does it get rich? does it stay rich? does it get worse?'
WHERE id = 11;
