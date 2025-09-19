//Project Detail Page Created
//This comprehensive project detail page provides:

//Dynamic SEO: Auto-generated metadata from project data
//Static Generation: Pre-generates all project pages at build time
//Rich Content Layout: Multi-column layout with sidebar information
//Image Gallery: Showcase multiple project screenshots
//Comprehensive Information: Challenges, solutions, learnings, and metrics
//Related Projects: Smart recommendations based on technology and category
//Action Buttons: Direct links to live project, GitHub, and demos

//Key Features:

//generateStaticParams: Pre-generates all project routes for performance
//generateMetadata: Dynamic SEO optimization for each project
//Responsive Design: Mobile-first approach with adaptive layouts
//Rich Media: Optimized images with hover effects
//Navigation: Back button and related project discovery
//Status Indicators: Visual project status with appropriate icons

//Architecture Benefits:

//Performance: Static generation with ISR capabilities
//SEO: Perfect metadata and social sharing optimization
//User Experience: Comprehensive project showcase with clear navigation
//Maintainability: Clean separation of data and presentation
////
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, Clock, CheckCircle } from "lucide-react"

import { getProjectBySlug, getRelatedProjects, getAllProjectSlugs } from "@/lib/db/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectCard } from "@/components/project-card"
import { cn } from "@/lib/utils"

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all published projects
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate dynamic metadata for each project
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  const title = project.metaTitle || project.title
  const description = project.metaDescription || project.excerpt

  return {
    title,
    description,
    keywords: [
      ...project.technologies,
      project.category,
      "project",
      "portfolio",
      "case study"
    ],
    openGraph: {
      title: `${title} | Dev ND`,
      description,
      type: "article",
      images: [
        {
          url: project.featuredImage,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Dev ND`,
      description,
      images: [project.featuredImage],
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  // Get related projects
  const relatedProjects = await getRelatedProjects(
    project.id,
    project.technologies,
    project.category,
    3
  )

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'planning':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'planning':
        return 'Planning'
      default:
        return status
    }
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Image */}
          <div className="lg:col-span-2">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <Image
                src={project.featuredImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {project.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {project.liveUrl && (
                <Button size="lg" asChild>
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Project
                  </Link>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </Link>
                </Button>
              )}
              {project.demoUrl && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Demo
                  </Link>
                </Button>
              )}
            </div>

            {/* Project Meta */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">{formatDate(project.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Category:</span>
                <span className="text-muted-foreground">{project.category}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                {getStatusIcon(project.status)}
                <span className="font-medium">Status:</span>
                <span className="text-muted-foreground">{getStatusText(project.status)}</span>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm font-medium bg-muted rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Long Description */}
          {project.longDescription && (
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </div>
            </section>
          )}

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Challenges & Solutions */}
          {(project.challenges || project.solutions) && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Challenges & Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.challenges && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Challenges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{project.challenges}</p>
                    </CardContent>
                  </Card>
                )}
                {project.solutions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Solutions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{project.solutions}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          )}

          {/* Key Learnings */}
          {project.learnings && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Learnings</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">{project.learnings}</p>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Project Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Metrics</CardTitle>
                <CardDescription>Key achievements and results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm font-medium mb-1">
                        {metric.title}
                      </div>
                      {metric.description && (
                        <div className="text-xs text-muted-foreground">
                          {metric.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.liveUrl && (
                <Button className="w-full" asChild>
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Project
                  </Link>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Source Code
                  </Link>
                </Button>
              )}
              {project.demoUrl && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo Video
                  </Link>
                </Button>
              )}
            </CardContent>
            </Card>
          
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Related Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              More projects you might find interesting
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((relatedProject) => (
              <ProjectCard key={relatedProject.id} project={relatedProject} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}