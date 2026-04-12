import { useState, useEffect } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import {
  BriefcaseBusiness,
  Layers,
  Sparkles,
  LayoutDashboard
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import LoginForm from "@/components/user/LoginForm"
import SignupForm from "@/components/user/SignupForm"
import { THEME_MAP } from "@/helper/functions"

export default function LoginPage() {
  const accessToken = localStorage.getItem("access_token")
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get("mode")
  const source = searchParams.get("source")
  const [view, setView] = useState("login")

  if (accessToken) {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    const root = document.documentElement

    Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
    const savedTheme = localStorage.getItem("theme") || "theme-ocean"
    root.classList.add(savedTheme)
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    if (requestedMode === "signup") {
      setView("signup")
    }
  }, [requestedMode])

  return (
    // Changed to a column layout on mobile, row on desktop (md+)
    <div className="flex min-h-screen flex-col bg-muted/20 text-foreground md:flex-row">
      
      {/* Left Panel - Now visible on mobile, stacked at the top */}
      <div className="flex flex-col justify-between border-b border-border/50 bg-background p-6 md:w-1/2 md:border-b-0 md:border-r lg:w-2/3 lg:p-16">
        <div className="space-y-6 md:space-y-12 max-w-2xl">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-10 md:size-14 items-center justify-center rounded-xl md:rounded-2xl border border-border/60 bg-muted/35">
              <BriefcaseBusiness className="size-5 md:size-7" />
            </div>
            <span className="text-lg md:text-xl font-semibold tracking-tight">
              MyPortfolio
            </span>
          </div>

          {/* HERO - Font sizes scaled for mobile */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
              A better way to build,
              <br className="hidden sm:block" /> manage and showcase
              <br className="hidden sm:block" /> your Portfolio.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              {source === "portfolio-builder"
                ? "Start with the same builder powering this portfolio and make a version that feels fully yours."
                : "Everything you need to organize projects, highlight experience, and present your work in a clean, structured interface."}
            </p>
          </div>
        </div>

        {/* FEATURES - Hidden on mobile so the form stays above the fold */}
        <div className="mt-10 hidden space-y-6 md:block lg:mt-0">
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex items-start gap-3">
              <Layers className="size-5 lg:size-6 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">Modular Components</p>
                <p className="text-xs text-muted-foreground">
                  Reusable UI blocks to build faster
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="size-5 lg:size-6 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">Modern Interface</p>
                <p className="text-xs text-muted-foreground">
                  Clean design focused on clarity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LayoutDashboard className="size-5 lg:size-6 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">Powerful Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Manage everything in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - The Form */}
      <div className="flex w-full flex-1 items-center justify-center p-4 py-8 md:w-1/2 lg:w-1/3 lg:p-6">
        <div className="w-full max-w-sm space-y-6 rounded-[24px] md:rounded-[28px] border border-border/60 bg-background p-6 md:p-7 shadow-sm">
          {/* HEADER */}
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              {view === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {view === "login"
                ? "Enter your email and password to continue."
                : source === "portfolio-builder"
                  ? "Create your account to start building your own portfolio."
                  : "Create your account to get started."}
            </p>
          </div>
          <Separator />
          
          {/* FORM */}
          <div className="space-y-4">
            {view === "login" ? <LoginForm /> : <SignupForm />}
          </div>
          
          <Separator />
          
          {/* TOGGLE */}
          <p className="text-sm text-muted-foreground text-center">
            {view === "login"
              ? "Don't have an account? "
              : "Already have an account? "}

            <button
              onClick={() => setView(view === "login" ? "signup" : "login")}
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              {view === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}