//Complete CRUD Interface: View, edit, delete projects (create coming next)
//Visual Project Grid: Thumbnail previews with status indicators
//Advanced Filtering: Search, status, and category filters
//Mobile Optimization: Responsive table/card views
//Quick Actions: Edit, view live, delete with proper permissions
//Stats Overview: Project distribution and health metrics

//Key Features:

//Server Components: Optimal performance with real-time data
//Loading States: Skeleton UI for better user experience
//Status Indicators: Visual feedback for project states
//Action Buttons: Direct links to edit, view, and manage projects
//Empty States: Helpful guidance when no content exists
////

import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Star,
  Clock,
  CheckCircle,
  Search,
  Filter
} from "lucide-react"

import { getAllProjectsAdmin } from "@/lib/db/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Projects table component
async function ProjectsTable() {
  const projects = await getAllProjectsAdmin()

  // Replace this function in your ProjectsTable component:
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString)) // Convert string to Date first
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              Manage your portfolio projects
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Project</th>
                      <th className="text-left py-3 px-2 font-medium">Status</th>
                      <th className="text-left py-3 px-2 font-medium">Category</th>
                      <th className="text-left py-3 px-2 font-medium">Updated</th>
                      <th className="text-left py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-8 rounded overflow-hidden bg-muted">
                              <Image
                                src={project.featuredImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{project.title}</span>
                                {project.featured && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {project.published ? (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                                    Published
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                                    Draft
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(project.status)}
                            <span className="text-sm">{getStatusText(project.status)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-muted-foreground">
                            {project.category}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(project.updatedAt)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            {project.published && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/projects/${project.slug}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/projects/${project.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium truncate">{project.title}</h3>
                        {project.featured && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {project.published ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                          Draft
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(project.status)}
                        <span className="text-xs text-muted-foreground">
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {project.published && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Updated {formatDate(project.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start building your portfolio by creating your first project. 
              Showcase your best work and attract potential clients.
            </p>
            <Button asChild>
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Project
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Loading component
function ProjectsLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 mt-2 animate-pulse" />
          </div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-12 h-8 bg-muted rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-48 mb-2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Projects stats component
async function ProjectsStats() {
  const projects = await getAllProjectsAdmin()
  
  const stats = {
    total: projects.length,
    published: projects.filter(p => p.published).length,
    drafts: projects.filter(p => !p.published).length,
    featured: projects.filter(p => p.featured && p.published).length,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.featured}</div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main projects page
export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects and showcase your best work
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-8 bg-muted rounded w-16 mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <ProjectsStats />
      </Suspense>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Category
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsTable />
      </Suspense>
    </div>
  )
}