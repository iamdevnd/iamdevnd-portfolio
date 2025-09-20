// src/app/admin/blog/page.tsx
import { Suspense } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Placeholder blog table component
function BlogTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog content
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Edit className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Blog System Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your blog system is set up and ready to use. Run the blog sample data script to populate with sample posts and start creating content.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Add Sample Blog Posts:</p>
              <code className="text-xs bg-background px-2 py-1 rounded">
                node scripts/add-sample-blog-data.js
              </code>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link href="/admin/blog/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Post
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog" target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground">
          Create and manage your blog posts
        </p>
      </div>

      <Suspense fallback={<div>Loading blog posts...</div>}>
        <BlogTable />
      </Suspense>
    </div>
  )
}