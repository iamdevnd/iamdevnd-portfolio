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
// src/lib/db/projects.ts - UPDATED VERSION
// src/lib/db/projects.ts - COMPLETE UPDATED VERSION
import { adminDb } from "@/lib/firebase/admin"
import { unstable_cache } from 'next/cache'

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
    longDescription: data.longDescription,
    metrics: data.metrics || [],
    // Convert to ISO strings for serialization
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as Project
}

/**
 * Get all published projects
 * Cached with tags for selective revalidation
 */
export const getAllProjects = unstable_cache(
  async (): Promise<Project[]> => {
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
  },
  ['all-projects'],
  {
    tags: ['projects'],
    revalidate: 60 // Cache for 1 minute, but can be revalidated on demand
  }
)

/**
 * Get featured projects for homepage
 * Limited to 3-4 most important projects
 */
export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
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
  },
  ['featured-projects'],
  {
    tags: ['projects', 'featured-projects'],
    revalidate: 60
  }
)

/**
 * Get a single project by slug
 * Used for project detail pages
 */
export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
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
  },
  ['project-by-slug'],
  {
    tags: ['projects'],
    revalidate: 300 // Cache for 5 minutes for individual projects
  }
)

/**
 * Get projects by category
 * For filtering on projects page
 */
export const getProjectsByCategory = unstable_cache(
  async (category: string): Promise<Project[]> => {
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
  },
  ['projects-by-category'],
  {
    tags: ['projects'],
    revalidate: 60
  }
)

/**
 * Get related projects based on similar technologies or category
 * Used on project detail pages
 */
export const getRelatedProjects = unstable_cache(
  async (
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
  },
  ['related-projects'],
  {
    tags: ['projects'],
    revalidate: 300
  }
)

/**
 * Get project slugs for static generation
 * Used in generateStaticParams
 */
export const getAllProjectSlugs = unstable_cache(
  async (): Promise<string[]> => {
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
  },
  ['project-slugs'],
  {
    tags: ['projects'],
    revalidate: 300
  }
)

/**
 * Admin function: Get all projects (including unpublished)
 * NOT CACHED - Always fresh data for admin with detailed logging
 */
export const getAllProjectsAdmin = async (): Promise<Project[]> => {
  try {
    console.log('🔍 [ADMIN] Starting fresh project fetch from Firestore...')
    console.log('🕐 [ADMIN] Request timestamp:', new Date().toISOString())
    
    const projectsRef = adminDb.collection('projects')
    console.log('📡 [ADMIN] Executing Firestore query...')
    
    const snapshot = await projectsRef
      .orderBy('updatedAt', 'desc')
      .get()

    console.log(`📊 [ADMIN] Firestore query completed. Documents found: ${snapshot.docs.length}`)

    if (snapshot.empty) {
      console.log('📭 [ADMIN] No projects found in Firestore collection')
      console.log('🔍 [ADMIN] Double-check that:')
      console.log('   - Collection name is "projects"')
      console.log('   - Documents exist in Firestore')
      console.log('   - Firebase permissions are correct')
      return []
    }

    console.log('🔄 [ADMIN] Transforming Firestore documents...')
    const projects = snapshot.docs.map((doc, index) => {
      const data = doc.data()
      console.log(`   ${index + 1}. Document ID: ${doc.id}`)
      console.log(`      Title: ${data.title || 'No title'}`)
      console.log(`      Published: ${data.published}`)
      console.log(`      Featured: ${data.featured}`)
      return transformProjectDoc(doc)
    })
    
    console.log(`✅ [ADMIN] Successfully transformed ${projects.length} projects`)
    console.log('📝 [ADMIN] Project summary:')
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title} (${project.published ? 'Published' : 'Draft'})`)
    })
    
    return projects
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching projects:', error)
    console.error('🔧 [ADMIN] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return []
  }
}

/**
 * Get a single project by ID (admin function)
 * NOT CACHED - Always fresh data for admin
 */
export const getProjectByIdAdmin = async (id: string): Promise<Project | null> => {
  try {
    console.log(`🔍 [ADMIN] Fetching project by ID: ${id}`)
    const projectRef = adminDb.collection('projects').doc(id)
    const doc = await projectRef.get()

    if (!doc.exists) {
      console.log(`❌ [ADMIN] Project not found: ${id}`)
      return null
    }

    const project = transformProjectDoc(doc)
    console.log(`✅ [ADMIN] Found project: ${project.title}`)
    return project
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching project by ID:', error)
    return null
  }
}

/**
 * Utility function to trigger revalidation after project changes
 */
export async function revalidateProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: 'projects'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to revalidate')
    }

    console.log('✅ Projects revalidated successfully')
  } catch (error) {
    console.error('❌ Error revalidating projects:', error)
  }
}

// ADMIN MUTATIONS (uncached)
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    console.log('🆕 [ADMIN] Creating new project:', projectData.title)
    const now = new Date()
    const docRef = await adminDb.collection('projects').add({
      ...projectData,
      createdAt: now,
      updatedAt: now,
    })
    console.log(`✅ [ADMIN] Project created with ID: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    console.error('❌ [ADMIN] Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

export async function updateProject(
  id: string,
  projectData: Partial<Omit<Project, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    console.log(`🔄 [ADMIN] Updating project: ${id}`)
    const ref = adminDb.collection('projects').doc(id)
    const snapshot = await ref.get()
    if (!snapshot.exists) throw new Error('Project not found')
    const now = new Date()
    await ref.update({ ...projectData, updatedAt: now })
    console.log(`✅ [ADMIN] Project updated: ${id}`)
  } catch (error) {
    console.error('❌ [ADMIN] Error updating project:', error)
    throw new Error('Failed to update project')
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    console.log(`🗑️ [ADMIN] Deleting project: ${id}`)
    const ref = adminDb.collection('projects').doc(id)
    await ref.delete()
    console.log(`✅ [ADMIN] Project deleted: ${id}`)
  } catch (error) {
    console.error('❌ [ADMIN] Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}

export async function toggleProjectPublished(id: string): Promise<void> {
  try {
    console.log(`🔄 [ADMIN] Toggling published status for project: ${id}`)
    const ref = adminDb.collection('projects').doc(id)
    const snapshot = await ref.get()
    if (!snapshot.exists) throw new Error('Project not found')
    const data = snapshot.data() || {}
    const willBePublished = !data.published
    const now = new Date()
    await ref.update({
      published: willBePublished,
      updatedAt: now,
    })
    console.log(`✅ [ADMIN] Project ${willBePublished ? 'published' : 'unpublished'}: ${id}`)
  } catch (error) {
    console.error('❌ [ADMIN] Error toggling project published:', error)
    throw new Error('Failed to toggle project')
  }
}

export async function toggleProjectFeatured(id: string): Promise<void> {
  try {
    console.log(`🔄 [ADMIN] Toggling featured status for project: ${id}`)
    const ref = adminDb.collection('projects').doc(id)
    const snapshot = await ref.get()
    if (!snapshot.exists) throw new Error('Project not found')
    const data = snapshot.data() || {}
    const willBeFeatured = !data.featured
    const now = new Date()
    await ref.update({
      featured: willBeFeatured,
      updatedAt: now,
    })
    console.log(`✅ [ADMIN] Project ${willBeFeatured ? 'featured' : 'unfeatured'}: ${id}`)
  } catch (error) {
    console.error('❌ [ADMIN] Error toggling project featured:', error)
    throw new Error('Failed to toggle featured')
  }
}