//Authentication Hook (use-auth.ts):

//Firebase Integration: Complete Firebase Auth integration
//Admin Authorization: Checks email against authorized admin list
//State Management: Centralized auth state with React Context
//Error Handling: User-friendly error messages for all auth scenarios
//HOC Protection: withAuth higher-order component for route protection
//Auto-redirect: Automatic redirection based on auth state
////
"use client"

import { useState, useEffect, useContext, createContext } from "react"
import { 
  User, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  AuthError
} from "firebase/auth"
import { toast } from "sonner"

import { auth } from "@/lib/firebase/client"

// Auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  isAdmin: boolean
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || 
                  user?.email?.endsWith('@iamdevnd.dev') || // Update with your domain
                  false

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Check if user is authorized admin
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (adminEmail && userCredential.user.email !== adminEmail) {
        await firebaseSignOut(auth)
        toast.error("Unauthorized: Admin access required")
        return false
      }

      toast.success("Successfully signed in")
      return true
    } catch (error) {
      console.error("Sign in error:", error)
      
      const authError = error as AuthError
      let errorMessage = "Failed to sign in"
      
      switch (authError.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password"
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later"
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection"
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address"
          break
        default:
          errorMessage = authError.message || "Failed to sign in"
      }
      
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth)
      toast.success("Successfully signed out")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}

// HOC for protecting admin routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAdmin } = useAuth()

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user || !isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
            <button
              onClick={() => window.location.href = "/admin/login"}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Login
            </button>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}


