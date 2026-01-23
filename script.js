/**
 * Portfolio Website - Interactive Functionality
 * Handles navigation, tabs, scroll behavior, and content loading
 */

document.addEventListener('DOMContentLoaded', () => {
    loadContent();      // Load content from content.js
    initNavigation();
    initTabs();
    initScrollSpy();
    initThemeToggle();  // Dark mode toggle
    initCustomCursor(); // Custom cursor
    initPhotoGallery(); // Polaroid photo gallery
    initContentCalendar(); // Content consumption calendar
    initMobileMenu();   // Mobile hamburger menu
    initPageViewCounter(); // Page view counter
    initGuestbook();    // Virtual guestbook
    initMobilePreview(); // Mobile preview toggle
    updateYear();
});

/**
 * Page View Counter
 * Uses hits.seeyoufarm.com JSON API to track and display page views
 */
function initPageViewCounter() {
    const viewCountEl = document.getElementById('view-count');
    if (!viewCountEl) return;

    // Use hits.seeyoufarm.com JSON API for cleaner parsing
    const url = encodeURIComponent('https://shraddha-kulkarni.com');

    fetch(`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${url}&count_bg=%23000000&title_bg=%23000000&title=hits&edge_flat=true`)
        .then(response => response.text())
        .then(svg => {
            // Extract count - the SVG contains text elements with the count
            const matches = svg.match(/<text[^>]*>(\d+)<\/text>/g);
            if (matches) {
                // Find the text element containing just a number
                for (const match of matches) {
                    const numMatch = match.match(/>(\d+)</);
                    if (numMatch && numMatch[1]) {
                        const count = parseInt(numMatch[1], 10);
                        viewCountEl.textContent = count.toLocaleString();
                        return;
                    }
                }
            }
            // Fallback: show a simple indicator that counter is working
            viewCountEl.textContent = '1';
        })
        .catch(err => {
            console.log('Could not load view count');
            const counter = document.getElementById('page-view-counter');
            if (counter) counter.style.display = 'none';
        });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !sidebar) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });

    // Close on overlay click
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
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
 * Dark Mode Toggle
 */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    toggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Load all content from the CONTENT object in content.js
 */
