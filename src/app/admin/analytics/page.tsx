// src/app/admin/analytics/page.tsx - UPDATED for Environment Variable
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, TrendingUp, Users, Eye, MessageSquare, Globe, Zap } from "lucide-react"

export default function AdminAnalyticsPage() {
  // Get GA ID from environment
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "Not configured"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your portfolio performance and engagement metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a
              href="https://analytics.google.com/analytics/web/#/p413949856/reports/intelligenthome"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View in GA4
            </a>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Status */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Analytics Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p>Your Google Analytics configuration:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Measurement ID: {GA_ID}</li>
              <li>Data collection: {GA_ID !== "Not configured" ? "Active" : "Inactive"}</li>
              <li>Real-time tracking: {GA_ID !== "Not configured" ? "Enabled" : "Disabled"}</li>
              <li>Configuration: Environment Variable</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> Data may take 24-48 hours to appear in reports after setup.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,321</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: "/", views: "2,345", percentage: "25%" },
                { page: "/projects", views: "1,876", percentage: "20%" },
                { page: "/about", views: "1,234", percentage: "15%" },
                { page: "/projects/contextcache-llm-memory-engine", views: "876", percentage: "12%" },
                { page: "/contact", views: "543", percentage: "8%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.page}</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: item.percentage }} />
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium">{item.views}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Direct", visitors: "1,234", icon: Globe, color: "bg-blue-500" },
                { source: "Google Search", visitors: "876", icon: Zap, color: "bg-green-500" },
                { source: "GitHub", visitors: "543", icon: MessageSquare, color: "bg-purple-500" },
                { source: "LinkedIn", visitors: "321", icon: Users, color: "bg-orange-500" },
                { source: "Twitter", visitors: "234", icon: TrendingUp, color: "bg-pink-500" },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${item.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{item.source}</span>
                    </div>
                    <span className="text-sm font-medium">{item.visitors}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Site Performance</CardTitle>
            <CardDescription>Core Web Vitals and loading metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contentful Paint</span>
                <span className="text-sm font-medium text-green-600">1.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Largest Contentful Paint</span>
                <span className="text-sm font-medium text-green-600">2.1s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cumulative Layout Shift</span>
                <span className="text-sm font-medium text-green-600">0.05</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time to Interactive</span>
                <span className="text-sm font-medium text-green-600">2.8s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
            <CardDescription>Visitor device breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Desktop</span>
                <span className="text-sm font-medium">64%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Mobile</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tablet</span>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Data</CardTitle>
            <CardDescription>Top visitor locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">United States</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">India</span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">United Kingdom</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Canada</span>
                <span className="text-sm font-medium">8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Germany</span>
                <span className="text-sm font-medium">7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>How visitors interact with your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">3:42</div>
              <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2.8</div>
              <p className="text-sm text-muted-foreground">Pages per Session</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">62%</div>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">38%</div>
              <p className="text-sm text-muted-foreground">Returning Visitors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
