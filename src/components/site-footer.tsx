//Site Footer Created
//This footer component provides:

//Professional Branding: Consistent logo and brand colors
//Complete Contact Info: Email, location, and timezone display
//Organized Navigation: Clean link structure with hover effects
//Social Media Integration: Icons with external link handling
//Status Indicator: Animated availability badge
//Legal Compliance: Privacy policy and terms links
//Visual Appeal: Gradient accent and responsive layout

//Key Features:

//Responsive Grid: Adapts from 1 to 4 columns based on screen size
//Interactive Elements: Hover states and smooth transitions
//Accessibility: Proper link structure and icon labeling
//Brand Consistency: Matches header styling and colors
//Professional Polish: Status badge and decorative elements
////
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, MapPin, Clock } from "lucide-react"

import { siteConfig, footerLinks, contactInfo } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
  }

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              {siteConfig.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Link 
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {contactInfo.email}
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{contactInfo.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{contactInfo.timezone}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Legal Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.social.map((link) => {
                const socialKey = link.title.toLowerCase() as keyof typeof socialIcons
                const IconComponent = socialIcons[socialKey]
                
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
                      )}
                      <span>{link.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Legal Links */}
            <div>
              <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-1">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-muted-foreground">
              <p>
                © {currentYear} {siteConfig.name}. All rights reserved.
              </p>
              <p className="hidden md:block">•</p>
              <p>
                Built with Next.js, TypeScript & ❤️
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span>{contactInfo.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />
    </footer>
  )
}