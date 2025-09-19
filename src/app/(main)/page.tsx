//Homepage Created
//This homepage provides:

//Hero Section: Professional introduction with gradient text and clear CTAs
//Featured Projects: Dynamic showcase using server-side data fetching
//Skills Display: Organized technology stack with visual categorization
//Professional Branding: Consistent with your AI engineer positioning
//Performance Optimized: Next.js Image optimization and proper loading
//Responsive Design: Mobile-first approach with adaptive layouts
//Interactive Elements: Hover effects and smooth transitions

//Key Features:

//Server Component: Fetches data at build time for optimal performance
//Dynamic Content: Automatically updates when you add featured projects
//SEO Optimized: Proper heading hierarchy and semantic structure
//Visual Appeal: Modern glassmorphism effects and gradients
//Clear CTAs: Multiple paths for visitors to engage

//Homepage Sections:

//Hero: Personal brand and value proposition
//Featured Projects: Your best work with live links
//Skills: Technology expertise organized by category
//CTA: Clear next steps for potential clients/employers
////
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, ExternalLink, Code2, Brain, Rocket } from "lucide-react"

import { getFeaturedProjects } from "@/lib/db/projects"
import { siteConfig, skills, contactInfo } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-blue-950/20 dark:via-background dark:to-violet-950/20" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6">
              <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium bg-background/60 backdrop-blur-sm">
                <span className="mr-2">👋</span>
                <span>Welcome to my portfolio</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Applied AI Engineer</span>
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Building the Future
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              I specialize in creating production-grade AI applications with Next.js, Python, 
              and cutting-edge machine learning technologies. Let's build something amazing together.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{featuredProjects.length}+</div>
                <div className="text-sm text-muted-foreground">Featured Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">∞</div>
                <div className="text-sm text-muted-foreground">Coffee Consumed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A showcase of my latest work in AI engineering, full-stack development, 
                and innovative problem-solving.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <Card 
                  key={project.id}
                  className={cn(
                    "group hover:shadow-lg transition-all duration-300 overflow-hidden",
                    index === 0 && featuredProjects.length % 2 !== 0 && "md:col-span-2"
                  )}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={project.featuredImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {project.githubUrl && (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </Link>
                        )}
                        {project.liveUrl && (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-medium bg-muted rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      View Project
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Skills & Technologies Section */}
      <section className="py-20 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Skills & Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I work with modern technologies to build scalable, performant applications 
              that solve real-world problems.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Code2 className="h-6 w-6 text-blue-600" />
                  <CardTitle>Frontend & Full-Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...skills.frameworks, ...skills.languages.slice(0, 3)].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-violet-600" />
                  <CardTitle>AI & Machine Learning</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.aiml.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm font-medium bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Rocket className="h-6 w-6 text-green-600" />
                  <CardTitle>Database & DevOps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...skills.databases, ...skills.tools.slice(0, 3)].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              I'm currently {contactInfo.availability.toLowerCase()} and would love to hear about your project. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}