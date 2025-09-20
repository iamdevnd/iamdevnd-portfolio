// src/components/resume-protection-modal.tsx
"use client"

import { useState } from "react"
import { X, Shield, Eye, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ResumeProtectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeProtectionModal({ isOpen, onClose }: ResumeProtectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-blue-500" />
            Sorry, My Resume is VIP Only
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            Look, I know you&apos;re curious about my credentials, but here&apos;s the thing...
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <Eye className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">Privacy First</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  My personal details aren&apos;t for public consumption. Would you post your home address on Times Square?
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-200">Quality Over Quantity</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Serious inquiries get the real deal. Tire-kickers get portfolio browsing rights only.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <Globe className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Internet Never Forgets</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Once it&apos;s online, it&apos;s forever. I&apos;m not about that life of having my resume indexed by every bot on the planet.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Want my resume? Here&apos;s how:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Send me a message through the contact form</li>
              <li>• Tell me about your opportunity (be specific!)</li>
              <li>• If it&apos;s a fit, you&apos;ll get the full PDF directly</li>
              <li>• No spam, no mass emails, no &quot;exciting opportunities&quot; without details</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 rounded-lg border">
            <p className="text-sm font-medium text-center">
              💡 <strong>Pro tip:</strong> The portfolio above already shows what I can do. 
              The resume just has the boring stuff like dates and company names.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={onClose} 
            className="flex-1"
            variant="outline"
          >
            Fair Enough
          </Button>
          <Button 
            onClick={() => {
              // Scroll to contact section
              onClose()
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                // If no contact section, navigate to contact page
                window.location.href = '/contact';
              }
            }}
            className="flex-1"
          >
            Let&apos;s Talk Business
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}