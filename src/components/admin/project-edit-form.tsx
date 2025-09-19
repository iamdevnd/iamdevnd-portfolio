"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  X, 
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  FileText,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import type { Project } from "@/lib/db/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { projectCategories, skills } from "@/config/site"
import { cn } from "@/lib/utils"

// Form validation schema (same as create form)
const projectFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(200, "Excerpt must be less than 200 characters"),
  longDescription: z
    .string()
    .min(50, "Long description must be at least 50 characters")
    .max(5000, "Long description must be less than 5000 characters")
    .optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  category: z
    .string()
    .min(1, "Please select a category"),
  status: z
    .enum(["completed", "in-progress", "planning"]),
  technologies: z
    .array(z.string())
    .min(1, "Please add at least one technology"),
  featuredImage: z
    .string()
    .url("Please enter a valid image URL"),
  images: z
    .array(z.string().url("Please enter valid image URLs"))
    .optional(),
  githubUrl: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  liveUrl: z
    .string()
    .url("Please enter a valid live URL")
    .optional()
    .or(z.literal("")),
  demoUrl: z
    .string()
    .url("Please enter a valid demo URL")
    .optional()
    .or(z.literal("")),
  challenges: z
    .string()
    .max(2000, "Challenges must be less than 2000 characters")
    .optional(),
  solutions: z
    .string()
    .max(2000, "Solutions must be less than 2000 characters")
    .optional(),
  learnings: z
    .string()
    .max(2000, "Learnings must be less than 2000 characters")
    .optional(),
  metaTitle: z
    .string()
    .max(60, "Meta title should be less than 60 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should be less than 160 characters")
    .optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  metrics: z
    .array(
      z.object({
        title: z.string().min(1, "Metric title is required"),
        value: z.string().min(1, "Metric value is required"),
        description: z.string().optional(),
      })
    )
    .optional(),
})

type ProjectFormData = z.infer<typeof projectFormSchema>

// All available technologies
const allTechnologies = [
  ...skills.languages,
  ...skills.frameworks,
  ...skills.aiml,
  ...skills.databases,
  ...skills.tools,
].sort()

