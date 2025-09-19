import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about my journey as an Applied AI Engineer and full-stack developer.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">
          About Me
        </h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            I'm a passionate Applied AI Engineer with expertise in building 
            intelligent applications that solve real-world problems.
          </p>
          
          <h2>My Journey</h2>
          <p>
            With over [2] years of experience in software development and AI, 
            I specialize in creating cutting-edge applications using the latest 
            technologies.
          </p>
          
          <h2>What I Do</h2>
          <ul>
            <li>Full-stack web application development</li>
            <li>AI/ML model integration and deployment</li>
            <li>API design and microservices architecture</li>
            <li>Cloud infrastructure and DevOps</li>
          </ul>
          
          <h2>Technologies I Love</h2>
          <p>
            I work with modern technologies including React, Next.js, TypeScript, 
            Python, TensorFlow, and cloud platforms like AWS and Firebase.
          </p>
        </div>
      </div>
    </div>
  )
}