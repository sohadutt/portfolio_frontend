import { ArrowRight, ChartColumnIncreasing, CircleCheckBig, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { heroContent, heroMetrics, personalInfo, statusPills } from '@/data/portfolio'

export function HeroSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.9)] backdrop-blur">
        <div className="mb-8 flex flex-wrap gap-3">
          {statusPills.map(({ label, icon }) => {
            const Icon = icon

            return (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Icon className="size-3.5 text-primary" />
              {label}
            </div>
            )
          })}
        </div>
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">{heroContent.eyebrow}</p>
          <h1 className="max-w-3xl font-serif text-5xl leading-none text-balance sm:text-6xl lg:text-7xl">
            {heroContent.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {heroContent.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <a href="#projects">
                View projects
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
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
              <p className="text-sm text-muted-foreground">Current focus</p>
              <p className="mt-2 font-serif text-3xl">Automation + product delivery</p>
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
          {heroMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[1.75rem] border border-border/60 bg-card/75 p-5 backdrop-blur"
            >
              <p className="font-serif text-3xl">{metric.value}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{metric.label}</p>
            </article>
          ))}
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
              <p className="text-sm font-semibold">{personalInfo.subtitle}</p>
              <p className="text-sm text-muted-foreground">{personalInfo.location}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <CircleCheckBig className="size-4 text-primary" />
                Backend systems
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Django management commands, safe database operations, and API-based automation.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
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
