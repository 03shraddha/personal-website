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
    helloIntro: `hi, i’m shraddha, welcome to my little corner of the internet, a sneak peek into my inner world and the things i’m interested in`,

    helloCorner: `<strong>media:</strong>
    <ul class="media-list">
        <li>i've been in the <a href="https://x.com/shraddhaha/status/2030900691032768810?s=20" target="_blank" rel="noopener noreferrer" class="highlight peach">newspaper</a> once</li>
        <li><a href="https://x.com/shraddhaha/status/2036696637528223934?s=20" target="_blank" rel="noopener noreferrer" class="highlight blue">again another time</a></li>
        <li>gave a talk at <a href="https://x.com/shraddhaha/status/2057109419943481775?s=20" target="_blank" rel="noopener noreferrer" class="highlight peach">takshashila institution</a></li>
        <li>you can watch me demo sarvam's voice agent's platform <a href="https://www.youtube.com/watch?v=zHaS7FekcWA&t" target="_blank" rel="noopener noreferrer" class="highlight lavender">here</a></li>
        <li>spoke on a <a href="https://x.com/devfolio/status/2088157946186522752" target="_blank" rel="noopener noreferrer" class="highlight blue">panel about sovereign AI</a> with devfolio</li>
    </ul>`,

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
        mainText: `i’m on the GTM & Strategy team at <a href="https://www.sarvam.ai/" target="_blank" class="highlight peach">Sarvam</a>. i get to work with India’s biggest businesses to help them build all kinds of applications using our models and inference stack`,
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
                <h4>Project: Agentic AI Deployment for a Niche Pharma Use Case (2025 & 2026)</h4>
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
    // VIDEOS - LinkedIn video posts, newest first (shown under the "watch me" toggle in thoughts)
    videosUrl: "https://www.linkedin.com/in/shraddha-kulkarni-6abb5a188/recent-activity/videos/",
    videos: [
        { title: "how do teams building speech models use jev for asr evals?", url: "https://www.linkedin.com/feed/update/urn:li:activity:7511851096064094209/", date: "Oct 2, 2026", duration: "6:57", poster: "https://media.licdn.com/dms/image/v2/D5605AQG-4bMbiGRrbQ/videocover-high/B56aD90oe8HABM-/0/1790964832962?e=2147483647&v=beta&t=_6lcNJjBwpzrHIR3GWGGCmRjNjNhUukrLrN0mZrTmi4", video: "https://dms.licdn.com/playlist/vid/v2/D5605AQG-4bMbiGRrbQ/mp4-720p-30fp-crf28/B56aD90oe8HAB8-/0/1790964855791?e=2147483647&v=beta&t=XPw9gMrSlyWPaYuD0P3oBuqDQYJP-f02a48gh3Ek7nM" },
        { title: "why are ai models priced the way they are?", url: "https://www.linkedin.com/feed/update/urn:li:activity:7502353566687350784/", date: "Sep 6, 2026", duration: "12:55", poster: "https://media.licdn.com/dms/image/v2/D5605AQGpGE8KWLcxDQ/videocover-high/B56aB22jMpHIBQ-/0/1788700412327?e=2147483647&v=beta&t=ZO42geDCLWY4BECi_MDpbTXaKPS8DGjVo274wEmkqSI", video: "https://dms.licdn.com/playlist/vid/v2/D5605AQGpGE8KWLcxDQ/mp4-720p-30fp-crf28/B56aB22jMpHICA-/0/1788700460221?e=2147483647&v=beta&t=GLH5sIX1SW_Tnt3kJiHUuP7nJmZCJpp9kOpjC1G-fNk" },
    ],

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
    // LABS - Personal experiments (static, not tracked)
    // ==========================================
    labs: {
        intro: `inspired by anne-laure le cunff's tiny experiments`,
        month: `september and october 2026`,
        items: [
            "meditate for 30 days for 10 minutes",
            "wake up before 8am, no matter what time i go to bed the night before",
            "journal before i look at a screen"
        ]
    },

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
    // POETRY - poems I'm reading and loving (shown under "poetry" in content worth consuming)
    // Keep the excerpt short; the url sends readers to the full poem.
    // ==========================================
    poetryUrl: "",
    poetry: [
        // full: true shows the whole poem on the site (public domain). Otherwise a short excerpt + link to the original.
        { title: "The Prophet: On Work", poet: "Kahlil Gibran", url: "https://monadnock.net/gibran/work.html", full: true,
          excerpt: "Then a ploughman said, Speak to us of Work.\n\nAnd he answered, saying:\n\nYou work that you may keep pace with the earth and the soul of the earth.\nFor to be idle is to become a stranger unto the seasons, and to step out of life's procession that marches in majesty and proud submission towards the infinite.\n\nWhen you work you are a flute through whose heart the whispering of the hours turns to music.\nWhich of you would be a reed, dumb and silent, when all else sings together in unison?\n\nAlways you have been told that work is a curse and labour a misfortune.\nBut I say to you that when you work you fulfill a part of earth's furthest dream, assigned to you when that dream was born,\nAnd in keeping yourself with labour you are in truth loving life,\nAnd to love life through labour is to be intimate with life's inmost secret.\n\nBut if you in your pain call birth an affliction and the support of the flesh a curse written upon your brow, then I answer that naught but the sweat of your brow shall wash away that which is written.\n\nYou have been told also that life is darkness, and in your weariness you echo what was said by the weary.\nAnd I say that life is indeed darkness save when there is urge,\nAnd all urge is blind save when there is knowledge.\nAnd all knowledge is vain save when there is work,\nAnd all work is empty save when there is love;\nAnd when you work with love you bind your self to yourself, and to one another, and to God.\n\nAnd what is it to work with love?\nIt is to weave the cloth with threads drawn from your heart, even as if your beloved were to wear that cloth.\nIt is to build a house with affection, even as if your beloved were to dwell in that house.\nIt is to sow seeds with tenderness and reap the harvest with joy, even as if your beloved were to eat the fruit.\nIt is to charge all things you fashion with a breath of your own spirit,\nAnd to know that all the blessed dead are standing about you and watching.\n\nOften have I heard you say, as if speaking in sleep, \"He who works in marble, and finds the shape of his own soul in the stone, is nobler than he who ploughs the soil.\nAnd he who seizes the rainbow to lay it on a cloth in the likeness of man, is more than he who makes the sandals for our feet.\"\nBut I say, not in sleep, but in the overwakefulness of noontide, that the wind speaks not more sweetly to the giant oaks than to the least of all the blades of grass;\nAnd he alone is great who turns the voice of the wind into a song made sweeter by his own loving.\n\nWork is love made visible. And if you cannot work with love but only with distaste, it is better that you should leave your work and sit at the gate of the temple and take alms of those who work with joy.\nFor if you bake bread with indifference, you bake a bitter bread that feeds but half man's hunger.\nAnd if you grudge the crushing of the grapes, your grudge distills a poison in the wine.\nAnd if you sing though as angels, and love not the singing, you muffle man's ears to the voices of the day and the voices of the night." },
        { title: "Duty and Joy", poet: "Rabindranath Tagore", url: "https://redtreetimes.com/2020/06/19/duty-and-joy/", full: true,
          excerpt: "I slept and dreamt\nthat life was joy.\nI awoke and saw\nthat life was duty.\nI worked — and behold,\nduty was joy." },
        { title: "Wild Geese", poet: "Mary J Oliver", url: "https://allpoetry.com/poem/15374223-Wild-geese-by-Mary-J-Oliver",
          excerpt: "You do not have to be good.\nYou do not have to walk on your knees\nFor a hundred miles through the desert, repenting.\nYou only have to let the soft animal of your body\nlove what it loves.\nTell me about despair, yours, and I will tell you mine.\nMeanwhile the world goes on.\nMeanwhile the sun and the clear pebbles of the rain\nare moving across the landscapes,\nover the prairies and the deep trees,\nthe mountains and the rivers.\nMeanwhile the wild geese, high in the clean blue air,\nare heading home again.\nWhoever you are, no matter how lonely,\nthe world offers itself to your imagination,\ncalls to you like the wild geese, harsh and exciting --\nover and over announcing your place\nin the family of things." },
    ],

    // ==========================================
    // FAV QUOTES - the "fav quotes" tab only shows up once this list has entries
    // { text, by, url (original), linkLabel, more: true if the text is cut short }
    // ==========================================
    quotes: [
        { text: "Climb mountains not so the world can see you, but so you can see the world.", by: "David McCullough Jr.",
          url: "https://www.goodreads.com/quotes/8556799-climb-mountains-not-so-the-world-can-see-you-but", linkLabel: "see the source" },
        { text: "you dont skip the shower just because you dont have soap, or warm water, or perfect circumstances. rinsing off, even poorly, even miserably, beats being a stench aura grease monkey. so why do you do it with everything else that matters? you skip the thing because it cant be\u2026", by: "dante (@dantefofante)",
          url: "https://x.com/dantefofante/status/2107508682854404185", linkLabel: "see the original tweet", more: true },
        { text: "you don\u2019t get to spend your days doing whatever feels easiest and then act personally offended when your life reflects it. there\u2019s a consequence to the way you spend your time. eventually, the life you\u2019ve been imagining has to compete with the life you\u2019ve actually been creating.", by: "jo johnson (@josbjohnson)",
          url: "https://x.com/josbjohnson/status/2106015361590026632", linkLabel: "see the original tweet", more: true },
        { text: "If you tweet like the internet is your friend, then sometimes it actually does become your friend", by: "maja (@majamediaco)",
          url: "https://x.com/majamediaco/status/2105852522913223030", linkLabel: "see the original tweet" },
        { text: "People do not seem to realize that their opinion of the world is also a confession of character.", by: "Lilly | The Commonplace Circle (Substack note)",
          url: "https://substack.com/@lillythecommonplacecircle/note/c-357591987", linkLabel: "see the original note" },
        { text: "I don\u2019t think becoming the best always means becoming better than someone else. Sometimes it means developing your abilities into something so distinctly your own that there is no useful comparison.", by: "Karri Saarinen, room for ambition",
          url: "https://karrisaarinen.com/posts/room-for-ambition/", linkLabel: "read the post" },
    ],

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
