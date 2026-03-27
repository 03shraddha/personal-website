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
        initRouting();      // SPA routing: scroll to section from URL path
        initCustomCursor(); // Custom cursor
        initPhotoGallery(); // Polaroid photo gallery
        initContentCalendar(); // Content consumption calendar
        initMobileMenu();   // Mobile hamburger menu
        initPageViewCounter(); // Page view counter
        initGuestbook();    // Virtual guestbook
        initAudioIntro();   // Audio voice introduction

        // Initialize text reveal after content is loaded
        setTimeout(() => {
            initTextReveal();
        }, 150);

        initAtmosphereToggle();
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
        // Atomic increment via RPC — DB does count+1 in a single operation,
        // so a stale JS read can never overwrite the real value.
        const { data, error } = await supabaseClient
            .rpc('increment_page_view', { page_id_param: 'main' });

        if (!error && data != null) {
            updateDisplay(data);
        } else {
            console.log('Error updating page view counter:', error);
            if (viewCountSocial) viewCountSocial.textContent = '--';
        }
    } catch (err) {
        console.log('Could not load view count:', err);
        if (viewCountSocial) viewCountSocial.textContent = '--';
    }
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
    // hello-intro is now the audio player (#audio-intro) — populated by initAudioIntro()
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
            <div class="corporate-content">
                <div class="corporate-preview">
                    ${about.corporateStory.paragraphs.slice(0, 2).map(p => `<p>${p}</p>`).join('')}
                </div>
                <button class="corporate-toggle">Read more →</button>
                <div class="corporate-full">
                    ${about.corporateStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
                </div>
                <button class="corporate-toggle-less">Show less ↑</button>
            </div>
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

    // Initialize corporate story toggle
    initCorporateToggle();

    // Initialize background toggle
    initBackgroundToggle();

    // Initialize beyond work toggle
    initBeyondWorkToggle();

    // Social Links
    const social = CONTENT.socialLinks;
    document.getElementById('social-linkedin').href = social.linkedin;
    document.getElementById('social-twitter').href = social.twitter;
    document.getElementById('social-substack').href = social.substack;
    document.getElementById('social-github').href = social.github;
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

    // Projects (for tabs) - Load from Supabase, fallback to content.js
    initProjectsSection();

    // Communities (for tabs) with expandable details
    const communitiesHtml = CONTENT.communities.map((c, index) => {
        const logoHtml = c.logo
            ? `<img src="${c.logo}" alt="${c.name} logo" class="community-logo" onerror="this.outerHTML='<span class=\\'community-emoji\\'>${c.fallbackEmoji || '🏢'}</span>'">`
            : `<span class="community-emoji">${c.fallbackEmoji || '🏢'}</span>`;

        return `
        <article class="project-card community-card" data-community-index="${index}">
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
    document.getElementById('footer-text').innerHTML = `${CONTENT.footer} · <a href="/llms.txt" target="_blank" style="opacity:0.5; text-decoration:none; border-bottom: 1px dashed currentColor;">llms.txt</a> · <span class="year">${new Date().getFullYear()}</span>`;
}

/**
 * Substack RSS Feed - Load posts for Thoughts section
 * Optimized: Shows cached/fallback content immediately, refreshes in background
 */
async function loadSubstackPosts() {
    const CACHE_KEY = 'substack-posts-v3';
    const CACHE_EXPIRY = 1 * 60 * 60 * 1000; // 1 hour cache
    const RSS_URL = 'https://shraddhaha.substack.com/feed';

    // Stale-while-revalidate: show any cached data immediately, then refresh if stale
    const cached = localStorage.getItem(CACHE_KEY);
    let hasCache = false;
    let isFresh = false;

    if (cached) {
        try {
            const { posts, timestamp } = JSON.parse(cached);
            if (posts && posts.length > 0) {
                hasCache = true;
                isFresh = Date.now() - timestamp < CACHE_EXPIRY;
                renderThoughtsPosts(posts); // show stale-or-fresh cache immediately
            }
        } catch (e) {
            // Invalid cache, fall through
        }
    }

    if (!hasCache) {
        // No cache at all — show static fallback immediately while fetching
        renderThoughtsFallback();
    }

    if (!isFresh) {
        // Fire-and-forget background fetch; updates UI when done
        fetchSubstackInBackground(RSS_URL, CACHE_KEY);
    }
}

// Background fetch - doesn't block UI
async function fetchSubstackInBackground(RSS_URL, CACHE_KEY) {
    // rss2json is a dedicated RSS API (most reliable), allorigins/corsproxy are CORS proxies
    const PROXIES = [
        { url: 'https://api.rss2json.com/v1/api.json?rss_url=', type: 'rss2json' },
        { url: 'https://api.allorigins.win/get?url=',           type: 'allorigins' },
        { url: 'https://corsproxy.io/?',                         type: 'xml' }
    ];

    function formatPubDate(raw) {
        if (!raw) return '';
        // rss2json gives "YYYY-MM-DD HH:MM:SS", RSS gives RFC 2822
        const date = new Date(raw.includes(' ') ? raw.replace(' ', 'T') : raw);
        return isNaN(date) ? '' : date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    for (const proxy of PROXIES) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(proxy.url + encodeURIComponent(RSS_URL), {
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (!response.ok) continue;

            const posts = [];

            if (proxy.type === 'rss2json') {
                const json = await response.json();
                if (json.status !== 'ok' || !json.items?.length) continue;
                json.items.slice(0, 10).forEach(item => {
                    posts.push({
                        title: item.title || 'Untitled',
                        link:  item.link  || '#',
                        date:  formatPubDate(item.pubDate)
                    });
                });
            } else {
                // allorigins returns JSON wrapper; corsproxy returns raw XML
                let xmlText;
                if (proxy.type === 'allorigins') {
                    const json = await response.json();
                    if (!json.contents) continue;
                    xmlText = json.contents;
                } else {
                    xmlText = await response.text();
                }
                const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
                const items = xml.querySelectorAll('item');
                if (items.length === 0) continue;
                Array.from(items).slice(0, 10).forEach(item => {
                    posts.push({
                        title: item.querySelector('title')?.textContent || 'Untitled',
                        link:  item.querySelector('link')?.textContent  || '#',
                        date:  formatPubDate(item.querySelector('pubDate')?.textContent)
                    });
                });
            }

            if (posts.length === 0) continue;

            // Cache and render
            localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }));
            renderThoughtsPosts(posts);
            return; // success

        } catch (error) {
            console.log(`Substack proxy ${proxy.type} failed:`, error.message);
        }
    }
    console.log('All Substack proxies failed, keeping cached/fallback content');
}

function renderThoughtsPosts(posts) {
    if (!posts || posts.length === 0) {
        document.getElementById('thoughts-list').innerHTML = '';
        return;
    }

    const postsHtml = posts.slice(0, 7).map((post, index) => `
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
    // Fallback to static content from CONTENT.thoughts (same numbered format as RSS)
    const posts = CONTENT.thoughts.map(t => ({
        title: t.title,
        link: t.url,
        date: ''
    }));
    renderThoughtsPosts(posts);
}

function renderThoughtsLoading() {
    // Show skeleton rows while RSS fetch is in progress
    const skeletons = Array.from({ length: 5 }, (_, i) => `
        <li class="thoughts-item thoughts-skeleton">
            <span class="thoughts-number">${i + 1}.</span>
            <div class="thoughts-content">
                <span class="skeleton-line skeleton-title"></span>
                <span class="skeleton-line skeleton-date"></span>
            </div>
        </li>
    `).join('');
    document.getElementById('thoughts-list').innerHTML = `
        <ol class="thoughts-posts-list">${skeletons}</ol>
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
 * Projects Section - Supabase-backed cards with admin CRUD
 */
// Global state for projects (accessible by inline onclick handlers)
window._projectsState = {
    projects: [],
    currentEditId: null
};

function initProjectsSection() {
    const projectsList = document.getElementById('projects-list');
    const addProjectBtn = document.getElementById('add-project-btn');

    if (!projectsList) return;

    const state = window._projectsState;

    function isAdmin() {
        return localStorage.getItem('admin-authenticated') === 'true';
    }

    // Show add button for admins
    if (addProjectBtn && isAdmin()) {
        addProjectBtn.style.display = 'inline-block';
    }

    // Load projects from Supabase
    async function loadProjectsFromSupabase() {
        if (!supabaseClient) {
            console.warn('Supabase not available for projects');
            return null;
        }
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading projects from Supabase:', error);
                return null;
            }

            return (data || []).map(p => ({
                id: p.id,
                name: p.name,
                highlight: p.highlight || 'blue',
                briefDescription: p.brief_description,
                expandedContent: p.expanded_content || '',
                githubUrl: p.github_url || '',
                demoUrl: p.demo_url || '',
                previewImageUrl: p.preview_image_url || '',
                sortOrder: p.sort_order || 0
            }));
        } catch (err) {
            console.error('Error loading projects:', err);
            return null;
        }
    }

    // Render project cards
    function renderProjects() {
        const isAdminUser = isAdmin();

        if (state.projects.length === 0) {
            projectsList.innerHTML = '';
            return;
        }

        const githubSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';
        const externalSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

        // Drag handle SVG (6-dot grip) — shown only in admin mode
        const dragHandleSvg = '<svg viewBox="0 0 10 16" fill="currentColor" width="10" height="16"><circle cx="3" cy="3" r="1.2"/><circle cx="7" cy="3" r="1.2"/><circle cx="3" cy="8" r="1.2"/><circle cx="7" cy="8" r="1.2"/><circle cx="3" cy="13" r="1.2"/><circle cx="7" cy="13" r="1.2"/></svg>';

        // Build HTML for a single project card
        function buildCardHtml(proj, index) {
            const linksHtml = (proj.githubUrl || proj.demoUrl) ? `
                <div class="project-links">
                    ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${githubSvg} GitHub</a>` : ''}
                    ${proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${externalSvg} Demo</a>` : ''}
                </div>
            ` : '';

            const expandedHtml = proj.expandedContent ? `
                <div class="project-expanded">
                    ${proj.expandedContent}
                </div>
                <button class="project-toggle" data-project-index="${index}">
                    View details <span class="toggle-arrow">&rarr;</span>
                </button>
            ` : '';

            const adminHtml = isAdminUser ? `
                <div class="project-admin-actions">
                    <button class="project-admin-btn project-edit-btn" onclick="window.projectEditItem(${proj.id})">Edit</button>
                    <button class="project-admin-btn project-delete-btn" onclick="window.projectDeleteItem(${proj.id})">Delete</button>
                </div>
            ` : '';

            // data-project-id used by sortable reorder; data-project-index used by expand toggle
            return `
                <article class="project-card${isAdminUser ? ' is-admin-card' : ''}" data-project-index="${index}" data-project-id="${proj.id}"${proj.previewImageUrl ? ` data-preview-url="${proj.previewImageUrl}"` : ''}>
                    ${isAdminUser ? `<div class="drag-handle" title="Drag to reorder" aria-hidden="true">${dragHandleSvg}</div>` : ''}
                    <h3><span class="highlight ${proj.highlight}">${proj.name}</span></h3>
                    <p class="project-brief">${proj.briefDescription}</p>
                    ${linksHtml}
                    ${expandedHtml}
                    ${adminHtml}
                </article>
            `;
        }

        if (isAdminUser) {
            // Admin: always flat list (no carousel) so drag-to-reorder works across all projects
            projectsList.innerHTML = state.projects.map((proj, index) => buildCardHtml(proj, index)).join('');
            initProjectToggles();
            initProjectPreview();
            initAdminSortable(state, projectsList);
            return;
        }

        const PROJECTS_PER_PAGE = 5;
        const pages = [];
        for (let i = 0; i < state.projects.length; i += PROJECTS_PER_PAGE) {
            pages.push(state.projects.slice(i, i + PROJECTS_PER_PAGE));
        }

        if (pages.length <= 1) {
            // Single page: flat list
            projectsList.innerHTML = state.projects.map((proj, index) => buildCardHtml(proj, index)).join('');
        } else {
            // Multi-page: horizontal carousel with peek
            const backSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>`;
            const nextSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="9 18 15 12 9 6"/></svg>`;

            const pagesHtml = pages.map((pageProjects, pageIndex) => {
                const startIndex = pageIndex * PROJECTS_PER_PAGE;
                const cardsHtml = pageProjects.map((proj, i) => buildCardHtml(proj, startIndex + i)).join('');
                return `<div class="projects-page">${cardsHtml}</div>`;
            }).join('');

            // Reusable nav row — back starts hidden (always on page 1 at load)
            function makeNavHtml() {
                const dotsHtml = pages.map((_, i) =>
                    `<button class="projects-scroll-dot${i === 0 ? ' active' : ''}" data-page="${i}" aria-label="Page ${i + 1}"></button>`
                ).join('');
                return `
                    <button class="projects-nav-prev hidden" aria-label="Previous page">${backSvg} Previous</button>
                    <div class="projects-scroll-dots">${dotsHtml}</div>
                    <button class="projects-nav-next" aria-label="Next page">Next ${nextSvg}</button>
                `;
            }

            projectsList.innerHTML = `
                <div class="projects-carousel-wrapper" id="projects-carousel-wrapper">
                    <div class="projects-carousel" id="projects-carousel-scroll">
                        ${pagesHtml}
                    </div>
                </div>
                <div class="projects-carousel-nav">${makeNavHtml()}</div>
            `;

            const carousel = document.getElementById('projects-carousel-scroll');
            const wrapper = document.getElementById('projects-carousel-wrapper');
            const pageEls = () => carousel.querySelectorAll('.projects-page');
            const PEEK_PX = 48;

            function getActivePage() {
                let activePage = 0;
                pageEls().forEach((el, i) => {
                    if (carousel.scrollLeft >= el.offsetLeft - 8) activePage = i;
                });
                return activePage;
            }

            function updateNav() {
                const activePage = getActivePage();
                const atEnd = carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10;
                projectsList.querySelectorAll('.projects-scroll-dot').forEach(dot => {
                    dot.classList.toggle('active', parseInt(dot.dataset.page) === activePage);
                });
                projectsList.querySelectorAll('.projects-nav-next').forEach(btn => {
                    btn.classList.toggle('hidden', atEnd);
                });
                projectsList.querySelectorAll('.projects-nav-prev').forEach(btn => {
                    btn.classList.toggle('hidden', activePage === 0);
                });
                wrapper.classList.toggle('at-end', atEnd);
            }

            // Set page widths in px (% mis-resolves inside overflow-scroll flex containers).
            // Also re-syncs nav: when tab is hidden on initial render, offsetWidth=0 so we
            // skip the sync; ResizeObserver fires again once the tab becomes visible.
            function updatePageWidths() {
                const pageWidth = wrapper.offsetWidth - PEEK_PX;
                if (pageWidth <= 0) return; // tab still hidden — ResizeObserver will retry
                pageEls().forEach(page => {
                    page.style.minWidth = pageWidth + 'px';
                    page.style.maxWidth = pageWidth + 'px';
                });
                // Defer to next frame — reading scrollWidth immediately after setting
                // minWidth gives stale values before browser reflow, causing atEnd=true
                // which incorrectly hides the Next button.
                requestAnimationFrame(updateNav);
            }
            updatePageWidths();
            new ResizeObserver(updatePageWidths).observe(wrapper);

            carousel.addEventListener('scroll', updateNav, { passive: true });

            // Scroll to a page and immediately update nav to the target state.
            // Optimistic update avoids relying on scroll event timing — the nav
            // reflects the destination before the animation completes.
            function scrollToPage(pageEl, targetIndex) {
                carousel.scrollTo({ left: pageEl.offsetLeft, behavior: 'smooth' });
                // Immediately reflect target state so Prev/Next show without delay
                const targetIsLast = targetIndex >= pages.length - 1;
                projectsList.querySelectorAll('.projects-scroll-dot').forEach(dot => {
                    dot.classList.toggle('active', parseInt(dot.dataset.page) === targetIndex);
                });
                projectsList.querySelectorAll('.projects-nav-next').forEach(btn => {
                    btn.classList.toggle('hidden', targetIsLast);
                });
                projectsList.querySelectorAll('.projects-nav-prev').forEach(btn => {
                    btn.classList.toggle('hidden', targetIndex === 0);
                });
                wrapper.classList.toggle('at-end', targetIsLast);
                // Confirm with DOM-based check after animation settles
                setTimeout(updateNav, 600);
            }

            projectsList.querySelectorAll('.projects-nav-next').forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetIndex = getActivePage() + 1;
                    const next = pageEls()[targetIndex];
                    if (next) scrollToPage(next, targetIndex);
                });
            });

            projectsList.querySelectorAll('.projects-nav-prev').forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetIndex = getActivePage() - 1;
                    const prev = pageEls()[targetIndex];
                    if (prev) scrollToPage(prev, targetIndex);
                });
            });

            projectsList.querySelectorAll('.projects-scroll-dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    const targetIndex = parseInt(dot.dataset.page);
                    const target = pageEls()[targetIndex];
                    if (target) scrollToPage(target, targetIndex);
                });
            });
        }

        initProjectToggles();
        initProjectPreview();
    }

    // Expose renderProjects for global handlers
    window._projectsRender = renderProjects;

    // Load and render
    async function init() {
        const supabaseProjects = await loadProjectsFromSupabase();
        state.projects = (supabaseProjects !== null) ? supabaseProjects : [];
        renderProjects();
    }

    init();
}

/**
 * Admin Drag-to-Reorder — initializes SortableJS on the projects list.
 * Only runs in admin mode when SortableJS is loaded.
 * @param {object} state - window._projectsState
 * @param {HTMLElement} container - the #projects-list element
 */
function initAdminSortable(state, container) {
    if (typeof Sortable === 'undefined') {
        console.warn('SortableJS not loaded — drag-to-reorder unavailable');
        return;
    }

    // Fix: destroy any existing instance before creating a new one.
    // renderProjects() re-runs on every edit/delete/rollback, which would
    // otherwise stack up multiple Sortable listeners on the same element.
    if (container._sortableInstance) {
        container._sortableInstance.destroy();
    }

    const sortable = new Sortable(container, {
        animation: 150,          // smooth card slide animation (ms)
        handle: '.drag-handle',  // only the grip icon initiates drag
        ghostClass: 'sortable-ghost',    // placeholder left behind during drag
        chosenClass: 'sortable-chosen',  // card being actively dragged
        scroll: true,            // auto-scroll page when near edges
        scrollSensitivity: 80,
        scrollSpeed: 10,
        onEnd: async function() {
            // Fix: disable sorting during API call to prevent a second drag
            // from firing before the first save completes (race condition).
            sortable.option('disabled', true);

            // Read new order from DOM after drop; skip any card missing an id.
            const newOrder = Array.from(container.querySelectorAll('.project-card'))
                .map((card, i) => ({ id: parseInt(card.dataset.projectId), sort_order: i }))
                .filter(({ id }) => !isNaN(id)); // Fix: guard against missing data-project-id

            // Optimistic update: reorder local state to match DOM
            const prevProjects = [...state.projects];
            state.projects = newOrder
                .map(({ id }) => state.projects.find(p => p.id === id))
                .filter(Boolean);

            try {
                await saveProjectOrder(newOrder);
            } catch (err) {
                // Rollback: restore previous order and re-render
                state.projects = prevProjects;
                if (window._projectsRender) window._projectsRender();
                console.error('Reorder failed — previous order restored:', err);
            } finally {
                sortable.option('disabled', false);
            }
        }
    });

    // Store reference so re-renders can destroy it cleanly.
    container._sortableInstance = sortable;
}

/**
 * Persist new project sort order to Supabase.
 * Uses individual UPDATE calls (not upsert) — upsert's INSERT path requires
 * all NOT NULL columns (name, brief_description) which we don't send here,
 * causing a constraint error before the conflict can be detected.
 */
async function saveProjectOrder(newOrder) {
    if (!supabaseClient) throw new Error('Supabase not connected');
    const results = await Promise.all(
        newOrder.map(({ id, sort_order }) =>
            supabaseClient.from('projects').update({ sort_order }).eq('id', id)
        )
    );
    const failed = results.find(({ error }) => error);
    if (failed) throw failed.error;
}

// ---- Global project CRUD functions (called via onclick) ----

function projectOpenAddModal() {
    const state = window._projectsState;
    state.currentEditId = null;
    document.getElementById('project-modal-title').textContent = 'Add Project';
    document.getElementById('project-edit-id').value = '';
    document.getElementById('project-name').value = '';
    document.getElementById('project-brief').value = '';
    document.getElementById('project-expanded').value = '';
    document.getElementById('project-github').value = '';
    document.getElementById('project-demo').value = '';
    document.getElementById('project-highlight').value = 'blue';
    document.getElementById('project-preview-image').value = '';
    document.getElementById('project-preview-url').value = '';
    document.getElementById('project-preview-thumb').style.display = 'none';
    document.getElementById('project-preview-thumb-img').src = '';
    document.getElementById('project-save').textContent = 'Save Project';
    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function projectCloseModal() {
    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = '';
    window._projectsState.currentEditId = null;
}

window.projectEditItem = function(projectId) {
    const state = window._projectsState;
    const proj = state.projects.find(p => p.id === projectId);
    if (!proj) return;

    state.currentEditId = projectId;
    document.getElementById('project-modal-title').textContent = 'Edit Project';
    document.getElementById('project-edit-id').value = projectId;
    document.getElementById('project-name').value = proj.name;
    document.getElementById('project-brief').value = proj.briefDescription;
    document.getElementById('project-expanded').value = proj.expandedContent || '';
    document.getElementById('project-github').value = proj.githubUrl || '';
    document.getElementById('project-demo').value = proj.demoUrl || '';
    document.getElementById('project-highlight').value = proj.highlight || 'blue';
    document.getElementById('project-preview-image').value = '';
    document.getElementById('project-preview-url').value = proj.previewImageUrl || '';
    const thumb = document.getElementById('project-preview-thumb');
    const thumbImg = document.getElementById('project-preview-thumb-img');
    if (proj.previewImageUrl) {
        thumbImg.src = proj.previewImageUrl;
        thumb.style.display = 'flex';
    } else {
        thumbImg.src = '';
        thumb.style.display = 'none';
    }
    document.getElementById('project-save').textContent = 'Update Project';
    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.projectDeleteItem = async function(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) {
            alert('Delete failed: ' + error.message);
            return;
        }
        const state = window._projectsState;
        state.projects = state.projects.filter(p => p.id !== projectId);
        if (window._projectsRender) window._projectsRender();
    } catch (err) {
        alert('Delete failed: ' + err.message);
    }
};

window.projectSaveItem = async function() {
    console.log('projectSaveItem called');
    const state = window._projectsState;
    const name = document.getElementById('project-name').value.trim();
    const briefDescription = document.getElementById('project-brief').value.trim();
    const expandedContent = document.getElementById('project-expanded').value.trim();
    const githubUrl = document.getElementById('project-github').value.trim();
    const demoUrl = document.getElementById('project-demo').value.trim();
    const highlight = document.getElementById('project-highlight').value;
    const saveBtn = document.getElementById('project-save');
    const imageFile = document.getElementById('project-preview-image').files[0];
    let previewImageUrl = document.getElementById('project-preview-url').value.trim();

    if (!name || !briefDescription) {
        alert('Project title and short description are required.');
        return;
    }

    if (!supabaseClient) {
        alert('Supabase is not connected. Cannot save.');
        return;
    }

    saveBtn.textContent = state.currentEditId ? 'Updating...' : 'Saving...';
    saveBtn.disabled = true;

    try {
        // Upload preview image if a new file was selected
        if (imageFile) {
            saveBtn.textContent = 'Uploading image...';
            const ext = imageFile.name.split('.').pop().toLowerCase();
            const filename = `project-${state.currentEditId || 'new'}-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('project-previews')
                .upload(filename, imageFile, { upsert: true });
            if (uploadError) {
                alert('Image upload failed: ' + uploadError.message);
                saveBtn.textContent = state.currentEditId ? 'Update Project' : 'Save Project';
                saveBtn.disabled = false;
                return;
            }
            const { data: urlData } = supabaseClient.storage
                .from('project-previews')
                .getPublicUrl(filename);
            previewImageUrl = urlData.publicUrl;
        }

        if (state.currentEditId) {
            // Update
            const { error } = await supabaseClient
                .from('projects')
                .update({
                    name,
                    highlight,
                    brief_description: briefDescription,
                    expanded_content: expandedContent || null,
                    github_url: githubUrl || null,
                    demo_url: demoUrl || null,
                    preview_image_url: previewImageUrl || null
                })
                .eq('id', state.currentEditId);

            if (error) {
                alert('Update error: ' + error.message);
                saveBtn.textContent = 'Update Project';
                saveBtn.disabled = false;
                return;
            }

            const idx = state.projects.findIndex(p => p.id === state.currentEditId);
            if (idx !== -1) {
                state.projects[idx] = { ...state.projects[idx], name, highlight, briefDescription, expandedContent, githubUrl, demoUrl, previewImageUrl };
            }
        } else {
            // Insert
            const { data, error } = await supabaseClient
                .from('projects')
                .insert([{
                    name,
                    highlight,
                    brief_description: briefDescription,
                    expanded_content: expandedContent || null,
                    github_url: githubUrl || null,
                    demo_url: demoUrl || null,
                    preview_image_url: previewImageUrl || null,
                    sort_order: state.projects.length
                }])
                .select();

            if (error) {
                alert('Save error: ' + error.message);
                saveBtn.textContent = 'Save Project';
                saveBtn.disabled = false;
                return;
            }

            const saved = data[0];
            state.projects.push({
                id: saved.id,
                name: saved.name,
                highlight: saved.highlight,
                briefDescription: saved.brief_description,
                expandedContent: saved.expanded_content || '',
                githubUrl: saved.github_url || '',
                demoUrl: saved.demo_url || '',
                previewImageUrl: saved.preview_image_url || '',
                sortOrder: saved.sort_order || 0
            });
        }

        projectCloseModal();
        if (window._projectsRender) window._projectsRender();
    } catch (err) {
        alert('Error: ' + err.message);
    }

    saveBtn.textContent = 'Save Project';
    saveBtn.disabled = false;
};

