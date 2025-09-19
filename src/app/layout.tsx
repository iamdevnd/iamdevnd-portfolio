//Root Layout Created
// This root layout provides:

// Complete SEO Setup: Rich metadata with OpenGraph, Twitter Cards, and structured data
// Font Optimization: Inter font with CSS variables and swap display
// Theme Integration: Theme provider with system preference detection
// Analytics Ready: Microsoft Clarity integration (you'll add the project ID later)
// Performance Optimized: Proper font loading and hydration handling
// Accessibility: Semantic HTML structure and proper lang attribute

// Key Features:

// Template Titles: Dynamic page titles with fallback
// Rich Metadata: Complete social media and SEO optimization
// System Theme: Respects user's OS dark/light preference
// Production Ready: All the metadata search engines expect
////
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Dev ND - Applied AI Engineer",
    template: "%s | Dev ND"
  },
  description: "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions. Explore my portfolio of production-grade applications and innovative projects.",
  keywords: [
    "Applied AI Engineer",
    "Next.js Developer", 
    "Python Developer",
    "AI/ML Engineer",
    "Full Stack Developer",
    "Portfolio",
    "Software Engineer"
  ],
  authors: [{ name: "Dev ND" }],
  creator: "Dev ND",
  metadataBase: new URL("https://iamdevnd.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iamdevnd.dev",
    title: "Dev ND - Applied AI Engineer",
    description: "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions. Explore my portfolio of production-grade applications and innovative projects.",
    siteName: "Dev ND Portfolio",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Dev ND - Applied AI Engineer Portfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev ND - Applied AI Engineer",
    description: "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions.",
    images: ["/images/og-default.png"],
    creator: "@devnd", // Update with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Microsoft Clarity Analytics */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ''}");
            `,
          }}
        />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}