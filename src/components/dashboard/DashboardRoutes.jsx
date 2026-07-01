import { useEffect, useState } from "react"
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { BriefcaseBusiness, FolderKanban, LayoutDashboard, Loader2, Mail, Moon, Sun, Zap } from "lucide-react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { Toaster } from "@/components/ui/sonner"
import PortfolioManager from "@/components/dashboard/PortfolioManager"
import PortfolioEditor from "@/components/dashboard/PortfolioEditor"
import SubmissionInbox from "@/components/dashboard/SubmissionInbox"
import LucideIconBrowser from "@/components/dashboard/LucideIconBrowser"
import Jobby from "@/components/dashboard/jobby" 
import { getUserProfile, THEME_MAP } from "@/helper/functions"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"

const dashboardLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/portfolios", label: "Portfolios", icon: FolderKanban },
  { to: "/dashboard/submissions", label: "Submissions", icon: Mail },
  { to: "/dashboard/jobby", label: "Jobby AI", icon: Zap }, // <-- New Tab
]

const applyTheme = (themeMode) => {
  if (themeMode === undefined || themeMode === null) return

  const root = document.documentElement
  const themeClass = THEME_MAP[themeMode] || "theme-ocean"

  Object.values(THEME_MAP).forEach((theme) => root.classList.remove(theme))
  root.classList.add(themeClass)
}

export function DashboardOverview({ profile }) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <article className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Account</p>
          <p className="mt-4 truncate text-xl sm:text-2xl font-medium tracking-tight text-foreground">@{profile?.username}</p>
          <p className="mt-1 truncate text-sm font-light text-muted-foreground">{profile?.email}</p>
        </article>

        <article className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Portfolio Access</p>
          <p className="mt-4 text-xl sm:text-2xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
            {profile?.enable_share_token ? "Public" : "Private"}
            {profile?.enable_share_token && <span className="flex size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />}
          </p>
          <p className="mt-1 text-sm font-light text-muted-foreground">
            {profile?.portfolio_count || 0} portfolio{profile?.portfolio_count === 1 ? "" : "s"} tracked
          </p>
        </article>

        <article className="cinematic-panel cinematic-panel-hover rounded-[2rem] p-6 sm:p-8 sm:col-span-2 xl:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">Theme</p>
          <p className="mt-4 text-xl sm:text-2xl font-medium tracking-tight capitalize text-foreground">
            {(THEME_MAP[profile?.theme_mode] || "theme-ocean").replace("theme-", "")}
          </p>
          <p className="mt-1 text-sm font-light text-muted-foreground">
            {profile?.is_verified ? "Verified account" : "Email verification pending"}
          </p>
        </article>
      </section>

      <section className="cinematic-panel rounded-[2rem] p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <BriefcaseBusiness className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-foreground">Workspace</h2>
            <p className="mt-2 text-sm sm:text-base font-light leading-relaxed text-muted-foreground max-w-2xl">
              Use the unified Control Center to manage multi-portfolio instances, update site-wide configurations, review secure contact submissions, and find your next role with Jobby AI.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export function EditPortfolioRoute() {
  const { index } = useParams()
  return <PortfolioEditor portfolioIndex={Number(index || 1)} />
}

export { PortfolioManager, SubmissionInbox, LucideIconBrowser, Jobby }

export default function DashboardLayout() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    document.title = 'Dashboard | Portfolio Builder'

    getUserProfile()
      .then((response) => {
        if (!isMounted) return
        setProfile(response)
        applyTheme(response?.theme_mode)
      })
      .catch((error) => {
        console.error("Dashboard Load Error:", error)
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user_info")
          navigate("/login", { replace: true })
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [navigate])

  if (loading || !profile) {
    return (
      <div className="cinematic-ambient flex h-screen w-full items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex items-center justify-center">
             <div className="absolute h-24 w-24 rounded-full bg-primary/20 blur-[40px]" />
             <Loader2 className="relative size-10 animate-spin text-primary" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Initializing Dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-width-icon": "3.5rem",
      }}
    >
      <div className="cinematic-ambient flex min-h-screen w-full text-foreground overflow-hidden">
        
        <SideProfile profileData={profile} />

        <SidebarInset className="min-w-0 bg-transparent flex flex-col w-full z-10">
          <header className="sticky top-0 z-30 border-b border-border/30 bg-background/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8 lg:px-10">
              <div className="flex items-center gap-4 min-w-0">
                <SidebarTrigger className="h-10 w-10 transition-colors hover:bg-primary/10 hover:text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80 sm:block mb-1">Portfolio Platform</p>
                  <h1 className="truncate text-xl font-medium tracking-tight text-foreground">
                    Control Center
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <div className="cinematic-panel flex items-center gap-1 rounded-full p-1 border-border/40 bg-card/40">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "ghost"}
                    size="icon"
                    className="size-8 rounded-full transition-all duration-300 data-[variant=default]:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="icon"
                    className="size-8 rounded-full transition-all duration-300 data-[variant=default]:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <nav className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-3 px-6 pb-5 sm:px-8 lg:px-10">
              {dashboardLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                        : "border-border/40 bg-card/30 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:bg-card/50 hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-6 py-8 sm:px-8 lg:px-10 w-full max-w-7xl mx-auto overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <Routes>
              <Route index element={<DashboardOverview profile={profile} />} />
              <Route path="portfolios" element={<PortfolioManager />} />
              <Route path="portfolios/:index/edit" element={<EditPortfolioRoute />} />
              <Route path="submissions" element={<SubmissionInbox />} />
              <Route path="icons" element={<LucideIconBrowser />} />
              
              {/* Added Jobby Route */}
              <Route path="jobby" element={<Jobby />} />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </SidebarInset>

        <Toaster position="bottom-right" theme={theme === "dark" ? "dark" : "light"} />
      </div>
    </SidebarProvider>
  )
}