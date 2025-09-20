// src/app/layout.tsx - SECURE VERSION with Environment Variable
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Dev ND - Applied AI Engineer",
    template: "%s | Dev ND",
  },
  description:
    "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions. Building production-grade applications with modern technologies.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "Next.js Developer",
    "Python Developer",
    "Full Stack Developer",
    "Applied AI",
    "Portfolio",
  ],
  authors: [{ name: "Dev ND" }],
  creator: "Dev ND",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://iamdevnd.dev",
    title: "Dev ND - Applied AI Engineer",
    description:
      "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions.",
    siteName: "Dev ND Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dev ND - Applied AI Engineer",
    description:
      "Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ✅ Google Analytics - load only if ID exists */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