// Wire up the "Remove" button for the preview image thumbnail in the admin modal
document.addEventListener('DOMContentLoaded', () => {
    const removeBtn = document.getElementById('project-preview-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            document.getElementById('project-preview-image').value = '';
            document.getElementById('project-preview-url').value = '';
            document.getElementById('project-preview-thumb').style.display = 'none';
            document.getElementById('project-preview-thumb-img').src = '';
        });
    }

    // Show thumbnail preview when a file is selected
    const fileInput = document.getElementById('project-preview-image');
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('project-preview-thumb-img').src = e.target.result;
                document.getElementById('project-preview-thumb').style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });
    }
});

// Escape key for project modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('project-modal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        projectCloseModal();
    }
});

// Close on background click
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'project-modal') {
        projectCloseModal();
    }
});

/**
 * Project Toggle - Expand/Collapse project details
 */
function collapseProjectCard(card) {
    const expanded = card.querySelector('.project-expanded.active');
    if (!expanded) return;
    expanded.classList.remove('active');
    const btn = card.querySelector('.project-toggle');
    if (btn) btn.innerHTML = 'View details <span class="toggle-arrow">→</span>';
}

function initProjectToggles() {
    const isMobile = window.matchMedia('(hover: none)').matches;

    const toggleBtns = document.querySelectorAll('.project-toggle');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.projectIndex;
            const card = document.querySelector(`.project-card[data-project-index="${index}"]`);
            const expanded = card.querySelector('.project-expanded');
            const isExpanded = expanded.classList.contains('active');

            if (isExpanded) {
                expanded.classList.remove('active');
                btn.innerHTML = 'View details <span class="toggle-arrow">→</span>';
            } else {
                expanded.classList.add('active');
                btn.innerHTML = 'View less <span class="toggle-arrow">↑</span>';
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    if (!isMobile) return;

    // Mobile: tap anywhere on the card body (not buttons/links) to toggle details
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-toggle, .project-link, .project-admin-btn, .drag-handle')) return;
            card.querySelector('.project-toggle')?.click();
        });
    });

    // Mobile: auto-close a card when it scrolls completely out of the viewport
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.project-expanded.active').forEach(exp => {
            const card = exp.closest('.project-card');
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                collapseProjectCard(card);
            }
        });
    }, { passive: true });

    // Mobile: auto-close expanded cards when the horizontal carousel swipes to a new page
    const carousel = document.getElementById('projects-carousel-scroll');
    if (carousel) {
        carousel.addEventListener('scroll', () => {
            document.querySelectorAll('.project-expanded.active').forEach(exp => {
                collapseProjectCard(exp.closest('.project-card'));
            });
        }, { passive: true });
    }
}

