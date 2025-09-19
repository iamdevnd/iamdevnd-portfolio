//Filter Components Created
//These components provide:
//ProjectsFilter Features:

//URL State Management: Filters persist in URL for sharing/bookmarking
//Visual Feedback: Active states and smooth transitions
//Preserve Search: Maintains search query when changing categories
//Clear Functionality: Easy removal of active filters
//Responsive Design: Wrapping button layout
////

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectsFilterProps {
  categories: readonly string[]
  currentCategory?: string
}

export function ProjectsFilter({ categories, currentCategory = "All" }: ProjectsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === "All") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    
    // Preserve search query if it exists
    const search = searchParams.get("search")
    if (search) {
      params.set("search", search)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : "/projects"
    
    router.push(url)
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Filter by category
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = currentCategory === category
          
          return (
            <Button
              key={category}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "transition-all duration-200",
                isActive && "shadow-sm",
                !isActive && "hover:bg-muted/50"
              )}
            >
              {category}
            </Button>
          )
        })}
      </div>
      
      {/* Active filter indicator */}
      {currentCategory && currentCategory !== "All" && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            Active filter:
          </span>
          <div className="flex items-center space-x-1">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
              {currentCategory}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCategoryChange("All")}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Clear category filter</span>
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}