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
    <section id="about" className="apple-panel-strong grid gap-8 rounded-[2rem] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Wrap SectionHeader in a flex-col so it aligns properly with the grid layout.
        Fallbacks added just in case the API data is missing.
      */}
      <div className="flex flex-col">
        <SectionHeader
          eyebrow={eyebrow}
          title={aboutContent.title || "About Me"}
          description={aboutContent.description || "Learn more about my background and technical focus."}
        />
      </div>

      <div className="grid gap-4">
        {skillGroups.map((group, index) => {
          const isActive = activeGroup === index
          // Dynamically resolve the icon string from the backend (e.g. "Sparkles")
          const IconComponent = resolveIcon(group.icon || group.icon_name || "Sparkles")

          return (
            <article
              key={group.title || index}
              className={`apple-panel-hover group rounded-[1.75rem] border p-5 transition-all duration-300 ${
                isActive
                  ? 'border-primary/30 bg-primary/6'
                  : `border-border/60 bg-card/65 ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-foreground/5'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveGroup(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    {createElement(IconComponent, { className: "size-5" })}
                  </div>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {group.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <Badge 
                  variant="secondary" 
                  className="shrink-0 rounded-full uppercase tracking-[0.14em]"
                >
                  Module
                </Badge>
              </div>
              
              <div className="mt-5 flex flex-wrap gap-2">
                {(group.items || []).map((item, itemIdx) => (
                  <Badge
                    key={`${item}-${itemIdx}`}
                    variant={isActive ? "secondary" : "outline"}
                    className={`rounded-full px-3 py-1 font-medium transition-colors ${
                      isActive 
                        ? "border-transparent bg-primary/10 text-primary hover:bg-primary/15" 
                        : "border-border/60 bg-transparent text-muted-foreground"
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
