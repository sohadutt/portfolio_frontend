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
      <div className="cinematic-ambient flex min-h-screen items-center justify-center bg-background">
        <Empty className="size-8">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="relative flex items-center justify-center">
              {/* Cinematic Glow Behind Spinner */}
              <div className="absolute h-16 w-16 rounded-full bg-primary/20 blur-[30px]" />
              <Spinner className="relative text-primary" />
            </EmptyMedia>
            <EmptyTitle className="mt-4 text-sm font-light tracking-wide text-muted-foreground">
              Loading workspace...
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="cinematic-ambient flex min-h-screen w-full text-foreground overflow-hidden">
        
        {/* Ambient Global Glow */}
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <SideProfile profileData={data} />
        
        <main className="relative flex flex-1 flex-col min-w-0 z-10">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/30 bg-background/60 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-10 w-10 transition-colors duration-300 hover:bg-primary/10 hover:text-primary rounded-xl" />
              <div className="h-5 w-px bg-border/40 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <LayoutDashboard className="size-4" />
                </div>
                <h1 className="text-base font-medium tracking-tight text-foreground">
                  Dashboard
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <Badge variant="secondary" className="rounded-full border border-border/40 bg-card/40 px-4 py-1.5 text-[10px] uppercase tracking-widest font-medium text-muted-foreground backdrop-blur-md">
                  {TIER_MAP?.[data?.tier] || 'None'} Tier
               </Badge>
            </div>
          </header>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 p-6 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Welcome Section */}
            <div className="space-y-2 mt-4">
              <h2 className="text-3xl font-medium tracking-tight text-foreground">
                Welcome back, {data?.first_name || data?.username || "Guest"}
              </h2>
              <p className="text-base font-light text-muted-foreground">
                Here is an overview of your portfolio platform and current settings.
              </p>
            </div>

            {/* Metrics/Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Account */}
              <div className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-transform duration-500 group-hover:scale-110">
                    <User className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Account</p>
                    <p className="text-xl font-medium tracking-tight text-foreground">@{data?.username}</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Visibility */}
              <div className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-transform duration-500 group-hover:scale-110">
                    <Globe className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Visibility</p>
                    <p className="text-xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
                      {data?.enable_share_token ? 'Public Live' : 'Private'}
                      {data?.enable_share_token && <span className="flex size-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Active Theme */}
              <div className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  <div className="flex size-14 items-center justify-center bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-transform duration-500 group-hover:scale-110">
                    <Paintbrush className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Active Theme</p>
                    <p className="text-xl font-medium tracking-tight text-foreground">Theme {data?.theme_mode || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Placeholder Area */}
            <div className="cinematic-panel group relative h-[450px] rounded-[2.5rem] border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-primary/40 hover:bg-primary/5">
               {/* Hover Glow Effect */}
               <div className="absolute inset-0 rounded-[2.5rem] bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5 pointer-events-none" />
               
               <div className="flex size-16 items-center justify-center rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm shadow-sm mb-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                 <Sparkles className="size-7 text-muted-foreground transition-colors duration-500 group-hover:text-primary" />
               </div>
               
               <h3 className="text-xl font-medium text-foreground tracking-tight z-10">Ready to edit your portfolio?</h3>
               <p className="text-muted-foreground text-sm font-light leading-relaxed mt-3 max-w-md z-10">
                 Mount your new <code className="bg-muted/50 px-1.5 py-0.5 rounded text-primary border border-border/50">PortfolioEditor</code> component here to start customizing your public site.
               </p>
            </div>

          </div>
        </main>

        <Toaster position="bottom-right" className="z-[100]" />
      </div>
    </SidebarProvider>
  )
}