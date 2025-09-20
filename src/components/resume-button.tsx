"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResumeProtectionModal } from "@/components/resume-protection-modal"

export function ResumeButton() {
  const [showResumeModal, setShowResumeModal] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => setShowResumeModal(true)}
      >
        <svg 
          className="mr-2 h-4 w-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        Download Resume
      </Button>
      
      <ResumeProtectionModal 
        isOpen={showResumeModal} 
        onClose={() => setShowResumeModal(false)} 
      />
    </>
  )
}
