import { useState, useEffect } from "react"
import { Navigate, useLocation, useSearchParams } from "react-router-dom"
import {
  BriefcaseBusiness,
  Layers,
  Sparkles,
  LayoutDashboard,
  ArrowLeft
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import LoginForm from "@/components/user/LoginForm"
import SignupForm from "@/components/user/SignupForm"
import VerifyForm from "@/components/user/VerifyForm" 
import ForgotPasswordForm from "@/components/user/ForgotPasswordForm"
import ResetPasswordForm from "@/components/user/ResetPasswordForm"
import { THEME_MAP } from "@/helper/functions"

export default function LoginPage() {
  const accessToken = localStorage.getItem("access_token")
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  const requestedMode = searchParams.get("mode")
  const source = searchParams.get("source")
  
  const [view, setView] = useState(() => (requestedMode === "signup" ? "signup" : "login"))
  
  // States to hold email targets for verification and password reset flows
  const [verifyEmail, setVerifyEmail] = useState("")
  const [resetEmail, setResetEmail] = useState("")

  const from = location.state?.from
  const redirectTo = from ? `${from.pathname || "/dashboard"}${from.search || ""}${from.hash || ""}` : "/dashboard"

  useEffect(() => {
    const root = document.documentElement
    Object.values(THEME_MAP).forEach(t => root.classList.remove(t))
    const savedTheme = localStorage.getItem("theme") || "theme-ocean"
    root.classList.add(savedTheme)
    root.classList.add("dark")
  }, [])

  if (accessToken) {
    return <Navigate to={redirectTo} replace />
  }

  const handleRequireVerification = (email) => {
    setVerifyEmail(email)
    setView("verify")
  }

  const handleForgotPassword = () => setView("forgot-password")
  
  const handleOtpSent = (email) => {
    setResetEmail(email)
    setView("reset-password")
  }

  const handleResetSuccess = () => setView("login")

  // Boolean flags to clean up rendering logic
  const isBackable = ["verify", "forgot-password", "reset-password"].includes(view)
  const isAuthFlow = ["login", "signup"].includes(view)

  return (
    // Added overflow-hidden to clip viewport-level glows
    <div className="cinematic-ambient flex min-h-screen flex-col overflow-hidden text-foreground md:flex-row">
      
      {/* Left Panel - Added overflow-hidden to clip the 500px glow */}
      <div className="relative flex flex-col justify-between overflow-hidden border-b border-border/30 bg-background/40 p-6 backdrop-blur-md md:w-1/2 md:border-b-0 md:border-r lg:w-2/3 lg:p-16">
        
        {/* Subtle Background Glow for Left Panel */}
        <div className="absolute -left-20 top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-8 md:space-y-12">
          <div className="flex items-center gap-4">
            <div className="cinematic-panel flex size-12 items-center justify-center rounded-2xl border-border/40 bg-card/30 md:size-14">
              <BriefcaseBusiness className="size-6 text-primary" />
            </div>
            <span className="text-xl font-medium tracking-wide text-foreground">
              MyPortfolio
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-7xl">
              A better way to build,
              <br className="hidden sm:block" /> manage and showcase
              <br className="hidden sm:block" /> your Portfolio.
            </h1>

            <p className="max-w-lg text-lg font-light leading-relaxed text-muted-foreground">
              {source === "portfolio-builder"
                ? "Start with the same builder powering this portfolio and make a version that feels fully yours."
                : "Everything you need to organize projects, highlight experience, and present your work in a clean, structured interface."}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 hidden space-y-8 md:block lg:mt-0">
          <Separator className="bg-border/40" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-4">
              <Layers className="mt-0.5 size-6 text-primary" />
              <div>
                <p className="text-sm font-medium tracking-wide text-foreground">Modular Components</p>
                <p className="mt-1 text-sm font-light text-muted-foreground">Reusable UI blocks to build faster</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="mt-0.5 size-6 text-primary" />
              <div>
                <p className="text-sm font-medium tracking-wide text-foreground">Modern Interface</p>
                <p className="mt-1 text-sm font-light text-muted-foreground">Clean design focused on clarity</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <LayoutDashboard className="mt-0.5 size-6 text-primary" />
              <div>
                <p className="text-sm font-medium tracking-wide text-foreground">Powerful Dashboard</p>
                <p className="mt-1 text-sm font-light text-muted-foreground">Manage everything in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - The Form Container */}
      <div className="relative flex w-full flex-1 items-center justify-center p-4 py-8 md:w-1/2 lg:w-1/3 lg:p-6">
        
        {/* Dynamic Back Button for sub-flows */}
        {isBackable && (
          <button 
            onClick={() => setView("login")}
            className="absolute left-6 top-8 z-20 flex items-center text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary md:left-8"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to login
          </button>
        )}

        <div className="cinematic-panel-strong relative mt-8 w-full max-w-sm overflow-hidden rounded-[2.5rem] p-8 md:mt-0 shadow-2xl shadow-background/50">
          
          {/* Subtle Form Card Glow - Parent already has overflow-hidden */}
          <div className="absolute -right-20 -top-20 h-[250px] w-[250px] rounded-full bg-primary/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-7">
            {/* HEADER */}
            <div className="space-y-2">
              <h2 className="text-2xl font-medium tracking-tight text-foreground">
                {view === "login" && "Welcome back"}
                {view === "signup" && "Create account"}
                {view === "verify" && "Verify your email"}
                {view === "forgot-password" && "Reset Password"}
                {view === "reset-password" && "Set New Password"}
              </h2>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                {view === "login" && "Enter your email and password to continue."}
                {view === "verify" && `We've sent a 6-digit code to ${verifyEmail || "your email"}.`}
                {view === "forgot-password" && "Enter your email and we'll send you a code to reset your password."}
                {view === "reset-password" && `Enter the code sent to ${resetEmail} and your new password.`}
                {view === "signup" && (
                  source === "portfolio-builder"
                    ? "Create your account to start building your own portfolio."
                    : "Create your account to get started."
                )}
              </p>
            </div>
            
            <Separator className="bg-border/40" />
            
            {/* FORM ROUTING */}
            <div className="space-y-4">
              {view === "login" && (
                <LoginForm 
                  redirectTo={redirectTo} 
                  onRequireVerification={handleRequireVerification} 
                  onForgotPassword={handleForgotPassword}
                />
              )}
              {view === "signup" && (
                <SignupForm 
                  redirectTo={redirectTo} 
                  onRequireVerification={handleRequireVerification} 
                />
              )}
              {view === "verify" && (
                <VerifyForm 
                  email={verifyEmail} 
                  redirectTo={redirectTo} 
                />
              )}
              {view === "forgot-password" && (
                <ForgotPasswordForm 
                  onOtpSent={handleOtpSent}
                />
              )}
              {view === "reset-password" && (
                <ResetPasswordForm 
                  email={resetEmail}
                  onSuccess={handleResetSuccess}
                />
              )}
            </div>
            
            {/* TOGGLE */}
            {isAuthFlow && (
              <>
                <Separator className="bg-border/40" />
                <p className="text-center text-sm font-light text-muted-foreground">
                  {view === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setView(view === "login" ? "signup" : "login")}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {view === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}