//Server Actions (actions.ts):

//Zod Validation: Server-side form validation with detailed error messages
//Email Integration: Sends notification emails via Resend API
//Rate Limiting: Prevents spam with email and IP-based limits
//reCAPTCHA Support: Optional spam protection (configurable)
//Database Storage: Saves submissions to Firestore for admin review
//Confirmation Emails: Automatic confirmation to users
//Error Handling: Graceful error handling with user-friendly messages

//Contact Form Component:

//React Hook Form: Professional form handling with validation
//Real-time Validation: Instant feedback as users type
//Loading States: Visual feedback during submission
//Success States: Clear confirmation when message is sent
//Character Counters: Helpful UI for message length
//Responsive Design: Works perfectly on all devices
//Accessibility: Proper labels, ARIA attributes, and keyboard navigation

//Contact Page:

//Professional Layout: Contact form + information sidebar
//Multiple Contact Methods: Form, email, social links, resume download
//Clear Expectations: Response times and process information
//FAQ Section: Answers common questions proactively
//Call to Action: Encourages engagement with multiple options

//Setup Requirements:

//Add Resend API key to environment variables
//Configure your domain for email sending
//Update email addresses in the actions file
//Add your resume.pdf to the public folder
////
import { Mail, MapPin, Clock, Phone, MessageSquare, Calendar } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { contactInfo, siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to discuss your next project. I'm available for freelance work, consulting, and collaboration opportunities.",
  keywords: [
    "contact",
    "hire developer",
    "freelance",
    "consulting",
    "AI engineer",
    "Next.js developer",
    "project inquiry"
  ],
  openGraph: {
    title: "Contact | Dev ND",
    description: "Get in touch to discuss your next project. I'm available for freelance work, consulting, and collaboration opportunities.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Let's Work Together
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          I'm always interested in new opportunities and exciting projects. 
          Whether you need a full-stack application, AI integration, or technical consulting, 
          I'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Contact Information & Quick Actions */}
        <div className="space-y-8">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>
                Prefer to reach out directly? Here are other ways to connect.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <Link 
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    {contactInfo.email}
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.timezone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-medium">Availability</p>
                  <p className="text-sm text-muted-foreground">{contactInfo.availability}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Other ways to connect and learn more about my work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href={`mailto:${contactInfo.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Direct Email
                </Link>
              </Button>

              {/* ✅ Added Schedule a Call button */}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="https://app.cal.com/dnpro/" target="_blank" rel="noopener noreferrer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule a Call
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  View GitHub
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Response Time Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>What to Expect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Initial Response</span>
                  <span className="text-sm text-muted-foreground">Within 24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Project Discussion</span>
                  <span className="text-sm text-muted-foreground">2-3 business days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Proposal Delivery</span>
                  <span className="text-sm text-muted-foreground">Within 1 week</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  I typically work with clients who value quality, clear communication, 
                  and long-term partnerships. All projects start with a detailed 
                  discovery call to ensure we're a good fit.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Card */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Do you work with startups?</h4>
                <p className="text-xs text-muted-foreground">
                  Yes! I love working with early-stage companies and have flexible 
                  pricing models to accommodate different budgets.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">What's your typical project timeline?</h4>
                <p className="text-xs text-muted-foreground">
                  Most projects range from 4-12 weeks depending on complexity. 
                  I provide detailed timelines during the proposal phase.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Do you offer ongoing support?</h4>
                <p className="text-xs text-muted-foreground">
                  Absolutely! I offer maintenance packages and can provide ongoing 
                  development support after project completion.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-muted-foreground mb-8">
            The best time to start is now. Let's discuss your ideas and create something 
            amazing together. I'm committed to delivering high-quality solutions that 
            drive real business results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#contact-form">
                Fill Out the Form Above
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`mailto:${contactInfo.email}?subject=Project Inquiry`}>
                Send Quick Email
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
