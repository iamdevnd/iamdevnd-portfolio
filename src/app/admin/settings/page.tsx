// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, User, Mail, Globe, Shield, Database } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your portfolio configuration and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="ND" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="iamdevnd@gmail.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                defaultValue="Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions." 
              />
            </div>
            
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Site Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Configuration
            </CardTitle>
            <CardDescription>
              Configure your portfolio website settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-title">Site Title</Label>
              <Input id="site-title" defaultValue="ND - Applied AI Engineer" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Input 
                id="site-description" 
                defaultValue="Applied AI Engineer specializing in Next.js, Python, and cutting-edge AI solutions."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" defaultValue="https://github.com/iamdevnd" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bluesky">Bluesky URL</Label>
                <Input id="bluesky" defaultValue="https://devnd.bsky.social" />
              </div>
            </div>
            
            <Button>Save Configuration</Button>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Settings
            </CardTitle>
            <CardDescription>
              Configure how your content is displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projects-per-page">Projects Per Page</Label>
                <Input id="projects-per-page" type="number" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-per-page">Blog Posts Per Page</Label>
                <Input id="blog-per-page" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured-projects">Max Featured Projects</Label>
                <Input id="featured-projects" type="number" defaultValue="4" />
              </div>
            </div>
            
            <Button>Save Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access
            </CardTitle>
            <CardDescription>
              Manage authentication and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Admin Access</h4>
                <p className="text-sm text-muted-foreground">
                  Currently signed in as admin user
                </p>
              </div>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Secure your account with 2FA (Future feature)
                </p>
              </div>
              <Button variant="outline" disabled>
                Configure 2FA
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">
                These actions cannot be undone. Please be careful.
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" disabled>
                  Reset All Data
                </Button>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              View system status and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Framework</Label>
                <div className="text-sm text-muted-foreground">Next.js 14+</div>
              </div>
              <div className="space-y-2">
                <Label>Database</Label>
                <div className="text-sm text-muted-foreground">Firebase Firestore</div>
              </div>
              <div className="space-y-2">
                <Label>Hosting</Label>
                <div className="text-sm text-muted-foreground">Vercel</div>
              </div>
              <div className="space-y-2">
                <Label>Last Updated</Label>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}