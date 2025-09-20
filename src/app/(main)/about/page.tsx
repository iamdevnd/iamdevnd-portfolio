// src/app/(main)/about/page.tsx
import { Mail, MapPin, Clock, Calendar, Code, Database, Cloud, Brain } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { contactInfo, siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about my journey as an Applied AI Engineer, my technical expertise, and passion for building innovative solutions.",
  openGraph: {
    title: "About | Dev ND",
    description: "Learn about my journey as an Applied AI Engineer, my technical expertise, and passion for building innovative solutions.",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          About Me
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Applied AI Engineer passionate about building scalable systems and deploying cutting-edge AI solutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Story */}
          <Card>
            <CardHeader>
              <CardTitle>My Journey</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                I&apos;m a Software and AI Engineer with a Master&apos;s in Computer Science, specializing in building cloud-native microservices and deploying Generative AI/LLM systems. My expertise spans RAG (Retrieval-Augmented Generation), vector search, and knowledge graphs.
              </p>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                Throughout my career, I&apos;ve consistently delivered measurable impact: cutting p95 latency by 40%, maintaining 99.9% system uptime, and increasing release velocity by 45% through CI/CD automation. I believe in building systems that not only work but scale elegantly under pressure.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                My approach combines deep technical expertise with practical business sense. Whether I&apos;m optimizing Python microservices for thousands of users or architecting enterprise-grade AI solutions, I focus on delivering solutions that drive real business results.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                I&apos;m particularly passionate about the intersection of AI and software engineering, where I leverage tools like GitHub Copilot, OpenAI Codex, and Anthropic Claude to accelerate development while maintaining code quality and system reliability.
              </p>
            </CardContent>
          </Card>

          {/* Experience Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Experience</CardTitle>
              <CardDescription>My journey through software engineering and AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Junior Software Engineer</h3>
                    <p className="text-sm text-muted-foreground mb-2">Current Role</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Developed and deployed AI-powered applications, automating workflows across teams</li>
                      <li>• Architected enterprise-grade solutions on AWS with third-party AI integrations</li>
                      <li>• Leveraged AI coding agents to accelerate development, improving delivery speed by 30%</li>
                      <li>• Ensured reliability via DevOps best practices and containerized deployments</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-3"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Graduate Assistant</h3>
                    <p className="text-sm text-muted-foreground mb-2">Academic Role</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Optimized Python microservices for 1,000+ users, reducing p95 latency by 40%</li>
                      <li>• Hardened REST APIs with OAuth2/JWT, maintaining 99.9% uptime on AWS</li>
                      <li>• Automated CI/CD with GitHub Actions & Terraform, reducing deployment errors by 60%</li>
                      <li>• Implemented OpenTelemetry logging & tracing for faster incident resolution</li>
                      <li>• Authored 20+ SOPs and reusable templates, reducing onboarding time by 30-40%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Expertise</CardTitle>
              <CardDescription>Technologies I work with daily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">AI/ML & Data Science</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'RAG', 'FAISS', 'spaCy', 'scikit-learn', 'PySpark', 'LLM fine-tuning'].map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Cloud className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Backend & Cloud</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['FastAPI', 'Django REST', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Supabase', 'Firebase'].map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Code className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Languages & Frontend</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'JavaScript/TypeScript', 'Java', 'Go', 'React', 'Next.js', 'SQL'].map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Database className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">DevOps & Infrastructure</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['CI/CD', 'GitHub Actions', 'Jenkins', 'Terraform', 'OpenTelemetry', 'Prometheus', 'Grafana'].map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Touch */}
          <Card>
            <CardHeader>
              <CardTitle>Beyond the Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When I&apos;m not optimizing algorithms or architecting cloud solutions, I&apos;m constantly exploring the latest developments in AI and machine learning. I believe in the power of open-source software and contribute to projects that solve real-world problems.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My academic background includes advanced coursework in Machine Learning, Knowledge Representation, Data Mining, and Machine/Deep Learning Security. I&apos;ve also published research on IoT-robotics convergence and cybersecurity challenges.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  I&apos;m always interested in discussing new technologies, potential collaborations, or just geeking out about the latest AI breakthroughs. Feel free to reach out if you&apos;d like to connect!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Let&apos;s Connect</CardTitle>
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

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>AWS Certified Cloud Practitioner</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>SQL and Relational Databases 101 (IBM)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Python 101 for Data Science (IBM)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Fun Fact */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Latency Reduction</span>
                  <span className="font-semibold text-green-600">40%</span>
                </div>
                <div className="flex justify-between">
                  <span>System Uptime</span>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Release Velocity Increase</span>
                  <span className="font-semibold text-green-600">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>SOPs Authored</span>
                  <span className="font-semibold text-blue-600">20+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}