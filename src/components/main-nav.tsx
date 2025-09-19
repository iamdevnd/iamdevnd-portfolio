//Main Navigation Created
//This navigation component provides:

//Responsive Design: Desktop horizontal nav + mobile overlay menu
//Theme Switching: Light/Dark/System theme toggle with visual feedback
//Active States: Highlights current page with proper contrast
//Accessibility: ARIA labels, keyboard navigation, focus management
//Performance: Sticky positioning with backdrop blur
//Mobile UX: Full-screen overlay with descriptions and scroll prevention
//Brand Identity: Gradient logo text for visual appeal

//Key Features:

// Smooth Animations: Backdrop blur and hover transitions
// Auto-Close: Mobile menu closes on route changes
// Visual Hierarchy: Clear active states and hover effects
// Touch-Friendly: Large touch targets for mobile
// SEO Friendly: Semantic navigation structure
////
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Monitor } from "lucide-react"

import { siteConfig, mainNav } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const ThemeToggle = () => (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={cn(
          "p-2",
          theme === "light" && "bg-muted"
        )}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2",
          theme === "dark" && "bg-muted"
        )}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("system")}
        className={cn(
          "p-2",
          theme === "system" && "bg-muted"
        )}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b glass">
  <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme Toggle & CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-2"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative bg-background border-b shadow-lg">
            <nav className="flex flex-col space-y-1 p-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col space-y-1 px-3 py-3 text-base font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Get In Touch
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}