interface ProjectEditFormProps {
  project: Project
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(project.technologies || [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    control,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      excerpt: project.excerpt,
      longDescription: project.longDescription || "",
      slug: project.slug,
      category: project.category,
      status: project.status,
      technologies: project.technologies,
      featuredImage: project.featuredImage,
      images: project.images || [],
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      demoUrl: project.demoUrl || "",
      challenges: project.challenges || "",
      solutions: project.solutions || "",
      learnings: project.learnings || "",
      metaTitle: project.metaTitle || "",
      metaDescription: project.metaDescription || "",
      featured: project.featured,
      published: project.published,
      metrics: project.metrics || [],
    },
    mode: "onChange",
  })

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control,
    name: "metrics",
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  })

  // Watch form values
  const watchedTitle = watch("title", "")
  const watchedSlug = watch("slug", "")
  const watchedDescription = watch("description", "")
  const watchedLongDescription = watch("longDescription", "")

  // Initialize selected technologies
  useEffect(() => {
    setSelectedTechnologies(project.technologies || [])
    setValue("technologies", project.technologies || [])
  }, [project.technologies, setValue])

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  // Handle technology selection
  const toggleTechnology = (tech: string) => {
    const newTechs = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter((t) => t !== tech)
      : [...selectedTechnologies, tech]
    
    setSelectedTechnologies(newTechs)
    setValue("technologies", newTechs, { shouldDirty: true })
  }

  // Handle form submission
  const onSubmit = async (data: ProjectFormData) => {
    startTransition(async () => {
      try {
        // Here you would call your update API
        console.log("Updating project:", { id: project.id, ...data })
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        
        toast.success("Project updated successfully!")
        router.push("/admin/projects")
      } catch (error) {
        console.error("Error updating project:", error)
        toast.error("Failed to update project. Please try again.")
      }
    })
  }

  // Handle project deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      // Here you would call your delete API
      console.log("Deleting project:", project.id)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      toast.success("Project deleted successfully!")
      router.push("/admin/projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">
              Update your project information
            </p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          {project.published && (
            <Button variant="outline" asChild>
              <Link href={`/projects/${project.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Live
              </Link>
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Same structure as create form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  Essential details about your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Project Title *
                    </label>
                    <Input
                      id="title"
                      {...register("title")}
                      className={cn(errors.title && "border-red-500")}
                      placeholder="My Awesome AI Project"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                      URL Slug *
                    </label>
                    <Input
                      id="slug"
                      {...register("slug")}
                      className={cn(errors.slug && "border-red-500")}
                      placeholder="my-awesome-ai-project"
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug.message}</p>
                    )}
                    {watchedSlug && (
                      <p className="text-xs text-muted-foreground">
                        URL: /projects/{watchedSlug}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Short Description *
                  </label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    className={cn("min-h-[100px]", errors.description && "border-red-500")}
                    placeholder="Brief overview of your project..."
                  />
                  <div className="flex justify-between">
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {watchedDescription.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">
                    Excerpt *
                  </label>
                  <Textarea
                    id="excerpt"
                    {...register("excerpt")}
                    className={cn("min-h-[80px]", errors.excerpt && "border-red-500")}
                    placeholder="Short excerpt for project cards..."
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="longDescription" className="text-sm font-medium">
                    Detailed Description
                  </label>
                  <Textarea
                    id="longDescription"
                    {...register("longDescription")}
                    className={cn("min-h-[200px]", errors.longDescription && "border-red-500")}
                    placeholder="Comprehensive project description..."
                  />
                  <div className="flex justify-between">
                    {errors.longDescription && (
                      <p className="text-sm text-red-500">{errors.longDescription.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {watchedLongDescription?.length || 0}/5000 characters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details - Same as create form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Project Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </label>
                    <select
                      id="category"
                      {...register("category")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select category</option>
                      {projectCategories.filter(cat => cat !== "All").map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status *
                    </label>
                    <select
                      id="status"
                      {...register("status")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Technologies Used *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full"
                      >
                        {tech}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTechnology(tech)}
                          className="ml-2 h-4 w-4 p-0 text-primary-foreground hover:text-primary-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                  <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {allTechnologies.map((tech) => (
                        <Button
                          key={tech}
                          type="button"
                          variant={selectedTechnologies.includes(tech) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTechnology(tech)}
                          className="justify-start"
                        >
                          {tech}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {errors.technologies && (
                    <p className="text-sm text-red-500">{errors.technologies.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Content - Same structure as create form */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Optional details that enhance your project showcase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="challenges" className="text-sm font-medium">
                    Challenges Faced
                  </label>
                  <Textarea
                    id="challenges"
                    {...register("challenges")}
                    className="min-h-[100px]"
                    placeholder="What obstacles did you encounter and overcome?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="solutions" className="text-sm font-medium">
                    Solutions Implemented
                  </label>
                  <Textarea
                    id="solutions"
                    {...register("solutions")}
                    className="min-h-[100px]"
                    placeholder="How did you solve the challenges?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="learnings" className="text-sm font-medium">
                    Key Learnings
                  </label>
                  <Textarea
                    id="learnings"
                    {...register("learnings")}
                    className="min-h-[100px]"
                    placeholder="What did you learn from this project?"
                  />
                </div>

                {/* Project Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Project Metrics</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendMetric({ title: "", value: "", description: "" })}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Metric
                    </Button>
                  </div>
                  {metricFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Input
                          {...register(`metrics.${index}.title`)}
                          placeholder="Metric name"
                        />
                        <Input
                          {...register(`metrics.${index}.value`)}
                          placeholder="Value"
                        />
                        <Input
                          {...register(`metrics.${index}.description`)}
                          placeholder="Description (optional)"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMetric(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Same as create form */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="published"
                    type="checkbox"
                    {...register("published")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="published" className="text-sm font-medium">
                    Published
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    type="checkbox"
                    {...register("featured")}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured on homepage
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="h-5 w-5" />
                  <span>Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="featuredImage" className="text-sm font-medium">
                    Featured Image URL *
                  </label>
                  <Input
                    id="featuredImage"
                    {...register("featuredImage")}
                    className={cn(errors.featuredImage && "border-red-500")}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.featuredImage && (
                    <p className="text-sm text-red-500">{errors.featuredImage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Additional Images</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendImage("")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Input
                        {...register(`images.${index}`)}
                        placeholder="Image URL"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LinkIcon className="h-5 w-5" />
                  <span>Project Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="githubUrl" className="text-sm font-medium">
                    GitHub Repository
                  </label>
                  <Input
                    id="githubUrl"
                    {...register("githubUrl")}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="liveUrl" className="text-sm font-medium">
                    Live Demo
                  </label>
                  <Input
                    id="liveUrl"
                    {...register("liveUrl")}
                    placeholder="https://myproject.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="demoUrl" className="text-sm font-medium">
                    Demo Video
                  </label>
                  <Input
                    id="demoUrl"
                    {...register("demoUrl")}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="metaTitle" className="text-sm font-medium">
                    Meta Title
                  </label>
                  <Input
                    id="metaTitle"
                    {...register("metaTitle")}
                    placeholder="Custom page title"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="metaDescription" className="text-sm font-medium">
                    Meta Description
                  </label>
                  <Textarea
                    id="metaDescription"
                    {...register("metaDescription")}
                    className="min-h-[80px]"
                    placeholder="Custom page description for search results"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <Button
                    type="submit"
                    disabled={!isValid || isPending || !isDirty}
                    className="w-full"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isDirty ? "Save Changes" : "No Changes"}
                      </>
                    )}
                  </Button>
                  
                  {project.published && (
                    <Button type="button" variant="outline" className="w-full" asChild>
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Live
                      </Link>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    disabled={!isDirty}
                    className="w-full"
                  >
                    Reset Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}