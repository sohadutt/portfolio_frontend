import { useEffect, useState } from "react"
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom"
import { BriefcaseBusiness, FolderKanban, LayoutDashboard, Loader2, Mail, Moon, Sun } from "lucide-react"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SideProfile } from "@/components/user/SideProfile"
import { Toaster } from "@/components/ui/sonner"
import PortfolioManager from "@/components/dashboard/PortfolioManager"
import PortfolioEditor from "@/components/dashboard/PortfolioEditor"
import SubmissionInbox from "@/components/dashboard/SubmissionInbox"
import LucideIconBrowser from "@/components/dashboard/LucideIconBrowser"
import { getUserProfile, THEME_MAP } from "@/helper/functions"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"

const dashboardLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/portfolios", label: "Portfolios", icon: FolderKanban },
  { to: "/dashboard/submissions", label: "Submissions", icon: Mail },
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
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <article className="apple-panel apple-panel-hover rounded-3xl p-5 sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Account</p>
          <p className="mt-3 truncate text-xl sm:text-2xl font-semibold tracking-tight">@{profile?.username}</p>
          <p className="mt-2 truncate text-sm text-muted-foreground">{profile?.email}</p>
        </article>

        <article className="apple-panel apple-panel-hover rounded-3xl p-5 sm:p-7">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Portfolio Access</p>
          <p className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight">
            {profile?.enable_share_token ? "Public" : "Private"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.portfolio_count || 0} portfolio{profile?.portfolio_count === 1 ? "" : "s"} tracked
          </p>
        </article>

        <article className="apple-panel apple-panel-hover rounded-3xl p-5 sm:p-7 sm:col-span-2 xl:col-span-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Theme</p>
          <p className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight capitalize">
            {(THEME_MAP[profile?.theme_mode] || "theme-ocean").replace("theme-", "")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.is_verified ? "Verified account" : "Email verification still pending"}
          </p>
        </article>
      </section>

      <section className="apple-panel rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Workspace</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use the dashboard routes above to manage portfolios, update content, and review contact submissions.
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

export { PortfolioManager, SubmissionInbox, LucideIconBrowser }

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

    return () => {
      isMounted = false
    }
  }, [navigate])

  if (loading || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm tracking-[0.18em] text-slate-300 uppercase">Loading dashboard</p>
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
      <div className="apple-ambient flex min-h-screen w-full text-foreground">
        <SideProfile profileData={profile} />

        <SidebarInset className="min-w-0 bg-transparent flex flex-col w-full">
          <header className="sticky top-0 z-30 border-b border-border/50 bg-background/76 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-10 2xl:px-12">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <SidebarTrigger className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:block">Dashboard</p>
                  <h1 className="truncate text-lg sm:text-xl font-semibold tracking-tight">
                    Control Center
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="apple-panel flex items-center gap-1 rounded-full p-1 sm:gap-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "ghost"}
                    size="icon"
                    className="size-7 sm:size-8 rounded-full"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-3 sm:size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="icon"
                    className="size-7 sm:size-8 rounded-full"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-3 sm:size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <nav className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-2 sm:gap-3 px-4 pb-4 sm:px-6 lg:px-10 2xl:px-12">
              {dashboardLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card/70 text-muted-foreground hover:border-primary/40 hover:bg-foreground/5 hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 2xl:px-12 w-full max-w-[100vw]">
            <Routes>
              <Route index element={<DashboardOverview profile={profile} />} />
              <Route path="portfolios" element={<PortfolioManager />} />
              <Route path="portfolios/:index/edit" element={<EditPortfolioRoute />} />
              <Route path="submissions" element={<SubmissionInbox />} />
              <Route path="icons" element={<LucideIconBrowser />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </SidebarInset>

        <Toaster position="bottom-right" />
      </div>
    </SidebarProvider>
  )
}
