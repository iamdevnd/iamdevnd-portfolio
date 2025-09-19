//ProjectsSearch Features:

//Debounced Search: 500ms delay to prevent excessive API calls
//Real-time Updates: URL updates as you type (after debounce)
//Clear Functionality: X button to reset search
//Loading States: Visual feedback during search
//Search Hints: Helpful placeholder and guidance text
//State Synchronization: Local state syncs with URL parameters
////
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectsSearchProps {
  defaultValue?: string
  placeholder?: string
  className?: string
}

export function ProjectsSearch({ 
  defaultValue = "", 
  placeholder = "Search projects...",
  className 
}: ProjectsSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim())
      } else {
        params.delete("search")
      }
      
      // Preserve category filter if it exists
      const category = searchParams.get("category")
      if (category) {
        params.set("category", category)
      }
      
      const queryString = params.toString()
      const url = queryString ? `/projects?${queryString}` : "/projects"
      
      router.push(url)
      setIsSearching(false)
    }, 500),
    [router, searchParams]
  )

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  // Clear search
  const clearSearch = () => {
    setQuery("")
    setIsSearching(false)
    
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    
    // Preserve category filter if it exists
    const category = searchParams.get("category")
    if (category) {
      params.set("category", category)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/projects?${queryString}` : "/projects"
    
    router.push(url)
  }

  // Update local state when URL search param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    setQuery(urlSearch)
  }, [searchParams])

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Search projects
        </span>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-10 pr-10"
        />
        
        {/* Clear button */}
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
      </div>
      
      {/* Search hints */}
      {!query && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Search by project name, description, technology, or category
          </p>
        </div>
      )}
      
      {/* Active search indicator */}
      {query && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            Searching for:
          </span>
          <div className="flex items-center space-x-1">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
              "{query}"
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Clear search</span>
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}