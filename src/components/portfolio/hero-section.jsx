import { ArrowRight, ChartColumnIncreasing, CircleCheckBig, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { heroContent, heroMetrics, personalInfo, statusPills } from '@/helper/portfolio'

export function HeroSection({ isScrolling }) {
  const [activeMetric, setActiveMetric] = useState(null)
  const [activeCapability, setActiveCapability] = useState(null)
  const resolvedMetric = activeMetric
  const resolvedCapability = activeCapability

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* Updated the base neutral shadow to use standard black/foreground opacity so it looks good in light/dark mode */}
      <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.5)] backdrop-blur dark:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]">
        <div className="mb-8 flex flex-wrap gap-3">
          {statusPills.map(({ label, icon }, index) => {
            const Icon = icon
            const isActive = resolvedMetric === `pill-${index}`

            return (
              <div
                key={label}
                // SWAPPED ORANGE FOR var(--color-primary)
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                  isActive
                    ? 'border-primary/50 bg-primary text-primary-foreground shadow-[0_20px_55px_-35px_var(--color-primary)]'
                    : `border-border/70 bg-background/80 text-muted-foreground ${isScrolling ? '' : 'hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/8'}`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(`pill-${index}`)}
              >
                <Icon className={`size-3.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                {label}
              </div>
            )
          })}
        </div>
        <div className="space-y-6">
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-primary">
            {heroContent.eyebrow}
          </p>
          <h1 className="scroll-m-20 text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {heroContent.title}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {heroContent.description}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full px-6 font-semibold">
              <a href="#projects">
                View projects
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 font-semibold">
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2rem] border border-border/60 bg-card/75 p-6 backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Current focus
              </p>
              <h3 className="mt-3 scroll-m-20 text-2xl font-semibold tracking-tight">
                Automation + product delivery
              </h3>
            </div>
            <div className="rounded-2xl bg-primary/12 p-3 text-primary">
              <Sparkles className="size-5" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-primary transition-all duration-700" />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[92%] rounded-full bg-foreground/75 transition-all duration-700" />
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[64%] rounded-full bg-chart-2 transition-all duration-700" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {heroMetrics.map((metric, index) => {
            const isActive = resolvedMetric === index

            return (
              <article
                key={metric.label}
                // SWAPPED ORANGE FOR var(--color-primary)
                className={`rounded-[1.75rem] border p-5 backdrop-blur transition-all duration-300 ${
                  isActive
                    ? 'border-primary/70 bg-primary/10 shadow-[0_24px_70px_-42px_var(--color-primary)]'
                    : `border-border/60 bg-card/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/6'}`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(index)}
              >
                <p className="scroll-m-20 text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {metric.label}
                </p>
              </article>
            )
          })}
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-card/75 p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex -space-x-3">
              {['S', 'D', 'U'].map((letter) => (
                <div
                  key={letter}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-semibold"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{personalInfo.subtitle}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{personalInfo.location}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              // SWAPPED ORANGE FOR var(--color-primary)
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                resolvedCapability === 'backend'
                  ? 'border-primary/60 bg-primary/10 shadow-[0_24px_70px_-42px_var(--color-primary)]'
                  : `border-border/60 bg-background/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/6'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveCapability('backend')}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
                <CircleCheckBig className="size-4 text-primary" />
                Backend systems
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Django management commands, safe database operations, and API-based automation.
              </p>
            </div>
            <div
              // SWAPPED ORANGE FOR var(--color-primary)
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                resolvedCapability === 'frontend'
                  ? 'border-primary/60 bg-primary/10 shadow-[0_24px_70px_-42px_var(--color-primary)]'
                  : `border-border/60 bg-background/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/6'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveCapability('frontend')}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
                <ChartColumnIncreasing className="size-4 text-primary" />
                Frontend delivery
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                React and Tailwind components integrated with backend APIs and responsive UX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}