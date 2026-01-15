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
    updateYear();
});

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorRing = document.querySelector('.cursor-ring');

    if (!cursor || !cursorRing) return;

    // Check if it's a touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        cursorRing.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Move main cursor instantly
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animate ring to follow with slight delay
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects for clickable elements
    const clickables = document.querySelectorAll('a, button, .tab, .highlight, [role="button"]');

    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorRing.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            cursorRing.classList.remove('hovering');
        });
    });

    // Click effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
        cursorRing.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
        cursorRing.classList.remove('clicking');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
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
        <p class="about-intro"><strong>${about.intro}</strong></p>
        <p>${about.mainText}</p>
        <p>${about.debateText}</p>

        <div class="about-subsection">
            <p><strong>${about.learnAboutMe.title}</strong></p>
            <ul class="about-list">
                ${about.learnAboutMe.items.map(item => `<li><a href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank"' : ''}>${item.text}</a></li>`).join('')}
            </ul>
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.corporateStory.title}</h3>
            <p class="about-subtitle-meta"><em>${about.corporateStory.subtitle}</em></p>
            ${about.corporateStory.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.background.title}</h3>
            <ul class="about-list">
                ${about.background.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <div class="about-subsection">
            <h3 class="about-subtitle">${about.beyondWork.title}</h3>
            <div class="beyond-work-grid">
                ${about.beyondWork.items.map(item => `
                    <div class="beyond-work-item">
                        <span class="beyond-work-emoji">${item.emoji}</span>
                        <div>
                            <strong>${item.label}:</strong> ${item.text}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('about-content').innerHTML = aboutHtml;

    // Social Links
    const social = CONTENT.socialLinks;
    document.getElementById('social-linkedin').href = social.linkedin;
    document.getElementById('social-twitter').href = social.twitter;
    document.getElementById('social-substack').href = social.substack;
    document.getElementById('social-email').href = `mailto:${social.email}`;

    // Experiences
    const experiencesHtml = CONTENT.experiences.map(exp => `
        <article class="experience-item">
            <div class="experience-header">
                <h3><a href="${exp.companyUrl}" ${exp.companyUrl.startsWith('http') ? 'target="_blank"' : ''} class="highlight peach">${exp.title}</a></h3>
                <span class="experience-date">${exp.date}</span>
            </div>
            <p class="experience-company">${exp.company}</p>
            <p>${exp.description}</p>
        </article>
    `).join('');
    document.getElementById('experiences-list').innerHTML = experiencesHtml;

    // Projects (for tabs)
    const projectsHtml = CONTENT.projects.map(p => `
        <article class="content-card">
            <span class="card-tag">Project</span>
            <h3><a href="${p.url}" class="highlight ${p.highlight}">${p.name}</a></h3>
            <p>${p.description}</p>
        </article>
    `).join('');
    document.getElementById('projects-grid').innerHTML = projectsHtml;

    // Communities (for tabs)
    const communitiesHtml = CONTENT.communities.map(c => `
        <article class="content-card">
            <span class="card-tag">Community</span>
            <h3><a href="${c.url}" class="highlight ${c.highlight}">${c.name}</a></h3>
            <p>${c.description}</p>
        </article>
    `).join('');
    document.getElementById('communities-grid').innerHTML = communitiesHtml;

    // Everything tab (projects + communities)
    const everythingHtml = [
        ...CONTENT.projects.map(p => `
            <article class="content-card">
                <span class="card-tag">Project</span>
                <h3><a href="${p.url}" class="highlight ${p.highlight}">${p.name}</a></h3>
                <p>${p.description}</p>
            </article>
        `),
        ...CONTENT.communities.map(c => `
            <article class="content-card">
                <span class="card-tag">Community</span>
                <h3><a href="${c.url}" class="highlight ${c.highlight}">${c.name}</a></h3>
                <p>${c.description}</p>
            </article>
        `)
    ].join('');
    document.getElementById('everything-grid').innerHTML = everythingHtml;

    // Fieldnotes
    const fieldnotesHtml = CONTENT.fieldnotes.map(note => `
        <article class="note-card">
            <span class="note-date">${note.date}</span>
            <h3><a href="${note.url}" class="highlight ${note.highlight}">${note.title}</a></h3>
            <p>${note.description}</p>
        </article>
    `).join('');
    document.getElementById('fieldnotes-grid').innerHTML = fieldnotesHtml;

    // Philosophy
    document.getElementById('philosophy-quote').textContent = `"${CONTENT.philosophy.quote}"`;
    const philosophyHtml = CONTENT.philosophy.paragraphs.map(p => `<p>${p}</p>`).join('');
    document.getElementById('philosophy-content').innerHTML = philosophyHtml;

    // Content Worth Consuming
    const consumeHtml = CONTENT.contentWorthConsuming.map(item => `
        <article class="consume-item">
            <span class="consume-type">${item.type}</span>
            <h3><a href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank"' : ''} class="highlight ${item.highlight}">${item.title}</a></h3>
            <p class="consume-author">${item.author}</p>
        </article>
    `).join('');
    document.getElementById('consume-list').innerHTML = consumeHtml;

    // Fun Facts
    const funFactsHtml = CONTENT.funFacts.map(fact => `
        <div class="fun-fact">
            <span class="fun-fact-emoji">${fact.emoji}</span>
            <p>${fact.text}</p>
        </div>
    `).join('');
    document.getElementById('fun-facts-grid').innerHTML = funFactsHtml;

    // Footer
    document.getElementById('footer-text').innerHTML = `${CONTENT.footer} · <span class="year">${new Date().getFullYear()}</span>`;
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
