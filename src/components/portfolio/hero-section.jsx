import { ArrowRight, Sparkles } from 'lucide-react'
import { useState, createElement } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { resolveIcon } from '@/helper/functions'

export function HeroSection({ data = {}, isScrolling }) {
  const [activeMetric, setActiveMetric] = useState(null)
  const [activeCapability, setActiveCapability] = useState(null)
  
  // Read directly from the API payload with safe fallbacks
  const heroContent = data.heroContent || data.hero_content || {}
  const heroActions = data.heroActions || data.hero_actions || {}
  const heroFocus = data.heroFocus || data.hero_focus || { areas: [] }
  const heroBadges = data.heroBadges || data.hero_badges || []
  const heroHighlights = data.heroHighlights || data.hero_highlights || []
  const heroMetrics = data.heroMetrics || data.hero_metrics || []
  const personalInfo = data.personalInfo || {}
  const statusPills = data.statusPills || data.status_pills || []
  
  const subtitleTokens = (personalInfo.subtitle || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Left Main Card - Strong Cinematic Panel */}
      <div className="cinematic-panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
        {/* Subtle Background Glow Effect matching the theme */}
        <div className="absolute -left-40 -top-40 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 mb-10 flex flex-wrap gap-3">
          {statusPills.map(({ label, icon, icon_name }, index) => {
            const IconComponent = resolveIcon(icon || icon_name)
            const isActive = activeMetric === `pill-${index}`

            return (
              <div
                key={label}
                className={`inline-flex cursor-default items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'border-transparent bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)]'
                    : `border-border/60 bg-card/30 text-muted-foreground backdrop-blur-md ${
                        isScrolling ? '' : 'hover:border-primary/40 hover:bg-primary/10 hover:text-foreground'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(`pill-${index}`)}
                onMouseLeave={() => !isScrolling && setActiveMetric(null)}
              >
                {createElement(IconComponent, { 
                  className: `size-4 ${isActive ? 'text-primary-foreground' : 'text-primary/70'}` 
                })}
                {label}
              </div>
            )
          })}
        </div>

        <div className="relative z-10 space-y-8">
          {/* Glowing Gradient Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {heroContent.eyebrow}
          </p>

          <h1 className="max-w-4xl text-5xl font-medium tracking-tight text-foreground leading-[1.05] sm:text-6xl lg:text-7xl">
            {heroContent.title}
          </h1>

          <p className="max-w-2xl text-lg font-light leading-relaxed text-muted-foreground sm:text-xl">
            {heroContent.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {heroActions.primary?.label && (
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-base font-medium transition-all hover:scale-[1.02]">
                <a href={heroActions.primary.href || '#'}>
                  {heroActions.primary.label}
                  <ArrowRight className="ml-2 size-5" />
                </a>
              </Button>
            )}

            {heroActions.secondary?.label && (
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-border/60 px-8 text-base font-medium transition-all hover:bg-primary/5">
                <a href={heroActions.secondary.href || '#'} target="_blank" rel="noreferrer">
                  {heroActions.secondary.label}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Top Right Card - Focus Areas */}
        <div className="cinematic-panel rounded-[2rem] p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{heroFocus.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                {heroFocus.title}
              </h3>
            </div>

            <div className="rounded-full border border-border/50 bg-card/50 p-3 backdrop-blur-sm">
              <Sparkles className="size-5 text-primary" />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {(heroFocus.areas || []).map((area, index) => (
              <div key={`${area.label}-${index}`}>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 font-medium text-foreground/90">
                    {createElement(resolveIcon(area.icon || area.icon_name || "Component"), { className: "size-4 text-muted-foreground" })}
                    <span>{area.label}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{area.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border/40">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      index === 0 ? 'bg-gradient-to-r from-primary to-accent' : 
                      index === 1 ? 'bg-primary/70' : 'bg-primary/40'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, Number(area.value) || 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Right - Metrics (Hover Cards) */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {heroMetrics.map((metric, index) => {
            const isActive = activeMetric === index

            return (
              <article
                key={metric.label}
                className={`cinematic-panel-hover rounded-[1.5rem] border p-6 ${
                  isActive
                    ? 'border-primary/40 bg-primary/10 shadow-[0_0_30px_0_color-mix(in_oklch,var(--primary)_15%,transparent)]'
                    : `border-border/50 bg-card/40 ${
                        isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/60'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(index)}
                onMouseLeave={() => !isScrolling && setActiveMetric(null)}
              >
                <div className="mb-4">
                   {createElement(resolveIcon(metric.icon || metric.icon_name || "Sparkles"), { className: "size-6 text-primary" })}
                </div>
                <p className="text-4xl font-light tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </p>
              </article>
            )
          })}
        </div>

        {/* Bottom Right - Highlights */}
        <div className="cinematic-panel rounded-[2rem] p-8">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {subtitleTokens.map((token) => (
                <div
                  key={token}
                  className="flex size-12 items-center justify-center rounded-full border-[3px] border-card bg-primary/10 text-sm font-bold text-primary shadow-sm backdrop-blur-md"
                >
                  {token.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div>
              <p className="text-base font-medium text-foreground">{personalInfo.subtitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{personalInfo.location}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <Badge key={badge.label} variant="secondary" className="rounded-full border border-border/50 bg-card/50 px-3 py-1 font-medium backdrop-blur-sm transition-colors hover:bg-card/80">
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroHighlights.map((item, index) => {
              const cardKey = item.title || `highlight-${index}`
              const isActive = activeCapability === cardKey
              const IconComponent = resolveIcon(item.icon || item.icon_name || "FileText")

              return (
                <div
                  key={cardKey}
                  className={`rounded-2xl border p-5 transition-all duration-300 ${
                    isActive
                      ? 'border-primary/40 bg-primary/10 shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_10%,transparent)]'
                    : `border-border/40 bg-card/30 ${
                          isScrolling ? '' : 'hover:border-primary/20 hover:bg-card/50'
                        }`
                  }`}
                  onMouseEnter={() => !isScrolling && setActiveCapability(cardKey)}
                  onMouseLeave={() => !isScrolling && setActiveCapability(null)}
                >
                  <div className="mb-3 flex items-center gap-3 text-sm font-medium text-foreground">
                    {createElement(IconComponent, { className: "size-5 text-primary/80" })}
                    {item.title}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}