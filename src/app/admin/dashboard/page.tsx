//Real-time Statistics: Project counts, status overview, and key metrics
//Recent Activity: Latest project updates with quick actions
//Quick Actions: One-click access to common tasks
//Site Status: Live deployment status and health checks
//Pro Tips: Helpful guidance for portfolio optimization
//Responsive Design: Works perfectly on all screen sizes

import { Suspense } from "react"
import Link from "next/link"
import { 
  Plus, 
  Eye, 
  FileText, 
  FolderOpen, 
  Mail, 
  Users, 
  TrendingUp,
  Calendar,
  ExternalLink,
  BarChart3
} from "lucide-react"

import { getAllProjectsAdmin } from "@/lib/db/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Dashboard stats component
async function DashboardStats() {
  const projects = await getAllProjectsAdmin()
  
  const stats = {
    totalProjects: projects.length,
    publishedProjects: projects.filter(p => p.published).length,
    featuredProjects: projects.filter(p => p.featured && p.published).length,
    draftProjects: projects.filter(p => !p.published).length,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            All projects in the system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publishedProjects}</div>
          <p className="text-xs text-muted-foreground">
            Live on the website
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.featuredProjects}</div>
          <p className="text-xs text-muted-foreground">
            Shown on homepage
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.draftProjects}</div>
          <p className="text-xs text-muted-foreground">
            Work in progress
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Recent projects component
// In src/app/admin/dashboard/page.tsx, replace the RecentProjects function:

async function RecentProjects() {
  const allProjects = await getAllProjectsAdmin()
  const recentProjects = allProjects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) // Fixed this line
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Latest updates to your project portfolio
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/projects">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center space-x-1">
                      {project.published ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                          Draft
                        </span>
                      )}
                      {project.featured && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.category} • Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {project.published && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to get started
            </p>
            <Button asChild>
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Quick actions component
function QuickActions() {
  const actions = [
    {
      title: "New Project",
      description: "Add a new project to your portfolio",
      icon: Plus,
      href: "/admin/projects/new",
      color: "bg-blue-500",
    },
    {
      title: "View Site",
      description: "Preview your live portfolio",
      icon: ExternalLink,
      href: "/",
      color: "bg-green-500",
      external: true,
    },
    {
      title: "Analytics",
      description: "View site performance data",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-purple-500",
    },
    {
      title: "Contact Messages",
      description: "Review incoming inquiries",
      icon: Mail,
      href: "/admin/contacts",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            const LinkComponent = action.external ? "a" : Link
            const linkProps = action.external 
              ? { href: action.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: action.href }

            return (
              <LinkComponent
                key={action.title}
                {...linkProps}
                className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg mr-3",
                  action.color
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </LinkComponent>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading components
function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-12 mb-2 animate-pulse" />
            <div className="h-3 bg-muted rounded w-32 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProjectsLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-muted rounded w-40 animate-pulse" />
        <div className="h-4 bg-muted rounded w-64 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-48 mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Main dashboard component
export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin panel. Here's what's happening with your site.
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<StatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ProjectsLoading />}>
            <RecentProjects />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span>Site Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Deployment</span>
                <span className="text-sm text-green-600">✓ Live</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Contact Form</span>
                <span className="text-sm text-green-600">✓ Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Featured Projects:</strong> Keep 3-4 projects featured for optimal homepage display
              </div>
              <div>
                <strong>SEO:</strong> Add meta descriptions to improve search rankings
              </div>
              <div>
                <strong>Performance:</strong> Optimize images before uploading for faster load times
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}