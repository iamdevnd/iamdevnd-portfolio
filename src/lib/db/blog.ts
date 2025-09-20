// src/lib/db/blog.ts
import { adminDb } from "@/lib/firebase/admin"
import { FieldValue } from 'firebase-admin/firestore'
import { unstable_cache } from 'next/cache'

// Blog post type definition
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  featuredImage?: string
  images?: string[]
  tags: string[]
  category: string
  published: boolean
  featured: boolean
  readTime: number // estimated reading time in minutes
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  // SEO fields
  metaTitle?: string
  metaDescription?: string
  // Optional fields
  series?: string
  seriesOrder?: number
  tableOfContents?: {
    id: string
    text: string
    level: number
  }[]
}

// Transform Firestore document to BlogPost type
function transformBlogPostDoc(doc: any): BlogPost {
  const data = doc.data()
  
  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    author: data.author || { name: 'Dev ND', email: 'iamdevnd@gmail.com' },
    featuredImage: data.featuredImage,
    images: data.images || [],
    tags: data.tags || [],
    category: data.category || 'General',
    published: data.published || false,
    featured: data.featured || false,
    readTime: data.readTime || 5,
    views: data.views || 0,
    likes: data.likes || 0,
    series: data.series,
    seriesOrder: data.seriesOrder,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    tableOfContents: data.tableOfContents || [],
    // Convert to ISO strings for serialization
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    publishedAt: data.publishedAt?.toDate?.()?.toISOString(),
  } as BlogPost
}

/**
 * Get all published blog posts
 * Cached with tags for selective revalidation
 */
export const getAllBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .orderBy('publishedAt', 'desc')
        .get()

      if (snapshot.empty) {
        return []
      }

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }
  },
  ['all-blog-posts'],
  {
    tags: ['blog'],
    revalidate: 60
  }
)

/**
 * Get featured blog posts for homepage
 */
export const getFeaturedBlogPosts = unstable_cache(
  async (limit: number = 3): Promise<BlogPost[]> => {
    try {
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .where('featured', '==', true)
        .orderBy('publishedAt', 'desc')
        .limit(limit)
        .get()

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching featured blog posts:', error)
      return []
    }
  },
  ['featured-blog-posts'],
  {
    tags: ['blog', 'featured-blog'],
    revalidate: 60
  }
)

/**
 * Get blog post by slug
 */
export const getBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
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
  },
  ['blog-post-by-slug'],
  {
    tags: ['blog'],
    revalidate: 300
  }
)

/**
 * Get blog posts by category
 */
export const getBlogPostsByCategory = unstable_cache(
  async (category: string): Promise<BlogPost[]> => {
    try {
      let query = adminDb.collection('blog').where('published', '==', true)
      
      if (category !== 'All') {
        query = query.where('category', '==', category)
      }
      
      const snapshot = await query
        .orderBy('publishedAt', 'desc')
        .get()

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching blog posts by category:', error)
      return []
    }
  },
  ['blog-posts-by-category'],
  {
    tags: ['blog'],
    revalidate: 60
  }
)

/**
 * Get blog posts by tag
 */
export const getBlogPostsByTag = unstable_cache(
  async (tag: string): Promise<BlogPost[]> => {
    try {
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .where('tags', 'array-contains', tag)
        .orderBy('publishedAt', 'desc')
        .get()

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching blog posts by tag:', error)
      return []
    }
  },
  ['blog-posts-by-tag'],
  {
    tags: ['blog'],
    revalidate: 60
  }
)

/**
 * Get related blog posts based on tags and category
 */
export const getRelatedBlogPosts = unstable_cache(
  async (
    currentPostId: string,
    tags: string[],
    category: string,
    limit: number = 3
  ): Promise<BlogPost[]> => {
    try {
      // First try to find posts in the same category
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .where('category', '==', category)
        .orderBy('publishedAt', 'desc')
        .get()

      const allPosts = snapshot.docs.map(transformBlogPostDoc)
      
      // Filter out current post and calculate relevance score
      const relatedPosts = allPosts
        .filter(post => post.id !== currentPostId)
        .map(post => {
          // Calculate similarity score based on common tags
          const commonTags = post.tags.filter(tag => tags.includes(tag)).length
          return {
            ...post,
            relevanceScore: commonTags
          }
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit)

      return relatedPosts.map(({ relevanceScore, ...post }) => post)
    } catch (error) {
      console.error('Error fetching related blog posts:', error)
      return []
    }
  },
  ['related-blog-posts'],
  {
    tags: ['blog'],
    revalidate: 300
  }
)

/**
 * Get all blog post slugs for static generation
 */
export const getAllBlogPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
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
  },
  ['blog-post-slugs'],
  {
    tags: ['blog'],
    revalidate: 300
  }
)

