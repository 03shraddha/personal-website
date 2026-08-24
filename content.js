/**
 * ========================================
 * WEBSITE CONTENT - EDIT THIS FILE!
 * ========================================
 *
 * To update your website, just change the text below.
 * Save the file, refresh your browser, & see the changes!
 *
 * TIPS:
 * - Keep quotes around all text: "your text here"
 * - For links, update both 'text' & 'url'
 * - To highlight text, set 'highlight' to: "peach", "blue", or "lavender"
 * - Set highlight to "" (empty) for no highlight
 */


const CONTENT = {

    // ==========================================
    // PERSONAL INFO
    // ==========================================
    name: "shraddha kulkarni",

    // Hello section intro (landing page)
    helloIntro: `hi i’m shraddha, this is my little corner of the internet where i share my work, unfinished projects & whatever i’m curious about at the moment :)`,

    helloCorner: `<strong>media:</strong> i've been in the <a href="https://x.com/shraddhaha/status/2030900691032768810?s=20" target="_blank" rel="noopener noreferrer" class="highlight peach">newspaper</a> once, then <a href="https://x.com/shraddhaha/status/2036696637528223934?s=20" target="_blank" rel="noopener noreferrer" class="highlight blue">again another time</a>, went on the <a href="https://x.com/shraddhaha/status/2034845228449014104/photo/1" target="_blank" rel="noopener noreferrer" class="highlight lavender">radio</a>, gave a talk at <a href="https://x.com/shraddhaha/status/2057109419943481775?s=20" target="_blank" rel="noopener noreferrer" class="highlight peach">takshashila institution</a> & spoke on a <a href="https://x.com/devfolio/status/2088157946186522752" target="_blank" rel="noopener noreferrer" class="highlight blue">panel about sovereign AI</a> with devfolio`,

    // "These days i’m learning" bullet list
    helloLearning: {
        title: `<strong>these days i’m learning:</strong>`,
        items: [
            `how to be grateful`,
            `how to AI`,
            `how to detach my self worth from my appearance`,
            `how to keep the promises i make to myself`
        ]
    },

    // About section content (structured)
    aboutContent: {
        intro: ``,
        mainText: `i work at <a href="https://www.sarvam.ai/" target="_blank" class="highlight peach">Sarvam AI</a> in their GTM team. Sarvam AI is building foundational AI models & infrastructure for India`,
        mainText2: `before Sarvam, i worked at <a href="https://www.zs.com/" target="_blank" class="highlight blue">ZS Associates</a>, a boutique, pharma-focused management consulting firm, where i helped build agentic AI products for some of the biggest pharma companies in the world`,
        debateText: `for 4 years in college, i was a debate nerd & spent my weekends competing in debate tournaments, winning <a href="https://drive.google.com/drive/folders/1eCzRW-W-MMtbEWGfZ1S08gK0i4EJnvmC" target="_blank" class="highlight lavender">50+ awards</a> at national & international levels`,
        learnAboutMe: {
            title: `the best way to learn about me is through the people i've worked with:`,
            items: [
                { text: "recommendations from past teammates", url: "https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/details/recommendations/", source: "LinkedIn", highlight: "blue" },
                { text: "college senior on my debate journey", url: "https://www.instagram.com/thenalsariv/p/Cwk-XEmvvy6/#", source: "Instagram", highlight: "peach" },
                { text: "college junior on my club leadership", url: "https://www.instagram.com/rvcedebsoc/p/Cr9_QcFpt94/", source: "Instagram", highlight: "peach" }
            ]
        },
        beyondWork: {
            title: "things i do when i'm not working",
            items: [
                { emoji: "💗", label: "before the 9 to 5", text: "before the 9 to 5 & on weekends, you’ll find me cooking, watching YouTube video essays, going on long walks, journaling & catching up with friends across time zones. my 8 journals are where i store notes on interesting ideas from articles, books, tweets & YT videos" },
                { emoji: "💗", label: "financial literacy educator", text: "i have been creating financial literacy videos for The Apprentice Project for over a year" },
                { emoji: "💗", label: "debate judge & competitor", text: "my entire personality in college revolved around being a debate nerd. i have competed in 50+ British Parliamentary debates, <a href=\"https://drive.google.com/drive/u/7/folders/1eCzRW-W-MMtbEWGfZ1S08gK0i4EJnvmC\" target=\"_blank\" class=\"highlight-link pink\">won 40+ awards, & judged 20+ competitions</a>. i was an invited & remunerated judge at IIT Bombay, IIM Indore, NLS Bangalore, & more"},
                { emoji: "💗", label: "bharatanatyam dancer", text: "i’ve always loved dancing, so my parents signed me up for Indian classical dance classes. i ended up doing Bharatanatyam for over 10 years & finished 4 exam levels" }
            ]
        }
    },

    // Contact line — shown below the audio intro
    contactLine: `want to get in touch? or just say hi? <a href="https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/" target="_blank" class="highlight blue">linkedin</a>, <a href="mailto:meetshraddhakulkarni@gmail.com" class="highlight peach">email</a>, <a href="https://x.com/shraddhaha" target="_blank" class="highlight lavender">twitter</a>`,

    // Name in Kannada (for hover effect)
    nameKannada: "ಶ್ರದ್ಧಾ ಕುಲಕರ್ಣಿ",

    // ==========================================
    // SOCIAL LINKS (top-right icons)
    // ==========================================
    socialLinks: {
        linkedin: "https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/",
        twitter: "https://x.com/shraddhaha",
        substack: "https://substack.com/@shraddhaha",
        github: "https://github.com/03shraddha",
        email: "meetshraddhakulkarni@gmail.com",
    },

    // ==========================================
    // EXPERIENCES (work history)
    // ==========================================
    experiences: [
        {
            title: "AI Consulting & Analytics in Healthcare",
            highlight: "peach",
            company: "ZS Associates - Boutique Pharma Consulting Firm",
            companyUrl: "https://www.zs.com/",
            date: "September 2023 - June 2026",
            briefDescription: `Worked on an AI platform for Medical, Legal, & Regulatory (MLR) reviews & pharma content generation for large pharmaceutical companies. Responsible for product solutioning, managing deployments, LLM evals & improving the product based on client feedback.`,
            expandedContent: `
                <h4>Project: GenAI Deployment for a Niche Pharma Use Case (2025 & 2026)</h4>
                <p>★ <strong>Awards & Recognition:</strong><br>
                Fast-tracked promotion achieved in 4 cycles, compared to the firm average of 5 cycles</p>

                <p>★ Won Client Impact Champion Award for delivering a key feature for ZS's Quill Product, used by one of the world's biggest pharma companies</p>

                <p>★ i worked on Quill, ZS's AI platform for MLR (Medical Legal Review), the mandatory pharma process where medical, legal, & regulatory experts vet all promotional content (ads, brochures, websites, patient materials) for accuracy, compliance, & scientific truthfulness before it goes public</p>

                <p>★ On the product team at ZS, was responsible for product solutioning, overseeing deployments, validating end-to-end functionality, writing LLM evaluations to ensure compliant outputs, ensuring the product meets user & business requirements, & iterating based on client feedback</p>

                <h4>Project: Hospitality Analytics (2023 & 2024)</h4>
                <p>★ <strong>Awards & Recognition:</strong><br>
                Earned the "Most Valuable Player" award among 100+ peers across India & Argentina for high quality of work, led the training of a team to win the "Most Meaningful Client Impact" award</p>

                <p>★ <strong>Pricing Profitability Strategy:</strong><br>
                Managed $20M in monthly revenue across 30+ hotels, driving ~8% YoY growth by optimizing pricing strategies through data analytics, market trends, & demand forecasting to maximize profitability</p>

                <p>★ <strong>Advanced Data & Business Analytics:</strong><br>
                Leveraged SQL & Python (back when we had to write our own queries) for demand forecasting, segmentation analysis, price elasticity modeling, competitor benchmarking driving insights that optimized revenue across 1,200 hotels</p>

                <p>★ <strong>Leadership:</strong><br>
                • Deputy lead of a 13-person team, mentoring new joiners & developing members' analytical skills to extract insights from unstructured data<br>
                • Conducted analytics that supported the optimization of US hotel revenue during high-footfall events (such as F1 races & Taylor Swift concerts) & during slow periods caused by disruptions like snowstorms & floods</p>
            `
        },
        {
            title: "Digital Technology Intern",
            highlight: "blue",
            company: "Baker Hughes (A General Electric Company)",
            companyUrl: "https://www.bakerhughes.com/",
            date: "2023",
            briefDescription: `Developed & automated e-commerce reporting, saving 12+ hours per month & enabling faster, data-driven B2B decision-making for shopbakerhughes.com in the oil & gas industry.`,
            expandedContent: `
                <p>★ <strong>Implemented automation solution:</strong><br>
                Developed a Java-based automated reporting script that periodically generated B2B analytics reports from shopbakerhughes.com data, replacing manual processes & enabling business insights</p>

                <p>★ Gained industry insights, understanding B2B operations in oil & gas & renewable energy while working on the Baker Hughes website</p>

                <p><a href="https://drive.google.com/file/d/1GqZ-EVwdi0j0RQUfEV25okyE9NyUkOoC/view?usp=sharing" target="_blank" class="project-cta highlight peach">View Internship Certificate →</a></p>
            `
        },
        {
            title: "Research Engineering Intern, Cisco Center of Excellence at RVCE",
            highlight: "lavender",
            company: "CISCO Center of Excellence at RVCE",
            companyUrl: "https://rvce.edu.in/department/mca/coe_centre_of_excellence_in_internet_of_things_cisco_rvce/",
            date: "2021 - 2022",
            briefDescription: `Project 1 - Built a crowd management system using Bluetooth Low Energy (BLE) for wireless communication & OpenPose. 
            <br> Project 2 - Developed YOLOv3-based airport security detection for dangerous item identification.`,
            expandedContent: `
                <h4>Crowd Management using BLE & OpenPose</h4>
                <p>★ Developed & implemented a real-time crowd management system integrating OpenPose-based pose estimation & Bluetooth Low Energy (BLE) beacon localization to detect & manage overcrowding</p>

                <p>★ Achieved 40%+ accuracy in multi-person tracking, reducing response time for overcrowding alerts by 90%, & enabling authorities to take proactive crowd control measures within seconds using existing CCTV infrastructure</p>

                <h4>Deep Learning for Airport Security: Advanced Object Detection with YOLOv3</h4>
                <p>★ Developed an AI-driven crowd management & safety solution leveraging YOLOv3 to enhance object localization in airport security scans, enabling real-time detection of dangerous items with improved accuracy</p>

                <p>★ Enhanced model performance through hyperparameter tuning & data augmentation, achieving a 5–8% reduction in False Positive Rate (FPR) compared to baseline YOLOv3 models, resulting in more accurate & reliable threat identification in high-security simulations</p>

                <p><a href="https://drive.google.com/file/d/1b1JwcLYDSjBlx3HCvV5PL1hISu4E7UEk/view?usp=sharing" target="_blank" class="project-cta highlight lavender">View Project Report →</a></p>
            `
        },
        {
            title: "RF Antenna Intern",
            highlight: "blue",
            company: "Telimart - The company is an expert OEM & ODM Antenna Designer & Manufacturer",
            companyUrl: "https://www.telimart.com/",
            date: "2022",
            briefDescription: `Using LabVIEW software & USRP 2920 radio hardware, we built a system that analyzes how a wireless channel affects a signal & compensates for noise & distortion. The system estimates channel conditions & improves signal quality, resulting in a 9 dB improvement in signal-to-noise ratio & more reliable wireless communication.`,
            expandedContent: `
                <p>★ <strong>Antenna Engineering:</strong><br>
                Designed & implemented an SDR-based channel estimation & equalization system using LabVIEW & USRP 2920, improving SNR by 9 dB & enhancing wireless signal reliability by mitigating ISI & multipath distortions</p>

                <p>★ <strong>Factory & Business Exposure:</strong><br>
                Gained hands-on experience with electronics procurement & supply chains, working directly in factories with high-value equipment to understand sourcing, maintenance, & operational workflows</p>

                <p><a href="https://drive.google.com/file/d/1hSBLpDlTsVo8vN4z47Ugahn0FP5cryWy/view?usp=sharing" target="_blank" class="project-cta highlight blue">View Project Demo Video →</a></p>
                <p><a href="https://drive.google.com/file/d/1OysW6dYF1CPZ64Mszi-8GOQfVCEZBtyF/view?usp=sharing" target="_blank" class="project-cta highlight blue">Horn & Microstrip Antenna Design by Simulation-Driven Optimization →</a></p>
            `
        }
    ],

    // ==========================================
    // COMMUNITIES
    // ==========================================
    communities: [
        {
            name: "The Apprentice Project",
            highlight: "peach",
            logo: "https://media.licdn.com/dms/image/v2/C510BAQGZwW9Pp717mA/company-logo_200_200/company-logo_200_200/0/1630594091865/the_apprentice_project_2018_logo?e=2147483647&v=beta&t=qPHbmPBSJvwP9P9hbQbCdEnVkGnbShgVkGlT2lBEEPQ",
            briefDescription: "Financial literacy educator creating 35+ videos on SIPs, taxes, & investments (100+ hours).",
            url: "https://www.theapprenticeproject.org/",
            expandedContent: `
                <p>★ <strong>Finance Literacy Consultant:</strong><br>
                Spent 100+ hours creating 35+ financial literacy videos, breaking down topics like SIPs, taxes, & investments for underserved kids</p>

                <p>★ Created educational content focused on making complex financial concepts accessible to young learners from underserved communities</p>

                <p>★ <a href="https://drive.google.com/file/d/1Pqsm-pzSy5xCBxrR7xgTF3pqDwsoBvqr/view?usp=sharing" target="_blank" class="project-cta highlight peach">View my experience @ TAP →</a></p>
            `
        },
        {
            name: "Make A Difference (MAD)",
            highlight: "blue",
            logo: "https://media.licdn.com/dms/image/v2/C510BAQHSolnkv_Jrog/company-logo_200_200/company-logo_200_200/0/1631417254927/make_a_difference_2_logo?e=2147483647&v=beta&t=J7NLD7tkeMazKUC0Yqqp9vL8NaAHXzQb0lbgnjqRKZI",
            briefDescription: "Trained a Grade 12 student in Physics for NEET during COVID through one-on-one tutoring",
            url: "https://makeadiff.in/",
            expandedContent: `
                <p>★ <strong>Academic Support Volunteer:</strong><br>
                Trained a Grade 12 student in Physics for NEET during COVID through one-on-one tutoring sessions</p>

                <p>★ <strong>Fundraising Volunteer:</strong><br>
                Participated in fundraising campaigns supporting children in need</p>

                <p>★ <a href="https://drive.google.com/file/d/1PgLKBESB1GZSTN7XC7z9OgVqX2_rFTTW/view?usp=sharing" target="_blank" class="project-cta highlight blue">View my experience @ MAD →</a></p>
            `
        },
        {
            name: "UNICEF",
            highlight: "lavender",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/1200px-Logo_of_UNICEF.svg.png",
            fallbackEmoji: "🌍",
            briefDescription: "Content creator for teacher training on inclusive materials for students with disabilities.",
            url: "https://www.unicef.org/",
            expandedContent: `
                <p>★ <strong>Content Creator for Teachers:</strong><br>
                Helped create a training module to support government school teachers in making inclusive materials for children with disabilities</p>

                <p>★ Focused on accessibility & inclusive education practices for special needs students in government schools</p>

                <p>★ <a href="https://drive.google.com/file/d/1anM1oXUa1_jSLn2X-t5-QJs0_r0TycsM/view?usp=sharing" target="_blank" class="project-cta highlight lavender">View my experience @ UNICEF →</a></p>
            `
        },
        {
            name: "DIKSHA (NCERT)",
            highlight: "peach",
            logo: "https://vajiramandravi.com/current-affairs/wp-content/uploads/2025/04/diksha_platform-1.jpg",
            fallbackEmoji: "📖",
            briefDescription: "Created simplified NCERT learning materials for grades 6-8 in government schools.",
            url: "https://diksha.gov.in/",
            expandedContent: `
                <p>★ <strong>Content Creator:</strong><br>
                Helped create simplified NCERT learning materials for classes 6–8 in government schools under the Diksha Project</p>

                <p>★ Part of the Digital Infrastructure for Knowledge SHAring (DIKSHA) initiative to improve government education</p>

                <p>★ <a href="https://drive.google.com/file/d/1861I1_Ueh_LcMXlkjF4nYyuQv_1cr3LM/view?usp=sharing" target="_blank" class="project-cta highlight peach">View my experience @ DIKSHA →</a></p>
            `
        }
    ],

    // ==========================================
    // THOUGHTS (formerly fieldnotes) - simple linked list
    // ==========================================
    thoughts: [
        { year: "2026", title: "this is a rant about why AI won't take away all jobs", url: "https://shraddhaha.substack.com/p/this-is-a-rant-about-why-ai-wont" },
        { year: "2026", title: "what if AI wrote this post?", url: "https://shraddhaha.substack.com/p/what-if-ai-wrote-this-post" },
        { year: "2026", title: "my favorite souvenirs are just convivence store snacks", url: "https://shraddhaha.substack.com/p/my-favorite-souvenirs-are-just-connivence" },
        { year: "2026", title: "why \"imperfect\" iphone photos are replacing professional pics", url: "https://shraddhaha.substack.com/p/why-people-prefer-iphone-pics" },
        { year: "2026", title: "are we wrong about why LLMs cannot produce new research?", url: "https://shraddhaha.substack.com/p/are-we-wrong-about-why-llms-cannot" },
        { year: "2026", title: "how much does a 10 minute house help really earn?", url: "https://shraddhaha.substack.com/p/how-much-does-a-10-minute-house-help" },
        { year: "2026", title: "why metrics can mislead us more than we think", url: "https://shraddhaha.substack.com/p/why-metrics-can-mislead-us-more-than" },
        { year: "2026", title: "the case against minimum wages", url: "https://shraddhaha.substack.com/p/the-case-against-minimum-wages" },
        { year: "2026", title: "india's population is not a problem", url: "https://shraddhaha.substack.com/p/indias-population-is-not-a-problem" },
        { year: "2026", title: "the trad wife trend is completely unhinged", url: "https://shraddhaha.substack.com/p/the-trad-wife-trend-is-completely" },
        { year: "2026", title: "weekly reading log #4", url: "https://shraddhaha.substack.com/p/weekly-reading-log-4" },
        { year: "2026", title: "how are railway exams different from the UPSC craze?", url: "https://shraddhaha.substack.com/p/how-are-railway-exams-different-from" },
        { year: "2026", title: "why democracy matters even when voters are wrong", url: "https://shraddhaha.substack.com/p/should-voting-and-elections-be-only" },
    ],

    // ==========================================
    // PHOTOS - Polaroid Gallery
    // ==========================================
    photos: {
        polaroids: [
            // Example format - users can add their own
            // { id: 1, src: "path/to/image.jpg", caption: "Memory caption", zoom: 100, posX: 0, posY: 0 }
        ],
        film: [],
        digital: []
    },

    // ==========================================
    // CONTENT CALENDAR - Track what you consume
    // ==========================================
    // This is the initial/default data. User-added entries are stored in localStorage
    // Categories: article, substack, video, podcast, book
    contentCalendar: [
        // Example entries to show the format:
        // {
        //     id: 1,
        //     date: "2026-01-15",
        //     title: "The Art of Product Management",
        //     url: "https://example.com/article",
        //     category: "article",
        //     source: "Medium",
        //     description: "Great insights on user research"
        // }
    ],

    // ==========================================
    // FOOTER
    // ==========================================
    footer: "Who even reads the text in the footer?"
};
