//Project Database Functions Created
//This module provides:

//Complete Project Type: Comprehensive TypeScript interface with all fields
//Cached Functions: React cache() for optimal performance and ISR compatibility
//Error Handling: Graceful fallbacks that never break the UI
//Multiple Query Types: Featured, by category, by slug, related projects
//Admin Support: Separate function for admin panel (includes unpublished)
//SEO Ready: Meta fields and slug-based routing
//Performance Optimized: Proper Firestore indexing and limits

//Key Features:

//React Server Component Ready: All functions work in RSCs
//Type Safety: Full TypeScript coverage with proper transformations
//Firestore Optimized: Uses proper where clauses and indexing
//Caching Strategy: React's cache() for per-request memoization
//Related Content: Smart algorithm for finding similar projects

//Firestore Indexes Required:
//You'll need to create these composite indexes in Firebase Console:
//Collection: projects
//- published (Ascending) + createdAt (Descending)
//- published (Ascending) + featured (Ascending) + createdAt (Descending)
//- published (Ascending) + category (Ascending) + createdAt (Descending)
////
import { adminDb } from "@/lib/firebase/admin"
import { cache } from "react"

// Project type definition
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  excerpt: string
  featuredImage: string
  images: string[]
  technologies: string[]
  category: string
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
  slug: string
  status: 'completed' | 'in-progress' | 'planning'
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  // Optional additional fields
  challenges?: string
  solutions?: string
  learnings?: string
  metrics?: {
    title: string
    value: string
    description?: string
  }[]
}

// Transform Firestore document to Project type
// Transform Firestore document to Project type
function transformProjectDoc(doc: any): Project {
  const data = doc.data()
  
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    excerpt: data.excerpt || '',
    featuredImage: data.featuredImage || '',
    images: data.images || [],
    technologies: data.technologies || [],
    category: data.category || '',
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    demoUrl: data.demoUrl,
    featured: data.featured || false,
    published: data.published || false,
    slug: data.slug || '',
    status: data.status || 'planning',
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    challenges: data.challenges,
    solutions: data.solutions,
    learnings: data.learnings,
    metrics: data.metrics || [],
    // Convert to ISO strings for serialization
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Project
}

/**
 * Get all published projects
 * Cached for performance in production
 */
export const getAllProjects = cache(async (): Promise<Project[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    const snapshot = await projectsRef
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(transformProjectDoc)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
})

/**
 * Get featured projects for homepage
 * Limited to 3-4 most important projects
 */
export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    const snapshot = await projectsRef
      .where('published', '==', true)
      .where('featured', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(4)
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(transformProjectDoc)
  } catch (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }
})

/**
 * Get a single project by slug
 * Used for project detail pages
 */
export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const projectsRef = adminDb.collection('projects')
    const snapshot = await projectsRef
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    return transformProjectDoc(snapshot.docs[0])
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
})

/**
 * Get projects by category
 * For filtering on projects page
 */
export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    let query = projectsRef.where('published', '==', true)
    
    if (category !== 'All') {
      query = query.where('category', '==', category)
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(transformProjectDoc)
  } catch (error) {
    console.error('Error fetching projects by category:', error)
    return []
  }
})

/**
 * Get related projects based on similar technologies or category
 * Used on project detail pages
 */
export const getRelatedProjects = cache(async (
  currentProjectId: string, 
  technologies: string[], 
  category: string,
  limit: number = 3
): Promise<Project[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    
    // First try to find projects with similar technologies
    const snapshot = await projectsRef
      .where('published', '==', true)
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get()

    if (snapshot.empty) {
      return []
    }

    const allProjects = snapshot.docs.map(transformProjectDoc)
    
    // Filter out current project and calculate relevance score
    const relatedProjects = allProjects
      .filter(project => project.id !== currentProjectId)
      .map(project => {
        // Calculate similarity score based on common technologies
        const commonTechs = project.technologies.filter(tech => 
          technologies.includes(tech)
        ).length
        
        return {
          ...project,
          relevanceScore: commonTechs
        }
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    // Remove the relevanceScore property before returning
    return relatedProjects.map(({ relevanceScore, ...project }) => project)
  } catch (error) {
    console.error('Error fetching related projects:', error)
    return []
  }
})

/**
 * Get project slugs for static generation
 * Used in generateStaticParams
 */
export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    const snapshot = await projectsRef
      .where('published', '==', true)
      .select('slug')
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(doc => doc.data().slug).filter(Boolean)
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return []
  }
})

