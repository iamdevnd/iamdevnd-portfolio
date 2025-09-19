//Theme Provider Created
// This component provides:

// Client-Side Theme Management: Uses the popular next-themes library
// SSR Safe: Prevents hydration mismatches between server and client
// Flexible Configuration: Accepts all NextThemes provider props
// Clean API: Simple wrapper that can be extended with custom logic
// ////
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider