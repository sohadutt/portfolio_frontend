import { ArrowRight, ChartColumnIncreasing, CircleCheckBig, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { heroContent, heroMetrics, personalInfo, statusPills } from '@/helper/portfolio'

export function HeroSection({ isScrolling }) {
  const [activeMetric, setActiveMetric] = useState(null)
  const [activeCapability, setActiveCapability] = useState(null)

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

      {/* LEFT MAIN */}
      <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 backdrop-blur">

        {/* STATUS PILLS */}
        <div className="mb-8 flex flex-wrap gap-3">
          {statusPills.map(({ label, icon }, index) => {
            const Icon = icon
            const isActive = activeMetric === `pill-${index}`

            return (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? 'border-primary/50 bg-primary text-primary-foreground'
                    : `border-border/70 bg-background/80 text-muted-foreground ${
                        isScrolling ? '' : 'hover:border-primary/40 hover:bg-primary/5'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(`pill-${index}`)}
              >
                <Icon className={`size-4 ${isActive ? '' : 'text-primary'}`} />
                {label}
              </div>
            )
          })}
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-primary">
            {heroContent.eyebrow}
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02]">
            {heroContent.title}
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
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

      {/* RIGHT SIDE */}
      <div className="grid gap-4">

        {/* FOCUS CARD */}
        <div className="rounded-[2rem] border border-border/60 bg-card/80 p-6 backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Current focus
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                Automation + product delivery
              </h3>
            </div>

            <div className="rounded-xl bg-primary/10 p-3">
              <Sparkles className="size-6 text-primary" />
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-6 space-y-3">
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[78%] rounded-full bg-primary" />
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[92%] rounded-full bg-foreground/70" />
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[64%] rounded-full bg-chart-2" />
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {heroMetrics.map((metric, index) => {
            const isActive = activeMetric === index

            return (
              <article
                key={metric.label}
                className={`rounded-[1.5rem] border p-5 transition-all ${
                  isActive
                    ? 'border-primary/60 bg-primary/10'
                    : `border-border/60 bg-card/80 ${
                        isScrolling ? '' : 'hover:border-primary/40 hover:bg-primary/5'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(index)}
              >
                <p className="text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {metric.label}
                </p>
              </article>
            )
          })}
        </div>

        {/* PROFILE + CAPABILITIES */}
        <div className="rounded-[2rem] border border-border/60 bg-card/80 p-6">

          {/* PROFILE */}
          <div className="mb-5 flex items-center gap-3">
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
              <p className="text-sm font-semibold">{personalInfo.subtitle}</p>
              <p className="text-sm text-muted-foreground">{personalInfo.location}</p>
            </div>
          </div>

          {/* CAPABILITIES */}
          <div className="grid gap-3 sm:grid-cols-2">

            <div
              className={`rounded-xl border p-4 transition-all ${
                activeCapability === 'backend'
                  ? 'border-primary/60 bg-primary/10'
                  : `border-border/60 bg-background/80 ${
                      isScrolling ? '' : 'hover:border-primary/40 hover:bg-primary/5'
                    }`
              }`}
              onMouseEnter={() => !isScrolling && setActiveCapability('backend')}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CircleCheckBig className="size-5 text-primary" />
                Backend systems
              </div>
              <p className="text-sm text-muted-foreground">
                Django, APIs, automation workflows and scalable backend logic.
              </p>
            </div>

            <div
              className={`rounded-xl border p-4 transition-all ${
                activeCapability === 'frontend'
                  ? 'border-primary/60 bg-primary/10'
                  : `border-border/60 bg-background/80 ${
                      isScrolling ? '' : 'hover:border-primary/40 hover:bg-primary/5'
                    }`
              }`}
              onMouseEnter={() => !isScrolling && setActiveCapability('frontend')}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <ChartColumnIncreasing className="size-5 text-primary" />
                Frontend delivery
              </div>
              <p className="text-sm text-muted-foreground">
                React, Tailwind and modern UI systems integrated with APIs.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}