/**
 * Admin function: Get all projects (including unpublished)
 * Used in admin panel
 */
export const getAllProjectsAdmin = cache(async (): Promise<Project[]> => {
  try {
    const projectsRef = adminDb.collection('projects')
    const snapshot = await projectsRef
      .orderBy('updatedAt', 'desc')
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(transformProjectDoc)
  } catch (error) {
    console.error('Error fetching all projects (admin):', error)
    return []
  }
})

// Add these functions to your existing src/lib/db/projects.ts file

/**
 * Get a single project by ID (admin function)
 * Used for editing projects in admin panel
 */
export const getProjectByIdAdmin = cache(async (id: string): Promise<Project | null> => {
  try {
    const projectRef = adminDb.collection('projects').doc(id)
    const doc = await projectRef.get()

    if (!doc.exists) {
      return null
    }

    return transformProjectDoc(doc)
  } catch (error) {
    console.error('Error fetching project by ID:', error)
    return null
  }
})

/**
 * Create a new project
 * Used in admin panel project creation
 */
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date()
    const newProject = {
      ...projectData,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('projects').add(newProject)
    return docRef.id
  } catch (error) {
    console.error('Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

/**
 * Update an existing project
 * Used in admin panel project editing
 */
export async function updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const projectRef = adminDb.collection('projects').doc(id)
    
    // Check if project exists
    const doc = await projectRef.get()
    if (!doc.exists) {
      throw new Error('Project not found')
    }

    const updatedProject = {
      ...projectData,
      updatedAt: new Date(),
    }

    await projectRef.update(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    throw new Error('Failed to update project')
  }
}

/**
 * Delete a project
 * Used in admin panel project management
 */
export async function deleteProject(id: string): Promise<void> {
  try {
    const projectRef = adminDb.collection('projects').doc(id)
    
    // Check if project exists
    const doc = await projectRef.get()
    if (!doc.exists) {
      throw new Error('Project not found')
    }

    await projectRef.delete()
  } catch (error) {
    console.error('Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}

/**
 * Toggle project published status
 * Quick action for admin panel
 */
export async function toggleProjectPublished(id: string): Promise<void> {
  try {
    const projectRef = adminDb.collection('projects').doc(id)
    const doc = await projectRef.get()
    
    if (!doc.exists) {
      throw new Error('Project not found')
    }

    const currentData = doc.data()
    await projectRef.update({
      published: !currentData?.published,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error toggling project published status:', error)
    throw new Error('Failed to toggle project status')
  }
}

/**
 * Toggle project featured status
 * Quick action for admin panel
 */
export async function toggleProjectFeatured(id: string): Promise<void> {
  try {
    const projectRef = adminDb.collection('projects').doc(id)
    const doc = await projectRef.get()
    
    if (!doc.exists) {
      throw new Error('Project not found')
    }

    const currentData = doc.data()
    await projectRef.update({
      featured: !currentData?.featured,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error toggling project featured status:', error)
    throw new Error('Failed to toggle project featured status')
  }
}

/**
 * Bulk update project statuses
 * For admin operations
 */
export async function bulkUpdateProjects(
  projectIds: string[], 
  updates: Partial<Pick<Project, 'published' | 'featured' | 'status'>>
): Promise<void> {
  try {
    const batch = adminDb.batch()
    const now = new Date()

    for (const id of projectIds) {
      const projectRef = adminDb.collection('projects').doc(id)
      batch.update(projectRef, {
        ...updates,
        updatedAt: now,
      })
    }

    await batch.commit()
  } catch (error) {
    console.error('Error bulk updating projects:', error)
    throw new Error('Failed to bulk update projects')
  }
}