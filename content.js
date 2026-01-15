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
    name: "SHRADDHA KULKARNI",

    // Your intro paragraph (includes contact line)
    intro: `Hi, I'm Shraddha. I'm into product management. This is my corner of the internet where I share my work, unfinished projects, imperfect experiments and whatever I'm curious about right now. A couple of my friends also think I'm funny. Want to get in touch? Or just say Hi? <a href="https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/" target="_blank">LinkedIn</a>, <a href="mailto:meetshraddhakulkarni@gmail.com">Email</a>, <a href="https://x.com/shraddhaha" target="_blank">Twitter</a>`,

    // Contact line (keeping for backwards compatibility, but now part of intro)
    contactLine: ``,

    // Unique abilities (as bullet points)
    uniqueAbilities: [
        { text: "Substack writing", url: "https://substack.com/@shraddhaha", highlight: "peach" },
        { text: "reciting 100 digits of π from memory", url: "#", highlight: "blue" },
        { text: "knowing all the BMTC routes in BLR by heart", url: "#", highlight: "lavender" },
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
            title: "Product Management / Customer Success",
            company: "ZS Associates",
            companyUrl: "https://www.zs.com/",
            date: "2025 — Present",
            description: `Working on <a href="#" class="highlight blue">Quill</a>, an AI-driven platform for Medical Legal Regulatory (MLR) reviews in pharmaceuticals. Responsibilities include product solutioning, deployment oversight, and client feedback iteration. Awarded <a href="#" class="highlight lavender">Client Impact Champion</a> for on-time delivery with exceptional quality.`
        },
        {
            title: "Business Analyst - Hospitality Analytics",
            company: "ZS Associates",
            companyUrl: "https://www.zs.com/",
            date: "2023 — 2024",
            description: `Led pricing and profitability strategy for a major U.S. hotel chain managing <a href="#" class="highlight lavender">$20M monthly revenue</a>. Advanced data analytics using <a href="#" class="highlight blue">SQL and Python</a> for demand forecasting and revenue optimization. Deputy lead of 13-person team. Named <a href="#" class="highlight lavender">Most Valuable Player</a> among 150+ colleagues.`
        },
        {
            title: "Software Engineering Intern",
            company: "Baker Hughes / General Electric",
            companyUrl: "https://www.bakerhughes.com/",
            date: "2022",
            description: `Automated e-commerce report generation using <a href="#" class="highlight blue">Java and CronJobs</a>, saving 12+ hours/month. Gained B2B insights in the oil and gas industry.`
        },
        {
            title: "Research Engineer",
            company: "Cisco Center of Excellence, RVCE",
            companyUrl: "#",
            date: "2021 — 2022",
            description: `Built <a href="#" class="highlight blue">Crowd Management System</a> integrating OpenPose and BLE beacon localization (40%+ accuracy, 90% faster alerts). Developed <a href="#" class="highlight lavender">YOLOv3-based</a> airport security detection improving false positive rate by 5-8%.`
        }
    ],

    // ==========================================
    // PROJECTS
    // ==========================================
    projects: [
        {
            name: "Quill - MLR Review Platform",
            highlight: "blue",
            description: "AI-driven platform for Medical Legal Regulatory reviews in pharmaceuticals at ZS Associates.",
            url: "#"
        },
        {
            name: "Crowd Management System",
            highlight: "lavender",
            description: "OpenPose + BLE beacon localization achieving 90% reduction in overcrowding alert response time.",
            url: "#"
        },
        {
            name: "Airport Security Detection",
            highlight: "peach",
            description: "YOLOv3-based object detection for threat identification at Cisco Center of Excellence.",
            url: "#"
        },
        {
            name: "SDR Channel Estimation",
            highlight: "blue",
            description: "Software-defined radio channel estimation using LabVIEW and USRP 2920, improving SNR by 9 dB.",
            url: "#"
        }
    ],

    // ==========================================
    // COMMUNITIES
    // ==========================================
    communities: [
        {
            name: "The Apprentice Project",
            highlight: "peach",
            description: "Financial literacy educator creating 35+ videos on SIPs, taxes, and investments (100+ hours).",
            url: "#"
        },
        {
            name: "Make A Difference (MAD)",
            highlight: "blue",
            description: "Academic volunteer tutoring Grade 12 Physics and fundraising volunteer.",
            url: "#"
        },
        {
            name: "UNICEF",
            highlight: "lavender",
            description: "Content creator for teacher training on inclusive materials for students with disabilities.",
            url: "#"
        },
        {
            name: "DIKSHA (NCERT)",
            highlight: "peach",
            description: "Created simplified learning materials for grades 6-8 in government schools.",
            url: "#"
        }
    ],

    // ==========================================
    // FIELDNOTES (blog/thoughts)
    // ==========================================
    fieldnotes: [
        {
            date: "2024",
            title: "On building AI products",
            highlight: "peach",
            description: "Lessons from shipping Quill — balancing ML capabilities with user expectations in regulated industries like pharma.",
            url: "#"
        },
        {
            date: "2024",
            title: "Revenue optimization at scale",
            highlight: "blue",
            description: "What I learned managing $20M in monthly hotel revenue — the interplay of demand forecasting, pricing psychology, and data quality.",
            url: "#"
        },
        {
            date: "2023",
            title: "Teaching financial literacy",
            highlight: "lavender",
            description: "Creating 35+ videos on SIPs, taxes, and investments for underprivileged youth — making complex concepts accessible.",
            url: "#"
        }
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
    // FOOTER
    // ==========================================
    footer: "Made with care in Bangalore"
};
