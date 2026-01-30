/**
 * Portfolio Website - Interactive Functionality
 * Handles navigation, tabs, scroll behavior, and content loading
 */

// 🔧 SUPABASE CONFIGURATION
const SUPABASE_URL = 'https://ptoykobcidzgewmtiomp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0b3lrb2JjaWR6Z2V3bXRpb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODQ0MDYsImV4cCI6MjA4NTE2MDQwNn0.7kP4Dk4paoIzGMfwYmswlyrQhSTSS-3qVMEPjrU0HvE';

// Supabase client - initialized later
let supabaseClient = null;

// Initialize Supabase client (called after DOM loads)
function initSupabase() {
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized');
        } else {
            console.warn('Supabase library not loaded');
        }
    } catch (err) {
        console.error('Failed to initialize Supabase:', err);
    }
}

// Admin password hash (SHA-256 of "admin361")
const ADMIN_PASSWORD_HASH = '0a9933ce1f3ee9195af9ac29566e786995291f9fbbe7630bc42fb1f04b67a7ab';

// Simple SHA-256 hash function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check for admin mode via URL parameter: ?admin=shraddha
async function checkAdminMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');

    if (adminParam === 'shraddha') {
        // Prompt for password
        const password = prompt('Enter admin password:');
        if (password) {
            const hashedInput = await sha256(password);
            if (hashedInput === ADMIN_PASSWORD_HASH) {
                localStorage.setItem('admin-authenticated', 'true');
                alert('Admin mode enabled! Page will reload.');
                // Reload page without the admin parameter to show admin UI
                window.location.href = window.location.pathname;
                return;
            } else {
                alert('Incorrect password');
                localStorage.removeItem('admin-authenticated');
            }
        }
    } else if (adminParam === 'logout') {
        localStorage.removeItem('admin-authenticated');
        alert('Admin mode disabled. Page will reload.');
        // Reload page to hide admin UI
        window.location.href = window.location.pathname;
        return;
    }
}

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Global error:', msg, 'at', url, lineNo, columnNo, error);
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    try {
        initSupabase();     // Initialize Supabase first
        checkAdminMode();   // Check admin mode
        loadContent();      // Load content from content.js
        initNavigation();
        initTabs();
        initScrollSpy();
        initCustomCursor(); // Custom cursor
        initProfilePhoto(); // Paper clip profile photo
        initPhotoGallery(); // Polaroid photo gallery
        initContentCalendar(); // Content consumption calendar
        initMobileMenu();   // Mobile hamburger menu
        initPageViewCounter(); // Page view counter
        initGuestbook();    // Virtual guestbook
        updateYear();
        console.log('All initialization complete');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

/**
 * Page View Counter
 * Uses Supabase database to track and display page views
 */
async function initPageViewCounter() {
    const viewCountSocial = document.getElementById('view-count-social');
    const viewCountFooter = document.getElementById('view-count');

    // Format number to short form (1.1K, 12.1K, 1.2M)
    function formatCount(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    }

    // Update display
    function updateDisplay(count) {
        const shortCount = formatCount(count);
        if (viewCountSocial) viewCountSocial.textContent = shortCount;
        if (viewCountFooter) viewCountFooter.textContent = count.toLocaleString();
    }

    // Check if Supabase is available
    if (!supabaseClient) {
        console.log('Supabase not available for page view counter');
        if (viewCountSocial) viewCountSocial.textContent = '--';
        return;
    }

    try {
        // Increment the view count using Supabase RPC or direct update
        // Using a simple table with page_id='main' for the main page counter
        const { data: currentData, error: fetchError } = await supabaseClient
            .from('page_views')
            .select('count')
            .eq('page_id', 'main')
            .single();

        if (fetchError && fetchError.code === 'PGRST116') {
            // Row doesn't exist, create it with count = 1
            const { data: newData, error: insertError } = await supabaseClient
                .from('page_views')
                .insert([{ page_id: 'main', count: 1 }])
                .select()
                .single();

            if (!insertError && newData) {
                updateDisplay(newData.count);
            } else {
                console.log('Error creating page view counter:', insertError);
                if (viewCountSocial) viewCountSocial.textContent = '1';
            }
        } else if (!fetchError && currentData) {
            // Increment the counter
            const newCount = currentData.count + 1;
            const { error: updateError } = await supabaseClient
                .from('page_views')
                .update({ count: newCount })
                .eq('page_id', 'main');

            if (!updateError) {
                updateDisplay(newCount);
            } else {
                console.log('Error updating page view counter:', updateError);
                updateDisplay(currentData.count);
            }
        } else {
            console.log('Error fetching page views:', fetchError);
            if (viewCountSocial) viewCountSocial.textContent = '--';
        }
    } catch (err) {
        console.log('Could not load view count:', err);
        if (viewCountSocial) viewCountSocial.textContent = '--';
    }
}

/**
 * Profile Photo - Paper frame with tape, photo upload
 * Photo stored in Supabase (admin only can upload)
 */
function initProfilePhoto() {
    const photoArea = document.getElementById('photo-area');
    const profilePhoto = document.getElementById('profile-photo');
    const placeholder = document.getElementById('photo-placeholder');
    const uploadInput = document.getElementById('profile-photo-upload');

    if (!photoArea || !profilePhoto) return;

    // Check if admin
    function isAdmin() {
        return localStorage.getItem('admin-authenticated') === 'true';
    }

    // Load photo from Supabase
    async function loadProfilePhoto() {
        if (!supabaseClient) return;

        try {
            const { data, error } = await supabaseClient
                .from('photos')
                .select('src')
                .eq('caption', 'profile_photo_main')
                .order('created_at', { ascending: false })
                .limit(1);

            if (!error && data && data.length > 0 && data[0].src) {
                displayPhoto(data[0].src);
            }
        } catch (err) {
            console.log('No profile photo found:', err);
        }
    }

    // Display photo
    function displayPhoto(src) {
        profilePhoto.src = src;
        profilePhoto.style.display = 'block';
        if (placeholder) placeholder.classList.add('hidden');
    }

    // Save photo to Supabase
    async function saveProfilePhoto(base64Data) {
        if (!supabaseClient || !isAdmin()) return false;

        try {
            // Delete existing profile photo first
            await supabaseClient
                .from('photos')
                .delete()
                .eq('caption', 'profile_photo_main');

            // Insert new photo
            const { error } = await supabaseClient
                .from('photos')
                .insert([{
                    src: base64Data,
                    category: 'digital',
                    caption: 'profile_photo_main'
                }]);

            if (error) {
                console.error('Error saving profile photo:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error saving profile photo:', err);
            return false;
        }
    }

    // Handle upload
    function handleUpload(file) {
        if (!isAdmin()) {
            console.log('Photo upload is admin only');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result;
            displayPhoto(base64);

            const saved = await saveProfilePhoto(base64);
            if (saved) {
                console.log('Profile photo saved');
            } else {
                alert('Failed to save photo');
            }
        };
        reader.readAsDataURL(file);
    }

    // Click handler - only trigger upload for admin
    photoArea.addEventListener('click', () => {
        if (isAdmin()) {
            uploadInput.click();
        }
    });

    // File input change
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleUpload(e.target.files[0]);
            }
        });
    }

    // Load photo on init
    loadProfilePhoto();
}

/**
 * Mobile Menu - Hamburger toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !sidebar) return;

    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        menuToggle.classList.add('active');
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        console.log('Cursor element not found');
        return;
    }

    // Simple mouse tracking
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Hover effect on clickable elements
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('a, button, .tab, .highlight')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.3)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('a, button, .tab, .highlight')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
}


/**
 * Load all content from the CONTENT object in content.js
 */
