import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import {
  ArrowRight,
  BadgeCheck,
  Brush,
  ExternalLink,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  Moon,
  Palette,
  Sparkles,
  Sun,
  Wand2,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { THEME_MAP } from "@/helper/functions"

const builderFeatures = [
  {
    icon: Brush,
    title: "Theme-first editor",
    text: "Shape colors, sections, projects, and profile details from one focused workspace.",
  },
  {
    icon: Layers3,
    title: "Reusable sections",
    text: "Build a portfolio with modular hero, work, experience, component, and contact blocks.",
  },
  {
    icon: LockKeyhole,
    title: "Private dashboard",
    text: "Sign in, manage your data, and publish only the portfolio pages you want to share.",
  },
]

const showcaseItems = ["Hero", "Projects", "Experience", "Components", "Contact", "Themes"]

const builderSteps = [
  "Add your profile, links, and headline.",
  "Drop in projects, experience, skills, and contact sections.",
  "Pick a theme, publish the page, and share it anywhere.",
]

const footerLinks = [
  { label: "Default portfolio", href: "/" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "GitHub", href: "https://github.com/sohadutt", external: true },
]

const themeOptions = [
  { label: "Ocean", value: "theme-ocean", swatch: "bg-sky-500" },
  { label: "Forest", value: "theme-forest", swatch: "bg-emerald-500" },
  { label: "Desert", value: "theme-desert", swatch: "bg-amber-500" },
  { label: "Space", value: "theme-space", swatch: "bg-violet-500" },
  { label: "Sunset", value: "theme-sunset", swatch: "bg-rose-500" },
]

const colorModeKey = "portfolio-theme"
const builderThemeKey = "theme"

export default function HomePage() {
  const pageRef = useRef(null)
  const previewRef = useRef(null)
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window === "undefined") return "theme-ocean"
    return localStorage.getItem(builderThemeKey) || "theme-ocean"
  })
  const [colorMode, setColorMode] = useState(() => {
    if (typeof window === "undefined") return "dark"
    return localStorage.getItem(colorModeKey) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  })

  useEffect(() => {
    document.title = "Portfolio Builder"

    const root = document.documentElement
    Object.values(THEME_MAP).forEach((theme) => root.classList.remove(theme))
    root.classList.add(selectedTheme)
    root.classList.toggle("dark", colorMode === "dark")
    root.style.colorScheme = colorMode
    localStorage.setItem(builderThemeKey, selectedTheme)
    localStorage.setItem(colorModeKey, colorMode)
  }, [colorMode, selectedTheme])

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return undefined

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
      const clearVisibleState = { autoAlpha: 1, clearProps: "opacity,visibility,transform" }

      intro
        .fromTo("[data-home-nav]", { y: -18, autoAlpha: 0 }, { ...clearVisibleState, duration: 0.7 })
        .fromTo("[data-home-kicker]", { y: 18, autoAlpha: 0 }, { ...clearVisibleState, duration: 0.55 }, "-=0.2")
        .fromTo("[data-home-title]", { y: 28, autoAlpha: 0 }, { ...clearVisibleState, duration: 0.75 }, "-=0.25")
        .fromTo("[data-home-copy]", { y: 20, autoAlpha: 0 }, { ...clearVisibleState, duration: 0.65 }, "-=0.35")
        .fromTo("[data-home-cta]", { y: 18, autoAlpha: 0 }, { ...clearVisibleState, stagger: 0.08, duration: 0.55 }, "-=0.25")
        .fromTo("[data-home-preview]", { x: 42, autoAlpha: 0, rotate: 1.5 }, { ...clearVisibleState, duration: 0.9 }, "-=0.55")
        .fromTo("[data-home-feature]", { y: 42, autoAlpha: 0 }, { ...clearVisibleState, stagger: 0.1, duration: 0.65 }, "-=0.3")

      gsap.to("[data-home-float]", {
        y: -16,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.22,
      })

      gsap.to("[data-home-scan]", {
        xPercent: 160,
        duration: 4.5,
        repeat: -1,
        ease: "none",
      })

      gsap.to("[data-home-marquee]", {
        xPercent: -50,
        duration: 18,
        repeat: -1,
        ease: "none",
      })
    }, pageRef)

    const canUsePointerTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const handlePointerMove = (event) => {
      if (!previewRef.current) return

      const bounds = previewRef.current.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5

      gsap.to(previewRef.current, {
        rotateY: x * 6,
        rotateX: y * -5,
        x: x * 12,
        y: y * 8,
        duration: 0.45,
        ease: "power2.out",
      })
    }

    if (canUsePointerTilt) {
      window.addEventListener("pointermove", handlePointerMove)
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      ctx.revert()
    }
  }, [])

  return (
    <div ref={pageRef} className="cinematic-ambient min-h-screen overflow-hidden text-foreground">
      <div className="relative min-h-screen">
        <div className="absolute inset-x-0 top-0 h-px bg-border/20" />
        
        {/* Cinematic Ambient Glows - Added overflow-hidden to prevent corner bleed */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

        <header data-home-nav className="relative z-20 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:px-6 sm:py-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80">
            <span className="cinematic-panel flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10">
              <Sparkles className="size-4 text-primary sm:size-5" />
            </span>
            <span className="truncate text-sm font-medium tracking-wide sm:text-base">MyPortfolio</span>
          </Link>

          <nav className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <div className="cinematic-panel hidden items-center gap-1 rounded-full p-1 md:flex">
              <span className="flex size-8 items-center justify-center text-muted-foreground/70">
                <Palette className="size-4" />
              </span>
              {themeOptions.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  aria-label={`Use ${theme.label} theme`}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`flex size-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-card/60 ${
                    selectedTheme === theme.value ? "bg-card border border-border/50 shadow-sm" : ""
                  }`}
                >
                  <span className={`size-3.5 rounded-full ${theme.swatch}`} />
                </button>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setColorMode((current) => (current === "dark" ? "light" : "dark"))}
              className="cinematic-panel size-9 rounded-full border-transparent shadow-none sm:size-10 hover:border-border/50 hover:bg-card/40"
              aria-label="Toggle light and dark theme"
            >
              {colorMode === "dark" ? <Moon className="size-4 text-foreground/80" /> : <Sun className="size-4 text-foreground/80" />}
            </Button>

            <Button asChild variant="ghost" className="h-9 rounded-full px-4 text-xs font-medium sm:h-10 sm:px-5 sm:text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-300">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="h-9 rounded-full px-5 text-xs shadow-none sm:h-10 sm:px-6 sm:text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)]">
              <Link to="/login?mode=signup&source=portfolio-builder">
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            </Button>
          </nav>
        </header>

        <main className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col justify-center gap-10 px-4 pb-12 pt-6 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <section className="max-w-3xl text-left">
            <div data-home-kicker className="cinematic-panel mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground sm:mb-8">
              <Zap className="size-3.5 text-primary" />
              <span className="truncate uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Animated portfolio builder
              </span>
            </div>

            <h1 data-home-title className="max-w-4xl text-5xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Build a portfolio that moves like your work matters.
            </h1>

            <p data-home-copy className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground sm:mt-8 sm:text-xl sm:leading-8">
              Create, manage, and publish a polished portfolio with themed sections, smooth motion, and a dashboard built for real updates.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button data-home-cta asChild size="lg" className="h-14 w-full rounded-full px-8 text-base font-medium shadow-none sm:w-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)]">
                <Link to="/login?mode=signup&source=portfolio-builder">
                  Make your portfolio
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button data-home-cta asChild variant="outline" size="lg" className="h-14 w-full rounded-full border-border/50 bg-card/30 backdrop-blur-sm px-8 text-base font-medium sm:w-auto transition-all duration-300 hover:bg-card/60 hover:text-primary hover:border-primary/30">
                <Link to="/preview/1">View demo</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl gap-4 text-sm font-medium min-[420px]:grid-cols-3 sm:mt-12">
              {["Fast setup", "Theme aware", "Share ready"].map((item) => (
                <div key={item} data-home-cta className="flex items-center gap-2.5 text-muted-foreground">
                  <BadgeCheck className="size-4.5 text-primary" />
                  <span className="tracking-wide">{item}</span>
                </div>
              ))}
            </div>

            <div data-home-cta className="cinematic-panel mt-10 max-w-2xl rounded-[2rem] p-6 sm:mt-12 sm:p-8 overflow-hidden">
              <p className="text-sm font-medium tracking-wide text-primary">How it works</p>
              <div className="mt-5 grid gap-4">
                {builderSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 text-sm font-light text-muted-foreground sm:text-base">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative min-h-[390px] perspective-[1200px] sm:min-h-[560px] lg:min-h-[640px]">
            {/* Cinematic Glow Behind Preview */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

            <div data-home-float className="cinematic-panel absolute left-2 top-4 z-20 hidden rounded-full px-5 py-2.5 text-sm font-medium tracking-wide sm:flex">
              <Wand2 className="mr-2.5 size-4 text-primary" />
              Live theme controls
            </div>

            <div data-home-float className="cinematic-panel absolute bottom-8 right-2 z-20 hidden rounded-full px-5 py-2.5 text-sm font-medium tracking-wide sm:flex">
              <LayoutDashboard className="mr-2.5 size-4 text-primary" />
              Dashboard ready
            </div>

            {/* 3D Preview Wrapper - Added overflow-hidden to clip internal gradients */}
            <div
              ref={previewRef}
              data-home-preview
              className="cinematic-panel-strong relative mx-auto h-[380px] w-full max-w-[680px] rounded-[2.5rem] p-2 sm:h-[580px] sm:rounded-[3rem] sm:p-3 shadow-2xl shadow-background/80 overflow-hidden"
            >
              <div className="relative h-full overflow-hidden rounded-[1.8rem] border border-border/40 bg-card/20 backdrop-blur-xl sm:rounded-[2.2rem]">
                <div data-home-scan className="pointer-events-none absolute -left-1/2 top-0 z-20 h-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                <div className="flex h-12 items-center justify-between border-b border-border/40 bg-card/40 px-4 sm:h-14 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <span className="size-3 rounded-full bg-destructive/80" />
                    <span className="size-3 rounded-full bg-amber-500/80" />
                    <span className="size-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-2 w-20 rounded-full bg-muted/60 sm:w-28" />
                </div>

                <div className="grid h-[calc(100%-3rem)] grid-cols-[64px_1fr] sm:h-[calc(100%-3.5rem)] sm:grid-cols-[140px_1fr]">
                  <aside className="border-r border-border/40 bg-card/20 p-3 sm:p-4">
                    <div className="mb-4 h-8 rounded-lg bg-primary/20 sm:mb-6 sm:h-10" />
                    <div className="space-y-3 sm:space-y-4">
                      {showcaseItems.map((item, index) => (
                        <div
                          key={item}
                          className={`h-7 rounded-md sm:h-9 sm:rounded-lg ${index === 1 ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "bg-card/40 border border-border/30"}`}
                        />
                      ))}
                    </div>
                  </aside>

                  <div className="overflow-hidden p-4 sm:p-8">
                    <div className="mb-5 flex items-center justify-between gap-4 sm:mb-8">
                      <div>
                        <div className="mb-3 h-2.5 w-20 rounded-full bg-primary/40 sm:h-3 sm:w-24" />
                        <div className="h-6 w-32 rounded-lg bg-foreground/90 sm:h-8 sm:w-48" />
                      </div>
                      <div className="hidden h-10 w-28 rounded-full bg-primary sm:block shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
                    </div>

                    <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="cinematic-panel relative min-h-36 rounded-2xl p-4 sm:min-h-52 sm:rounded-[2rem] sm:p-5 overflow-hidden">
                        {/* Gradient Box - Increased rounding and added overflow-hidden to parent */}
                        <div className="mb-4 h-24 w-full rounded-xl bg-gradient-to-br from-primary/60 via-accent/40 to-chart-1/30 sm:mb-5 sm:h-32 sm:rounded-2xl" />
                        <div className="space-y-3">
                          <div className="h-3.5 w-3/4 rounded-full bg-foreground/80" />
                          <div className="h-3 w-1/2 rounded-full bg-muted-foreground/40" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 sm:block sm:space-y-5">
                        {["Profile", "Projects", "Publish"].map((item, index) => (
                          <div key={item} data-home-float className="cinematic-panel rounded-xl p-3 sm:rounded-[1.5rem] sm:p-5 overflow-hidden">
                            <div className="mb-3 flex items-center gap-3 sm:mb-4">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary sm:size-10 sm:rounded-xl sm:text-sm">
                                {index + 1}
                              </div>
                              <div className="hidden h-3 w-24 rounded-full bg-foreground/60 min-[480px]:block" />
                            </div>
                            <div className="h-2 w-full rounded-full bg-border/60" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-border/40 bg-card/30 py-3 sm:mt-6 sm:rounded-2xl sm:py-4">
                      <div data-home-marquee className="flex w-max gap-4 px-4">
                        {[...showcaseItems, ...showcaseItems].map((item, index) => (
                          <span key={`${item}-${index}`} className="rounded-full border border-border/50 bg-card/50 px-5 py-2 text-xs font-medium tracking-wide text-muted-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <section className="relative z-10 border-y border-border/30 bg-background/50 py-16 backdrop-blur-xl sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {builderFeatures.map((feature) => {
            const Icon = feature.icon

            return (
              <article key={feature.title} data-home-feature className="cinematic-panel cinematic-panel-hover overflow-hidden rounded-[2rem] p-6 sm:p-8">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary sm:mb-6 sm:size-14">
                  <Icon className="size-6" />
                </div>
                <h2 className="text-xl font-medium tracking-tight text-foreground">{feature.title}</h2>
                <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground">{feature.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="relative z-10 bg-background/80 px-4 py-10 backdrop-blur-lg sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
              <span className="cinematic-panel flex size-10 items-center justify-center rounded-xl">
                <Sparkles className="size-5 text-primary" />
              </span>
              <span className="text-lg font-medium tracking-wide">MyPortfolio</span>
            </Link>
            <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
              Build a themed portfolio, manage it from your dashboard, and share a polished public page.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:items-end">
            <div className="grid w-full grid-cols-2 gap-3 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:gap-4 sm:w-auto">
              {footerLinks.map((link) => (
                <Button key={link.label} asChild variant="outline" size="sm" className="w-full rounded-full border-border/50 bg-card/30 font-medium tracking-wide shadow-none min-[480px]:w-auto transition-colors hover:bg-card/60 hover:text-primary">
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                    {link.external && <ExternalLink className="ml-1.5 size-3.5" />}
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-sm font-light tracking-wide text-muted-foreground sm:text-right">
              © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}