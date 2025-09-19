"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { submitContactForm, type ContactFormData } from "@/app/(main)/contact/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Form validation schema (client-side)
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  budget: z
    .enum(["<$5k", "$5k-$15k", "$15k-$50k", "$50k+", "Not sure"])
    .optional(),
  timeline: z
    .enum(["ASAP", "1-3 months", "3-6 months", "6+ months", "Just exploring"])
    .optional(),
  projectType: z
    .enum(["Web Application", "Mobile App", "AI/ML Project", "API Development", "Consulting", "Other"])
    .optional(),
})

type FormData = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  })

  // Watch message length for character counter
  const messageValue = watch("message", "")

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        // Create FormData object
        const formData = new FormData()
        
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            formData.append(key, value.toString())
          }
        })

        // Add metadata
        formData.append("userAgent", navigator.userAgent)
        
        // Submit form
        const result = await submitContactForm(formData)

        if (result.success) {
          setIsSubmitted(true)
          reset()
          toast.success(result.message)
        } else {
          toast.error(result.message)
          
          // Handle field errors
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`)
              })
            })
          }
        }
      } catch (error) {
        console.error("Form submission error:", error)
        toast.error("Something went wrong. Please try again.")
      }
    })
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Message Sent!</h3>
              <p className="text-muted-foreground">
                Thanks for reaching out. I'll get back to you within 24 hours.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
            >
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Get In Touch</CardTitle>
        <CardDescription>
          Let's discuss your project and how I can help bring your ideas to life.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                {...register("name")}
                className={cn(errors.name && "border-red-500")}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={cn(errors.email && "border-red-500")}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company (Optional)
            </label>
            <Input
              id="company"
              {...register("company")}
              placeholder="Your Company Name"
            />
          </div>

          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <Input
                id="subject"
                {...register("subject")}
                className={cn(errors.subject && "border-red-500")}
                placeholder="Project inquiry, collaboration opportunity, etc."
              />
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="projectType" className="text-sm font-medium">
                  Project Type
                </label>
                <select
                  id="projectType"
                  {...register("projectType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select type</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="AI/ML Project">AI/ML Project</option>
                  <option value="API Development">API Development</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="text-sm font-medium">
                  Budget Range
                </label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select budget</option>
                  <option value="<$5k">&lt;$5k</option>
                  <option value="$5k-$15k">$5k-$15k</option>
                  <option value="$15k-$50k">$15k-$50k</option>
                  <option value="$50k+">$50k+</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="timeline" className="text-sm font-medium">
                  Timeline
                </label>
                <select
                  id="timeline"
                  {...register("timeline")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                  <option value="Just exploring">Just exploring</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message *
              </label>
              <Textarea
                id="message"
                {...register("message")}
                className={cn(
                  "min-h-[120px] resize-y",
                  errors.message && "border-red-500"
                )}
                placeholder="Tell me about your project, goals, and any specific requirements..."
              />
              <div className="flex justify-between items-center">
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message.message}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {messageValue.length}/5000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !isValid}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}