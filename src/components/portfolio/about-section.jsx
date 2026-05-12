import { createElement, useState } from 'react'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'
import { resolveIcon } from '@/helper/functions' // Import your dynamic icon resolver

export function AboutSection({ data = {}, isScrolling }) {
  const [activeGroup, setActiveGroup] = useState(null)
  
  // Safely extract data from the API payload
  const aboutContent = data.aboutContent || data.about_content || {}
  const sectionCopy = data.sectionCopy || data.section_copy || {}
  const rawSkillGroups = data.skillGroups || data.skill_groups || []
  const skillGroups = Array.isArray(rawSkillGroups) ? rawSkillGroups : []

  // Safely extract the eyebrow from section copy, fallback to "About"
  const eyebrow = sectionCopy.about?.eyebrow || 'About'

  return (
    <section id="about" className="cinematic-panel-strong relative grid gap-8 overflow-hidden rounded-[2.5rem] p-8 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] shadow-2xl shadow-background/50">
      
      {/* Deep Cinematic Ambient Glow */}
      <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Wrap SectionHeader in a flex-col so it aligns properly with the grid layout.
        Fallbacks added just in case the API data is missing.
      */}
      <div className="relative z-10 flex flex-col">
        <SectionHeader
          eyebrow={eyebrow}
          title={aboutContent.title || "About Me"}
          description={aboutContent.description || "Learn more about my background and technical focus."}
        />
      </div>

      <div className="relative z-10 grid gap-5">
        {skillGroups.map((group, index) => {
          const isActive = activeGroup === index
          // Dynamically resolve the icon string from the backend (e.g. "Sparkles")
          const IconComponent = resolveIcon(group.icon || group.icon_name || "Sparkles")

          return (
            <article
              key={group.title || index}
              className={`cinematic-panel-hover group relative rounded-[2rem] border p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_30px_0_color-mix(in_oklch,var(--primary)_15%,transparent)]'
                  : `border-border/30 bg-card/20 backdrop-blur-md ${isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveGroup(index)}
              onMouseLeave={() => !isScrolling && setActiveGroup(null)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                    {createElement(IconComponent, { className: "size-6" })}
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight text-foreground">
                    {group.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-muted-foreground sm:text-base sm:leading-8">
                    {group.description}
                  </p>
                </div>

                <Badge 
                  variant="secondary" 
                  className="shrink-0 rounded-full border border-border/40 bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm"
                >
                  Module
                </Badge>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2.5">
                {(group.items || []).map((item, itemIdx) => (
                  <Badge
                    key={`${item}-${itemIdx}`}
                    variant="outline"
                    className={`rounded-md border px-3 py-1.5 text-xs font-light transition-colors duration-500 ${
                      isActive 
                        ? "border-primary/30 bg-primary/5 text-primary" 
                        : "border-border/40 bg-card/30 text-muted-foreground"
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}