//ProjectCard Component Created
//This component provides:

//Responsive Design: Adapts to different screen sizes with proper aspect ratios
//Interactive States: Hover effects with image scaling and overlay actions
//Status Indicators: Visual badges for project status (completed, in-progress, planning)
//Rich Metadata: Date, category, and technology information
//Action Buttons: Quick access to view details, GitHub, and live demos
//Accessibility: Screen reader support and proper focus management
//Performance: Optimized images with proper sizing hints

//Key Features:

//Flexible Layout: Works in grids and as standalone cards
//Featured Variant: Special styling for featured projects
//Technology Tags: Limited display with overflow indication
//External Links: Safe target="_blank" with proper rel attributes
//Hover Interactions: Smooth transitions and micro-animations

////
"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, ExternalLink, Calendar, Eye } from "lucide-react"

import type { Project } from "@/lib/db/projects"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  className?: string
  featured?: boolean
}

export function ProjectCard({ project, className, featured = false }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(new Date(dateString))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'planning':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
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
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col",
        featured && "border-blue-200 dark:border-blue-800 shadow-md",
        className
      )}
    >
      {/* Project Image */}
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={project.featuredImage}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="secondary" asChild>
              <Link href={`/projects/${project.slug}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            {project.liveUrl && (
              <Button size="sm" variant="secondary" asChild>
                <Link 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            getStatusColor(project.status)
          )}>
            {getStatusText(project.status)}
          </span>
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Card Header */}
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-1">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {project.excerpt}
            </CardDescription>
          </div>
          
          {/* External Links */}
          <div className="flex items-center space-x-2 ml-4">
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">View GitHub repository</span>
              </Link>
            )}
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View live project</span>
              </Link>
            )}
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-blue-600 rounded-full" />
            <span className="capitalize">{project.category}</span>
          </div>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="pt-0">
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* View Project Link */}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors group/link"
        >
          <span>View Project</span>
          <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}