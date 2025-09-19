import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ProjectEditForm } from "@/components/admin/project-edit-form"
import { getProjectByIdAdmin } from "@/lib/db/projects"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

// Loading component
function ProjectEditLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        <div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-24 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Project edit content
async function ProjectEditContent({ projectId }: { projectId: string }) {
  const project = await getProjectByIdAdmin(projectId)

  if (!project) {
    notFound()
  }

  return <ProjectEditForm project={project} />
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <Suspense fallback={<ProjectEditLoading />}>
      <ProjectEditContent projectId={params.id} />
    </Suspense>
  )
}