/**
 * Project Preview — floating image on desktop hover, bottom sheet on mobile tap
 */
function initProjectPreview() {
    const isTouchOnly = window.matchMedia('(hover: none)').matches;

    // Create floating preview card (once) — shared by desktop hover + mobile tap
    if (!document.getElementById('project-preview-card')) {
        const el = document.createElement('div');
        el.className = 'project-preview-card';
        el.id = 'project-preview-card';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = `
            <div class="preview-img-wrapper">
                <img id="project-preview-card-img" src="" alt="">
            </div>
            <div class="preview-card-body">
                <span class="preview-card-title" id="project-preview-card-title"></span>
            </div>`;
        document.body.appendChild(el);

        // Dismiss preview on any touch — preview has pointer-events:none so it never blocks this
        document.addEventListener('touchstart', () => {
            el.classList.remove('visible');
        }, { passive: true });
    }

    const previewCard = document.getElementById('project-preview-card');
    const previewImg = document.getElementById('project-preview-card-img');
    let hideTimeout;

    document.querySelectorAll('.project-card[data-preview-url]').forEach(card => {
        const url = card.dataset.previewUrl;
        if (!url) return;

        if (!isTouchOnly) {
            // Desktop: follow cursor, hide on leave
            card.addEventListener('mouseenter', (e) => {
                clearTimeout(hideTimeout);
                previewImg.src = url;
                const titleEl = document.getElementById('project-preview-card-title');
                if (titleEl) titleEl.textContent = card.querySelector('h3 .highlight')?.textContent || '';
                positionProjectPreview(previewCard, e.clientX, e.clientY);
                previewCard.classList.add('visible');
            });
            card.addEventListener('mousemove', (e) => {
                positionProjectPreview(previewCard, e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => previewCard.classList.remove('visible'), 60);
            });
        }
        // Mobile: tap opens card details (handled in initProjectToggles), no preview needed
    });
}

