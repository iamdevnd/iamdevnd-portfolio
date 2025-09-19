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
  createdAt: Date
  updatedAt: Date
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
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
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