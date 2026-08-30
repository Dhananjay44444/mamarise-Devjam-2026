// videoService.js
// Career Restart Video Course Catalog & Recommendation Service for MamaRise

export const COURSE_TRACKS = [
  { id: "all", label: "All Career Tracks", icon: "Sparkles" },
  { id: "uiux", label: "UI / UX Design", icon: "Layout" },
  { id: "python", label: "Python & AI Programming", icon: "Code2" },
  { id: "data", label: "Data & Business Analytics", icon: "BarChart3" },
  { id: "pm", label: "Product Management", icon: "Briefcase" },
  { id: "selffinancing", label: "Self-Financing & Freelance", icon: "DollarSign" },
  { id: "webdev", label: "Modern Web Dev (React)", icon: "Globe" },
  { id: "marketing", label: "Digital Marketing & SEO", icon: "TrendingUp" },
  { id: "leadership", label: "Leadership & Confidence", icon: "Award" },
  { id: "cloud", label: "Cloud & DevOps (AWS)", icon: "Cloud" },
  { id: "java", label: "Java Development", icon: "Terminal" },
];

export const CAREER_VIDEO_CATALOG = [
  // ================= UI / UX DESIGN =================
  {
    id: "vid-uiux-figma-01",
    track: "uiux",
    title: "Figma UI/UX Design Masterclass: From Wireframe to Interactive Prototype",
    creator: "freeCodeCamp.org (Taught by Daniel Walter Scott)",
    channel: "freeCodeCamp.org",
    duration: "24:15",
    durationSeconds: 1455,
    views: "1.4M views",
    viewCountNum: 1400000,
    category: "UI / UX Design",
    difficulty: "Beginner Friendly",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/jwCmIBJ8Jtc",
    externalUrl: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc",
    tags: ["uiux", "figma", "wireframing", "prototyping", "design"],
    whyRecommended: "Ideal for flexible remote design roles; learn modern component architecture at your own pace.",
    rating: "4.9 ★ (Certified)",
  },
  {
    id: "vid-uiux-research-02",
    track: "uiux",
    title: "UX Research & User Persona Foundations: Build Real Client Case Studies",
    creator: "Mizko (Design Strategist)",
    channel: "Mizko Academy",
    duration: "18:30",
    durationSeconds: 1110,
    views: "520K views",
    viewCountNum: 520000,
    category: "UI / UX Design",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    externalUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
    tags: ["uiux", "ux_research", "personas", "case_study", "portfolio"],
    whyRecommended: "Master user interviewing and UX problem-solving to build impressive resume case studies.",
    rating: "4.8 ★",
  },
  {
    id: "vid-uiux-designsystems-03",
    track: "uiux",
    title: "Design Systems & Auto-Layout in Figma: Professional Component Sets",
    creator: "Figma Official Learning",
    channel: "Figma",
    duration: "15:45",
    durationSeconds: 945,
    views: "890K views",
    viewCountNum: 890000,
    category: "UI / UX Design",
    difficulty: "Practical Skills",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/2a6q9k_UaD4",
    externalUrl: "https://www.youtube.com/watch?v=2a6q9k_UaD4",
    tags: ["uiux", "figma", "design_systems", "components", "tokens"],
    whyRecommended: "High-demand industry skill for scalable product teams and high-paying remote roles.",
    rating: "4.9 ★",
  },

  // ================= PYTHON PROGRAMMING =================
  {
    id: "vid-python-core-01",
    track: "python",
    title: "Python Programming for Beginners: 0 to Job-Ready Essentials",
    creator: "Programming with Mosh",
    channel: "Programming with Mosh",
    duration: "30:00",
    durationSeconds: 1800,
    views: "4.8M views",
    viewCountNum: 4800000,
    category: "Python Programming",
    difficulty: "Beginner Friendly",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    externalUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    tags: ["python", "coding", "basics", "software", "backend"],
    whyRecommended: "Cleanest entry point to software engineering with flexible remote work opportunities.",
    rating: "4.9 ★ (Most Popular)",
  },
  {
    id: "vid-python-automation-02",
    track: "python",
    title: "Automate Everyday Tasks with Python: Excel, Web Scraping & Emails",
    creator: "Tech With Tim & freeCodeCamp",
    channel: "freeCodeCamp.org",
    duration: "22:10",
    durationSeconds: 1330,
    views: "1.1M views",
    viewCountNum: 1100000,
    category: "Python Programming",
    difficulty: "High Practical Value",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
    externalUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    tags: ["python", "automation", "scripts", "excel", "freelancing"],
    whyRecommended: "Automate spreadsheet chores and build quick client automation scripts for freelance income.",
    rating: "4.8 ★",
  },
  {
    id: "vid-python-data-03",
    track: "python",
    title: "Data Analysis with Python, Pandas & NumPy: Step-by-Step Crash Course",
    creator: "Keith Galli (MIT Grad)",
    channel: "Keith Galli",
    duration: "25:40",
    durationSeconds: 1540,
    views: "980K views",
    viewCountNum: 980000,
    category: "Python Programming",
    difficulty: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/r-uOLxNrNk8",
    externalUrl: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
    tags: ["python", "data", "pandas", "analytics", "visualization"],
    whyRecommended: "High-paying hybrid roles in business analytics, operations, and business intelligence.",
    rating: "4.9 ★",
  },

  // ================= JAVA DEVELOPMENT =================
  {
    id: "vid-java-core-01",
    track: "java",
    title: "Java Programming Fundamentals & Object-Oriented Design Principles",
    creator: "Bro Code & Telusko",
    channel: "Bro Code",
    duration: "28:15",
    durationSeconds: 1695,
    views: "3.2M views",
    viewCountNum: 3200000,
    category: "Java Development",
    difficulty: "Beginner to Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/A74TOX803D0",
    externalUrl: "https://www.youtube.com/watch?v=A74TOX803D0",
    tags: ["java", "oop", "backend", "enterprise", "software"],
    whyRecommended: "Enterprise-standard backbone language for stable corporate returnships and backend engineering.",
    rating: "4.9 ★",
  },
  {
    id: "vid-java-springboot-02",
    track: "java",
    title: "Spring Boot & REST API Development: Build Your First Microservice",
    creator: "Nelson Djalo (Amigoscode)",
    channel: "Amigoscode",
    duration: "26:50",
    durationSeconds: 1610,
    views: "1.6M views",
    viewCountNum: 1600000,
    category: "Java Development",
    difficulty: "Industry Ready",
    thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/9SGDpanrc8U",
    externalUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    tags: ["java", "springboot", "api", "microservices", "cloud"],
    whyRecommended: "Most requested skill in modern enterprise software interviews and technical evaluations.",
    rating: "4.9 ★ (Certified)",
  },

  // ================= SELF-FINANCING & FREELANCING =================
  {
    id: "vid-self-freelance-01",
    track: "selffinancing",
    title: "How to Build a $3K/Mo Freelance Business from Home Around Childcare",
    creator: "Ali Abdaal & Sinéad Connolly (Remote Career Strategists)",
    channel: "Ali Abdaal",
    duration: "19:20",
    durationSeconds: 1160,
    views: "2.1M views",
    viewCountNum: 2100000,
    category: "Self-Financing & Freelancing",
    difficulty: "High ROI / Practical",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/9BqSgzW9-zY",
    externalUrl: "https://www.youtube.com/watch?v=9BqSgzW9-zY",
    tags: ["selffinancing", "freelance", "remote_work", "pricing", "clients"],
    whyRecommended: "Step-by-step framework to land high-ticket freelance clients without 9-to-5 commute constraints.",
    rating: "4.9 ★",
  },
  {
    id: "vid-self-digital-02",
    track: "selffinancing",
    title: "Digital Products & Micro-Consulting: Creating Predictable Monthly Cashflow",
    creator: "Vanessa Lau (Creator Economy Educator)",
    channel: "Vanessa Lau",
    duration: "16:45",
    durationSeconds: 1005,
    views: "870K views",
    viewCountNum: 870000,
    category: "Self-Financing & Freelancing",
    difficulty: "Independent Income",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/bNlxvS0R7x4",
    externalUrl: "https://www.youtube.com/watch?v=bNlxvS0R7x4",
    tags: ["selffinancing", "digital_products", "consulting", "passive_income"],
    whyRecommended: "Turn your past corporate domain expertise into scalable consulting packages and templates.",
    rating: "4.8 ★",
  },

  // ================= DATA & BUSINESS ANALYTICS =================
  {
    id: "vid-data-analytics-01",
    track: "data",
    title: "Data Analytics Full Course: From Excel Spreadsheets to SQL & Dashboards",
    creator: "Alex The Analyst (Senior Data Manager)",
    channel: "Alex The Analyst",
    duration: "27:10",
    durationSeconds: 1630,
    views: "2.3M views",
    viewCountNum: 2300000,
    category: "Data & Business Analytics",
    difficulty: "High Employment Demand",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/Caq_3w3vY64",
    externalUrl: "https://www.youtube.com/watch?v=Caq_3w3vY64",
    tags: ["data", "sql", "excel", "powerbi", "analytics"],
    whyRecommended: "Analytical roles allow immense flexibility and high compensation for problem-solving mothers.",
    rating: "4.9 ★",
  },
  {
    id: "vid-data-powerbi-02",
    track: "data",
    title: "Power BI & Interactive Business Dashboards in 30 Minutes",
    creator: "Chandoo (Microsoft MVP)",
    channel: "Chandoo",
    duration: "20:05",
    durationSeconds: 1205,
    views: "1.5M views",
    viewCountNum: 1500000,
    category: "Data & Business Analytics",
    difficulty: "Fast Skill Acquisition",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/HXV3zeRR3h4",
    externalUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
    tags: ["data", "powerbi", "dashboards", "business_intelligence"],
    whyRecommended: "Build visual business reporting tools that immediately prove technical capability to recruiters.",
    rating: "4.9 ★",
  },

  // ================= PRODUCT MANAGEMENT =================
  {
    id: "vid-pm-fundamentals-01",
    track: "pm",
    title: "Product Management Full Course: From Ideation to Agile Roadmap",
    creator: "freeCodeCamp.org & Product School",
    channel: "freeCodeCamp.org",
    duration: "26:30",
    durationSeconds: 1590,
    views: "1.8M views",
    viewCountNum: 1800000,
    category: "Product Management",
    difficulty: "Strategic & Practical",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/502ILHjX9EE",
    externalUrl: "https://www.youtube.com/watch?v=502ILHjX9EE",
    tags: ["pm", "product_management", "agile", "roadmaps", "strategy"],
    whyRecommended: "Ideal for mothers with prior organizational and leadership skills returning to tech product roles.",
    rating: "4.9 ★ (Certified)",
  },
  {
    id: "vid-pm-prd-02",
    track: "pm",
    title: "How to Write High-Impact PRDs & Agile User Stories with Real Examples",
    creator: "Diego Granados (Senior PM)",
    channel: "Diego Granados",
    duration: "18:40",
    durationSeconds: 1120,
    views: "640K views",
    viewCountNum: 640000,
    category: "Product Management",
    difficulty: "Industry Ready",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/k41U6Q2N0gU",
    externalUrl: "https://www.youtube.com/watch?v=k41U6Q2N0gU",
    tags: ["pm", "prd", "user_stories", "jira", "specs"],
    whyRecommended: "Master concise documentation and cross-functional team alignment.",
    rating: "4.8 ★",
  },

  // ================= MODERN WEB DEV (REACT) =================
  {
    id: "vid-webdev-react-01",
    track: "webdev",
    title: "React JS 2026 Crash Course: Build Real-World Production Web Apps",
    creator: "Traversy Media & freeCodeCamp",
    channel: "Traversy Media",
    duration: "29:15",
    durationSeconds: 1755,
    views: "3.5M views",
    viewCountNum: 3500000,
    category: "Modern Web Dev (React)",
    difficulty: "High Remote Demand",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
    externalUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    tags: ["webdev", "react", "javascript", "frontend", "components"],
    whyRecommended: "React remains the #1 requested frontend framework for flexible remote engineering contracts.",
    rating: "4.9 ★ (Most Popular)",
  },
  {
    id: "vid-webdev-tailwind-02",
    track: "webdev",
    title: "Tailwind CSS & Modern UI Component Architecture in 20 Minutes",
    creator: "Kevin Powell (CSS Specialist)",
    channel: "Kevin Powell",
    duration: "19:50",
    durationSeconds: 1190,
    views: "920K views",
    viewCountNum: 920000,
    category: "Modern Web Dev (React)",
    difficulty: "Rapid UI Polish",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/mr15Xzb1Ook",
    externalUrl: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
    tags: ["webdev", "tailwind", "css", "responsive", "design"],
    whyRecommended: "Ship modern responsive web layouts in a fraction of traditional styling time.",
    rating: "4.9 ★",
  },

  // ================= DIGITAL MARKETING & SEO =================
  {
    id: "vid-mktg-growth-01",
    track: "marketing",
    title: "Digital Marketing Full Course: SEO, Content Strategy & Ad Funnels",
    creator: "Simplilearn & HubSpot Academy",
    channel: "Simplilearn",
    duration: "25:20",
    durationSeconds: 1520,
    views: "2.8M views",
    viewCountNum: 2800000,
    category: "Digital Marketing & SEO",
    difficulty: "Practical Growth",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/nU-IIXBWlS4",
    externalUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4",
    tags: ["marketing", "seo", "growth", "ads", "content"],
    whyRecommended: "Drive measurable organic traffic and customer acquisition for remote clients.",
    rating: "4.9 ★",
  },

  // ================= LEADERSHIP & CONFIDENCE =================
  {
    id: "vid-lead-confidence-01",
    track: "leadership",
    title: "Executive Presence & Confident Communication for Returning Professionals",
    creator: "Stanford Graduate School of Business (Taught by Matt Abrahams)",
    channel: "Stanford GSB",
    duration: "21:40",
    durationSeconds: 1300,
    views: "4.1M views",
    viewCountNum: 4100000,
    category: "Leadership & Confidence",
    difficulty: "High Impact",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/HAnw168huqA",
    externalUrl: "https://www.youtube.com/watch?v=HAnw168huqA",
    tags: ["leadership", "confidence", "executive_presence", "interview", "speaking"],
    whyRecommended: "Master spontaneous speaking, executive poise, and interview authority after maternity leave.",
    rating: "4.9 ★ (Certified)",
  },

  // ================= CLOUD & DEVOPS =================
  {
    id: "vid-cloud-aws-01",
    track: "cloud",
    title: "AWS Cloud Practitioner & Core Services Crash Course",
    creator: "freeCodeCamp.org & Andrew Brown (ExamPro)",
    channel: "freeCodeCamp.org",
    duration: "28:50",
    durationSeconds: 1730,
    views: "2.9M views",
    viewCountNum: 2900000,
    category: "Cloud & DevOps (AWS)",
    difficulty: "Enterprise Certified",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    embedUrl: "https://www.youtube.com/embed/3hLmDS179YE",
    externalUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
    tags: ["cloud", "aws", "devops", "infrastructure", "security"],
    whyRecommended: "Highest paying cloud certifications with widespread remote infrastructure opportunities.",
    rating: "4.9 ★",
  },
];

/**
 * Returns career course videos filtered by track or scored by relevance
 *
 * @param {string} trackId - "all" | "uiux" | "python" | "java" | "selffinancing" | "data"
 * @param {object} userState - Current application state
 * @returns {Array<object>} Filtered list of career videos
 */
export function getCareerVideosByTrack(trackId = "all", userState = {}) {
  let filtered = CAREER_VIDEO_CATALOG;

  if (trackId && trackId !== "all") {
    filtered = CAREER_VIDEO_CATALOG.filter((v) => v.track === trackId || v.tags.includes(trackId));
  }

  return filtered;
}

/**
 * Formats seconds into MM:SS format
 */
export function formatWatchTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Formats total seconds into human-readable duration (e.g. "18 mins" or "1 hr 12 mins")
 */
export function formatTotalWatchTime(totalSeconds) {
  if (!totalSeconds || totalSeconds < 60) {
    return `${totalSeconds || 0}s`;
  }
  const mins = Math.floor(totalSeconds / 60);
  if (mins < 60) {
    return `${mins} min${mins === 1 ? "" : "s"}`;
  }
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}