function positionProjectPreview(previewCard, cursorX, cursorY) {
    const PREVIEW_W = 280;
    const OFFSET = 20; // distance from cursor
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = cursorX + OFFSET;
    // Flip to left of cursor if not enough room on the right
    if (left + PREVIEW_W > vw - 8) {
        left = cursorX - PREVIEW_W - OFFSET;
    }
    left = Math.max(8, left);

    let top = cursorY + OFFSET;
    const estimatedH = previewCard.offsetHeight || 180;
    // Flip above cursor if not enough room below
    if (top + estimatedH > vh - 8) {
        top = cursorY - estimatedH - OFFSET;
    }
    top = Math.max(8, top);

    previewCard.style.left = left + 'px';
    previewCard.style.top = top + 'px';
}

function positionMobilePreview(previewCard, cardRect) {
    const PREVIEW_W = 240;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Center horizontally
    const left = Math.max(8, (vw - PREVIEW_W) / 2);
    // Position below card; flip above if not enough room
    const estimatedH = previewCard.offsetHeight || 220;
    let top = cardRect.bottom + 8;
    if (top + estimatedH > vh - 16) { top = cardRect.top - estimatedH - 8; }
    top = Math.max(8, top);
    previewCard.style.left = left + 'px';
    previewCard.style.top = top + 'px';
    previewCard.style.width = PREVIEW_W + 'px';
}

