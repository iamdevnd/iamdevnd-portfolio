// src/app/(main)/blog/[slug]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Eye, User, Tag, Share, Heart } from "lucide-react"

import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogPostSlugs, incrementBlogPostViews } from "@/lib/db/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all published blog posts
export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs()
  
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt

  return {
    title,
    description,
    keywords: [post.category, ...post.tags],
    authors: [{ name: post.author.name, url: post.author.email }],
    openGraph: {
      title: `${title} | Dev ND Blog`,
      description,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

// Table of Contents component
interface TableOfContentsProps {
  tableOfContents: Array<{ id: string; text: string; level: number }>
}

function TableOfContents({ tableOfContents }: TableOfContentsProps) {
  if (!tableOfContents.length) return null

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "block text-sm hover:text-primary transition-colors",
                item.level === 1 && "font-medium",
                item.level === 2 && "ml-4",
                item.level === 3 && "ml-8"
              )}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </CardContent>
    </Card>
  )
}

// Related Posts component
interface RelatedPostsProps {
  posts: any[]
}

function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Posts</CardTitle>
        <CardDescription>You might also be interested in these posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex gap-4 group">
              {post.featuredImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={80}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="font-medium line-clamp-2 group-hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Share buttons component
function ShareButtons({ post }: { post: any }) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out this article: ${post.title}`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Share:</span>
      <Button size="sm" variant="outline" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </Button>
      <Button size="sm" variant="outline" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </Button>
      <Button size="sm" variant="outline" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </Button>
    </div>
  )
}

// Article content component with proper typography
function ArticleContent({ content }: { content: string }) {
  return (
    <div 
      className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-pre:bg-muted prose-pre:p-4 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// Main blog post page
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementBlogPostViews(post.id).catch(console.error)

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(post.id, post.tags, post.category, 3)

  const publishedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category and Tags */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <ShareButtons post={post} />
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={630}
              className="rounded-lg object-cover w-full"
              priority
            />
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-3">
            <ArticleContent content={post.content} />

            <Separator className="my-8" />

            {/* Article Footer */}
            <footer className="space-y-6">
              {/* Author Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {post.author.avatar && (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{post.author.name}</CardTitle>
                      <CardDescription>Software Engineer & AI Enthusiast</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Share Again */}
              <div className="flex items-center justify-between">
                <ShareButtons post={post} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </footer>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Table of Contents */}
            <TableOfContents tableOfContents={post.tableOfContents || []} />
            
            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/blog">
                ← All Posts
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Get in Touch →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}