function loadContent() {
    console.log('loadContent called');
    if (typeof CONTENT === 'undefined') {
        console.error('CONTENT is undefined - content.js may not have loaded');
        return;
    }
    console.log('CONTENT loaded, name:', CONTENT.name);

    // Personal Info - Name with Kannada hover (in Hello section)
    const nameEl = document.getElementById('name');
    if (!nameEl) {
        console.error('Element #name not found');
        return;
    }
    nameEl.innerHTML = `<span class="name-english">${CONTENT.name}</span><span class="name-kannada">${CONTENT.nameKannada || ''}</span>`;

    // Hello section intro
    document.getElementById('hello-intro').innerHTML = CONTENT.helloIntro;
    document.getElementById('contact-line').innerHTML = CONTENT.contactLine;

    // Unique abilities as bullet points (now in Hello section)
    const abilitiesHtml = CONTENT.uniqueAbilities.map(ability => {
        if (ability.highlight && ability.url) {
            return `<li><a href="${ability.url}" ${ability.url.startsWith('http') ? 'target="_blank"' : ''} class="highlight ${ability.highlight}">${ability.text}</a></li>`;
        } else if (ability.highlight) {
            return `<li><span class="highlight ${ability.highlight}">${ability.text}</span></li>`;
        } else {
            return `<li>${ability.text}</li>`;
        }
    }).join('');
    document.getElementById('unique-abilities').innerHTML = abilitiesHtml;

    document.getElementById('resume-line').innerHTML = CONTENT.resumeLine;

    // Update Resume tab link (uses RESUME_URL constant from content.js)
    const resumeTabLink = document.getElementById('resume-tab-link');
    if (resumeTabLink && CONTENT.socialLinks.resume) {
        resumeTabLink.href = CONTENT.socialLinks.resume;
    }

    // About section content
    const about = CONTENT.aboutContent;
    const aboutHtml = `
        ${about.intro ? `<p class="about-intro"><strong>${about.intro}</strong></p>` : ''}
        <p>${about.mainText}</p>
        <p>${about.debateText}</p>

        <div class="about-subsection">
            <p><strong>${about.learnAboutMe.title}</strong></p>
            <ul class="about-list learn-about-list">
                ${about.learnAboutMe.items.map(item => `<li><a href="${item.url}" target="_blank" class="highlight ${item.highlight}">${item.text}</a> <em>${item.source}</em></li>`).join('')}
            </ul>
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.corporateStory.title}</h3>
            <p class="about-subtitle-meta">${about.corporateStory.subtitle}</p>
            ${about.corporateStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.background.title}</h3>
            <div class="background-content">
                <ul class="about-list background-preview">
                    ${about.background.items.slice(0, 2).map(item => `<li>${item}</li>`).join('')}
                </ul>
                <span class="background-ellipsis">...</span>
                <button class="background-toggle" data-expanded="false">Read more →</button>
                <ul class="about-list background-full">
                    ${about.background.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <button class="background-toggle-less">Show less ↑</button>
            </div>
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.beyondWork.title}</h3>
            <div class="beyond-work-content">
                <div class="beyond-work-grid beyond-work-preview">
                    ${about.beyondWork.items.slice(0, 2).map(item => `
                        <div class="beyond-work-item">
                            <span class="beyond-work-emoji">${item.emoji}</span>
                            <div>
                                <strong>${item.label}:</strong> ${item.text}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="beyond-work-toggle">Read more →</button>
                <div class="beyond-work-grid beyond-work-full">
                    ${about.beyondWork.items.map(item => `
                        <div class="beyond-work-item">
                            <span class="beyond-work-emoji">${item.emoji}</span>
                            <div>
                                <strong>${item.label}:</strong> ${item.text}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="beyond-work-toggle-less">Show less ↑</button>
            </div>
        </div>
    `;
    document.getElementById('about-content').innerHTML = aboutHtml;

    // Initialize background toggle
    initBackgroundToggle();

    // Initialize beyond work toggle
    initBeyondWorkToggle();

    // Social Links
    const social = CONTENT.socialLinks;
    document.getElementById('social-linkedin').href = social.linkedin;
    document.getElementById('social-twitter').href = social.twitter;
    document.getElementById('social-substack').href = social.substack;
    document.getElementById('social-email').href = `mailto:${social.email}`;

    // Experiences with expandable details
    const experiencesHtml = CONTENT.experiences.map((exp, index) => `
        <article class="experience-item" data-index="${index}">
            <div class="experience-header">
                <h3><a href="${exp.companyUrl}" ${exp.companyUrl.startsWith('http') ? 'target="_blank"' : ''} class="highlight peach">${exp.title}</a></h3>
                <span class="experience-date">${exp.date}</span>
            </div>
            <p class="experience-company">${exp.company}</p>
            <p class="experience-brief">${exp.briefDescription}</p>

            <div class="experience-expanded">
                ${exp.expandedContent}
            </div>

            <button class="experience-toggle" data-index="${index}">
                View project details <span class="toggle-arrow">→</span>
            </button>
        </article>
    `).join('');
    document.getElementById('experiences-list').innerHTML = experiencesHtml;

    // Initialize experience toggles
    initExperienceToggles();

    // Projects (for tabs) - Sticky note placeholder
    const projectsHtml = `
        <div class="projects-empty-state">
            <div class="sticky-note">
                <span class="sticky-note-emoji">🔨</span>
                <h3 class="sticky-note-title">Work in Progress</h3>
                <p class="sticky-note-text">
                    This space is for projects built while<br>
                    experimenting with AI tools.
                </p>
                <p class="sticky-note-cta">Check back soon to see what I'm building!</p>
            </div>
        </div>
    `;
    document.getElementById('projects-grid').innerHTML = projectsHtml;

    // Communities (for tabs) with expandable details
    const communitiesHtml = CONTENT.communities.map((c, index) => {
        const logoHtml = c.logo
            ? `<img src="${c.logo}" alt="${c.name} logo" class="community-logo" onerror="this.outerHTML='<span class=\\'community-emoji\\'>${c.fallbackEmoji || '🏢'}</span>'">`
            : `<span class="community-emoji">${c.fallbackEmoji || '🏢'}</span>`;

        return `
        <article class="content-card community-card" data-community-index="${index}">
            <span class="card-tag">Community</span>
            <div class="community-header">
                ${logoHtml}
                <h3><a href="${c.url}" target="_blank" class="highlight ${c.highlight}">${c.name}</a></h3>
            </div>
            <p class="community-brief">${c.briefDescription}</p>

            <div class="community-expanded">
                ${c.expandedContent}
            </div>

            <button class="community-toggle" data-community-index="${index}">
                View details <span class="toggle-arrow">→</span>
            </button>
        </article>
    `}).join('');
    document.getElementById('communities-grid').innerHTML = communitiesHtml;

    // Initialize community toggles
    initCommunityToggles();

    // Thoughts - Load from Substack RSS feed
    loadSubstackPosts();

    // Footer
    document.getElementById('footer-text').innerHTML = `${CONTENT.footer} · <span class="year">${new Date().getFullYear()}</span>`;
}

/**
 * Substack RSS Feed - Load posts for Thoughts section
 * Optimized: Shows cached/fallback content immediately, refreshes in background
 */
async function loadSubstackPosts() {
    const CACHE_KEY = 'substack-posts-cache';
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours cache
    const RSS_URL = 'https://shraddhaha.substack.com/feed';

    // Check cache first - show immediately if available (even if stale)
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        try {
            const { posts, timestamp } = JSON.parse(cached);
            renderThoughtsPosts(posts);

            // If cache is still fresh, we're done
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                return;
            }
            // Otherwise, continue to refresh in background (content already shown)
        } catch (e) {
            // Invalid cache, continue to fetch
        }
    } else {
        // No cache - show fallback immediately while loading
        renderThoughtsFallback();
    }

    // Fetch fresh data in background
    fetchSubstackInBackground(RSS_URL, CACHE_KEY);
}

