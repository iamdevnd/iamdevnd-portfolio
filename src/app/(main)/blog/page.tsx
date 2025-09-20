// src/app/(main)/blog/page.tsx
import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Tag, Eye, User } from "lucide-react"

import { getAllBlogPosts, getBlogPostsByCategory } from "@/lib/db/blog"
import { blogCategories } from "@/config/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on AI engineering, software development, and technology trends. Learn from real-world projects and industry experiences.",
  keywords: [
    "AI engineering blog",
    "Machine learning tutorials",
    "Software development insights",
    "Technology trends",
    "Programming tutorials",
    "Developer blog"
  ],
  openGraph: {
    title: "Blog | Dev ND",
    description: "Insights on AI engineering, software development, and technology trends.",
    type: "website",
  },
}

interface BlogPageProps {
  searchParams: {
    category?: string
    search?: string
  }
}

// Loading skeleton for blog cards
function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardHeader>
        <div className="h-4 bg-muted rounded animate-pulse mb-2" />
        <div className="h-6 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </CardContent>
    </Card>
  )
}

// Blog card component
interface BlogCardProps {
  post: any // Will be properly typed with BlogPost interface
}

function BlogCard({ post }: BlogCardProps) {
  const publishedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      {post.featuredImage && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {publishedDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime} min read
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views.toLocaleString()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Link href={`/blog/${post.slug}`}>
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </CardTitle>
          </Link>
          
          <CardDescription className="line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
              {post.category}
            </span>
            {post.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {post.author.name}
          </div>
        </div>
        
        <div className="mt-4">
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Category filter component
interface CategoryFilterProps {
  currentCategory: string
}

function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {['All', ...blogCategories].map((category) => (
        <Button
          key={category}
          asChild
          variant={currentCategory === category ? "default" : "outline"}
          size="sm"
        >
          <Link 
            href={category === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`}
            className="capitalize"
          >
            {category}
          </Link>
        </Button>
      ))}
    </div>
  )
}

// Main blog page component
async function BlogPageContent({ searchParams }: BlogPageProps) {
  const category = searchParams.category || 'All'
  
  // Get posts based on category filter
  const posts = category === 'All' 
    ? await getAllBlogPosts()
    : await getBlogPostsByCategory(category)

  // Filter by search if provided
  const filteredPosts = searchParams.search
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchParams.search!.toLowerCase()))
      )
    : posts

  const totalPosts = posts.length
  const filteredCount = filteredPosts.length

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground">
          Insights on AI engineering, software development, and technology trends. 
          Learn from real-world projects and industry experiences.
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter currentCategory={category} />

      {/* Results Info */}
      {(category !== 'All' || searchParams.search) && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredCount === 0 ? (
              <>No posts found{category !== 'All' && ` in "${category}"`}{searchParams.search && ` matching "${searchParams.search}"`}</>
            ) : (
              <>
                Showing {filteredCount} of {totalPosts} posts
                {category !== 'All' && ` in "${category}"`}
                {searchParams.search && ` matching "${searchParams.search}"`}
              </>
            )}
          </p>
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {category !== 'All' 
              ? `No published posts in the "${category}" category yet.`
              : "No published posts found matching your criteria."
            }
          </p>
          <Button asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Load More Button (for future pagination) */}
      {filteredPosts.length >= 12 && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  )
}

// Main page component with Suspense wrapper
export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container py-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="h-10 bg-muted rounded animate-pulse mb-4" />
            <div className="h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <BlogPageContent searchParams={searchParams} />
    </Suspense>
  )
}