/**
 * Corporate Story Toggle - Expand/Collapse "My job, explained" section
 */
function initCorporateToggle() {
    const readMoreBtn = document.querySelector('.corporate-toggle');
    const showLessBtn = document.querySelector('.corporate-toggle-less');
    const preview = document.querySelector('.corporate-preview');
    const full = document.querySelector('.corporate-full');

    if (!readMoreBtn || !showLessBtn) return;

    readMoreBtn.addEventListener('click', () => {
        preview.classList.add('hidden');
        readMoreBtn.classList.add('hidden');
        full.classList.add('active');
        showLessBtn.classList.add('active');
        setTimeout(() => refreshTextReveal(), 150);
    });

    showLessBtn.addEventListener('click', () => {
        full.classList.remove('active');
        showLessBtn.classList.remove('active');
        preview.classList.remove('hidden');
        readMoreBtn.classList.remove('hidden');
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
        // Refresh text reveal for new content
        setTimeout(() => refreshTextReveal(), 150);
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
        // Refresh text reveal for new content
        setTimeout(() => refreshTextReveal(), 150);
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

            const href = link.getAttribute('href');           // '/about' or '/'
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                // Get offset for fixed header on mobile
                const offset = window.innerWidth <= 900 ? 80 : 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                // Suppress scroll spy while smooth-scrolling so it doesn't
                // briefly highlight intermediate sections (e.g. work when going to thoughts)
                _programmaticScrolling = true;
                clearTimeout(_programmaticScrollTimer);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page reload
                history.pushState(null, '', href);

                // Update active state immediately for better UX
                updateActiveNav(link);

                // Re-enable scroll spy after animation (~600ms is enough for smooth scroll)
                _programmaticScrollTimer = setTimeout(() => {
                    _programmaticScrolling = false;
                }, 600);

                // Correction for layout shifts from async loading (e.g. Supabase projects
                // rendering after click, expanding the work section and pushing thoughts down).
                // Fires after smooth scroll + buffer; instant-jumps only if meaningfully off.
                setTimeout(() => {
                    const correctedOffset = window.innerWidth <= 900 ? 80 : 0;
                    const correctedTop = targetSection.getBoundingClientRect().top + window.pageYOffset - correctedOffset;
                    if (Math.abs(correctedTop - window.pageYOffset) > 20) {
                        window.scrollTo({ top: correctedTop, behavior: 'instant' });
                    }
                }, 800);
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

// Track last URL-updated section to avoid redundant replaceState calls on scroll
let _lastScrollSpySection = null;
// Suppress scroll spy URL/nav updates during programmatic smooth scrolls
let _programmaticScrolling = false;
let _programmaticScrollTimer = null;

/**
 * SPA Routing - Read initial URL path and scroll to the matching section.
 * Must be called after initScrollSpy so all sections exist in the DOM.
 */
function initRouting() {
    const PATH_TO_SECTION = {
        '/':                  'hello',
        '/hello':             'hello',
        '/about':             'about',
        '/work':              'work',
        '/work/experience':   'work',
        '/work/projects':     'work',
        '/work/communities':  'work',
        '/thoughts':          'thoughts',
        '/content':           'content',
        '/photos':            'photos',
        '/guestbook':         'guestbook',
    };

    // window.__initialPath is set by the head script when arriving via 404 redirect.
    // Falls back to window.location.pathname for direct navigation.
    var rawPath = window.__initialPath || window.location.pathname;
    var path = (rawPath.replace(/\/$/, '') || '/').toLowerCase();
    var sectionId = PATH_TO_SECTION[path] || 'hello';
    var targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    var offset = window.innerWidth <= 900 ? 80 : 0;
    var correctPath = sectionId === 'hello' ? '/' : '/' + sectionId;

    function doRoutingScroll() {
        _programmaticScrolling = true;
        window.scrollTo({ top: targetSection.offsetTop - offset, behavior: 'instant' });
        requestAnimationFrame(() => {
            _programmaticScrolling = false;
            history.replaceState(null, '', correctPath);
            _lastScrollSpySection = sectionId;
        });
    }

    // Initial scroll — DOM is laid out but Supabase projects (async) may not have loaded yet
    doRoutingScroll();

    // Re-scroll after async content (projects from Supabase) may have injected DOM
    // and shifted the target section's offsetTop.
    if (sectionId !== 'hello') {
        setTimeout(doRoutingScroll, 900);
    }

    var matchingLink = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
    if (matchingLink) updateActiveNav(matchingLink);

    // Activate a specific work tab if the path includes one (e.g. /work/projects)
    var tabMatch = path.match(/^\/work\/(\w+)$/);
    if (tabMatch) {
        var tabBtn = document.querySelector('.tab[data-tab="' + tabMatch[1] + '"]');
        if (tabBtn) tabBtn.click();
    }

    // Clean up URL if path was unknown (fallback to hello)
    if (!PATH_TO_SECTION[path]) history.replaceState(null, '', '/');
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

    if (currentSection && !_programmaticScrolling) {
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update URL as user scrolls, but skip during programmatic scrolls to avoid
        // briefly highlighting intermediate sections (e.g. work when navigating to thoughts)
        if (!_programmaticScrolling && currentSection !== _lastScrollSpySection) {
            _lastScrollSpySection = currentSection;
            const newPath = currentSection === 'hello' ? '/' : '/' + currentSection;
            history.replaceState(null, '', newPath);
        }
    }
}

/**
 * Scroll-Triggered Text Reveal Effect
 * Sequential word-by-word reveal like reading - left to right, line by line
 * Line 1 completes before Line 2 starts
 */
function initTextReveal() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Color values
    const fadedColor = '#b5b5b5';
    const fullColor = '#1a1a1a';

    // Function to split text into word spans while preserving HTML
    function splitTextIntoWords(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            if (!text.trim()) return;

            const words = text.split(/(\s+)/);
            const fragment = document.createDocumentFragment();

            words.forEach(word => {
                if (word.match(/^\s+$/)) {
                    fragment.appendChild(document.createTextNode(word));
                } else if (word) {
                    const span = document.createElement('span');
                    span.className = 'reveal-word';
                    span.textContent = word;
                    span.style.color = fadedColor;
                    fragment.appendChild(span);
                }
            });

            textNode.parentNode.replaceChild(fragment, textNode);
        });
    }

    // Define selectors for elements to animate
    const selectors = [
        // Hello Section
        '#name',
        // About Section
        '#about .section-title', '#about .section-intro',
        '#about-content p', '#about-content .about-subtitle',
        '#about-content .about-list li', '.beyond-work-item',
        // Work Section
        '#work .section-title', '#work .section-intro',
        // About expanded content
        '.background-expanded p', '.beyond-work-expanded p'
    ];

    let elementCount = 0;

    // First pass: split all text into words
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el.dataset.revealInit) return;
            el.dataset.revealInit = 'true';
            elementCount++;
            splitTextIntoWords(el);
        });
    });

    // Collect ALL words with positions
    const allWords = Array.from(document.querySelectorAll('.reveal-word'));

    if (allWords.length === 0) return;

    // Get typical line height from first word's parent
    const computedStyle = window.getComputedStyle(allWords[0].parentElement || allWords[0]);
    const lineHeight = parseInt(computedStyle.lineHeight) || 28;

    // Get position data and calculate LINE NUMBER for each word
    const wordData = allWords.map(word => {
        const rect = word.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        return {
            element: word,
            top: absoluteTop,
            left: rect.left,
            // Calculate line number based on position (group by line height)
            lineNum: Math.round(absoluteTop / (lineHeight * 0.8))
        };
    });

    // Group words by their line number
    const lineMap = new Map();
    wordData.forEach(word => {
        if (!lineMap.has(word.lineNum)) {
            lineMap.set(word.lineNum, []);
        }
        lineMap.get(word.lineNum).push(word);
    });

    // Sort line numbers and create ordered lines array
    const sortedLineNums = Array.from(lineMap.keys()).sort((a, b) => a - b);
    const lines = sortedLineNums.map(lineNum => {
        const wordsInLine = lineMap.get(lineNum);
        // Sort words within each line by X position (left to right)
        wordsInLine.sort((a, b) => a.left - b.left);
        return wordsInLine;
    });

    // Flatten into single array with sequential indices
    // CRITICAL: Line 1 gets indices 0-N, Line 2 gets N+1-M, etc.
    const sortedWords = [];
    lines.forEach((line, lineIndex) => {
        line.forEach((word, wordInLineIndex) => {
            word.index = sortedWords.length;
            word.lineIndex = lineIndex;
            sortedWords.push(word);
        });
    });

    const totalWords = sortedWords.length;
    const totalLines = lines.length;

    if (totalWords === 0) return;

    const isMobile = window.innerWidth <= 900;
    // Lines up to this index are permanently fullColor — skip them on future frames
    let maxSettledLine = -1;

    function updateRevealStrict() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const readingLineY = scrollY + (viewportHeight * 0.50);

        // Find the current active line
        let activeLineIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (readingLineY >= lines[i][0].top) {
                activeLineIndex = i;
            } else {
                break;
            }
        }

        lines.forEach((line, lineIndex) => {
            // Skip lines already permanently settled (avoids redundant DOM writes)
            if (lineIndex <= maxSettledLine) return;

            if (lineIndex < activeLineIndex) {
                // Past line — settle it permanently
                line.forEach(w => { w.element.style.color = fullColor; });
                maxSettledLine = lineIndex;
            } else if (lineIndex === activeLineIndex) {
                if (isMobile) {
                    // Mobile: reveal the whole line at once, then settle
                    line.forEach(w => { w.element.style.color = fullColor; });
                    maxSettledLine = lineIndex;
                } else {
                    // Desktop: per-word reveal with color interpolation
                    const distancePastLine = readingLineY - line[0].top;
                    const wordsToReveal = Math.max(0, distancePastLine / 18);
                    line.forEach((w, i) => {
                        const progress = wordsToReveal - i;
                        if (progress <= 0) {
                            w.element.style.color = fadedColor;
                        } else if (progress >= 1) {
                            w.element.style.color = fullColor;
                        } else {
                            w.element.style.color = interpolateColor(fadedColor, fullColor, progress);
                        }
                    });
                }
            } else {
                // Future line — faded (only write if not already set)
                line.forEach(w => {
                    if (w.element.style.color !== fadedColor) {
                        w.element.style.color = fadedColor;
                    }
                });
            }
        });
    }

    // Color interpolation helper
    function interpolateColor(color1, color2, progress) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);

        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateRevealStrict();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial update
    updateRevealStrict();
}

