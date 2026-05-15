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
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Left Main Card - Strong Cinematic Panel */}
      <div className="cinematic-panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-14 shadow-lg isolation-isolate">

        {/* Subtle Background Glow Effect matching the theme */}
        <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mb-12 flex flex-wrap gap-3">
          {statusPills.map(({ label, icon, icon_name }, index) => {
            const IconComponent = resolveIcon(icon || icon_name)
            const isActive = activeMetric === `pill-${index}`

            return (
              <div
                key={label}
                className={`inline-flex cursor-default items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'border-primary/40 bg-primary/20 text-primary shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_20%,transparent)] scale-105'
                    : `border-border/40 bg-card/30 text-muted-foreground backdrop-blur-md ${
                        isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/50 hover:text-foreground'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(`pill-${index}`)}
                onMouseLeave={() => !isScrolling && setActiveMetric(null)}
              >
                {createElement(IconComponent, {
                  className: `size-4 transition-colors duration-500 ${isActive ? 'text-primary' : 'text-primary/70'}`
                })}
                {label}
              </div>
            )
          })}
        </div>

        <div className="relative z-10 space-y-8">
          {/* Glowing Gradient Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {heroContent.eyebrow}
          </p>

          <h1 className="max-w-4xl text-6xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
            {heroContent.title}
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl font-light leading-[1.8] text-muted-foreground">
            {heroContent.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-8">
            {heroActions.primary?.label && (
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-base font-semibold shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-xl">
                <a href={heroActions.primary.href || '#'}>
                  {heroActions.primary.label}
                  <ArrowRight className="ml-2.5 size-5" />
                </a>
              </Button>
            )}

            {heroActions.secondary?.label && (
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-border/50 bg-card/20 px-8 text-base font-semibold backdrop-blur-sm shadow-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-primary/40 hover:bg-card/40 hover:text-primary hover:shadow-lg">
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
        <div className="cinematic-panel relative overflow-hidden rounded-[2.5rem] p-8 isolation-isolate">
          <div className="absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-primary/10 blur-[60px] pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{heroFocus.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                {heroFocus.title}
              </h3>
            </div>

            <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-sm shadow-lg">
              <Sparkles className="size-5 text-primary" />
            </div>
          </div>

          <div className="relative z-10 mt-8 space-y-6">
            {(heroFocus.areas || []).map((area, index) => (
              <div key={`${area.label}-${index}`}>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 font-light tracking-wide text-foreground/90">
                    {createElement(resolveIcon(area.icon || area.icon_name || "Component"), { className: "size-4 text-muted-foreground" })}
                    <span>{area.label}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{area.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-border/30">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      index === 0 ? 'bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(var(--primary),0.5)]' :
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
                className={`cinematic-panel-hover group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'border-primary/40 bg-primary/10 shadow-lg scale-[1.02]'
                    : `border-border/30 bg-card/20 backdrop-blur-md ${
                        isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'
                      }`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMetric(index)}
                onMouseLeave={() => !isScrolling && setActiveMetric(null)}
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-background/50 border border-border/40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/10">
                   {createElement(resolveIcon(metric.icon || metric.icon_name || "Sparkles"), { className: "size-5 text-primary font-bold" })}
                </div>
                <p className="text-4xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </p>
              </article>
            )
          })}
        </div>

        {/* Bottom Right - Highlights */}
        <div className="cinematic-panel rounded-[2.5rem] p-8">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex -space-x-3">
              {subtitleTokens.map((token, i) => (
                <div
                  key={token}
                  className="flex size-14 items-center justify-center rounded-full border-4 border-background bg-card/60 text-sm font-bold text-primary shadow-md backdrop-blur-xl transition-transform duration-500 hover:scale-110 hover:z-10 hover:border-primary/20 hover:bg-primary/10"
                  style={{ zIndex: subtitleTokens.length - i }}
                >
                  {token.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground">{personalInfo.subtitle}</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">{personalInfo.location}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <span key={badge.label} className="inline-flex items-center rounded-full border border-border/40 bg-card/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card/60 hover:text-foreground">
                    {badge.label}
                  </span>
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
                  className={`group rounded-2xl border p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? 'border-primary/40 bg-primary/10 shadow-lg scale-[1.02]'
                    : `border-border/30 bg-card/20 backdrop-blur-sm ${
                          isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'
                        }`
                  }`}
                  onMouseEnter={() => !isScrolling && setActiveCapability(cardKey)}
                  onMouseLeave={() => !isScrolling && setActiveCapability(null)}
                >
                  <div className="mb-4 flex items-center gap-3 text-sm font-semibold tracking-wide text-foreground">
                    <div className={`flex size-8 items-center justify-center rounded-lg transition-colors duration-500 ${isActive ? 'bg-primary/20 text-primary' : 'bg-background/50 border border-border/40 text-muted-foreground group-hover:text-primary group-hover:border-primary/30'}`}>
                      {createElement(IconComponent, { className: "size-4" })}
                    </div>
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