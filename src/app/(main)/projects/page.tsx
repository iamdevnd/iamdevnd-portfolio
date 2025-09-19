//Projects Listing Page Created
//This page provides:

//Server-Side Filtering: URL-based filtering and search with SEO benefits
//Responsive Layout: 1-3 column grid that adapts to screen size
//Loading States: Skeleton UI during data fetching
//Empty States: User-friendly messages when no projects match filters
//Search & Filter: Combined category and text search capabilities
//Performance: Suspense boundaries for optimal loading experience
//SEO Optimized: Rich metadata and semantic structure

//Key Features:

//URL State Management: Filters persist in URL for sharing and bookmarking
//Real-time Stats: Shows filtered vs total project counts
//Clear Filters: Easy way to reset all applied filters
//Comprehensive Search: Searches title, description, technologies, and category
//Featured Highlighting: Special styling for featured projects
////
import { Suspense } from "react"
import type { Metadata } from "next"

import { getAllProjects } from "@/lib/db/projects"
import { projectCategories } from "@/config/site"
import { ProjectCard } from "@/components/project-card"
import { ProjectsFilter } from "@/components/projects-filter"
import { ProjectsSearch } from "@/components/projects-search"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of AI engineering projects, full-stack applications, and innovative solutions built with modern technologies.",
  keywords: [
    "AI projects",
    "Machine learning applications", 
    "Next.js projects",
    "Python development",
    "Full-stack applications",
    "Portfolio projects"
  ],
  openGraph: {
    title: "Projects | Dev ND",
    description: "Explore my portfolio of AI engineering projects, full-stack applications, and innovative solutions.",
    type: "website",
  },
}

interface ProjectsPageProps {
  searchParams: {
    category?: string
    search?: string
  }
}

// Loading skeleton for projects grid
function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-muted rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-16" />
              <div className="h-6 bg-muted rounded w-12" />
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Main projects content component
async function ProjectsContent({ searchParams }: ProjectsPageProps) {
  const allProjects = await getAllProjects()
  
  // Filter projects based on search params
  let filteredProjects = allProjects

  // Category filter
  if (searchParams.category && searchParams.category !== 'All') {
    filteredProjects = filteredProjects.filter(
      project => project.category === searchParams.category
    )
  }

  // Search filter
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.excerpt.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(searchTerm)
      ) ||
      project.category.toLowerCase().includes(searchTerm)
    )
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {allProjects.length} projects
              {searchParams.category && searchParams.category !== 'All' && (
                <span> in "{searchParams.category}"</span>
              )}
              {searchParams.search && (
                <span> matching "{searchParams.search}"</span>
              )}
            </p>
          </div>
          
          {/* Clear filters */}
          {(searchParams.category && searchParams.category !== 'All') || searchParams.search ? (
            <div>
              <a
                href="/projects"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Clear all filters
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              featured={project.featured}
            />
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-16">
          <div className="mx-auto max-w-md">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 text-muted-foreground">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchParams.search 
                ? `No projects match your search for "${searchParams.search}".`
                : searchParams.category 
                ? `No projects found in the "${searchParams.category}" category.`
                : "No projects available at the moment."
              }
            </p>
            <a
              href="/projects"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              View all projects
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          My Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my work in AI engineering, full-stack development, 
          and innovative solutions. Each project represents a unique challenge 
          and learning experience.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Filter */}
          <div className="lg:w-2/3">
            <ProjectsFilter 
              categories={projectCategories}
              currentCategory={searchParams.category}
            />
          </div>
          
          {/* Search */}
          <div className="lg:w-1/3">
            <ProjectsSearch 
              defaultValue={searchParams.search}
            />
          </div>
        </div>
      </div>

      {/* Projects Content with Suspense */}
      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}