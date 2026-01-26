/**
 * ========================================
 * WEBSITE CONTENT - EDIT THIS FILE!
 * ========================================
 *
 * To update your website, just change the text below.
 * Save the file, refresh your browser, and see the changes!
 *
 * TIPS:
 * - Keep quotes around all text: "your text here"
 * - For links, update both 'text' and 'url'
 * - To highlight text, set 'highlight' to: "peach", "blue", or "lavender"
 * - Set highlight to "" (empty) for no highlight
 */

const CONTENT = {

    // ==========================================
    // PERSONAL INFO
    // ==========================================
    name: "Shraddha Kulkarni",

    // Hello section intro (landing page)
    helloIntro: `Hi, I'm Shraddha. I’ve worked in analytics and now work in product management. This is my corner of the internet where I share my work, unfinished projects, imperfect experiments and whatever I'm curious about right now. A couple of my friends also think I'm funny. 
    <br><br>
    Want to get in touch? Or just say Hi? <a href="https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/" target="_blank">LinkedIn</a>, <a href="mailto:meetshraddhakulkarni@gmail.com">Email</a>, <a href="https://x.com/shraddhaha" target="_blank">Twitter</a>`,

    // About section content (structured)
    aboutContent: {
        intro: ``,
        mainText: `I work at <a href="https://www.zs.com/" target="_blank" class="highlight peach">ZS Associates</a>, a boutique, pharma-focused management consulting firm. Currently, I'm part of the <a href="https://www.zs.com/solutions/artificial-intelligence-and-analytics/max-ai" target="_blank" class="highlight blue">MAX.AI team</a>, where I help build GenAI products for some of the biggest pharma companies in the world`,
        debateText: `For four years in college, I was a debate nerd and spent my weekends competing in debate tournaments, winning 50+ <a href="https://drive.google.com/drive/folders/1eCzRW-W-MMtbEWGfZ1S08gK0i4EJnvmC" target="_blank" class="highlight lavender">awards</a> at national and international levels.`,
        learnAboutMe: {
            title: `The best way to learn about me is through the people I've worked with:`,
            items: [
                { text: "Recommendations from past teammates", url: "https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/details/recommendations/?detailScreenTabIndex=0", source: "LinkedIn", highlight: "blue" },
                { text: "College senior on my debate journey", url: "https://www.instagram.com/thenalsariv/p/Cwk-XEmvvy6/#", source: "Instagram", highlight: "peach" },
                { text: "College junior on my club leadership", url: "https://www.instagram.com/rvcedebsoc/p/Cr9_QcFpt94/", source: "Instagram", highlight: "peach" },
                { text: "Organizations training future debate champions", url: "https://drive.google.com/file/u/7/d/1HcWGH1M3RsFmPSolJ3hlpTHIEp95An3g/view?usp=sharing", source: "Email", highlight: "lavender" }
            ]
        },
        corporateStory: {
            title: "Corporate Story",
            subtitle: "Areas of interest: Product management | Analytics",
            paragraphs: [
            `Before working on ZS’s GenAI product, Quill, I did analytics for hospitality clients. I used SQL and Python to turn very unstructured data (can’t believe I’m saying this either, but yes, it was unstructured) into real business insights for hotel chains generating millions in revenue.`,
            `In just two years in corporate, I’ve led teams that won multiple client awards. I was named Most Valuable Player out of 150+ colleagues across the India and Argentina offices, and also received ZS’s Impact Award for delivering a GenAI solution for the firm’s largest client, competing with hundreds of teams in the same practice area.`
             ]

        },
        background: {
            title: "A Little Bit of This, A Little Bit of That",
            items: [
                "🪐 I am a Kannadiga, and I live, work, and love blr. I graduated in Electronics from <strong>R.V. College of Engineering</strong> (loved college, but it's a degree I no longer use)",
                "🪐 Interned at <strong>Baker Hughes (a General Electric company)</strong>, where I got my first exposure to B2B business in oil and gas and did some automation work using Java and Spring (learned how a company with ~57,000 employees operates)",
                "🪐 Then I switched to <strong>management consulting and ZS Associates</strong>, where I worked on a hospitality analytics project for one of the largest hotel chains in the U.S., where we used analytics to decide pricing and discount strategies and manage end-to-end hotel revenue.",
                "🪐 Now I work at MAX.AI, where I work on Quill, an <strong>AI-driven platform</strong> that helps pharma teams speed up MLR (Medical Legal Regulatory) reviews, the mandatory process for approving compliant medical and promotional content."
        ]},
        beyondWork: {
            title: "Things I do when I’m not working",
            items: [
                { emoji: "💗", label: "Financial Literacy Educator", text: "I have been creating financial literacy videos for The Apprentice Project for over a year. <a href=\"https://drive.google.com/file/d/1BCo0CJTcdwTMQFUdahyWkdsZcWvAkrpV/view\" target=\"_blank\" class=\"highlight-link\">A sample video I made in the pre-AI days</a>" },                { emoji: "💗", label: "Debate Judge & Competitor", text: "My entire personality in college revolved around being a debate nerd. I have competed in 50+ British Parliamentary debates, <a href=\"https://drive.google.com/drive/u/7/folders/1eCzRW-W-MMtbEWGfZ1S08gK0i4EJnvmC\" target=\"_blank\" class=\"highlight-link pink\">won 40+ awards, and judged 20+ competitions</a>. I was an invited and remunerated judge at IIT Bombay, IIM Indore, NLS Bangalore, and more."},
                { emoji: "💗", label: "Bharatanatyam Dancer", text: "I’ve always loved dancing, so my parents signed me up for Indian classical dance classes. I ended up doing Bharatanatyam for over 10 years and finished 4 exam levels." },
                { emoji: "💗", label: "Before the 9 to 5", text: "Before the 9 to 5 and on weekends, you’ll find me cooking, watching YouTube video essays, going on long walks, journaling, and catching up with friends across time zones. My 6 journals are where I store notes on interesting ideas from articles, books, tweets, and YT videos." }
            ]
        }
    },

    // Contact line (keeping for backwards compatibility)
    contactLine: ``,

    // Unique abilities (as bullet points)
    uniqueAbilities: [

        { text: "reciting 100 digits of π from memory", url: "#", highlight: "" },
        { text: "knowing all the BMTC routes in blr by heart", url: "#", highlight: "" },
        { text: "befriending every apartment cat", url: "#", highlight: "" },
        { text: "recognizing obscure Punjabi songs", url: "#", highlight: "" }
    ],

    // Resume line for recruiters
    resumeLine: `If you're recruiting for product related roles, here's the <a href="https://drive.google.com/file/d/1RYgq1Yahx9fA8f3MXa6L-oN2nfUb8pc8/view" target="_blank" class="highlight peach">link to my resume</a>.`,

    // Name in Kannada (for hover effect)
    nameKannada: "ಶ್ರದ್ಧಾ ಕುಲಕರ್ಣಿ",

    // ==========================================
    // SOCIAL LINKS (top-right icons)
    // ==========================================
    socialLinks: {
        linkedin: "https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/",
        twitter: "https://x.com/shraddhaha",
        substack: "https://substack.com/@shraddhaha",
        email: "meetshraddhakulkarni@gmail.com",
        resume: "https://drive.google.com/file/d/1RYgq1Yahx9fA8f3MXa6L-oN2nfUb8pc8/view"
    },

    // ==========================================
    // COOL THINGS I'VE DONE (bullet points)
    // ==========================================
    coolThings: [
        {
            text: "Working on Quill, an AI-driven platform for Medical Legal Regulatory reviews at ZS Associates",
            highlights: [
                { word: "Quill", color: "blue", url: "#" },
                { word: "ZS Associates", color: "peach", url: "https://www.zs.com/" }
            ]
        },
        {
            text: "Won the Client Impact Champion Award for on-time delivery with exceptional quality",
            highlights: [
                { word: "Client Impact Champion Award", color: "lavender", url: "#" }
            ]
        },
        {
            text: "Named Most Valuable Player among 150+ colleagues at ZS for hospitality analytics work",
            highlights: [
                { word: "Most Valuable Player", color: "lavender", url: "#" }
            ]
        },
        {
            text: "Built crowd management systems using OpenPose & BLE beacons at the Cisco Center of Excellence",
            highlights: [
                { word: "OpenPose & BLE beacons", color: "blue", url: "#" },
                { word: "Cisco Center of Excellence", color: "peach", url: "#" }
            ]
        },
        {
            text: "Created 35+ financial literacy videos for The Apprentice Project, investing 100+ hours",
            highlights: [
                { word: "The Apprentice Project", color: "peach", url: "#" }
            ]
        },
        {
            text: "Won 40+ awards in debate competitions at national and international levels",
            highlights: [
                { word: "debate competitions", color: "lavender", url: "#" }
            ]
        }
    ],

    // ==========================================
    // EXPERIENCES (work history)
    // ==========================================
    experiences: [
        {
            title: "Product Management & Analytics in Healthcare",
            company: "ZS Associates - Boutique Pharma Consulting Firm",
            companyUrl: "https://www.zs.com/",
            date: "2023 — Present",
            briefDescription: `Working on Quill, an AI-driven platform for Medical Legal Regulatory (MLR) reviews in the healthcare industry. Responsibilities include product solutioning, deployment oversight, and client feedback iteration.`,
            expandedContent: `
                <h4>Project – GenAI Deployment for a Niche Pharma Use Case (2025 & 2026)</h4>
                <p>★ <strong>Awards and Recognition:</strong><br>
                - Fast-tracked promotion achieved in 4 cycles, compared to the firm average of 5 cycles.
                <br> - Won Client Impact Champion Award for delivering a key feature for ZS's Quill Product, used by one of the world's biggest pharma companies</p>

                <p>★ I work on the Quill Team at ZS. Quill helps with MLR. In the pharmaceutical industry, Medical Legal Review (MLR) is the process where medical, legal, and regulatory experts carefully check all promotional and scientific documents, such as ads, brochures, websites, manuscripts, and patient materials, to ensure they are accurate, scientifically truthful, comply with regulations, follow company policies, properly reference data, do not mislead, and protect the company from legal or regulatory risks before being shared with healthcare professionals or the public.</p>

                <p>★ On product team for Quill, I help with product solutioning, oversee deployment, validate end-to-end functionality, ensure the product meets user and business requirements, and iterate based on client feedback.</p>

                <h4>Project – Hospitality Analytics (2023 & 2024)</h4>
                <p>★ <strong>Awards and Recognition:</strong><br>
                Earned the "Most Valuable Player" award among 100+ peers across India and Argentina for high quality of work, led the training of a team to win the "Most Meaningful Client Impact" award.</p>

                <p>★ <strong>Pricing Profitability Strategy:</strong><br>
                Managed $20M in monthly revenue across 30+ hotels, driving ~8% YoY growth by optimizing pricing strategies through data analytics, market trends, and demand forecasting to maximize profitability.</p>

                <p>★ <strong>Advanced Data & Business Analytics:</strong><br>
                Leveraged SQL and Python for demand forecasting, segmentation analysis, price elasticity modeling, competitor benchmarking driving insights that optimized revenue across 1,200 hotels</p>

                <p>★ <strong>Leadership:</strong><br>
                Deputy lead of a 13-person team, mentoring new joiners and equipping members with SQL skills to extract insights from unstructured data, optimizing hotel revenue during high-footfall nights and navigating slow seasons</p>
            `
        },
        {
            title: "Digital Technology Intern",
            company: "Baker Hughes (A General Electric Company)",
            companyUrl: "https://www.bakerhughes.com/",
            date: "2023",
            briefDescription: `Developed and automated e-commerce reporting, saving 12+ hours per month and enabling faster, data-driven B2B decision-making for shopbakerhughes.com in the oil & gas industry.`,
            expandedContent: `
                <p>★ <strong>Implemented automation solution:</strong><br>
                Developed a Java-based automated reporting tool that periodically generated B2B analytics reports from shopbakerhughes.com data, replacing manual processes and enabling business insights.</p>

                <p>★ Gained industry insights, understanding B2B operations in oil & gas and renewable energy while working on the Baker Hughes website.</p>

                <p><a href="#" class="project-cta highlight peach">View Project Report →</a></p>
            `
        },
        {
            title: "Research Engineering Intern, Cisco Center of Excellence at RVCE",
            company: "CISCO Center of Excellence at RVCE",
            companyUrl: "https://rvce.edu.in/department/mca/coe_centre_of_excellence_in_internet_of_things_cisco_rvce/",
            date: "2021 — 2022",
            briefDescription: `Project 1 - Built a crowd management system using Bluetooth Low Energy (BLE) for wireless communication and OpenPose. 
            <br> Project 2 - Developed YOLOv3-based airport security detection for dangerous item identification.`,
            expandedContent: `
                <h4>🔸 Crowd Management using BLE and OpenPose:</h4>
                <p>★ Developed and implemented a real-time crowd management system integrating OpenPose-based pose estimation and Bluetooth Low Energy (BLE) beacon localization to detect and manage overcrowding.</p>

                <p>★ Achieved 40%+ accuracy in multi-person tracking, reducing response time for overcrowding alerts by 90%, and enabling authorities to take proactive crowd control measures within seconds using existing CCTV infrastructure.</p>

                <h4>🔸 Deep Learning for Airport Security: Advanced Object Detection with YOLOv3:</h4>
                <p>★ Developed an AI-driven crowd management and safety solution leveraging YOLOv3 to enhance object localization in airport security scans, enabling real-time detection of dangerous items with improved accuracy.</p>

                <p>★ Enhanced model performance through hyperparameter tuning and data augmentation, achieving a 5–8% reduction in False Positive Rate (FPR) compared to baseline YOLOv3 models, resulting in more accurate and reliable threat identification in high-security simulations.</p>

                <p><a href="#" class="project-cta highlight lavender">View Project Report →</a></p>
            `
        },
        {
            title: "RF Antenna Intern",
            company: "Telimart - The company is an expert OEM & ODM Antenna Designer & Manufacturer",
            companyUrl: "",
            date: "2022",
            briefDescription: `Using LabVIEW software and USRP 2920 radio hardware, we built a system that analyzes how a wireless channel affects a signal and compensates for noise and distortion. The system estimates channel conditions and improves signal quality, resulting in a 9 dB improvement in signal-to-noise ratio and more reliable wireless communication.`,
            expandedContent: `
                <p>★ <strong>Antenna Engineering:</strong><br>
                Designed and implemented an SDR-based channel estimation and equalization system using LabVIEW and USRP 2920, improving SNR by 9 dB and enhancing wireless signal reliability by mitigating ISI and multipath distortions.</p>

                <p>★ <strong>Factory and Business Exposure:</strong><br>
                Gained hands-on experience with electronics procurement and supply chains, working directly in factories with high-value equipment to understand sourcing, maintenance, and operational workflows.</p>

                <p><a href="#" class="project-cta highlight blue">View Project Demo Video →</a></p>
            `
        }
    ],

    // ==========================================
    // PROJECTS
    // ==========================================
    projects: [
        {
            name: "Quill - MLR Review Platform",
            highlight: "blue",
            briefDescription: "AI-driven platform for Medical Legal Regulatory reviews in pharmaceuticals at ZS Associates.",
            url: "#",
            expandedContent: `
                <p class="project-detail-intro">★ <strong>Awards and Recognition:</strong><br>
                Won Client Impact Champion Award for pulling crazy hours with my team to deliver a key feature for ZS's Quill Product, used by one of the world's biggest pharma clients</p>

                <p>★ I work on the Quill Team at ZS. Quill helps with MLR. In the pharmaceutical industry, Medical Legal Review (MLR) is the process where medical, legal, and regulatory experts carefully check all promotional and scientific documents, such as ads, brochures, websites, manuscripts, and patient materials, to ensure they are accurate, scientifically truthful, comply with regulations, follow company policies, properly reference data, do not mislead, and protect the company from legal or regulatory risks before being shared with healthcare professionals or the public.</p>

                <p>★ On product team for Quill, I help with product solutioning, oversee deployment, validate end-to-end functionality, ensure the product meets user and business requirements, and iterate based on client feedback.</p>
            `
        },
        {
            name: "Crowd Management System",
            highlight: "lavender",
            briefDescription: "OpenPose + BLE beacon localization achieving 90% reduction in overcrowding alert response time.",
            url: "#",
            expandedContent: `
                <p>★ Built at CISCO Center of Excellence, R.V. College of Engineering</p>

                <p>★ Integrated OpenPose pose estimation with BLE beacon localization for real-time crowd density monitoring and tracking.</p>

                <p>★ Achieved 40%+ improvement in crowd localization accuracy compared to baseline systems.</p>

                <p>★ Reduced overcrowding alert response time by 90%, enabling faster evacuation and safety measures.</p>
            `
        },
        {
            name: "Airport Security Detection",
            highlight: "peach",
            briefDescription: "YOLOv3-based object detection for threat identification at Cisco Center of Excellence.",
            url: "#",
            expandedContent: `
                <p>★ Developed at Cisco Center of Excellence, R.V. College of Engineering</p>

                <p>★ Implemented YOLOv3 deep learning model for real-time threat detection in airport security footage.</p>

                <p>★ Improved false positive rate by 5-8% compared to existing systems, reducing unnecessary security checks.</p>

                <p>★ Trained on custom dataset of prohibited items for airport security scenarios.</p>
            `
        },
        {
            name: "SDR Channel Estimation",
            highlight: "blue",
            briefDescription: "Software-defined radio channel estimation using LabVIEW and USRP 2920, improving SNR by 9 dB.",
            url: "#",
            expandedContent: `
                <p>★ Final year engineering project focused on wireless communication optimization.</p>

                <p>★ Used LabVIEW and USRP 2920 software-defined radio platform for implementation.</p>

                <p>★ Achieved 9 dB improvement in Signal-to-Noise Ratio through advanced channel estimation techniques.</p>

                <p>★ Demonstrated practical applications in improving wireless communication reliability.</p>
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
            briefDescription: "Financial literacy educator creating 35+ videos on SIPs, taxes, and investments (100+ hours).",
            url: "https://www.theapprenticeproject.org/",
            expandedContent: `
                <p>★ <strong>Finance Literacy Consultant:</strong><br>
                Spent 100+ hours creating 35+ financial literacy videos, breaking down topics like SIPs, taxes, and investments for underserved kids.</p>

                <p>★ Created educational content focused on making complex financial concepts accessible to young learners from underserved communities.</p>

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
                Trained a Grade 12 student in Physics for NEET during COVID through one-on-one tutoring sessions.</p>

                <p>★ <strong>Fundraising Volunteer:</strong><br>
                Participated in fundraising campaigns supporting children in need.</p>

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
                Helped create a training module to support government school teachers in making inclusive materials for children with disabilities.</p>

                <p>★ Focused on accessibility and inclusive education practices for special needs students in government schools.</p>

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
                Helped create simplified NCERT learning materials for classes 6–8 in government schools under the Diksha Project.</p>

                <p>★ Part of the Digital Infrastructure for Knowledge SHAring (DIKSHA) initiative to improve government education.</p>

                <p>★ <a href="https://drive.google.com/file/d/1861I1_Ueh_LcMXlkjF4nYyuQv_1cr3LM/view?usp=sharing" target="_blank" class="project-cta highlight peach">View my experience @ DIKSHA →</a></p>
            `
        }
    ],

    // ==========================================
    // THOUGHTS (formerly fieldnotes) - simple linked list
    // ==========================================
    thoughts: [
        { year: "2025", title: "WordPress Explorations: Application Menu", url: "#" },
        { year: "2024", title: "On building AI products", url: "#" },
        { year: "2024", title: "Revenue optimization at scale", url: "#" },
        { year: "2023", title: "Teaching financial literacy", url: "#" }
    ],

    // ==========================================
    // PHILOSOPHY
    // ==========================================
    philosophy: {
        quote: "Build things that matter. Ship early. Learn fast. Help others along the way.",
        paragraphs: [
            `I believe in <a href="#" class="highlight peach">impact over perfection</a> — shipping early, learning from real users, and iterating relentlessly. The best products come from <a href="#" class="highlight blue">deep empathy</a> and understanding the humans you're building for.`,
            `My approach combines <a href="#" class="highlight lavender">analytical rigor</a> with creative problem-solving. Whether it's pricing strategy for hotels, AI products for pharma, or teaching financial literacy — the goal is always to create meaningful impact.`,
            `I value <a href="#" class="highlight peach">curiosity over certainty</a>, <a href="#" class="highlight blue">collaboration over ego</a>, and <a href="#" class="highlight lavender">giving back</a> through teaching and mentorship.`
        ]
    },

    // ==========================================
    // CONTENT WORTH CONSUMING
    // ==========================================
    contentWorthConsuming: [
        {
            type: "Substack",
            title: "My Writing",
            highlight: "peach",
            author: "Essays on product, tech, and life",
            url: "https://substack.com/@shraddhaha"
        },
        {
            type: "Interest",
            title: "Documentary Video Essays",
            highlight: "blue",
            author: "Long-form storytelling that makes you think",
            url: "#"
        },
        {
            type: "Practice",
            title: "Bharatanatyam",
            highlight: "lavender",
            author: "10+ years, 4 exam levels completed",
            url: "#"
        },
        {
            type: "Hobby",
            title: "Journaling",
            highlight: "peach",
            author: "Daily reflections and idea capture",
            url: "#"
        }
    ],

    // ==========================================
    // FUN FACTS
    // ==========================================
    funFacts: [
        { emoji: "🥧", text: "Can recite <strong>100 digits of π</strong> from memory" },
        { emoji: "🚌", text: "Knows all <strong>BMTC bus routes</strong> in Bangalore" },
        { emoji: "🐱", text: "Has befriended <strong>every apartment cat</strong>" },
        { emoji: "🎵", text: "Can recognize <strong>obscure Punjabi songs</strong>" },
        { emoji: "🏆", text: "<strong>50+ debates</strong> competed, <strong>40+ awards</strong> won" },
        { emoji: "💃", text: "<strong>10+ years</strong> of Bharatanatyam" }
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
