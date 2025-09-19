"use client"

//import type { Metadata } from "next"
import { Mail, MapPin, Clock, Calendar } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { siteConfig, skills, contactInfo } from "@/config/site"

//export const metadata: Metadata = {
//  title: "About",
  //description: "Learn about my journey as an Applied AI Engineer and full-stack developer.",
  //openGraph: {
    //title: "About | Dev ND",
    //description: "Learn about my journey as an Applied AI Engineer and full-stack developer.",
    //type: "website",
  //},
//}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          About Me
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          I'm a passionate Applied AI Engineer with expertise in building 
          intelligent applications that solve real-world problems. I specialize 
          in creating cutting-edge applications using modern technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Journey Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">My Journey</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                With several years of experience in software development and AI, 
                I've had the privilege of working on diverse projects that range 
                from enterprise web applications to cutting-edge AI solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My passion lies in bridging the gap between complex AI technologies 
                and practical, user-friendly applications. I believe that the best 
                AI solutions are those that seamlessly integrate into existing 
                workflows and genuinely improve people's lives.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                When I'm not coding, you'll find me exploring the latest developments 
                in AI research, contributing to open-source projects, or sharing 
                insights about technology through writing and speaking.
              </p>
            </CardContent>
          </Card>

          {/* What I Do Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What I Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold mb-1">AI/ML Development</h3>
                      <p className="text-sm text-muted-foreground">
                        Building intelligent applications with modern AI frameworks 
                        and custom machine learning models.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold mb-1">Full-Stack Development</h3>
                      <p className="text-sm text-muted-foreground">
                        Creating end-to-end web applications with modern frameworks 
                        like Next.js, React, and Python.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold mb-1">API Development</h3>
                      <p className="text-sm text-muted-foreground">
                        Designing and implementing scalable APIs and microservices 
                        architectures for complex systems.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold mb-1">Cloud & DevOps</h3>
                      <p className="text-sm text-muted-foreground">
                        Deploying and managing applications on cloud platforms 
                        with modern DevOps practices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Let's Connect</CardTitle>
              <CardDescription>
                Always open to discussing new opportunities and interesting projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{contactInfo.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{contactInfo.timezone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{contactInfo.availability}</span>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/contact">Get In Touch</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href={siteConfig.links.calendar} target="_blank" rel="noopener noreferrer">
                    Schedule a Call
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resume Download */}
          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  Download Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Technologies I Work With
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I work with modern technologies and frameworks to build scalable, 
            efficient, and maintainable applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.languages.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frameworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.frameworks.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI/ML</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.aiml.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Databases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.databases.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools & Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action Card */}
          <Card className="flex items-center justify-center">
            <CardContent className="text-center py-8">
              <h3 className="font-semibold mb-2">Ready to Collaborate?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let's build something amazing together.
              </p>
              <Button asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}