// Background fetch - doesn't block UI
async function fetchSubstackInBackground(RSS_URL, CACHE_KEY) {
    // Multiple CORS proxies as fallbacks
    const CORS_PROXIES = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?'
    ];

    for (const proxy of CORS_PROXIES) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

            const response = await fetch(proxy + encodeURIComponent(RSS_URL), {
                signal: controller.signal
            });
            clearTimeout(timeout);

            let data;
            if (proxy.includes('allorigins')) {
                data = await response.json();
                if (!data.contents) continue;
                data = data.contents;
            } else {
                data = await response.text();
            }

            // Parse XML
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'text/xml');
            const items = xml.querySelectorAll('item');

            if (items.length === 0) continue;

            const posts = [];
            items.forEach((item, index) => {
                if (index >= 10) return;

                const title = item.querySelector('title')?.textContent || 'Untitled';
                const link = item.querySelector('link')?.textContent || '#';
                const pubDate = item.querySelector('pubDate')?.textContent;

                let formattedDate = '';
                if (pubDate) {
                    const date = new Date(pubDate);
                    formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                }

                posts.push({ title, link, date: formattedDate });
            });

            // Cache the results
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                posts,
                timestamp: Date.now()
            }));

            // Update UI with fresh data
            renderThoughtsPosts(posts);
            return; // Success, exit

        } catch (error) {
            console.log(`Proxy ${proxy} failed:`, error.message);
            continue; // Try next proxy
        }
    }
    // All proxies failed - keep showing cached/fallback content
    console.log('All Substack proxies failed, using cached/fallback content');
}

function renderThoughtsPosts(posts) {
    if (!posts || posts.length === 0) {
        renderThoughtsFallback();
        return;
    }

    const postsHtml = posts.map((post, index) => `
        <li class="thoughts-item">
            <span class="thoughts-number">${index + 1}.</span>
            <div class="thoughts-content">
                <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="thoughts-title">${post.title}</a>
                ${post.date ? `<span class="thoughts-date">${post.date}</span>` : ''}
            </div>
        </li>
    `).join('');

    const thoughtsHtml = `
        <ol class="thoughts-posts-list">
            ${postsHtml}
        </ol>
        <a href="https://shraddhaha.substack.com" target="_blank" rel="noopener noreferrer" class="thoughts-view-all">
            View all posts on Substack →
        </a>
    `;

    document.getElementById('thoughts-list').innerHTML = thoughtsHtml;
}

