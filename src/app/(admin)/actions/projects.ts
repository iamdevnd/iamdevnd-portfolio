"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { 
  createProject, 
  updateProject, 
  deleteProject, 
  toggleProjectPublished,
  toggleProjectFeatured 
} from "@/lib/db/projects"

// Project form validation schema
const projectSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  excerpt: z.string().min(10).max(200),
  longDescription: z.string().min(50).max(5000).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  category: z.string().min(1),
  status: z.enum(["completed", "in-progress", "planning"]),
  technologies: z.array(z.string()).min(1),
  featuredImage: z.string().url(),
  images: z.array(z.string().url()).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  challenges: z.string().max(2000).optional(),
  solutions: z.string().max(2000).optional(),
  learnings: z.string().max(2000).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  featured: z.boolean(),
  published: z.boolean(),
  metrics: z.array(z.object({
    title: z.string().min(1),
    value: z.string().min(1),
    description: z.string().optional(),
  })).optional(),
})

export type ProjectFormResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  projectId?: string
}

/**
 * Create a new project
 */
// Fix for src/app/(admin)/actions/projects.ts
// Replace the createProjectAction function with this version:

export async function createProjectAction(formData: FormData): Promise<ProjectFormResponse> {
  try {
    // Extract and parse form data
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      excerpt: formData.get("excerpt") as string,
      longDescription: formData.get("longDescription") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as "completed" | "in-progress" | "planning",
      technologies: JSON.parse(formData.get("technologies") as string || "[]"),
      featuredImage: formData.get("featuredImage") as string,
      images: JSON.parse(formData.get("images") as string || "[]"), // This will always be an array
      githubUrl: formData.get("githubUrl") as string,
      liveUrl: formData.get("liveUrl") as string,
      demoUrl: formData.get("demoUrl") as string,
      challenges: formData.get("challenges") as string,
      solutions: formData.get("solutions") as string,
      learnings: formData.get("learnings") as string,
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
      featured: formData.get("featured") === "true",
      published: formData.get("published") === "true",
      metrics: JSON.parse(formData.get("metrics") as string || "[]"),
    }

    // Validate the data
    const validationResult = projectSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = validationResult.data

    // Ensure images is always an array (fix the TypeScript error)
    const projectData = {
      ...data,
      images: data.images || [], // Convert undefined to empty array
    }

    // Create the project
    const projectId = await createProject(projectData)

    // Revalidate relevant paths
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return {
      success: true,
      message: "Project created successfully!",
      projectId,
    }

  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message: "Failed to create project. Please try again.",
    }
  }
}

/**
 * Update an existing project
 */
// Fix for src/app/(admin)/actions/projects.ts
// Replace the updateProjectAction function with this version:

export async function updateProjectAction(
  projectId: string, 
  formData: FormData
): Promise<ProjectFormResponse> {
  try {
    // Extract and parse form data (same as create)
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      excerpt: formData.get("excerpt") as string,
      longDescription: formData.get("longDescription") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as "completed" | "in-progress" | "planning",
      technologies: JSON.parse(formData.get("technologies") as string || "[]"),
      featuredImage: formData.get("featuredImage") as string,
      images: JSON.parse(formData.get("images") as string || "[]"),
      githubUrl: formData.get("githubUrl") as string,
      liveUrl: formData.get("liveUrl") as string,
      demoUrl: formData.get("demoUrl") as string,
      challenges: formData.get("challenges") as string,
      solutions: formData.get("solutions") as string,
      learnings: formData.get("learnings") as string,
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
      featured: formData.get("featured") === "true",
      published: formData.get("published") === "true",
      metrics: JSON.parse(formData.get("metrics") as string || "[]"),
    }

    // Validate the data
    const validationResult = projectSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = validationResult.data

    // Ensure images is always an array (fix the TypeScript error)
    const projectData = {
      ...data,
      images: data.images || [], // Convert undefined to empty array
    }

    // Update the project
    await updateProject(projectId, projectData)

    // Revalidate relevant paths
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath(`/projects/${data.slug}`)
    revalidatePath("/")

    return {
      success: true,
      message: "Project updated successfully!",
      projectId,
    }

  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      message: "Failed to update project. Please try again.",
    }
  }
}

/**
 * Delete a project
 */
export async function deleteProjectAction(projectId: string): Promise<ProjectFormResponse> {
  try {
    await deleteProject(projectId)

    // Revalidate relevant paths
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return {
      success: true,
      message: "Project deleted successfully!",
    }

  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      success: false,
      message: "Failed to delete project. Please try again.",
    }
  }
}

/**
 * Toggle project published status
 */
export async function toggleProjectPublishedAction(projectId: string): Promise<ProjectFormResponse> {
  try {
    await toggleProjectPublished(projectId)

    // Revalidate relevant paths
    revalidatePath("/admin/projects")
    revalidatePath("/projects")
    revalidatePath("/")

    return {
      success: true,
      message: "Project status updated successfully!",
    }

  } catch (error) {
    console.error("Error toggling project status:", error)
    return {
      success: false,
      message: "Failed to update project status. Please try again.",
    }
  }
}

/**
 * Toggle project featured status
 */
export async function toggleProjectFeaturedAction(projectId: string): Promise<ProjectFormResponse> {
  try {
    await toggleProjectFeatured(projectId)

    // Revalidate relevant paths
    revalidatePath("/admin/projects")
    revalidatePath("/")

    return {
      success: true,
      message: "Project featured status updated successfully!",
    }

  } catch (error) {
    console.error("Error toggling project featured status:", error)
    return {
      success: false,
      message: "Failed to update project featured status. Please try again.",
    }
  }
}