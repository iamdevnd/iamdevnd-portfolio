//Site Configuration Created
// This configuration file provides:

// Centralized Data: All site-wide information in one place
// Type Safety: Full TypeScript typing with as const assertions
// SEO Optimization: Structured data for search engines
// Navigation Structure: Main nav, footer links, and categorization
//Skills Showcase: Organized technology stacks for the about page
// Contact Information: Professional contact details
// Content Organization: Project and blog categorization systems

//Key Features:

// Maintainable: Update links and info in one central location
// Flexible: Easy to add new navigation items or categories
// Professional: Complete contact and social media structure
// Scalable: Organized for future content expansion

// Update Required:
// Make sure to update the placeholder social media links and email address with your actual information before deployment.
////
export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "ND",
  description: "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions. Building production-grade applications with modern technologies.",
  url: "https://iamdevnd.dev",
  ogImage: "https://iamdevnd.dev/images/og-default.png",
  links: {
    github: "https://github.com/iamdevnd",
    bluesky: "https://devnd.bsky.social",
    calendar: "https://app.cal.com/dnpro/",
    email: "iamdevnd@gmail.com",
  },
}

export const mainNav = [
  {
    title: "Home",
    href: "/",
    description: "Welcome to my portfolio"
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about my background and expertise"
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Explore my latest work and case studies"
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Insights on AI, development, and technology"
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Let's work together"
  },
] as const

export const footerLinks = {
  main: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About", 
      href: "/about",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  social: [
    {
      title: "GitHub",
      href: "https://github.com/iamdevnd",
    },
    {
      title: "Bluesky",
      href: "https://devnd.bsky.social",
    },
    {
      title: "Schedule Call",
      href: "https://app.cal.com/dnpro/",
    },
  ],
  // Remove legal links if you don't need them, or keep as placeholder
  legal: [
    {
      title: "Privacy Policy", 
      href: "/privacy",
    },
    {
      title: "Terms of Service",
      href: "/terms",
    },
  ],
} as const

// Skills and technologies for the about page
export const skills = {
  languages: [
    "TypeScript",
    "Python", 
    "JavaScript",
    "SQL",
    "Bash"
  ],
  frameworks: [
    "Next.js",
    "React",
    "FastAPI",
    "Django",
    "TailwindCSS"
  ],
  aiml: [
    "OpenAI GPT",
    "LangChain",
    "Hugging Face",
    "TensorFlow",
    "PyTorch"
  ],
  databases: [
    "PostgreSQL",
    "Firebase",
    "MongoDB",
    "Redis",
    "Supabase"
  ],
  tools: [
    "Docker",
    "Vercel",
    "AWS",
    "Git",
    "VS Code"
  ],
} as const

// Contact information
// Update contact info too
export const contactInfo = {
  email: "iamdevnd@gmail.com",
  location: "Available for Remote Work", 
  timezone: "EST (UTC-5)",
  availability: "Open to new opportunities",
} as const

// Featured project categories
export const projectCategories = [
  "All",
  "AI/ML",
  "Web Development", 
  "Full Stack",
  "Mobile",
  "API Development",
] as const

// Blog categories
export const blogCategories = [
  "AI & Machine Learning",
  "Web Development",
  "Technology Insights",
  "Tutorials",
  "Career Development",
] as const