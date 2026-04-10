import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { getUserProfile, TIER_MAP } from "@/helper/functions"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/sonner"
import { LayoutDashboard, User, Globe, Paintbrush, Sparkles } from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"

// Import your editor here when you're ready to mount it!
// import PortfolioEditor from "@/components/portfolio/PortfolioEditor"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Empty className="size-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner className="text-primary" />
            </EmptyMedia>
            <EmptyTitle>Loading workspace...</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    // CHANGED: Increased the width from 22rem to 26rem to give the profile more room
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/10 text-foreground">
        
        {/* The Sidebar */}
        <SideProfile profileData={data} />

        {/* The Main Content Area */}
        <main className="relative flex-1 flex flex-col min-w-0">
          
          {/* Top Header / Navigation Bar */}
          <header className="flex h-16 items-center justify-between border-b border-border/60 px-6 bg-background/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 hover:bg-muted/50 rounded-xl" />
              <div className="h-4 w-[1px] bg-border/60 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LayoutDashboard className="size-4" />
                </div>
                <h1 className="text-sm font-semibold tracking-tight">
                  Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wider font-medium">
                  {TIER_MAP?.[data?.tier] || 'None'} Tier
               </Badge>
            </div>
          </header>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 p-6 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto">
            
            {/* Welcome Section */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back, {data?.first_name || data?.username || "Guest"}
              </h2>
              <p className="text-muted-foreground text-sm">
                Here is an overview of your portfolio platform and current settings.
              </p>
            </div>

            {/* Premium Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center bg-blue-500/10 rounded-2xl text-blue-500">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account</p>
                    <p className="text-lg font-bold tracking-tight">@{data?.username}</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center bg-green-500/10 rounded-2xl text-green-500">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visibility</p>
                    <p className="text-lg font-bold tracking-tight flex items-center gap-2">
                      {data?.enable_share_token ? 'Public Live' : 'Private'}
                      {data?.enable_share_token && <span className="flex size-2 rounded-full bg-green-500 animate-pulse" />}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center bg-purple-500/10 rounded-2xl text-purple-500">
                    <Paintbrush className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Theme</p>
                    <p className="text-lg font-bold tracking-tight">Theme {data?.theme_mode || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* This is where you can drop your `<PortfolioEditor portfolioIndex={1} />`!
              For now, here is a polished empty state.
            */}
            <div className="rounded-3xl border border-dashed border-border/60 bg-muted/20 h-[450px] flex flex-col items-center justify-center text-center group transition-colors hover:bg-muted/30">
               <div className="flex size-14 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm mb-4 group-hover:scale-105 transition-transform">
                 <Sparkles className="size-6 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-semibold text-foreground">Ready to edit your portfolio?</h3>
               <p className="text-muted-foreground text-sm font-medium mt-1 max-w-sm">
                 Mount your new PortfolioEditor component here to start customizing your public site.
               </p>
            </div>

          </div>
        </main>

        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  )
}