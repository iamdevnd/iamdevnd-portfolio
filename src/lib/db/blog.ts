// src/lib/db/blog.ts
import { adminDb } from "@/lib/firebase/admin"
import { cache } from "react"

// Blog post type definition
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  featuredImage?: string
  tags: string[]
  category: string
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  slug: string
  readTime: number // estimated reading time in minutes
  metaTitle?: string
  metaDescription?: string
  authorName: string
  authorImage?: string
}

// Transform Firestore document to BlogPost type
function transformBlogPostDoc(doc: any): BlogPost {
  const data = doc.data()
  
  return {
    id: doc.id,
    title: data.title || '',
    content: data.content || '',
    excerpt: data.excerpt || '',
    featuredImage: data.featuredImage,
    tags: data.tags || [],
    category: data.category || '',
    published: data.published || false,
    featured: data.featured || false,
    slug: data.slug || '',
    readTime: data.readTime || 5,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    authorName: data.authorName || 'Dev ND',
    authorImage: data.authorImage,
    // Convert to ISO strings for serialization
    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
  }
}

/**
 * Get all published blog posts for public pages
 */
export const getPublishedBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(transformBlogPostDoc)
  } catch (error) {
    console.error('Error fetching published blog posts:', error)
    return []
  }
})

/**
 * Get featured blog posts for homepage
 */
export const getFeaturedBlogPosts = cache(async (limit: number = 3): Promise<BlogPost[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .where('featured', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map(transformBlogPostDoc)
  } catch (error) {
    console.error('Error fetching featured blog posts:', error)
    return []
  }
})

/**
 * Get blog post by slug
 */
export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    return transformBlogPostDoc(snapshot.docs[0])
  } catch (error) {
    console.error('Error fetching blog post by slug:', error)
    return null
  }
})

/**
 * Get blog posts by category
 */
export const getBlogPostsByCategory = cache(async (category: string): Promise<BlogPost[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(transformBlogPostDoc)
  } catch (error) {
    console.error('Error fetching blog posts by category:', error)
    return []
  }
})

/**
 * Get related blog posts based on tags
 */
export const getRelatedBlogPosts = cache(async (
  currentPostId: string,
  tags: string[],
  limit: number = 3
): Promise<BlogPost[]> => {
  try {
    if (tags.length === 0) return []

    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get()

    const posts = snapshot.docs
      .map(transformBlogPostDoc)
      .filter(post => post.id !== currentPostId)

    // Calculate relevance score based on shared tags
    const postsWithScore = posts.map(post => {
      const sharedTags = post.tags.filter(tag => tags.includes(tag))
      return {
        ...post,
        relevanceScore: sharedTags.length
      }
    })

    // Sort by relevance score and return top results
    return postsWithScore
      .filter(post => post.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching related blog posts:', error)
    return []
  }
})

/**
 * Get all blog post slugs for static generation
 */
export const getAllBlogPostSlugs = cache(async (): Promise<string[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .select('slug')
      .get()

    return snapshot.docs.map(doc => doc.data().slug).filter(Boolean)
  } catch (error) {
    console.error('Error fetching blog post slugs:', error)
    return []
  }
})

/**
 * Admin functions for blog management
 */

/**
 * Get all blog posts for admin (including unpublished)
 */
export const getAllBlogPostsAdmin = cache(async (): Promise<BlogPost[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(transformBlogPostDoc)
  } catch (error) {
    console.error('Error fetching all blog posts for admin:', error)
    return []
  }
})

/**
 * Get blog post by ID for admin
 */
export const getBlogPostById = cache(async (id: string): Promise<BlogPost | null> => {
  try {
    const doc = await adminDb.collection('blog').doc(id).get()
    
    if (!doc.exists) {
      return null
    }

    return transformBlogPostDoc(doc)
  } catch (error) {
    console.error('Error fetching blog post by ID:', error)
    return null
  }
})

/**
 * Create a new blog post
 */
export async function createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date()
    const newPost = {
      ...postData,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('blog').add(newPost)
    return docRef.id
  } catch (error) {
    console.error('Error creating blog post:', error)
    throw new Error('Failed to create blog post')
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    
    // Check if post exists
    const doc = await postRef.get()
    if (!doc.exists) {
      throw new Error('Blog post not found')
    }

    const updatedPost = {
      ...postData,
      updatedAt: new Date(),
    }

    await postRef.update(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    throw new Error('Failed to update blog post')
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    
    // Check if post exists
    const doc = await postRef.get()
    if (!doc.exists) {
      throw new Error('Blog post not found')
    }

    await postRef.delete()
  } catch (error) {
    console.error('Error deleting blog post:', error)
    throw new Error('Failed to delete blog post')
  }
}

/**
 * Toggle blog post published status
 */
export async function toggleBlogPostPublished(id: string): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    const doc = await postRef.get()
    
    if (!doc.exists) {
      throw new Error('Blog post not found')
    }

    const currentStatus = doc.data()?.published || false
    await postRef.update({
      published: !currentStatus,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error toggling blog post published status:', error)
    throw new Error('Failed to toggle blog post status')
  }
}

/**
 * Toggle blog post featured status
 */
export async function toggleBlogPostFeatured(id: string): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    const doc = await postRef.get()
    
    if (!doc.exists) {
      throw new Error('Blog post not found')
    }

    const currentStatus = doc.data()?.featured || false
    await postRef.update({
      featured: !currentStatus,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error('Error toggling blog post featured status:', error)
    throw new Error('Failed to toggle blog post featured status')
  }
}