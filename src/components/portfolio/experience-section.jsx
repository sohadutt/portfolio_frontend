import { createElement } from 'react'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'
import { resolveIcon } from '@/helper/functions' // Use the new icon resolver

function getCardClasses(isActive, isScrolling) {
  return isActive
    ? 'border-primary/40 bg-primary/10 shadow-[0_0_30px_0_color-mix(in_oklch,var(--primary)_15%,transparent)]'
    : `border-border/30 bg-card/20 backdrop-blur-md ${isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'}`
}

export function ExperienceSection({ data = {}, activeHover, onRelationChange, isScrolling }) {
  const resolvedRelation = activeHover?.relation ?? null
  const activeSource = activeHover?.source ?? null
  
  // Safely extract data from the API payload
  const sectionCopy = data.sectionCopy || data.section_copy || {}
  const expCopy = sectionCopy.experience || {}
  
  const rawExperience = data.experience || []
  const experience = Array.isArray(rawExperience) 
    ? rawExperience 
    : (Array.isArray(rawExperience.results) ? rawExperience.results : [])

  const rawModules = data.featuredModules || data.featured_modules || []
  const featuredModules = Array.isArray(rawModules) 
    ? rawModules 
    : (Array.isArray(rawModules.results) ? rawModules.results : [])

  return (
    <section
      id="experience"
      className="relative grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr]"
      onMouseLeave={() => !isScrolling && onRelationChange(null)}
    >
      {/* Left Panel: Experience Timeline */}
      <div className="cinematic-panel-strong relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-lg">

        {/* Subtle Ambient Glow */}
        <div className="absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <SectionHeader
            eyebrow={expCopy.eyebrow || "Experience"}
            title={expCopy.title || "Experience across backend automation, frontend delivery, and production workflows."}
            description={expCopy.description || "Hover or tap a role to expand the story, pull its spotlight forward, and surface the component direction connected to that work."}
          />

          <div className="mt-8 sm:mt-12 space-y-5 sm:space-y-6">
            {experience.map((item, index) => {
              const isHighlighted = resolvedRelation === item.relation
              const isExpanded = isHighlighted && activeSource === 'experience'

              const safeHighlights = Array.isArray(item.highlights) ? item.highlights : []
              const safeComponents = Array.isArray(item.relatedComponents || item.related_components)
                ? (item.relatedComponents || item.related_components)
                : []

              return (
                <article
                  key={item.title || index}
                  className={`group relative cursor-pointer lg:cursor-default rounded-[1.5rem] sm:rounded-[2rem] border p-5 sm:p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${getCardClasses(isHighlighted, isScrolling)}`}
                  onMouseEnter={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
                  onFocus={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
                  onClick={() => onRelationChange({ relation: item.relation, source: 'experience' })}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary">{item.period}</p>

                    <span className="inline-flex rounded-full border border-border/40 bg-card/40 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                      {item.company}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground sm:text-base sm:leading-[1.7]">
                    {item.summary}
                  </p>

                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="rounded-[1.25rem] sm:rounded-[1.5rem] border border-border/30 bg-card/30 p-4 sm:p-5 backdrop-blur-sm shadow-md">
                        <ul className="space-y-2.5 text-sm font-light leading-relaxed text-muted-foreground">
                          {safeHighlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start">
                              <span className="mr-2.5 mt-1.5 flex size-1.5 shrink-0 rounded-full bg-primary/60" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                          {safeComponents.map((component, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-flex rounded-md border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-light text-primary transition-colors hover:bg-primary/15 border"
                            >
                              {component}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: Featured Modules */}
      <div className="grid gap-5 sm:grid-cols-2">
        {featuredModules.map((module, index) => {
          const { title, body, icon, icon_name, relation, details } = module
          const IconComponent = resolveIcon(icon || icon_name || "Blocks")

          const isHighlighted = resolvedRelation === relation
          const isExpanded = isHighlighted && activeSource === 'module'

          return (
            <article
              key={title || index}
              className={`cinematic-panel-hover group relative cursor-pointer lg:cursor-default rounded-[2rem] sm:rounded-[2.5rem] border p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${getCardClasses(isHighlighted, isScrolling)}`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onClick={() => onRelationChange({ relation, source: 'module' })}
            >
              <div
                className={`flex size-12 sm:size-14 items-center justify-center rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isHighlighted
                    ? 'scale-110 border border-primary bg-primary text-primary-foreground shadow-lg'
                    : 'border border-primary/20 bg-primary/10 text-primary group-hover:scale-110'
                }`}
              >
                {createElement(IconComponent, { className: "size-5 sm:size-6" })}
              </div>

              <h3 className="mt-6 text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h3>

              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground sm:text-base sm:leading-[1.7]">
                {body}
              </p>

              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/30 pt-4 text-sm font-light leading-relaxed text-muted-foreground">
                    {details}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}