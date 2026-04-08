import { useState, useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { getUserProfile, TIER_MAP } from "@/helper/functions"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/sonner"
import { LayoutDashboard, User, Briefcase, Settings } from "lucide-react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

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
    <Empty className="size-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading...</EmptyTitle>
      </EmptyHeader>
    </Empty>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        
        {/* The Sidebar (Your profile.jsx logic) */}
        <SideProfile profileData={data} />

        {/* The Main Content Area */}
        <main className="relative flex-1 flex flex-col min-w-0">
          
          {/* Top Header / Navigation Bar */}
          <header className="flex h-16 items-center justify-between border-b px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              <div className="h-4 w-[1px] bg-border hidden sm:block" />
              <h1 className="text-sm font-bold flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-orange-500" />
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Placeholders for future top-nav items like notifications or logout */}
               <div className="text-[10px] bg-muted px-2 py-1 rounded font-mono uppercase tracking-tighter">
                  Tier: {TIER_MAP[data?.tier] || 'Premium'}
               </div>
            </div>
          </header>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            
            {/* Simple Dashboard Overview Cards (Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><User size={20}/></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Username</p>
                    <p className="text-lg font-bold">@{data?.username}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Briefcase size={20}/></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Sharing Status</p>
                    <p className="text-lg font-bold">{data?.enable_share_token ? 'Public' : 'Private'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Settings size={20}/></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Theme Mode</p>
                    <p className="text-lg font-bold">Mode {data?.theme_mode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder for "The rest of the stuff" */}
            <div className="rounded-xl border border-dashed bg-muted/20 h-[400px] flex items-center justify-center group">
               <p className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                 Your analytics, portfolio items, or data tables will go here.
               </p>
            </div>

          </div>
        </main>

        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  )
}
