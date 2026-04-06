import { useState, useEffect } from "react"
import {
  BriefcaseBusiness,
  Layers,
  Sparkles,
  LayoutDashboard
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import LoginForm from "@/components/user/Loginfrom"
import SignupForm from "@/components/user/SignupForm"
import { THEME_MAP } from "@/helper/functions"

export default function LoginPage() {
  const [view, setView] = useState("login")

  useEffect(() => {
    const root = document.documentElement

    Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
    const savedTheme = localStorage.getItem("theme") || "theme-ocean"
    root.classList.add(savedTheme)
    root.classList.add("dark")
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-between w-2/3 border-r border-border/50 p-10 lg:p-16">

        {/* TOP */}
        <div className="space-y-12 max-w-2xl">

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl border bg-muted">
              <BriefcaseBusiness className="size-7" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              MyPortfolio
            </span>
          </div>

          {/* HERO */}
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              A better way to build,
              <br />
              manage and showcase
              <br />
              your portfolio
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Everything you need to organize projects, highlight experience,
              and present your work in a clean, structured interface.
            </p>
          </div>
        </div>

        {/* FEATURES */}
        <div className="space-y-6">
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            <div className="flex items-start gap-3">
              <Layers className="size-6 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">Modular Components</p>
                <p className="text-xs text-muted-foreground">
                  Reusable UI blocks to build faster
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="size-6 mt-1 text-primary" />
              <div>
                <p className="text-sm font-medium">Modern Interface</p>
                <p className="text-xs text-muted-foreground">
                  Clean design focused on clarity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LayoutDashboard className="size-6 mt-1 text-primary" />
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

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/3 items-center justify-center px-6">

        <div className="w-full max-w-sm space-y-6">

          {/* HEADER */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {view === "login" ? "Welcome back" : "Create account"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {view === "login"
                ? "Enter your email and password to continue."
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
              onClick={() =>
                setView(view === "login" ? "signup" : "login")
              }
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