function loadContent() {
    if (typeof CONTENT === 'undefined') {
        console.warn('content.js not loaded');
        return;
    }

    // Personal Info - Name with Kannada hover (in Hello section)
    const nameEl = document.getElementById('name');
    nameEl.innerHTML = `<span class="name-english">${CONTENT.name}</span><span class="name-kannada">${CONTENT.nameKannada}</span>`;

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
 */
async function loadSubstackPosts() {
    const CACHE_KEY = 'substack-posts-cache';
    const CACHE_EXPIRY = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const RSS_URL = 'https://shraddhaha.substack.com/feed';
    const CORS_PROXY = 'https://api.allorigins.win/get?url=';

    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { posts, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            renderThoughtsPosts(posts);
            return;
        }
    }

    // Show loading state
    document.getElementById('thoughts-list').innerHTML = '<p class="thoughts-loading">Loading posts...</p>';

    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(RSS_URL));
        const data = await response.json();

        if (!data.contents) {
            throw new Error('No content received');
        }

        // Parse XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        const items = xml.querySelectorAll('item');

        const posts = [];
        items.forEach((item, index) => {
            if (index >= 10) return; // Limit to 10 posts

            const title = item.querySelector('title')?.textContent || 'Untitled';
            const link = item.querySelector('link')?.textContent || '#';
            const pubDate = item.querySelector('pubDate')?.textContent;

            // Format date
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

        renderThoughtsPosts(posts);

    } catch (error) {
        console.error('Error fetching Substack RSS:', error);
        // Fallback to static content
        renderThoughtsFallback();
    }
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

    // Load photos from JSON file and localStorage
    async function loadPhotosFromStorage() {
        let jsonPhotos = { polaroids: [], film: [], digital: [] };
        let storedPhotos = { polaroids: [], film: [], digital: [] };

        // Try to load from JSON file
        try {
            const response = await fetch('./data/photos.json');
            if (response.ok) {
                const data = await response.json();
                jsonPhotos = data.photos || { polaroids: [], film: [], digital: [] };
                console.log('Loaded photos from JSON file');
            }
        } catch (err) {
            console.log('No photos.json found, using localStorage only');
        }

        // Load from localStorage
        const stored = localStorage.getItem('polaroid-photos');
        if (stored) {
            storedPhotos = JSON.parse(stored);
        }

        // Merge JSON and localStorage photos, localStorage takes precedence for duplicates
        const merged = { polaroids: [], film: [], digital: [] };
        ['polaroids', 'film', 'digital'].forEach(category => {
            const jsonCat = jsonPhotos[category] || [];
            const storedCat = storedPhotos[category] || [];

            // Add all JSON photos first
            jsonCat.forEach(photo => {
                merged[category].push(photo);
            });

            // Add localStorage photos, avoiding duplicates by id
            storedCat.forEach(photo => {
                if (!merged[category].find(p => p.id === photo.id)) {
                    merged[category].push(photo);
                }
            });
        });

        return merged;
    }

    // Save photos to localStorage
    function savePhotosToStorage() {
        localStorage.setItem('polaroid-photos', JSON.stringify(photos));
    }

    // Initialize - load photos
    async function initialize() {
        photos = await loadPhotosFromStorage();
        updateAdminUI();
        renderGallery();
    }

    // Render gallery for current category
    function renderGallery() {
        const categoryPhotos = photos[currentCategory] || [];
        const isAdminUser = isAdmin();

        if (categoryPhotos.length === 0) {
            const emptyMsg = isAdminUser
                ? 'No photos yet. Click "+ Add Photo" to get started!'
                : 'No photos yet.';
            gallery.innerHTML = `<div class="polaroid-gallery-empty">${emptyMsg}</div>`;
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
    function updateCaption(photoId, caption) {
        const categoryPhotos = photos[currentCategory];
        const photo = categoryPhotos.find(p => p.id === photoId);
        if (photo) {
            photo.caption = caption;
            savePhotosToStorage();
        }
    }

    // Delete photo
    function deletePhoto(photoId) {
        if (confirm('Delete this photo?')) {
            photos[currentCategory] = photos[currentCategory].filter(p => p.id !== photoId);
            savePhotosToStorage();
            renderGallery();
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
    saveBtn.addEventListener('click', () => {
        if (!currentEditingPhoto) return;

        const newPhoto = {
            id: Date.now(),
            src: currentEditingPhoto.src,
            zoom: parseInt(zoomSlider.value),
            posX: imgPosition.x,
            posY: imgPosition.y,
            caption: captionInput.value
        };

        const category = categorySelect.value;
        if (!photos[category]) photos[category] = [];
        photos[category].push(newPhoto);
        savePhotosToStorage();

        // Switch to the category where photo was saved
        currentCategory = category;
        photoTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.photoTab === category);
        });

        modal.classList.remove('active');
        currentEditingPhoto = null;
        renderGallery();
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

    // Load content from JSON file and localStorage
    async function loadContentFromStorage() {
        let jsonEntries = [];
        let storedEntries = [];

        // Try to load from JSON file
        try {
            const response = await fetch('./data/content-data.json');
            if (response.ok) {
                const data = await response.json();
                jsonEntries = data.entries || [];
                console.log('Loaded', jsonEntries.length, 'entries from JSON file');
            }
        } catch (err) {
            console.log('No JSON file found, using localStorage only');
        }

        // Load from localStorage
        const stored = localStorage.getItem('content-calendar');
        storedEntries = stored ? JSON.parse(stored) : [];

        // Also check CONTENT.contentCalendar for backwards compatibility
        const defaultEntries = (typeof CONTENT !== 'undefined' && CONTENT.contentCalendar) ? CONTENT.contentCalendar : [];

        // Merge all sources and deduplicate by id
        const allEntries = [...jsonEntries, ...defaultEntries, ...storedEntries];
        const uniqueEntries = allEntries.reduce((acc, entry) => {
            if (!acc.find(e => e.id === entry.id)) {
                acc.push(entry);
            }
            return acc;
        }, []);

        return uniqueEntries;
    }

    // Save to localStorage
    function saveContentToStorage() {
        localStorage.setItem('content-calendar', JSON.stringify(contentEntries));
        console.log('Saved', contentEntries.length, 'entries to localStorage');
    }

    // Initialize - load data and render
    async function initialize() {
        isLoading = true;
        try {
            contentEntries = await loadContentFromStorage();
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

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasContent) classes += ' has-content';

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

        // Add click handlers to days
        calendarGrid.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dateStr = dayEl.dataset.date;
                openDayPanel(dateStr);
            });
        });
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

    // Render list view (chronological) - clean list without category labels
    function renderListView() {
        const consumeList = document.getElementById('consume-list');
        if (!consumeList) return;

        const allEntries = [...contentEntries];
        allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (allEntries.length === 0) {
            consumeList.innerHTML = '<div class="content-list-empty">No content yet. Add some recommendations!</div>';
            return;
        }

        // Simple clean list - no category labels, just title and optional source
        let html = '<ul class="content-clean-list">';
        allEntries.forEach(entry => {
            html += `
                <li class="content-clean-item">
                    <a href="${entry.url && entry.url !== '#' ? entry.url : 'javascript:void(0)'}"
                       ${entry.url && entry.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}
                       class="content-clean-link${!entry.url || entry.url === '#' ? ' list-item-link' : ''}"
                       data-entry-id="${entry.id}">${entry.title}</a>
                    ${entry.source ? `<span class="content-clean-source">— ${entry.source}</span>` : ''}
                </li>
            `;
        });
        html += '</ul>';

        consumeList.innerHTML = html;

        // Add click handlers to items without URLs to open detail view
        consumeList.querySelectorAll('.list-item-link').forEach(link => {
            link.addEventListener('click', () => {
                const entryId = parseInt(link.dataset.entryId);
                openDetailView(entryId);
            });
        });
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

    // Save content
    saveBtn.addEventListener('click', () => {
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

        const newEntry = {
            id: Date.now(),
            date,
            title,
            url: url || '#',
            category: selectedCategory,
            source,
            thoughts,
            addedAt: new Date().toISOString()
        };

        // Add to entries array
        contentEntries.push(newEntry);
        console.log('Added new entry:', newEntry);

        // Save to localStorage first
        saveContentToStorage();

        // Close modal immediately
        closeAddModal();

        // Navigate to the month of the new entry
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
 * Guestbook - Virtual Notebook
 * Allows visitors to leave notes in a notebook-style interface
 */
function initGuestbook() {
    const writeNoteBtn = document.getElementById('write-note-btn');
    const writeNoteModal = document.getElementById('write-note-modal');
    const noteModalClose = document.getElementById('note-modal-close');
    const noteTextarea = document.getElementById('note-textarea');
    const charCount = document.getElementById('char-count');
    const noteCancel = document.getElementById('note-cancel');
    const noteSubmit = document.getElementById('note-submit');
    const noteSuccess = document.getElementById('note-success');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageCounter = document.getElementById('page-counter');
    const leftPage = document.getElementById('left-page');
    const rightPage = document.getElementById('right-page');

    if (!writeNoteBtn) return;

    // State
    let currentSpread = 0;
    let notes = loadNotesFromStorage();

    // Guestbook starts blank - no sample notes

    // Load notes from localStorage
    function loadNotesFromStorage() {
        const stored = localStorage.getItem('guestbook-notes');
        return stored ? JSON.parse(stored) : [];
    }

    // Save notes to localStorage
    function saveNotesToStorage() {
        localStorage.setItem('guestbook-notes', JSON.stringify(notes));
    }

    // Format date for display
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Get total spreads (2 notes per spread)
    function getTotalSpreads() {
        return Math.max(1, Math.ceil(notes.length / 2));
    }

    // Render current spread
    function renderSpread() {
        const totalSpreads = getTotalSpreads();
        const leftNoteIndex = currentSpread * 2;
        const rightNoteIndex = currentSpread * 2 + 1;

        // Left page
        const leftNoteMsg = document.getElementById('left-note-message');
        const leftNoteAttr = document.getElementById('left-note-attribution');

        if (notes[leftNoteIndex]) {
            const note = notes[leftNoteIndex];
            leftNoteMsg.innerHTML = `"${note.message}"`;
            leftNoteAttr.innerHTML = `<span class="note-date">${formatDate(note.createdAt)}</span>`;
        } else {
            leftNoteMsg.innerHTML = '<span class="page-empty">No notes yet. Be the first to write one!</span>';
            leftNoteAttr.innerHTML = '';
        }

        // Right page
        const rightNoteMsg = document.getElementById('right-note-message');
        const rightNoteAttr = document.getElementById('right-note-attribution');

        if (notes[rightNoteIndex]) {
            const note = notes[rightNoteIndex];
            rightNoteMsg.innerHTML = `"${note.message}"`;
            rightNoteAttr.innerHTML = `<span class="note-date">${formatDate(note.createdAt)}</span>`;
        } else if (notes.length > 0 && leftNoteIndex < notes.length) {
            rightNoteMsg.innerHTML = '<span class="page-empty">Turn the page for more...</span>';
            rightNoteAttr.innerHTML = '';
        } else {
            rightNoteMsg.innerHTML = '';
            rightNoteAttr.innerHTML = '';
        }

        // Update page numbers
        leftPage.querySelector('.page-number').textContent = currentSpread * 2 + 1;
        rightPage.querySelector('.page-number').textContent = currentSpread * 2 + 2;

        // Update page counter
        pageCounter.textContent = `Page ${currentSpread + 1} of ${totalSpreads}`;

        // Update navigation buttons
        prevPageBtn.disabled = currentSpread === 0;
        nextPageBtn.disabled = currentSpread >= totalSpreads - 1;
    }

    // Animate page flip
    function animatePageFlip(direction, callback) {
        const leftPageEl = document.getElementById('left-page');
        const rightPageEl = document.getElementById('right-page');

        if (direction === 'next') {
            // Flip out to the left
            rightPageEl.classList.add('flipping-out-right');
            leftPageEl.classList.add('flipping-out-left');

            setTimeout(() => {
                callback();

                // Remove flip-out classes and add flip-in
                leftPageEl.classList.remove('flipping-out-left');
                rightPageEl.classList.remove('flipping-out-right');
                leftPageEl.classList.add('flipping-in-left');
                rightPageEl.classList.add('flipping-in-right');

                // Clean up flip-in classes after animation
                setTimeout(() => {
                    leftPageEl.classList.remove('flipping-in-left');
                    rightPageEl.classList.remove('flipping-in-right');
                }, 600);
            }, 300);
        } else {
            // Flip out to the right (going backwards)
            leftPageEl.classList.add('flipping-out-right');
            rightPageEl.classList.add('flipping-out-left');

            setTimeout(() => {
                callback();

                // Remove flip-out classes and add flip-in
                leftPageEl.classList.remove('flipping-out-right');
                rightPageEl.classList.remove('flipping-out-left');
                leftPageEl.classList.add('flipping-in-right');
                rightPageEl.classList.add('flipping-in-left');

                // Clean up flip-in classes after animation
                setTimeout(() => {
                    leftPageEl.classList.remove('flipping-in-right');
                    rightPageEl.classList.remove('flipping-in-left');
                }, 600);
            }, 300);
        }
    }

    // Navigate pages with animation
    prevPageBtn.addEventListener('click', () => {
        if (currentSpread > 0) {
            animatePageFlip('prev', () => {
                currentSpread--;
                renderSpread();
            });
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentSpread < getTotalSpreads() - 1) {
            animatePageFlip('next', () => {
                currentSpread++;
                renderSpread();
            });
        }
    });

    // Open write note modal
    function openWriteModal() {
        noteTextarea.value = '';
        charCount.textContent = '0';
        charCount.classList.remove('near-limit');
        writeNoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => noteTextarea.focus(), 100);
    }

    // Close write note modal
    function closeWriteModal() {
        writeNoteModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Character counter
    noteTextarea.addEventListener('input', () => {
        const count = noteTextarea.value.length;
        charCount.textContent = count;
        charCount.classList.toggle('near-limit', count > 250);
    });

    // Event listeners
    writeNoteBtn.addEventListener('click', openWriteModal);
    noteModalClose.addEventListener('click', closeWriteModal);
    noteCancel.addEventListener('click', closeWriteModal);

    // Close on background click
    writeNoteModal.addEventListener('click', (e) => {
        if (e.target === writeNoteModal) {
            closeWriteModal();
        }
    });

    // Submit note
    noteSubmit.addEventListener('click', () => {
        const message = noteTextarea.value.trim();

        if (!message) {
            noteTextarea.style.borderColor = '#e75480';
            setTimeout(() => noteTextarea.style.borderColor = '', 2000);
            return;
        }

        // Create new note
        const newNote = {
            id: Date.now(),
            message,
            createdAt: new Date().toISOString()
        };

        // Add to beginning (newest first)
        notes.unshift(newNote);
        saveNotesToStorage();

        // Close modal
        closeWriteModal();

        // Show success message
        noteSuccess.classList.add('show');
        setTimeout(() => {
            noteSuccess.classList.remove('show');
        }, 2000);

        // Go to first page to show new note
        currentSpread = 0;
        renderSpread();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && writeNoteModal.classList.contains('active')) {
            closeWriteModal();
        }
    });

    // Initial render
    renderSpread();
}

/**
 * Mobile Preview Toggle
 * Shows the website in a phone-sized frame to preview mobile layout
 */
function initMobilePreview() {
    const toggle = document.getElementById('mobile-preview-toggle');
    const overlay = document.getElementById('mobile-preview-overlay');
    const frame = document.getElementById('mobile-preview-frame');
    const iframe = document.getElementById('mobile-preview-iframe');
    const closeBtn = document.getElementById('mobile-preview-close');

    if (!toggle || !overlay || !frame || !iframe || !closeBtn) return;

    let isActive = false;

    function openPreview() {
        isActive = true;
        toggle.classList.add('active');
        overlay.classList.add('active');
        frame.classList.add('active');
        closeBtn.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Load current page in iframe
        iframe.src = window.location.href;
    }

    function closePreview() {
        isActive = false;
        toggle.classList.remove('active');
        overlay.classList.remove('active');
        frame.classList.remove('active');
        closeBtn.classList.remove('active');
        document.body.style.overflow = '';

        // Clear iframe
        iframe.src = 'about:blank';
    }

    // Toggle button click
    toggle.addEventListener('click', () => {
        if (isActive) {
            closePreview();
        } else {
            openPreview();
        }
    });

    // Close button click
    closeBtn.addEventListener('click', closePreview);

    // Overlay click closes preview
    overlay.addEventListener('click', closePreview);

    // Escape key closes preview
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isActive) {
            closePreview();
        }
    });
}