/**
 * Get popular blog posts (by views)
 */
export const getPopularBlogPosts = unstable_cache(
  async (limit: number = 5): Promise<BlogPost[]> => {
    try {
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .orderBy('views', 'desc')
        .limit(limit)
        .get()

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching popular blog posts:', error)
      return []
    }
  },
  ['popular-blog-posts'],
  {
    tags: ['blog'],
    revalidate: 300
  }
)

/**
 * Get recent blog posts
 */
export const getRecentBlogPosts = unstable_cache(
  async (limit: number = 5): Promise<BlogPost[]> => {
    try {
      const snapshot = await adminDb
        .collection('blog')
        .where('published', '==', true)
        .orderBy('publishedAt', 'desc')
        .limit(limit)
        .get()

      return snapshot.docs.map(transformBlogPostDoc)
    } catch (error) {
      console.error('Error fetching recent blog posts:', error)
      return []
    }
  },
  ['recent-blog-posts'],
  {
    tags: ['blog'],
    revalidate: 60
  }
)

/**
 * Search blog posts by title and content
 */
export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation that searches titles
    // For production, consider using Algolia or similar
    const snapshot = await adminDb
      .collection('blog')
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .get()

    const allPosts = snapshot.docs.map(transformBlogPostDoc)
    
    // Simple client-side filtering for now
    const searchTerms = query.toLowerCase().split(' ')
    
    return allPosts.filter(post => {
      const searchableText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase()
      return searchTerms.some(term => searchableText.includes(term))
    })
  } catch (error) {
    console.error('Error searching blog posts:', error)
    return []
  }
}

/**
 * ADMIN FUNCTIONS (Not cached - always fresh data)
 */

/**
 * Get all blog posts for admin (including unpublished)
 */
export const getAllBlogPostsAdmin = async (): Promise<BlogPost[]> => {
  try {
    const snapshot = await adminDb
      .collection('blog')
      .orderBy('updatedAt', 'desc')
      .get()

    return snapshot.docs.map(transformBlogPostDoc)
  } catch (error) {
    console.error('Error fetching all blog posts (admin):', error)
    return []
  }
}

/**
 * Get blog post by ID for admin
 */
export const getBlogPostByIdAdmin = async (id: string): Promise<BlogPost | null> => {
  try {
    const doc = await adminDb.collection('blog').doc(id).get()

    if (!doc.exists) {
      return null
    }

    return transformBlogPostDoc(doc)
  } catch (error) {
    console.error('Error fetching blog post by ID (admin):', error)
    return null
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
  try {
    const now = new Date()
    const newPost = {
      ...postData,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.published ? now : null,
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
export async function updateBlogPost(id: string, postData: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'views' | 'likes'>>): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    const doc = await postRef.get()
    
    if (!doc.exists) {
      throw new Error('Blog post not found')
    }

    const currentData = doc.data()
    const now = new Date()
    
    const updatedPost = {
      ...postData,
      updatedAt: now,
      // Set publishedAt if being published for the first time
      publishedAt: postData.published && !currentData?.published ? now : currentData?.publishedAt,
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
 * Increment blog post views
 */
export async function incrementBlogPostViews(id: string): Promise<void> {
  try {
    const postRef = adminDb.collection('blog').doc(id)
    await postRef.update({
      views: FieldValue.increment(1)
    })
  } catch (error) {
    console.error('Error incrementing blog post views:', error)
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

    const currentData = doc.data()
    const now = new Date()
    const willBePublished = !currentData?.published
    
    await postRef.update({
      published: willBePublished,
      updatedAt: now,
      publishedAt: willBePublished && !currentData?.publishedAt ? now : currentData?.publishedAt,
    })
  } catch (error) {
    console.error('Error toggling blog post published status:', error)
    throw new Error('Failed to toggle blog post status')
  }
}

/**
 * Utility function to trigger blog revalidation
 */
export async function revalidateBlog() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: 'blog'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to revalidate')
    }

    console.log('✅ Blog revalidated successfully')
  } catch (error) {
    console.error('❌ Error revalidating blog:', error)
  }
}