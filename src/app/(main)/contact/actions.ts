"use server"

import { z } from "zod"
import { Resend } from "resend"
import { adminDb } from "@/lib/firebase/admin"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Contact form validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name contains invalid characters"),
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
  // reCAPTCHA token
  recaptchaToken: z.string().optional(),
})

// Type for form data
export type ContactFormData = z.infer<typeof contactFormSchema>

// Response type
export type ContactFormResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA secret key not configured")
    return true // Allow submission in development
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()
    return data.success && data.score > 0.5
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error)
    return false
  }
}

// Rate limiting check
async function checkRateLimit(email: string, ip?: string): Promise<boolean> {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const emailQuery = adminDb
      .collection("contactSubmissions")
      .where("email", "==", email)
      .where("createdAt", ">=", oneHourAgo)

    const emailSnapshot = await emailQuery.get()
    if (emailSnapshot.size >= 3) {
      return false
    }

    if (ip) {
      const ipQuery = adminDb
        .collection("contactSubmissions")
        .where("ipAddress", "==", ip)
        .where("createdAt", ">=", oneHourAgo)

      const ipSnapshot = await ipQuery.get()
      if (ipSnapshot.size >= 5) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Rate limit check failed:", error)
    return true
  }
}

// Save submission
async function saveSubmission(data: ContactFormData, metadata: any) {
  try {
    const submissionData = {
      ...data,
      ...metadata,
      createdAt: new Date(),
      status: "unread",
    }

    await adminDb.collection("contactSubmissions").add(submissionData)
  } catch (error) {
    console.error("Failed to save submission:", error)
  }
}

// Send notification email (TO YOU)
async function sendNotificationEmail(data: ContactFormData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API key not configured")
    return false
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Project Details</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          ${data.projectType ? `<p><strong>Project Type:</strong> ${data.projectType}</p>` : ''}
          ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
          ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>Sent from your portfolio contact form</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    const emailText = `
New Contact Form Submission

Contact Information:
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}

Project Details:
Subject: ${data.subject}
${data.projectType ? `Project Type: ${data.projectType}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.timeline ? `Timeline: ${data.timeline}` : ''}

Message:
${data.message}

---
Sent from your portfolio contact form
Time: ${new Date().toLocaleString()}
    `

    await resend.emails.send({
      from: "Portfolio Contact <portfolio@iamdevnd.dev>", // ✅ Updated
      to: ["iamdevnd@gmail.com"], // ✅ Updated
      replyTo: data.email,
      subject: `New Contact: ${data.subject}`,
      html: emailHtml,
      text: emailText,
    })

    return true
  } catch (error) {
    console.error("Failed to send notification email:", error)
    return false
  }
}

// Send confirmation email (TO USER)
async function sendConfirmationEmail(data: ContactFormData): Promise<boolean> {
  try {
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thanks for reaching out, ${data.name}!</h2>
        
        <p>I've received your message and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your message:</h3>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>

        <p>Best regards,<br>Dev ND</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This is an automated confirmation. Please don't reply to this email.</p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: "Dev ND <portfolio@iamdevnd.dev>", // ✅ Updated
      to: [data.email],
      subject: "Thanks for reaching out!",
      html: confirmationHtml,
    })

    return true
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return false
  }
}

// Main contact form submission handler
export async function submitContactForm(
  formData: FormData
): Promise<ContactFormResponse> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      budget: formData.get("budget") as string,
      timeline: formData.get("timeline") as string,
      projectType: formData.get("projectType") as string,
      recaptchaToken: formData.get("recaptchaToken") as string,
    }

    const validationResult = contactFormSchema.safeParse(rawData)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Please check your form data and try again.",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const data = validationResult.data

    if (data.recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(data.recaptchaToken)
      if (!recaptchaValid) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        }
      }
    }

    const rateLimitOk = await checkRateLimit(data.email)
    if (!rateLimitOk) {
      return {
        success: false,
        message: "Too many submissions. Please wait before submitting again.",
      }
    }

    const emailSent = await sendNotificationEmail(data)
    if (!emailSent) {
      return {
        success: false,
        message: "Failed to send your message. Please try again or contact me directly.",
      }
    }

    await sendConfirmationEmail(data)

    await saveSubmission(data, {
      userAgent: formData.get("userAgent"),
      ipAddress: formData.get("ipAddress"),
      source: "portfolio_contact_form",
    })

    return {
      success: true,
      message: "Thanks for your message! I'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again or contact me directly.",
    }
  }
}
