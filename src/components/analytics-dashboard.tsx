// src/components/analytics-dashboard.tsx - Real Analytics Component
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, MessageSquare, Globe, Zap } from "lucide-react"

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  sessions: number
  bounceRate: number
  topPages: Array<{ page: string; views: number; percentage: string }>
  trafficSources: Array<{ source: string; visitors: number; percentage: string }>
  avgSessionDuration: string
  pagesPerSession: number
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Try to fetch real data from GA4 via your API route
      const response = await fetch('/api/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError('Unable to load analytics data')
      
      // Fallback to sample data
      setAnalytics({
        pageViews: 12345,
        uniqueVisitors: 2350,
        sessions: 1876,
        bounceRate: 62,
        topPages: [
          { page: "/", views: 2345, percentage: "25%" },
          { page: "/projects", views: 1876, percentage: "20%" },
          { page: "/about", views: 1234, percentage: "15%" },
          { page: "/contact", views: 543, percentage: "8%" }
        ],
        trafficSources: [
          { source: "Direct", visitors: 1234, percentage: "45%" },
          { source: "Google Search", visitors: 876, percentage: "32%" },
          { source: "LinkedIn", visitors: 321, percentage: "12%" },
          { source: "GitHub", visitors: 234, percentage: "8%" }
        ],
        avgSessionDuration: "3:42",
        pagesPerSession: 2.8
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200">Analytics Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 dark:text-red-300">
            {error || 'Failed to load analytics data'}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Showing sample data. Check your Google Analytics API configuration.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.sessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Single page visits
            </p>
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
              {analytics.topPages.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.page}</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: item.percentage }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium">{item.views.toLocaleString()}</div>
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
              {analytics.trafficSources.map((item, index) => {
                const icons = {
                  "Direct": Globe,
                  "Google Search": Zap,
                  "LinkedIn": Users,
                  "GitHub": MessageSquare,
                  "Twitter": TrendingUp
                }
                const Icon = icons[item.source as keyof typeof icons] || Globe
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{item.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.visitors.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}</div>
                    </div>
                  </div>
                )
              })}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.avgSessionDuration}</div>
              <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.pagesPerSession}</div>
              <p className="text-sm text-muted-foreground">Pages per Session</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}