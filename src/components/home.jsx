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
    <div ref={pageRef} className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/15 to-transparent" />

        <header data-home-nav className="relative z-20 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:px-6 sm:py-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/80 shadow-sm backdrop-blur sm:size-10">
              <Sparkles className="size-4 text-primary sm:size-5" />
            </span>
            <span className="truncate text-sm font-semibold tracking-tight sm:text-base">MyPortfolio</span>
          </Link>

          <nav className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur md:flex">
              <span className="flex size-8 items-center justify-center text-muted-foreground">
                <Palette className="size-4" />
              </span>
              {themeOptions.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  aria-label={`Use ${theme.label} theme`}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`flex size-8 items-center justify-center rounded-full transition-all hover:bg-muted ${
                    selectedTheme === theme.value ? "bg-muted ring-2 ring-primary/40" : ""
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
              className="size-9 rounded-full bg-background/80 backdrop-blur sm:size-10"
              aria-label="Toggle light and dark theme"
            >
              {colorMode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>

            <Button asChild variant="ghost" className="h-9 rounded-full px-2.5 text-xs sm:h-10 sm:px-3 sm:text-sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="h-9 rounded-full px-3 text-xs shadow-none sm:h-10 sm:px-4 sm:text-sm">
              <Link to="/login?mode=signup&source=portfolio-builder">
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            </Button>
          </nav>
        </header>

        <main className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col justify-center gap-10 px-4 pb-12 pt-6 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <section className="max-w-3xl text-left">
            <div data-home-kicker className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur sm:mb-6">
              <Zap className="size-3.5 text-primary" />
              <span className="truncate">Animated portfolio builder for modern makers</span>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-2 md:hidden">
              {themeOptions.map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur transition-colors hover:bg-muted ${
                    selectedTheme === theme.value ? "text-foreground ring-2 ring-primary/35" : "text-muted-foreground"
                  }`}
                >
                  <span className={`size-3 rounded-full ${theme.swatch}`} />
                  {theme.label}
                </button>
              ))}
            </div>

            <h1 data-home-title className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-tight min-[420px]:text-5xl sm:text-6xl sm:leading-[0.98] lg:text-7xl">
              Build a portfolio that moves like your work matters.
            </h1>

            <p data-home-copy className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-7">
              Create, manage, and publish a polished portfolio with themed sections, smooth motion, and a dashboard built for real updates.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button data-home-cta asChild size="lg" className="h-12 w-full rounded-full px-6 text-sm shadow-none sm:w-auto">
                <Link to="/login?mode=signup&source=portfolio-builder">
                  Make your portfolio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button data-home-cta asChild size="lg" variant="outline" className="h-12 w-full rounded-full px-6 text-sm sm:w-auto">
                <Link to="/preview/1">View demo</Link>
              </Button>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 text-sm min-[420px]:grid-cols-3 sm:mt-10">
              {["Fast setup", "Theme aware", "Share ready"].map((item) => (
                <div key={item} data-home-cta className="flex items-center gap-2 text-muted-foreground">
                  <BadgeCheck className="size-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div data-home-cta className="mt-8 max-w-2xl rounded-2xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur sm:mt-10 sm:p-5">
              <p className="text-sm font-semibold tracking-tight">How it works</p>
              <div className="mt-4 grid gap-3">
                {builderSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative min-h-[390px] perspective-[1200px] sm:min-h-[560px] lg:min-h-[640px]">
            <div data-home-float className="absolute left-2 top-4 z-20 hidden rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur sm:flex">
              <Wand2 className="mr-2 size-4 text-primary" />
              Live theme controls
            </div>

            <div data-home-float className="absolute bottom-8 right-2 z-20 hidden rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur sm:flex">
              <LayoutDashboard className="mr-2 size-4 text-primary" />
              Dashboard ready
            </div>

            <div
              ref={previewRef}
              data-home-preview
              className="relative mx-auto h-[380px] w-full max-w-[680px] rounded-2xl border border-border/70 bg-card/90 p-2 shadow-2xl shadow-primary/10 backdrop-blur [transform-style:preserve-3d] sm:h-[580px] sm:rounded-[28px] sm:p-3"
            >
              <div className="relative h-full overflow-hidden rounded-xl border border-border bg-background sm:rounded-[20px]">
                <div data-home-scan className="pointer-events-none absolute -left-1/2 top-0 z-20 h-full w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

                <div className="flex h-10 items-center justify-between border-b border-border/70 px-3 sm:h-12 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-destructive/70" />
                    <span className="size-2.5 rounded-full bg-chart-1/80" />
                    <span className="size-2.5 rounded-full bg-chart-2/80" />
                  </div>
                  <div className="h-2 w-20 rounded-full bg-muted sm:w-28" />
                </div>

                <div className="grid h-[calc(100%-2.5rem)] grid-cols-[64px_1fr] sm:h-[calc(100%-3rem)] sm:grid-cols-[132px_1fr]">
                  <aside className="border-r border-border/70 bg-muted/25 p-2 sm:p-3">
                    <div className="mb-3 h-7 rounded-lg bg-primary/20 sm:mb-5 sm:h-8" />
                    <div className="space-y-2 sm:space-y-3">
                      {showcaseItems.map((item, index) => (
                        <div
                          key={item}
                          className={`h-6 rounded-md sm:h-8 sm:rounded-lg ${index === 1 ? "bg-primary text-primary-foreground" : "bg-background"}`}
                        />
                      ))}
                    </div>
                  </aside>

                  <div className="overflow-hidden p-3 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5 sm:gap-4">
                      <div>
                        <div className="mb-2 h-2.5 w-20 rounded-full bg-primary/30 sm:h-3 sm:w-24" />
                        <div className="h-5 w-32 rounded-lg bg-foreground/85 dark:bg-foreground/75 sm:h-7 sm:w-44" />
                      </div>
                      <div className="hidden h-10 w-24 rounded-full bg-primary sm:block" />
                    </div>

                    <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                      <div className="min-h-36 rounded-xl border border-border bg-card p-3 sm:min-h-52 sm:rounded-2xl sm:p-4">
                        <div className="mb-3 h-24 rounded-lg bg-gradient-to-br from-primary/75 via-chart-2/60 to-chart-1/60 sm:mb-4 sm:h-32 sm:rounded-xl" />
                        <div className="space-y-2">
                          <div className="h-3 w-3/4 rounded-full bg-foreground/70" />
                          <div className="h-3 w-1/2 rounded-full bg-muted-foreground/35" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:block sm:space-y-4">
                        {["Profile", "Projects", "Publish"].map((item, index) => (
                          <div key={item} data-home-float className="rounded-xl border border-border bg-card p-2 sm:rounded-2xl sm:p-4">
                            <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-semibold text-primary sm:size-9 sm:rounded-xl sm:text-sm">
                                {index + 1}
                              </div>
                              <div className="hidden h-3 w-24 rounded-full bg-foreground/70 min-[480px]:block" />
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/30 py-2 sm:mt-4 sm:rounded-2xl sm:py-3">
                      <div data-home-marquee className="flex w-max gap-3 px-3">
                        {[...showcaseItems, ...showcaseItems].map((item, index) => (
                          <span key={`${item}-${index}`} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground">
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

      <section className="relative z-10 border-y border-border/70 bg-muted/25 py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {builderFeatures.map((feature) => {
            const Icon = feature.icon

            return (
              <article key={feature.title} data-home-feature className="rounded-xl border border-border bg-background p-5 shadow-sm sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary sm:mb-5 sm:size-11">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.text}</p>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/70 bg-background px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted/40">
                <Sparkles className="size-5 text-primary" />
              </span>
              <span className="text-base font-semibold tracking-tight">MyPortfolio</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Build a themed portfolio, manage it from your dashboard, and share a polished public page.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <div className="grid w-full grid-cols-2 gap-2 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:gap-3 sm:w-auto">
              {footerLinks.map((link) => (
                <Button key={link.label} asChild variant="outline" size="sm" className="w-full rounded-full bg-background shadow-none min-[480px]:w-auto">
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                    {link.external && <ExternalLink className="size-3.5" />}
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground sm:text-right">
              © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
