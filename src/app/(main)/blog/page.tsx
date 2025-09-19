import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts and insights on AI, software development, and technology.",
}

export default function BlogPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, tutorials, and thoughts on AI, software development, 
          and the future of technology.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-muted-foreground mb-6">
          Blog posts coming soon! I'm working on some exciting content about 
          AI engineering, Next.js development, and building production applications.
        </p>
        
        <p className="text-sm text-muted-foreground">
          Want to be notified when I publish new posts? 
          <a href="/contact" className="text-primary hover:underline ml-1">
            Get in touch
          </a>
        </p>
      </div>
    </div>
  )
}