/**
 * Refresh text reveal for dynamically loaded content
 */
function refreshTextReveal() {
    setTimeout(() => {
        initTextReveal();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
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

            // Update URL to reflect active tab so tabs are deep-linkable
            // Experience is the default, so /work is its canonical URL
            const tabUrl = targetTab === 'experience' ? '/work' : '/work/' + targetTab;
            history.replaceState(null, '', tabUrl);
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

        // Update URL for keyboard navigation
        const newPath = targetSection.id === 'hello' ? '/' : '/' + targetSection.id;
        history.pushState(null, '', newPath);
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
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false }); // fallback for rows with sort_order = 0

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
                    posY: photo.pos_y || 0,
                    sortOrder: photo.sort_order ?? 0
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
                    <div class="polaroid-drag-handle admin-only" title="Drag to reorder">⠿</div>
                    <input type="text" class="polaroid-caption admin-only" value="${photo.caption || ''}"
                           placeholder="add caption..." data-id="${photo.id}">
                    <button class="polaroid-delete admin-only" data-id="${photo.id}">&times;</button>
                ` : ''}
            </div>
        `).join('');

        // Add event listeners for captions (admin only)
        if (isAdminUser) {
            gallery.querySelectorAll('.polaroid-caption.admin-only').forEach(input => {
                input.addEventListener('blur', (e) => {
                    updateCaption(parseInt(e.target.dataset.id), e.target.value);
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur(); // triggers blur → save
                    }
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

            // Init drag-to-reorder (Sortable.js)
            if (typeof Sortable !== 'undefined') {
                if (gallery._sortableInstance) gallery._sortableInstance.destroy();
                const sortable = new Sortable(gallery, {
                    animation: 150,
                    handle: '.polaroid-drag-handle',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    scroll: true,
                    scrollSensitivity: 80,
                    scrollSpeed: 10,
                    onEnd: async function() {
                        sortable.option('disabled', true);
                        await persistPhotoSortOrder();
                        sortable.option('disabled', false);
                    }
                });
                gallery._sortableInstance = sortable;
            }
        }
    }

    // Persist photo sort order to Supabase after drag-and-drop
    async function persistPhotoSortOrder() {
        if (!supabaseClient) return;
        const items = gallery.querySelectorAll('.polaroid[data-id]');
        const updates = Array.from(items).map((el, index) => ({
            id: parseInt(el.dataset.id),
            sort_order: index
        }));
        // Update in-memory array to match new order
        const categoryPhotos = photos[currentCategory];
        const idToPhoto = Object.fromEntries(categoryPhotos.map(p => [p.id, p]));
        photos[currentCategory] = updates.map(({ id }) => idToPhoto[id]).filter(Boolean);
        // Persist to Supabase
        try {
            await Promise.all(
                updates.map(({ id, sort_order }) =>
                    supabaseClient.from('photos').update({ sort_order }).eq('id', id)
                )
            );
        } catch (err) {
            console.error('Failed to save photo sort order:', err);
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

        // Trailing empty cells to complete the last row (ensures uniform row height)
        const totalCells = firstDay + daysInMonth;
        const trailingCells = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < trailingCells; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        calendarGrid.innerHTML = html;

        // Add click handlers to days - switch to list view and scroll to date
        calendarGrid.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                // On touch devices, briefly show tooltip as visual feedback before switching
                if (window.matchMedia('(max-width: 600px)').matches && dayEl.querySelector('.calendar-day-tooltip')) {
                    document.querySelectorAll('.calendar-day.tooltip-active').forEach(d => d.classList.remove('tooltip-active'));
                    dayEl.classList.add('tooltip-active');
                    clearTimeout(dayEl._tooltipTimer);
                    dayEl._tooltipTimer = setTimeout(() => dayEl.classList.remove('tooltip-active'), 1200);
                }
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
                highlightedGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    let listPage = 0;
    const LIST_PAGE_SIZE = 7;

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

        // Paginate by date groups (7 date groups per page)
        const totalPages = Math.ceil(sortedDates.length / LIST_PAGE_SIZE);
        if (listPage >= totalPages) listPage = totalPages - 1;
        if (listPage < 0) listPage = 0;

        const startIdx = listPage * LIST_PAGE_SIZE;
        const paginatedDates = sortedDates.slice(startIdx, startIdx + LIST_PAGE_SIZE);

        // If highlightDate exists but not on current page, jump to its page
        if (highlightDate) {
            const highlightIdx = sortedDates.indexOf(highlightDate);
            if (highlightIdx >= 0) {
                const targetPage = Math.floor(highlightIdx / LIST_PAGE_SIZE);
                if (targetPage !== listPage) {
                    listPage = targetPage;
                    renderListView(highlightDate);
                    return;
                }
            }
        }

        // Build HTML with date groups
        let html = '';
        paginatedDates.forEach(date => {
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
                                ${entry.source ? `<span class="content-clean-source">· ${entry.source}</span>` : ''}
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

        // Pagination controls
        if (totalPages > 1) {
            html += `
                <div class="content-list-pagination">
                    <button class="pagination-btn pagination-prev" ${listPage === 0 ? 'disabled' : ''}>
                        &larr; Newer
                    </button>
                    <span class="pagination-info">${listPage + 1} / ${totalPages}</span>
                    <button class="pagination-btn pagination-next" ${listPage >= totalPages - 1 ? 'disabled' : ''}>
                        Older &rarr;
                    </button>
                </div>
            `;
        }

        consumeList.innerHTML = html;

        // Bind pagination buttons
        const prevBtn = consumeList.querySelector('.pagination-prev');
        const nextBtn = consumeList.querySelector('.pagination-next');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                listPage--;
                renderListView();
                consumeList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                listPage++;
                renderListView();
                consumeList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

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

    if (!entriesContainer) return;

    // State
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

    // Save note via Edge Function (blocks direct API abuse)
    async function saveNoteToSupabase(message) {
        try {
            const res = await fetch('https://ptoykobcidzgewmtiomp.supabase.co/functions/v1/super-handler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!res.ok) {
                console.error('Error saving guestbook note:', res.status);
                return null;
            }

            return await res.json();
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

    // Render entries as plain text
    function renderEntries() {
        const pageNotes = notes;
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
                const entryNum = notes.length - index;
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

    // Rate limiting: one submission per 60 seconds per browser session
    const RATE_LIMIT_MS = 60 * 1000;
    function isRateLimited() {
        const lastSubmit = parseInt(localStorage.getItem('guestbook_last_submit') || '0', 10);
        return Date.now() - lastSubmit < RATE_LIMIT_MS;
    }
    function getRemainingCooldown() {
        const lastSubmit = parseInt(localStorage.getItem('guestbook_last_submit') || '0', 10);
        return Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSubmit)) / 1000);
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

            // Check rate limit
            if (isRateLimited()) {
                noteInput.placeholder = `Please wait ${getRemainingCooldown()}s before submitting again.`;
                setTimeout(() => {
                    noteInput.placeholder = 'Type your message here...';
                }, 3000);
                return;
            }

            // Show loading
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            // Set rate limit before the request — prevents double-submit if
            // the network fails after the server already processed the note.
            localStorage.setItem('guestbook_last_submit', Date.now().toString());

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

// ── Audio Voice Introduction (Web Speech API) ──
function initAudioIntro() {
    const INTRO_LINES = [
        "hi, i'm shraddha.",
        "i have experience in analytics & product management and am currently open to work.",
        "this is my corner of the internet where i share my work, unfinished projects, imperfect experiments and whatever i'm curious about right now.",
        "a couple of my friends also think i'm funny."
    ];
    const FULL_TEXT = INTRO_LINES.join(' ');
    const CIRCUMFERENCE = 125.66;

    // Word counts per line — used to proportion timestamps
    const WORD_COUNTS = [4, 14, 30, 10];
    const TOTAL_WORDS = 58;
    // Estimated duration at rate 0.92 (~138 wpm) = ~24.3s
    const EST_MS = (TOTAL_WORDS / 138) * 60 * 1000;

    // Pre-compute ms offset where each line starts
    let _elapsed = 0;
    const LINE_START_MS = WORD_COUNTS.map(w => {
        const t = _elapsed;
        _elapsed += (w / TOTAL_WORDS) * EST_MS;
        return t;
    });

    const playBtn = document.getElementById('audio-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('.play-icon') : null;
    const ringFill = playBtn ? playBtn.querySelector('.progress-ring__fill') : null;
    const transcriptEl = document.getElementById('audio-transcript');

    if (!playBtn || !transcriptEl || !window.speechSynthesis) return;

    const lineEls = INTRO_LINES.map((text, i) => {
        const el = document.createElement('p');
        el.className = 'transcript-line';
        el.textContent = text;
        // Duration for the underline animation = how long this line takes to speak
        const lineDurSec = ((WORD_COUNTS[i] / TOTAL_WORDS) * EST_MS / 1000).toFixed(1);
        el.style.setProperty('--line-dur', `${lineDurSec}s`);
        transcriptEl.appendChild(el);
        return el;
    });

    let isPlaying = false;
    let isEnded = false;
    let activeIndex = -1;
    let utterance = null;
    let timerFrame = null;
    let startTime = null;   // Date.now() when speech started
    let pausedAt = 0;       // ms elapsed when paused

    function getFemaleVoice() {
        const voices = speechSynthesis.getVoices();
        const preferred = ['Samantha', 'Google US English', 'Microsoft Zira', 'Karen', 'Victoria', 'Moira', 'Tessa'];
        for (const name of preferred) {
            const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
            if (v) return v;
        }
        return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
    }

    function setRing(progress) {
        if (ringFill) ringFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - Math.min(progress, 1));
    }

    function updateLines(idx) {
        lineEls.forEach((el, i) => {
            el.classList.remove('active', 'done');
            if (i < idx) el.classList.add('done');
            else if (i === idx) el.classList.add('active');
        });
    }

    // Timer-based sync — reliable across all browsers, no onboundary needed
    function startTimer(fromMs) {
        startTime = Date.now() - fromMs;
        function tick() {
            if (!isPlaying) return;
            const elapsed = Date.now() - startTime;
            setRing(elapsed / EST_MS);

            let newIdx = -1;
            for (let i = LINE_START_MS.length - 1; i >= 0; i--) {
                if (elapsed >= LINE_START_MS[i]) { newIdx = i; break; }
            }
            if (newIdx !== activeIndex) {
                activeIndex = newIdx;
                updateLines(newIdx);
            }
            if (elapsed < EST_MS * 1.1) timerFrame = requestAnimationFrame(tick);
        }
        timerFrame = requestAnimationFrame(tick);
    }

    function stopTimer() {
        if (timerFrame) { cancelAnimationFrame(timerFrame); timerFrame = null; }
    }

    function buildUtterance() {
        utterance = new SpeechSynthesisUtterance(FULL_TEXT);
        utterance.rate = 0.92;
        utterance.pitch = 1;
        const voice = getFemaleVoice();
        if (voice) utterance.voice = voice;

        utterance.onstart = () => startTimer(pausedAt);

        utterance.onend = () => {
            stopTimer();
            isPlaying = false;
            isEnded = true;
            pausedAt = 0;
            setRing(1);
            lineEls.forEach(el => { el.classList.remove('active'); el.classList.add('done'); });
            if (playIcon) playIcon.innerHTML = '&#8635;';
            if (playBtn) playBtn.setAttribute('aria-label', 'Replay introduction');
        };

        utterance.onerror = () => { stopTimer(); isPlaying = false; };
    }

    function resetPlayer() {
        stopTimer();
        speechSynthesis.cancel();
        isPlaying = false;
        isEnded = false;
        activeIndex = -1;
        pausedAt = 0;
        setRing(0);
        lineEls.forEach(el => el.classList.remove('active', 'done'));
        if (playIcon) playIcon.innerHTML = '&#9654;';
        if (playBtn) playBtn.setAttribute('aria-label', 'Play introduction');
    }

    function startSpeech() {
        buildUtterance();
        speechSynthesis.speak(utterance);
        isPlaying = true;
        if (playIcon) playIcon.innerHTML = '&#9646;&#9646;';
        if (playBtn) playBtn.setAttribute('aria-label', 'Pause introduction');
    }

    playBtn.addEventListener('click', () => {
        if (isEnded) {
            resetPlayer();
            setTimeout(startSpeech, 100);
            return;
        }
        if (isPlaying) {
            pausedAt = Date.now() - startTime; // save elapsed before pause
            stopTimer();
            speechSynthesis.pause();
            isPlaying = false;
            if (playIcon) playIcon.innerHTML = '&#9654;';
            if (playBtn) playBtn.setAttribute('aria-label', 'Play introduction');
        } else {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
                startTimer(pausedAt); // resume timer from saved position
            } else {
                startSpeech();
                return;
            }
            isPlaying = true;
            if (playIcon) playIcon.innerHTML = '&#9646;&#9646;';
            if (playBtn) playBtn.setAttribute('aria-label', 'Pause introduction');
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            pausedAt = Date.now() - startTime;
            stopTimer();
            speechSynthesis.pause();
            isPlaying = false;
            if (playIcon) playIcon.innerHTML = '&#9654;';
            if (playBtn) playBtn.setAttribute('aria-label', 'Play introduction');
        }
    });

    window.addEventListener('beforeunload', () => speechSynthesis.cancel());
}


// ── Atmosphere Modes (Sunny + Spring) ──
function initAtmosphereToggle() {
    const MODES = ['normal', 'sunny', 'spring'];
    const LABELS = { normal: 'mode', sunny: 'sunny', spring: 'spring' };

    const toggleBtn = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    const sunnyBg = document.getElementById('sunny-bg');
    const sunTurbulence = document.getElementById('sun-turbulence');
    const canvas = document.getElementById('petal-canvas');

    if (!toggleBtn || !canvas) return;

    let currentMode = 'normal';

    function debounceResize(fn, delay) {
        let timer;
        return function() { clearTimeout(timer); timer = setTimeout(fn, delay); };
    }

    // ── Spring mode: petals + flowers + leaves ──
    const PARTICLE_COUNT = 65;
    const PETAL_COLORS = ['#FFB7C5', '#FFC0CB', '#FFD1DC', '#FFAAB5', '#F9A8BF', '#FADADD'];
    const LEAF_COLORS  = ['#b8d4a8', '#a8c898', '#98b888', '#c8deb8'];
    let particles = [];
    let petalAnimFrame = null;
    let petalResizeHandler = null;
    const ctx = canvas.getContext('2d');

    function createParticle(randomY) {
        const roll = Math.random();
        // 55% single petal, 30% 5-petal flower, 15% leaf
        const type = roll < 0.55 ? 'petal' : roll < 0.85 ? 'flower' : 'leaf';
        return {
            type,
            x: Math.random() * canvas.width,
            y: randomY ? Math.random() * canvas.height : -15,
            size: type === 'flower' ? 5 + Math.random() * 5 :
                  type === 'leaf'   ? 6 + Math.random() * 7 :
                                      3 + Math.random() * 5,
            speed: 0.5 + Math.random() * 1.3,
            drift: 0.2 + Math.random() * 0.8,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            opacity: 0.18 + Math.random() * 0.22, // kept subtle
            phase: Math.random() * Math.PI * 2,
            color: type === 'leaf'
                ? LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
                : PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
        };
    }

    function drawSpringParticle(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'flower') {
            // 5-petal cherry blossom
            const r = p.size;
            for (let i = 0; i < 5; i++) {
                ctx.save();
                ctx.rotate((i / 5) * Math.PI * 2);
                ctx.beginPath();
                ctx.ellipse(0, -r * 0.9, r * 0.45, r * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Centre dot
            ctx.fillStyle = '#ff99aa';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'leaf') {
            // Simple oval leaf
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Single teardrop petal
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.bezierCurveTo( p.size * 0.75, -p.size * 0.4,  p.size * 0.75, p.size * 0.4, 0, p.size);
            ctx.bezierCurveTo(-p.size * 0.75,  p.size * 0.4, -p.size * 0.75, -p.size * 0.4, 0, -p.size);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(p.phase + p.y * 0.012) * p.drift;
            p.angle += p.rotationSpeed;
            if (p.y > canvas.height + 20) {
                p.y = -15;
                p.x = Math.random() * canvas.width;
            }
            drawSpringParticle(p);
        });
        petalAnimFrame = requestAnimationFrame(animatePetals);
    }

    function startSpringMode() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(true));
        petalResizeHandler = debounceResize(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles.forEach(p => { p.x = Math.random() * canvas.width; });
        }, 150);
        window.addEventListener('resize', petalResizeHandler);
        petalAnimFrame = requestAnimationFrame(animatePetals);
        document.addEventListener('visibilitychange', handleSpringVisibility);
    }

    function handleSpringVisibility() {
        if (document.hidden) {
            if (petalAnimFrame) { cancelAnimationFrame(petalAnimFrame); petalAnimFrame = null; }
        } else if (currentMode === 'spring' && !petalAnimFrame) {
            petalAnimFrame = requestAnimationFrame(animatePetals);
        }
    }

    function stopSpringMode() {
        if (petalAnimFrame) { cancelAnimationFrame(petalAnimFrame); petalAnimFrame = null; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (petalResizeHandler) { window.removeEventListener('resize', petalResizeHandler); petalResizeHandler = null; }
        document.removeEventListener('visibilitychange', handleSpringVisibility);
    }

    // ── Sunny mode: SVG feTurbulence organic light animation ──
    let sunnyAnimFrame = null;
    let sunnyTime = 0;

    function generateSunnyScene() { /* no-op — SVG filter handles rendering */ }

    function animateSunny(timestamp) {
        if (!sunTurbulence) return;
        sunnyTime = timestamp * 0.00007; // very slow organic drift
        const bfx = (0.013 + Math.sin(sunnyTime * 0.8)  * 0.003).toFixed(4);
        const bfy = (0.010 + Math.cos(sunnyTime * 0.55) * 0.002).toFixed(4);
        sunTurbulence.setAttribute('baseFrequency', `${bfx} ${bfy}`);
        sunnyAnimFrame = requestAnimationFrame(animateSunny);
    }

    function startSunnyMode() {
        sunnyAnimFrame = requestAnimationFrame(animateSunny);
    }

    function stopSunnyMode() {
        if (sunnyAnimFrame) { cancelAnimationFrame(sunnyAnimFrame); sunnyAnimFrame = null; }
    }

    // ── Mode application ──
    function applyMode(mode) {
        // Stop everything
        stopSunnyMode();
        stopSpringMode();
        document.body.classList.remove('mode-sunny', 'mode-spring');

        currentMode = mode;

        if (mode === 'sunny') {
            document.body.classList.add('mode-sunny');
            startSunnyMode();
        } else if (mode === 'spring') {
            document.body.classList.add('mode-spring');
            startSpringMode();
        }

        // Update button
        if (modeLabel) modeLabel.textContent = LABELS[mode];
        toggleBtn.setAttribute('aria-label', `Current mode: ${mode}. Click to switch.`);
    }

    toggleBtn.addEventListener('click', () => {
        const currentIdx = MODES.indexOf(currentMode);
        const nextMode = MODES[(currentIdx + 1) % MODES.length];
        applyMode(nextMode);
    });
}
