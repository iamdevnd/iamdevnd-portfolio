//Main Layout Created
//This layout provides:

//Consistent Structure: Header + Content + Footer on all public pages
//Flexbox Layout: Ensures footer stays at bottom even on short pages
//Clean Architecture: Separates layout concerns from page content
//Performance: Layout components are rendered once and reused
//Maintainability: Easy to update header/footer across all pages
////
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <SiteFooter />
    </div>
  )
}