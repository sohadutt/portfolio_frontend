import { ArrowRight, ChartColumnIncreasing, CircleCheckBig, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  getHeroActions,
  getHeroBadges,
  getHeroContent,
  getHeroFocus,
  getHeroHighlights,
  getHeroMetrics,
  getPortfolioPersonalInfo,
  getStatusPills,
} from '@/helper/portfolio-data'

export function HeroSection({ data, isScrolling }) {
  const [activeMetric, setActiveMetric] = useState(null)
  const [activeCapability, setActiveCapability] = useState(null)
  const heroContent = getHeroContent(data)
  const heroActions = getHeroActions(data)
  const heroFocus = getHeroFocus(data)
  const heroBadges = getHeroBadges(data)
  const heroHighlights = getHeroHighlights(data)
  const heroMetrics = getHeroMetrics(data)
  const personalInfo = getPortfolioPersonalInfo(data)
  const statusPills = getStatusPills(data)
  const subtitleTokens = (personalInfo.subtitle || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm">
        <div className="mb-8 flex flex-wrap gap-2.5">
          {statusPills.map(({ label, icon }, index) => {
            const Icon = icon
            const isActive = activeMetric === `pill-${index}`

            return (
              <div
                key={label}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-all ${
                  isActive
                    ? 'border-primary/30 bg-primary/8 text-foreground'
                    : `border-border/70 bg-background/80 text-muted-foreground ${
                        isScrolling ? '' : 'hover:border-primary/25 hover:bg-muted/70'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(`pill-${index}`)}
              >
                <Icon className={`size-3.5 ${isActive ? 'text-primary' : 'text-primary/80'}`} />
                {label}
              </div>
            )
          })}
        </div>

        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/85">
            {heroContent.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight leading-[1.05] sm:text-5xl lg:text-6xl">
            {heroContent.title}
          </h1>

          <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {heroContent.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" className="rounded-full px-6 font-medium shadow-none">
              <a href={heroActions.primary?.href || '#projects'}>
                {heroActions.primary?.label || 'View projects'}
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-full px-6 font-medium shadow-none">
              <a href={heroActions.secondary?.href || personalInfo.github} target="_blank" rel="noreferrer">
                {heroActions.secondary?.label || 'GitHub'}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2rem] border border-border/60 bg-background/95 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{heroFocus.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {heroFocus.title}
              </h3>
            </div>

            <div className="rounded-2xl bg-muted p-3">
              <Sparkles className="size-6 text-primary" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {heroFocus.areas.map((area, index) => (
              <div key={`${area.label}-${index}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-foreground">{area.label}</span>
                  <span className="text-muted-foreground">{area.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-foreground/70' : 'bg-chart-2'}`}
                    style={{ width: `${Math.max(0, Math.min(100, Number(area.value) || 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {heroMetrics.map((metric, index) => {
            const isActive = activeMetric === index

            return (
              <article
                key={metric.label}
                className={`rounded-[1.5rem] border p-5 transition-all ${
                  isActive
                    ? 'border-primary/30 bg-primary/6'
                    : `border-border/60 bg-card/80 ${
                        isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/60'
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

        <div className="rounded-[2rem] border border-border/60 bg-background/95 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex -space-x-3">
              {subtitleTokens.map((token) => (
                <div
                  key={token}
                  className="flex size-12 items-center justify-center rounded-full border-2 border-background bg-muted text-sm font-semibold text-foreground shadow-sm"
                >
                  {token.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{personalInfo.subtitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{personalInfo.location}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <Badge key={badge.label} variant="secondary" className="rounded-full px-3 py-1 font-medium">
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {heroHighlights.map((item, index) => {
              const cardKey = item.title || `highlight-${index}`
              const isActive = activeCapability === cardKey
              const Icon = index === 0 ? CircleCheckBig : ChartColumnIncreasing

              return (
                <div
                  key={cardKey}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-primary/30 bg-primary/6'
                      : `border-border/60 bg-background/80 ${
                          isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/60'
                        }`
                  }`}
                  onMouseEnter={() => !isScrolling && setActiveCapability(cardKey)}
                >
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Icon className="size-5 text-primary" />
                    {item.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