function renderThoughtsFallback() {
    // Fallback to static content from CONTENT.thoughts
    const thoughtsByYear = {};
    CONTENT.thoughts.forEach(thought => {
        if (!thoughtsByYear[thought.year]) {
            thoughtsByYear[thought.year] = [];
        }
        thoughtsByYear[thought.year].push(thought);
    });

    const thoughtsHtml = Object.keys(thoughtsByYear)
        .sort((a, b) => b - a)
        .map(year => `
            <div class="thoughts-year-group">
                <span class="thoughts-year-label">${year}</span>
                <ul class="thoughts-links">
                    ${thoughtsByYear[year].map(t => `
                        <li><a href="${t.url}" target="_blank" rel="noopener noreferrer">${t.title}</a></li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

    document.getElementById('thoughts-list').innerHTML = thoughtsHtml + `
        <a href="https://shraddhaha.substack.com" target="_blank" rel="noopener noreferrer" class="thoughts-view-all">
            View all posts on Substack →
        </a>
    `;
}

/**
 * Experience Toggle - Expand/Collapse project details
 */
function initExperienceToggles() {
    const toggleBtns = document.querySelectorAll('.experience-toggle');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            const card = document.querySelector(`.experience-item[data-index="${index}"]`);
            const expanded = card.querySelector('.experience-expanded');
            const isExpanded = expanded.classList.contains('active');

            if (isExpanded) {
                // Collapse
                expanded.classList.remove('active');
                btn.innerHTML = 'View project details <span class="toggle-arrow">→</span>';
            } else {
                // Expand
                expanded.classList.add('active');
                btn.innerHTML = 'View less <span class="toggle-arrow">↑</span>';

                // Scroll to keep card header visible
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

/**
 * Project Toggle - Expand/Collapse project details
 */
function initProjectToggles() {
    const toggleBtns = document.querySelectorAll('.project-toggle');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.projectIndex;
            const card = document.querySelector(`.project-card[data-project-index="${index}"]`);
            const expanded = card.querySelector('.project-expanded');
            const isExpanded = expanded.classList.contains('active');

            if (isExpanded) {
                // Collapse
                expanded.classList.remove('active');
                btn.innerHTML = 'View details <span class="toggle-arrow">→</span>';
            } else {
                // Expand
                expanded.classList.add('active');
                btn.innerHTML = 'View less <span class="toggle-arrow">↑</span>';

                // Scroll to keep card header visible
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

/**
 * Background Toggle - Expand/Collapse "A Little Bit of This" section
 */
function initBackgroundToggle() {
    const readMoreBtn = document.querySelector('.background-toggle');
    const showLessBtn = document.querySelector('.background-toggle-less');
    const preview = document.querySelector('.background-preview');
    const full = document.querySelector('.background-full');
    const ellipsis = document.querySelector('.background-ellipsis');

    if (!readMoreBtn || !showLessBtn) return;

    readMoreBtn.addEventListener('click', () => {
        preview.classList.add('hidden');
        ellipsis.classList.add('hidden');
        readMoreBtn.classList.add('hidden');
        full.classList.add('active');
        showLessBtn.classList.add('active');
    });

    showLessBtn.addEventListener('click', () => {
        full.classList.remove('active');
        showLessBtn.classList.remove('active');
        preview.classList.remove('hidden');
        ellipsis.classList.remove('hidden');
        readMoreBtn.classList.remove('hidden');
    });
}

/**
 * Beyond Work Toggle - Expand/Collapse "What Fills My Cup" section
 */
function initBeyondWorkToggle() {
    const readMoreBtn = document.querySelector('.beyond-work-toggle');
    const showLessBtn = document.querySelector('.beyond-work-toggle-less');
    const preview = document.querySelector('.beyond-work-preview');
    const full = document.querySelector('.beyond-work-full');

    if (!readMoreBtn || !showLessBtn) return;

    readMoreBtn.addEventListener('click', () => {
        preview.classList.add('hidden');
        readMoreBtn.classList.add('hidden');
        full.classList.add('active');
        showLessBtn.classList.add('active');
    });

    showLessBtn.addEventListener('click', () => {
        full.classList.remove('active');
        showLessBtn.classList.remove('active');
        preview.classList.remove('hidden');
        readMoreBtn.classList.remove('hidden');
    });
}

/**
 * Community Toggle - Expand/Collapse community details
 */
function initCommunityToggles() {
    const toggleBtns = document.querySelectorAll('.community-toggle');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.communityIndex;
            const card = document.querySelector(`.community-card[data-community-index="${index}"]`);
            const expanded = card.querySelector('.community-expanded');
            const isExpanded = expanded.classList.contains('active');

            if (isExpanded) {
                // Collapse
                expanded.classList.remove('active');
                btn.innerHTML = 'View details <span class="toggle-arrow">→</span>';
            } else {
                // Expand
                expanded.classList.add('active');
                btn.innerHTML = 'View less <span class="toggle-arrow">↑</span>';

                // Scroll to keep card header visible
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

/**
 * Navigation - Smooth scroll and active states
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Get offset for fixed header on mobile
                const offset = window.innerWidth <= 900 ? 80 : 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active state immediately for better UX
                updateActiveNav(link);
            }
        });
    });
}

/**
 * Update active navigation link
 */
function updateActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * Scroll Spy - Update navigation based on scroll position
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Throttle scroll events for performance
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollSpy(sections, navLinks);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    updateScrollSpy(sections, navLinks);
}

/**
 * Update scroll spy state
 */
function updateScrollSpy(sections, navLinks) {
    const scrollPosition = window.scrollY;
    const offset = window.innerWidth <= 900 ? 120 : 200;

    let currentSection = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    // If we're at the bottom of the page, activate the last section
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentSection = sections[sections.length - 1].id;
    }

    // If no section is found and we're near the top, default to first section
    if (!currentSection && scrollPosition < 200) {
        currentSection = sections[0]?.id;
    }

    if (currentSection) {
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

/**
 * Tab Navigation
 */
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Update tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update tab content
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Update footer year
 */
function updateYear() {
    const yearSpan = document.querySelector('.year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Optional: Add intersection observer for scroll animations
 * Uncomment if you want sections to animate as they come into view
 */
/*
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}
*/

/**
 * Optional: Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Press 'j' to go to next section, 'k' for previous
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const sections = Array.from(document.querySelectorAll('.section'));
    const currentActive = document.querySelector('.nav-link.active');
    const currentIndex = sections.findIndex(s => s.id === currentActive?.getAttribute('data-section'));

    let nextIndex;

    if (e.key === 'j' && currentIndex < sections.length - 1) {
        nextIndex = currentIndex + 1;
    } else if (e.key === 'k' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
    }

    if (nextIndex !== undefined) {
        const targetSection = sections[nextIndex];
        const offset = window.innerWidth <= 900 ? 80 : 0;

        window.scrollTo({
            top: targetSection.offsetTop - offset,
            behavior: 'smooth'
        });
    }
});

/**
 * Polaroid Photo Gallery
 * Upload, edit, and display photos in a Polaroid style
 * Admin-only upload functionality
 */
function initPhotoGallery() {
    const gallery = document.getElementById('polaroid-gallery');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const photoUpload = document.getElementById('photo-upload');
    const modal = document.getElementById('photo-editor-modal');
    const previewImg = document.getElementById('photo-preview-img');
    const cropArea = document.getElementById('photo-crop-area');
    const zoomSlider = document.getElementById('photo-zoom');
    const captionInput = document.getElementById('photo-caption');
    const categorySelect = document.getElementById('photo-category');
    const saveBtn = document.getElementById('photo-save-btn');
    const cancelBtn = document.getElementById('photo-cancel-btn');
    const photoTabs = document.querySelectorAll('.photo-tab');

    if (!gallery) return;

    let currentCategory = 'polaroids';
    let photos = { polaroids: [], film: [], digital: [] };
    let currentEditingPhoto = null;
    let imgPosition = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    // Check if user is admin (logged in via admin panel)
    function isAdmin() {
        return localStorage.getItem('admin-authenticated') === 'true';
    }

    // Show/hide admin-only elements
    function updateAdminUI() {
        const isAdminUser = isAdmin();
        if (addPhotoBtn) {
            addPhotoBtn.style.display = isAdminUser ? 'block' : 'none';
        }
    }

    // Load photos from Supabase
    async function loadPhotosFromSupabase() {
        if (!supabaseClient) {
            console.warn('Supabase not available, returning empty photos');
            return { polaroids: [], film: [], digital: [] };
        }
        try {
            const { data, error } = await supabaseClient
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading photos from Supabase:', error);
                return { polaroids: [], film: [], digital: [] };
            }

            // Group by category
            const grouped = { polaroids: [], film: [], digital: [] };
            (data || []).forEach(photo => {
                const category = photo.category || 'polaroids';
                if (!grouped[category]) grouped[category] = [];
                grouped[category].push({
                    id: photo.id,
                    src: photo.src,
                    caption: photo.caption || '',
                    zoom: photo.zoom || 100,
                    posX: photo.pos_x || 0,
                    posY: photo.pos_y || 0
                });
            });

            console.log('Loaded photos from Supabase');
            return grouped;
        } catch (err) {
            console.error('Error loading photos:', err);
            return { polaroids: [], film: [], digital: [] };
        }
    }

    // Upload image to Supabase Storage
    async function uploadImageToSupabase(base64Data) {
        if (!supabaseClient) {
            console.warn('Supabase not available');
            return null;
        }
        try {
            // Convert base64 to blob
            const response = await fetch(base64Data);
            const blob = await response.blob();

            // Generate unique filename
            const filename = `photo_${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;

            // Upload to Supabase Storage
            const { data, error } = await supabaseClient.storage
                .from('photos')
                .upload(filename, blob, {
                    contentType: blob.type,
                    upsert: false
                });

            if (error) {
                console.error('Error uploading image:', error);
                return null;
            }

            // Get public URL
            const { data: urlData } = supabaseClient.storage
                .from('photos')
                .getPublicUrl(filename);

            return urlData.publicUrl;
        } catch (err) {
            console.error('Error uploading image:', err);
            return null;
        }
    }

    // Save photo metadata to Supabase
    async function savePhotoToSupabase(photoData) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('photos')
                .insert([{
                    src: photoData.src,
                    caption: photoData.caption,
                    category: photoData.category,
                    zoom: photoData.zoom,
                    pos_x: photoData.posX,
                    pos_y: photoData.posY
                }])
                .select();

            if (error) {
                console.error('Error saving photo:', error);
                return null;
            }

            return data[0];
        } catch (err) {
            console.error('Error saving photo:', err);
            return null;
        }
    }

    // Update photo caption in Supabase
    async function updatePhotoCaptionInSupabase(photoId, caption) {
        if (!supabaseClient) return;
        try {
            const { error } = await supabaseClient
                .from('photos')
                .update({ caption })
                .eq('id', photoId);

            if (error) {
                console.error('Error updating caption:', error);
            }
        } catch (err) {
            console.error('Error updating caption:', err);
        }
    }

    // Delete photo from Supabase
    async function deletePhotoFromSupabase(photoId) {
        if (!supabaseClient) return false;
        try {
            const { error } = await supabaseClient
                .from('photos')
                .delete()
                .eq('id', photoId);

            if (error) {
                console.error('Error deleting photo:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error deleting photo:', err);
            return false;
        }
    }

    // Initialize - load photos
    async function initialize() {
        photos = await loadPhotosFromSupabase();
        updateAdminUI();
        renderGallery();
    }

    // Render gallery for current category
    function renderGallery() {
        const categoryPhotos = photos[currentCategory] || [];
        const isAdminUser = isAdmin();

        if (categoryPhotos.length === 0) {
            // Show empty polaroid templates
            const emptyPolaroids = [
                { caption: 'coming soon...' },
                { caption: 'memories loading...' },
                { caption: 'watch this space' }
            ];
            gallery.innerHTML = emptyPolaroids.map(p => `
                <div class="polaroid polaroid-empty">
                    <div class="polaroid-image polaroid-placeholder">
                        <span class="polaroid-placeholder-icon">📷</span>
                    </div>
                    <div class="polaroid-caption-display">${p.caption}</div>
                </div>
            `).join('');
            return;
        }

        gallery.innerHTML = categoryPhotos.map((photo, index) => `
            <div class="polaroid" data-id="${photo.id}">
                <div class="polaroid-image">
                    <img src="${photo.src}" alt="${photo.caption || 'Polaroid'}"
                         style="object-fit: contain; transform: scale(${photo.zoom / 100}) translate(${photo.posX || 0}px, ${photo.posY || 0}px);">
                </div>
                <div class="polaroid-caption-display">${photo.caption || ''}</div>
                ${isAdminUser ? `
                    <input type="text" class="polaroid-caption admin-only" value="${photo.caption || ''}"
                           placeholder="add caption..." data-id="${photo.id}">
                    <button class="polaroid-delete admin-only" data-id="${photo.id}">&times;</button>
                ` : ''}
            </div>
        `).join('');

        // Add event listeners for captions (admin only)
        if (isAdminUser) {
            gallery.querySelectorAll('.polaroid-caption.admin-only').forEach(input => {
                input.addEventListener('change', (e) => {
                    const photoId = parseInt(e.target.dataset.id);
                    updateCaption(photoId, e.target.value);
                });
                input.addEventListener('click', (e) => e.stopPropagation());
            });

            // Add event listeners for delete buttons (admin only)
            gallery.querySelectorAll('.polaroid-delete.admin-only').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const photoId = parseInt(e.target.dataset.id);
                    deletePhoto(photoId);
                });
            });
        }
    }

    // Update caption
    async function updateCaption(photoId, caption) {
        const categoryPhotos = photos[currentCategory];
        const photo = categoryPhotos.find(p => p.id === photoId);
        if (photo) {
            photo.caption = caption;
            await updatePhotoCaptionInSupabase(photoId, caption);
        }
    }

    // Delete photo
    async function deletePhoto(photoId) {
        if (confirm('Delete this photo?')) {
            const deleted = await deletePhotoFromSupabase(photoId);
            if (deleted) {
                photos[currentCategory] = photos[currentCategory].filter(p => p.id !== photoId);
                renderGallery();
            } else {
                alert('Failed to delete photo. Please try again.');
            }
        }
    }

    // Photo tab switching
    photoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            photoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.photoTab;
            renderGallery();
        });
    });

    // Add photo button
    addPhotoBtn.addEventListener('click', () => {
        photoUpload.click();
    });

    // File selected
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            currentEditingPhoto = {
                src: event.target.result,
                zoom: 100,
                posX: 0,
                posY: 0,
                caption: ''
            };
            imgPosition = { x: 0, y: 0 };
            zoomSlider.value = 100;
            captionInput.value = '';
            categorySelect.value = currentCategory;
            updatePreviewTransform();
            modal.classList.add('active');
        };
        reader.readAsDataURL(file);
        photoUpload.value = ''; // Reset input
    });

    // Update preview image transform
    function updatePreviewTransform() {
        const zoom = zoomSlider.value / 100;
        previewImg.style.transform = `translate(-50%, -50%) scale(${zoom}) translate(${imgPosition.x}px, ${imgPosition.y}px)`;
    }

    // Zoom slider
    zoomSlider.addEventListener('input', () => {
        updatePreviewTransform();
    });

    // Image dragging in crop area
    cropArea.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart = { x: e.clientX - imgPosition.x, y: e.clientY - imgPosition.y };
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        imgPosition.x = e.clientX - dragStart.x;
        imgPosition.y = e.clientY - dragStart.y;
        updatePreviewTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch support for mobile
    cropArea.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        dragStart = { x: touch.clientX - imgPosition.x, y: touch.clientY - imgPosition.y };
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        imgPosition.x = touch.clientX - dragStart.x;
        imgPosition.y = touch.clientY - dragStart.y;
        updatePreviewTransform();
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Save photo
    saveBtn.addEventListener('click', async () => {
        if (!currentEditingPhoto) return;

        // Show loading state
        const originalBtnText = saveBtn.textContent;
        saveBtn.textContent = 'Uploading...';
        saveBtn.disabled = true;

        // Upload image to Supabase Storage
        const imageUrl = await uploadImageToSupabase(currentEditingPhoto.src);

        if (!imageUrl) {
            alert('Failed to upload image. Please try again.');
            saveBtn.textContent = originalBtnText;
            saveBtn.disabled = false;
            return;
        }

        const category = categorySelect.value;

        // Save photo metadata to Supabase
        const savedPhoto = await savePhotoToSupabase({
            src: imageUrl,
            caption: captionInput.value,
            category: category,
            zoom: parseInt(zoomSlider.value),
            posX: imgPosition.x,
            posY: imgPosition.y
        });

        // Reset button
        saveBtn.textContent = originalBtnText;
        saveBtn.disabled = false;

        if (savedPhoto) {
            // Add to local photos array
            if (!photos[category]) photos[category] = [];
            photos[category].unshift({
                id: savedPhoto.id,
                src: savedPhoto.src,
                caption: savedPhoto.caption || '',
                zoom: savedPhoto.zoom || 100,
                posX: savedPhoto.pos_x || 0,
                posY: savedPhoto.pos_y || 0
            });

            // Switch to the category where photo was saved
            currentCategory = category;
            photoTabs.forEach(t => {
                t.classList.toggle('active', t.dataset.photoTab === category);
            });

            modal.classList.remove('active');
            currentEditingPhoto = null;
            renderGallery();
        } else {
            alert('Failed to save photo. Please try again.');
        }
    });

    // Cancel
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        currentEditingPhoto = null;
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            currentEditingPhoto = null;
        }
    });

    // Initial render - use async initialize
    initialize();
}

/**
 * Content Calendar
 * Calendar-based content consumption tracker
 */
function initContentCalendar() {
    const calendarView = document.getElementById('content-calendar-view');
    const listView = document.getElementById('content-list-view');
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonthEl = document.querySelector('.calendar-month');
    const prevBtn = document.querySelector('.calendar-nav.prev');
    const nextBtn = document.querySelector('.calendar-nav.next');
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    const addContentBtn = document.getElementById('add-content-btn');
    const addContentModal = document.getElementById('add-content-modal');
    const dayPanel = document.getElementById('content-day-panel');
    const detailView = document.getElementById('content-detail-view');
    const fabBtn = document.getElementById('fab-add-content');
    const categoryPills = document.querySelectorAll('.category-pill');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (!calendarGrid) return;

    // Check admin mode and show add button
    const isAdminUser = localStorage.getItem('admin-authenticated') === 'true';
    if (addContentBtn && isAdminUser) {
        addContentBtn.style.display = 'inline-block';
    }

    // State
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let contentEntries = [];
    let selectedCategory = 'article';
    let isLoading = true;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Category to highlight color mapping
    const categoryHighlights = {
        'article': 'peach',
        'video': 'blue',
        'book': 'lavender',
        'podcast': 'blue',
        'newsletter': 'peach'
    };

    // Load content from Supabase
    async function loadContentFromSupabase() {
        if (!supabaseClient) {
            console.warn('Supabase not available, returning empty content');
            return [];
        }
        try {
            const { data, error } = await supabaseClient
                .from('content_entries')
                .select('*')
                .order('date', { ascending: false });

            if (error) {
                console.error('Error loading content from Supabase:', error);
                return [];
            }

            // Map to expected format
            return (data || []).map(entry => ({
                id: entry.id,
                date: entry.date,
                title: entry.title,
                url: entry.url,
                source: entry.source,
                category: entry.category,
                thoughts: entry.thoughts,
                addedAt: entry.added_at
            }));
        } catch (err) {
            console.error('Error loading content:', err);
            return [];
        }
    }

    // Save content entry to Supabase
    async function saveContentToSupabase(entry) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('content_entries')
                .insert([{
                    date: entry.date,
                    title: entry.title,
                    url: entry.url,
                    source: entry.source,
                    category: entry.category,
                    thoughts: entry.thoughts
                }])
                .select();

            if (error) {
                console.error('Error saving content:', error);
                return null;
            }

            return data[0];
        } catch (err) {
            console.error('Error saving content:', err);
            return null;
        }
    }

    // Delete content entry from Supabase
    async function deleteContentFromSupabase(entryId) {
        if (!supabaseClient) return false;
        try {
            const { error } = await supabaseClient
                .from('content_entries')
                .delete()
                .eq('id', entryId);

            if (error) {
                console.error('Error deleting content:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error deleting content:', err);
            return false;
        }
    }

    // Initialize - load data and render
    async function initialize() {
        isLoading = true;
        try {
            contentEntries = await loadContentFromSupabase();
        } catch (err) {
            console.error('Error loading content:', err);
            contentEntries = [];
        }
        isLoading = false;
        console.log('Calendar initialized with', contentEntries.length, 'entries');
        renderCalendar();
    }

    // Get entries for a specific date
    function getEntriesForDate(dateStr) {
        return contentEntries.filter(entry => entry.date === dateStr);
    }

    // Get entry by ID
    function getEntryById(id) {
        return contentEntries.find(entry => entry.id === id);
    }

    // Format date as YYYY-MM-DD
    function formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Format date for display
    function formatDateDisplay(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Render calendar grid
    function renderCalendar() {
        calendarMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const today = new Date();
        const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

        let html = '';

        // Empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDate(currentYear, currentMonth, day);
            const entries = getEntriesForDate(dateStr);
            const isToday = dateStr === todayStr;
            const hasContent = entries.length > 0;

            // Get day of week (0 = Sunday, 6 = Saturday)
            const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
            const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasContent) classes += ` has-content day-${dayNames[dayOfWeek]}`;

            let dotsHtml = '';
            if (hasContent) {
                // Show up to 4 dots
                const displayEntries = entries.slice(0, 4);
                dotsHtml = '<div class="calendar-day-dots">';
                displayEntries.forEach(entry => {
                    dotsHtml += `<span class="content-dot ${entry.category}"></span>`;
                });
                if (entries.length > 4) {
                    dotsHtml += `<span class="content-dot" style="background: var(--color-text-muted)">+</span>`;
                }
                dotsHtml += '</div>';
            }

            // Tooltip with titles
            let tooltipHtml = '';
            if (hasContent) {
                const titles = entries.map(e => e.title).slice(0, 2);
                let tooltipText = titles.join(', ');
                if (entries.length > 2) tooltipText += ` +${entries.length - 2} more`;
                tooltipHtml = `<div class="calendar-day-tooltip">${tooltipText}</div>`;
            }

            html += `
                <div class="${classes}" data-date="${dateStr}">
                    <span class="calendar-day-number">${day}</span>
                    ${dotsHtml}
                    ${tooltipHtml}
                </div>
            `;
        }

        calendarGrid.innerHTML = html;

        // Add click handlers to days - switch to list view and scroll to date
        calendarGrid.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dateStr = dayEl.dataset.date;
                switchToListViewWithHighlight(dateStr);
            });
        });
    }

    // Switch to list view and highlight/scroll to a specific date
    function switchToListViewWithHighlight(dateStr) {
        // Switch to list view
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        const listBtn = document.querySelector('.view-toggle-btn[data-view="list"]');
        if (listBtn) listBtn.classList.add('active');

        calendarView.classList.add('hidden');
        listView.classList.remove('hidden');

        // Render list view with date grouping and highlight
        renderListView(dateStr);

        // Scroll to the highlighted date after a brief delay for DOM update
        setTimeout(() => {
            const highlightedGroup = document.querySelector('.content-date-group.highlighted');
            if (highlightedGroup) {
                highlightedGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    // Open day detail panel
    function openDayPanel(dateStr) {
        const entries = getEntriesForDate(dateStr);
        const panelDate = dayPanel.querySelector('.panel-date');
        const panelItems = dayPanel.querySelector('.panel-items');

        panelDate.textContent = formatDateDisplay(dateStr);

        if (entries.length === 0) {
            panelItems.innerHTML = `
                <div class="panel-empty">
                    No content consumed on this day.<br>
                    Click "+ Add Content" to add something!
                </div>
            `;
        } else {
            panelItems.innerHTML = entries.map(entry => `
                <div class="panel-item" data-entry-id="${entry.id}">
                    <span class="panel-item-category ${entry.category}">${entry.category}</span>
                    <a href="javascript:void(0)" class="panel-item-title" data-entry-id="${entry.id}">${entry.title}</a>
                    ${entry.source ? `<div class="panel-item-source">${entry.source}</div>` : ''}
                    ${entry.thoughts ? `<div class="panel-item-description">${entry.thoughts.substring(0, 80)}${entry.thoughts.length > 80 ? '...' : ''}</div>` : ''}
                </div>
            `).join('');

            // Add click handlers to open detail view
            panelItems.querySelectorAll('.panel-item-title').forEach(titleEl => {
                titleEl.addEventListener('click', () => {
                    const entryId = parseInt(titleEl.dataset.entryId);
                    openDetailView(entryId);
                });
            });
        }

        dayPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close day panel
    function closeDayPanel() {
        dayPanel.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open content detail view
    function openDetailView(entryId) {
        const entry = getEntryById(entryId);
        if (!entry) return;

        // Close day panel first
        closeDayPanel();

        // Populate detail view
        document.getElementById('detail-title').textContent = entry.title;
        document.getElementById('detail-source').textContent = entry.source || 'Unknown Source';
        document.getElementById('detail-date').textContent = `Read on ${formatDateDisplay(entry.date)}`;

        const categoryEl = document.getElementById('detail-category');
        categoryEl.textContent = entry.category.charAt(0).toUpperCase() + entry.category.slice(1);
        categoryEl.className = `detail-category ${entry.category}`;

        const linkEl = document.getElementById('detail-link');
        linkEl.href = entry.url;

        const thoughtsEl = document.getElementById('detail-thoughts');
        if (entry.thoughts && entry.thoughts.trim()) {
            // Convert line breaks to paragraphs
            const paragraphs = entry.thoughts.split('\n\n').filter(p => p.trim());
            thoughtsEl.innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
        } else {
            thoughtsEl.innerHTML = `<p class="detail-no-thoughts">No thoughts recorded for this content yet.</p>`;
        }

        // Show detail view
        detailView.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close detail view
    function closeDetailView() {
        detailView.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Detail view back button
    const detailBackBtn = document.getElementById('detail-back-btn');
    if (detailBackBtn) {
        detailBackBtn.addEventListener('click', closeDetailView);
    }

    // Panel close handlers
    dayPanel.querySelector('.panel-close').addEventListener('click', closeDayPanel);
    dayPanel.querySelector('.panel-overlay').addEventListener('click', closeDayPanel);

    // Navigation
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // View toggle
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            viewToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (view === 'calendar') {
                calendarView.classList.remove('hidden');
                listView.classList.add('hidden');
            } else {
                calendarView.classList.add('hidden');
                listView.classList.remove('hidden');
                renderListView();
            }
        });
    });

    // Render list view (grouped by date) - with optional highlight for a specific date
    function renderListView(highlightDate = null) {
        const consumeList = document.getElementById('consume-list');
        if (!consumeList) return;

        const allEntries = [...contentEntries];
        allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allEntries.length === 0) {
            consumeList.innerHTML = '<div class="content-list-empty">No content yet. Add some recommendations!</div>';
            return;
        }

        // Group entries by date
        const groupedByDate = {};
        allEntries.forEach(entry => {
            const date = entry.date;
            if (!groupedByDate[date]) {
                groupedByDate[date] = [];
            }
            groupedByDate[date].push(entry);
        });

        // Sort dates in descending order
        const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

        // Build HTML with date groups
        let html = '';
        sortedDates.forEach(date => {
            const entries = groupedByDate[date];
            const isHighlighted = highlightDate === date;
            const displayDate = formatDateDisplay(date);

            html += `
                <div class="content-date-group${isHighlighted ? ' highlighted' : ''}" data-date="${date}">
                    <div class="content-date-header">${displayDate}</div>
                    <ul class="content-clean-list">
                        ${entries.map(entry => `
                            <li class="content-clean-item">
                                <span class="content-item-category ${entry.category}">${entry.category}</span>
                                <a href="${entry.url && entry.url !== '#' ? entry.url : 'javascript:void(0)'}"
                                   ${entry.url && entry.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}
                                   class="content-clean-link${!entry.url || entry.url === '#' ? ' list-item-link' : ''}"
                                   data-entry-id="${entry.id}">${entry.title}</a>
                                ${entry.source ? `<span class="content-clean-source">— ${entry.source}</span>` : ''}
                                ${isAdminUser ? `
                                    <span class="content-admin-actions">
                                        <button class="content-edit-btn" data-entry-id="${entry.id}" title="Edit">✏️</button>
                                        <button class="content-delete-btn" data-entry-id="${entry.id}" title="Delete">🗑️</button>
                                    </span>
                                ` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        consumeList.innerHTML = html;

        // Add click handlers to items without URLs to open detail view
        consumeList.querySelectorAll('.list-item-link').forEach(link => {
            link.addEventListener('click', () => {
                const entryId = parseInt(link.dataset.entryId);
                openDetailView(entryId);
            });
        });

        // Add edit button handlers (admin only)
        if (isAdminUser) {
            consumeList.querySelectorAll('.content-edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const entryId = parseInt(btn.dataset.entryId);
                    openEditModal(entryId);
                });
            });

            consumeList.querySelectorAll('.content-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const entryId = parseInt(btn.dataset.entryId);
                    deleteEntry(entryId);
                });
            });
        }

        // Remove highlight after a few seconds
        if (highlightDate) {
            setTimeout(() => {
                const highlightedGroup = consumeList.querySelector('.content-date-group.highlighted');
                if (highlightedGroup) {
                    highlightedGroup.classList.remove('highlighted');
                    highlightedGroup.classList.add('highlight-fade');
                }
            }, 3000);
        }
    }

    // Add Content Modal elements
    const dateInput = document.getElementById('content-date');
    const titleInput = document.getElementById('content-title');
    const urlInput = document.getElementById('content-url');
    const categoryInput = document.getElementById('content-category');
    const sourceInput = document.getElementById('content-source');
    const thoughtsInput = document.getElementById('content-thoughts');
    const saveBtn = document.getElementById('content-save');
    const cancelBtn = document.getElementById('content-cancel');

    // Set default date to today
    function setDefaultDate() {
        const today = new Date();
        dateInput.value = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    }

    // Reset form
    function resetForm() {
        setDefaultDate();
        titleInput.value = '';
        urlInput.value = '';
        sourceInput.value = '';
        if (thoughtsInput) thoughtsInput.value = '';
        selectedCategory = 'article';
        categoryInput.value = 'article';

        // Reset category pills
        categoryPills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.category === 'article');
        });
    }

    // Open modal function
    function openAddModal() {
        resetForm();
        addContentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => titleInput.focus(), 100);
    }

    // Close modal function
    function closeAddModal() {
        addContentModal.classList.remove('active');
        document.body.style.overflow = '';
        editingEntryId = null; // Reset editing state
    }

    // Track if we're editing an existing entry
    let editingEntryId = null;

    // Open edit modal with existing entry data
    function openEditModal(entryId) {
        const entry = getEntryById(entryId);
        if (!entry) return;

        editingEntryId = entryId;

        // Populate form with entry data
        dateInput.value = entry.date;
        titleInput.value = entry.title || '';
        urlInput.value = entry.url || '';
        sourceInput.value = entry.source || '';
        if (thoughtsInput) thoughtsInput.value = entry.thoughts || '';

        // Set category
        selectedCategory = entry.category || 'article';
        categoryInput.value = selectedCategory;
        categoryPills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.category === selectedCategory);
        });

        // Update modal title
        const modalTitle = addContentModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Edit Content';

        // Update save button text
        if (saveBtn) saveBtn.textContent = 'Update Content';

        addContentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => titleInput.focus(), 100);
    }

    // Delete entry
    async function deleteEntry(entryId) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        const success = await deleteContentFromSupabase(entryId);
        if (success) {
            // Remove from local array
            contentEntries = contentEntries.filter(e => e.id !== entryId);
            renderCalendar();
            renderListView();
        } else {
            alert('Failed to delete entry. Please try again.');
        }
    }

    // Update content in Supabase
    async function updateContentInSupabase(entryId, entry) {
        if (!supabaseClient) return false;
        try {
            const { error } = await supabaseClient
                .from('content_entries')
                .update({
                    date: entry.date,
                    title: entry.title,
                    url: entry.url,
                    source: entry.source,
                    category: entry.category,
                    thoughts: entry.thoughts
                })
                .eq('id', entryId);

            if (error) {
                console.error('Error updating content:', error);
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error updating content:', err);
            return false;
        }
    }

    // Category pill selection
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedCategory = pill.dataset.category;
            categoryInput.value = selectedCategory;
        });
    });

    // Desktop add button
    if (addContentBtn) {
        addContentBtn.addEventListener('click', openAddModal);
    }

    // FAB button (mobile)
    if (fabBtn) {
        fabBtn.addEventListener('click', openAddModal);
    }

    // Modal close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeAddModal);
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeAddModal);
    }

    // Close modal on background click
    addContentModal.addEventListener('click', (e) => {
        if (e.target === addContentModal) {
            closeAddModal();
        }
    });

    // Save content (handles both add and edit)
    saveBtn.addEventListener('click', async () => {
        const date = dateInput.value;
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();
        const source = sourceInput.value.trim();
        const thoughts = thoughtsInput ? thoughtsInput.value.trim() : '';

        // Validation
        if (!title) {
            titleInput.style.borderColor = '#e75480';
            titleInput.focus();
            setTimeout(() => titleInput.style.borderColor = '', 2000);
            return;
        }

        if (!date) {
            dateInput.style.borderColor = '#e75480';
            dateInput.focus();
            setTimeout(() => dateInput.style.borderColor = '', 2000);
            return;
        }

        // Show loading state
        const originalBtnText = saveBtn.textContent;
        saveBtn.textContent = editingEntryId ? 'Updating...' : 'Saving...';
        saveBtn.disabled = true;

        const entryData = {
            date,
            title,
            url: url || '#',
            category: selectedCategory,
            source,
            thoughts
        };

        let success = false;

        if (editingEntryId) {
            // Update existing entry
            success = await updateContentInSupabase(editingEntryId, entryData);
            if (success) {
                // Update local entries array
                const index = contentEntries.findIndex(e => e.id === editingEntryId);
                if (index !== -1) {
                    contentEntries[index] = { ...contentEntries[index], ...entryData };
                }
                console.log('Updated entry:', editingEntryId);
            }
        } else {
            // Save new entry to Supabase
            const savedEntry = await saveContentToSupabase(entryData);
            if (savedEntry) {
                success = true;
                // Add to local entries array
                contentEntries.push({
                    id: savedEntry.id,
                    date: savedEntry.date,
                    title: savedEntry.title,
                    url: savedEntry.url,
                    source: savedEntry.source,
                    category: savedEntry.category,
                    thoughts: savedEntry.thoughts,
                    addedAt: savedEntry.added_at
                });
                console.log('Added new entry:', savedEntry);
            }
        }

        // Reset button
        saveBtn.textContent = 'Save Content';
        saveBtn.disabled = false;

        // Reset modal title
        const modalTitle = addContentModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Add Content';

        if (success) {
            // Close modal immediately
            closeAddModal();

            // Navigate to the month of the entry
            const entryDate = new Date(date + 'T00:00:00');
            currentYear = entryDate.getFullYear();
            currentMonth = entryDate.getMonth();

            // Re-render calendar to show the new entry
            renderCalendar();

            // Also update list view if visible
            if (!listView.classList.contains('hidden')) {
                renderListView();
            }

            console.log('Calendar updated, total entries:', contentEntries.length);
        } else {
            alert('Failed to save content. Please try again.');
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (detailView && detailView.classList.contains('active')) {
                closeDetailView();
            } else if (dayPanel.classList.contains('active')) {
                closeDayPanel();
            } else if (addContentModal.classList.contains('active')) {
                closeAddModal();
            }
        }
    });

    // Render calendar immediately (empty), then load data
    renderCalendar();

    // Initialize with async data loading (will re-render when data is loaded)
    initialize();
}

/**
 * Guestbook - Windows 95 Notepad Style
 * Plain text entries displayed like a .txt file
 */
function initGuestbook() {
    const entriesContainer = document.getElementById('notepad-entries');
    const noteInput = document.getElementById('notepad-input');
    const charCount = document.getElementById('notepad-char-count');
    const submitBtn = document.getElementById('notepad-submit');
    const prevBtn = document.getElementById('notepad-prev');
    const nextBtn = document.getElementById('notepad-next');
    const pageInfo = document.getElementById('notepad-page-info');

    if (!entriesContainer) return;

    // Configuration
    const ENTRIES_PER_PAGE = 5;

    // State
    let currentPage = 0;
    let notes = [];

    // Load notes from Supabase
    async function loadNotesFromSupabase() {
        if (!supabaseClient) {
            console.warn('Supabase not available, returning empty notes');
            return [];
        }
        try {
            const { data, error } = await supabaseClient
                .from('guestbook_notes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading guestbook notes:', error);
                return [];
            }

            return (data || []).map(note => ({
                id: note.id,
                message: note.message,
                createdAt: note.created_at
            }));
        } catch (err) {
            console.error('Error loading guestbook notes:', err);
            return [];
        }
    }

    // Save note to Supabase
    async function saveNoteToSupabase(message) {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('guestbook_notes')
                .insert([{ message }])
                .select();

            if (error) {
                console.error('Error saving guestbook note:', error);
                return null;
            }

            return data[0];
        } catch (err) {
            console.error('Error saving guestbook note:', err);
            return null;
        }
    }

    // Delete note from Supabase (admin only)
    async function deleteNoteFromSupabase(noteId) {
        if (!supabaseClient) {
            console.error('Supabase client not available');
            return false;
        }
        try {
            // Convert to number since Supabase uses integer IDs
            const numericId = parseInt(noteId, 10);
            console.log('Deleting note with ID:', numericId);

            const { data, error } = await supabaseClient
                .from('guestbook_notes')
                .delete()
                .eq('id', numericId)
                .select();

            console.log('Delete response - data:', data, 'error:', error);

            if (error) {
                console.error('Error deleting guestbook note:', error);
                alert('Supabase error: ' + error.message);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error deleting guestbook note:', err);
            alert('Exception: ' + err.message);
            return false;
        }
    }

    // Check if user is admin
    function isAdmin() {
        return localStorage.getItem('admin-authenticated') === 'true';
    }

    // Format date like a text file timestamp
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} ${hours}:${mins}`;
    }

    // Get total pages
    function getTotalPages() {
        return Math.max(1, Math.ceil(notes.length / ENTRIES_PER_PAGE));
    }

    // Render entries as plain text
    function renderEntries() {
        const totalPages = getTotalPages();
        const startIndex = currentPage * ENTRIES_PER_PAGE;
        const endIndex = startIndex + ENTRIES_PER_PAGE;
        const pageNotes = notes.slice(startIndex, endIndex);
        const adminMode = isAdmin();

        if (notes.length === 0) {
            entriesContainer.innerHTML = `<div class="notepad-empty">
═══════════════════════════════════════
         GUESTBOOK.TXT - Empty
═══════════════════════════════════════

No entries yet.

Type your message below and click
"Add Entry" to be the first!
</div>`;
        } else {
            // Format entries like a plain text file
            let content = '';
            pageNotes.forEach((note, index) => {
                const entryNum = startIndex + index + 1;
                content += `<div class="notepad-entry" data-note-id="${note.id}">`;
                content += `<div class="notepad-entry-header">`;
                content += `<div class="notepad-entry-date">[${formatDate(note.createdAt)}] Entry #${entryNum}</div>`;
                if (adminMode) {
                    content += `<button class="notepad-delete-btn" data-note-id="${note.id}" title="Delete entry">×</button>`;
                }
                content += `</div>`;
                content += `<div class="notepad-entry-message">${escapeHtml(note.message)}</div>`;
                content += `</div>`;
            });
            entriesContainer.innerHTML = content;

            // Add delete event listeners if admin
            if (adminMode) {
                entriesContainer.querySelectorAll('.notepad-delete-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const noteId = btn.dataset.noteId;
                        console.log('Delete clicked for noteId:', noteId);
                        if (confirm('Are you sure you want to delete this entry?')) {
                            btn.textContent = '...';
                            btn.disabled = true;
                            console.log('Attempting to delete from Supabase...');
                            const success = await deleteNoteFromSupabase(noteId);
                            console.log('Delete result:', success);
                            if (success) {
                                console.log('Notes before filter:', notes.length);
                                notes = notes.filter(n => String(n.id) !== String(noteId));
                                console.log('Notes after filter:', notes.length);
                                // Adjust page if needed
                                if (currentPage >= getTotalPages() && currentPage > 0) {
                                    currentPage--;
                                }
                                renderEntries();
                            } else {
                                btn.textContent = '×';
                                btn.disabled = false;
                                alert('Failed to delete entry. Check console for errors.');
                            }
                        }
                    });
                });
            }
        }

        // Update pagination
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize notes
    async function initializeNotes() {
        notes = await loadNotesFromSupabase();
        renderEntries();
    }

    // Start loading
    initializeNotes();

    // Character counter
    if (noteInput && charCount) {
        noteInput.addEventListener('input', () => {
            charCount.textContent = noteInput.value.length;
        });
    }

    // Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                renderEntries();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < getTotalPages() - 1) {
                currentPage++;
                renderEntries();
            }
        });
    }

    // Submit new entry
    if (submitBtn && noteInput) {
        submitBtn.addEventListener('click', async () => {
            const message = noteInput.value.trim();

            if (!message) {
                noteInput.style.borderColor = '#ff0000 #808080 #808080 #ff0000';
                setTimeout(() => {
                    noteInput.style.borderColor = '';
                }, 1500);
                return;
            }

            // Show loading
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            const savedNote = await saveNoteToSupabase(message);

            // Reset button
            submitBtn.textContent = 'Add Entry';
            submitBtn.disabled = false;

            if (savedNote) {
                // Add to local array
                notes.unshift({
                    id: savedNote.id,
                    message: savedNote.message,
                    createdAt: savedNote.created_at
                });

                // Clear input
                noteInput.value = '';
                charCount.textContent = '0';

                // Go to first page to show new entry
                currentPage = 0;
                renderEntries();

                // Brief visual feedback
                noteInput.placeholder = 'Entry saved!';
                setTimeout(() => {
                    noteInput.placeholder = 'Type your message here...';
                }, 2000);
            } else {
                alert('Error: Could not save entry. Please try again.');
            }
        });

        // Submit on Ctrl+Enter
        noteInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }

    // Initial render
    renderEntries();
}


