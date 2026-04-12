import { createElement } from 'react'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'
import { resolveIcon } from '@/helper/functions' // Use the new icon resolver

function getCardClasses(isActive, isScrolling) {
  return isActive
    ? 'border-primary/30 bg-primary/6 shadow-sm'
    : `border-border/60 bg-background ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
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
    // Reduced grid gap on mobile
    <section id="experience" className="grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      {/* Reduced outer padding and border radius on small screens */}
      <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-border/60 bg-background/95 p-5 sm:p-8 shadow-sm">
        <SectionHeader
          eyebrow={expCopy.eyebrow || "Experience"}
          title={expCopy.title || "Experience across backend automation, frontend delivery, and production workflows."}
          description={expCopy.description || "Hover or tap a role to expand the story, pull its orange spotlight forward, and surface the component direction connected to that work."}
        />
        
        {/* Adjusted spacing between items */}
        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
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
                // Scaled down inner padding, added cursor-pointer for mobile tap affordance
                className={`cursor-pointer lg:cursor-default rounded-[1.25rem] sm:rounded-[1.6rem] border p-4 sm:p-5 transition-all duration-300 ${getCardClasses(isHighlighted, isScrolling)}`}
                onMouseEnter={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
                onFocus={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
                onClick={() => onRelationChange({ relation: item.relation, source: 'experience' })}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-primary">{item.period}</p>

                  <Badge
                    variant="secondary"
                    // Scaled badge padding for mobile
                    className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium"
                  >
                    {item.company}
                  </Badge>
                </div>

                <h3 className="mt-3 sm:mt-4 scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-2 sm:mt-3 text-sm leading-relaxed sm:leading-7 text-muted-foreground">
                  {item.summary}
                </p>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isExpanded ? 'mt-4 sm:mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-70'
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Adjusted expanded area padding */}
                    <div className="rounded-[1rem] sm:rounded-[1.35rem] border border-border/60 bg-muted/35 p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-primary">
                        Expanded focus
                      </p>

                      <ul className="mt-2 sm:mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                        {safeHighlights.map((highlight, hIdx) => (
                          <li key={hIdx}>{highlight}</li>
                        ))}
                      </ul>

                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                        {safeComponents.map((component, cIdx) => (
                          <Badge
                            key={cIdx}
                            variant="outline"
                            className="rounded-full border-primary/20 bg-background px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-primary hover:bg-primary/8 transition-colors"
                          >
                            {component}
                          </Badge>
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
      
      <div className="grid gap-4 sm:grid-cols-2">
        {featuredModules.map((module, index) => {
          const { title, body, icon, icon_name, relation, details } = module
          const IconComponent = resolveIcon(icon || icon_name || "Blocks")
          
          const isHighlighted = resolvedRelation === relation
          const isExpanded = isHighlighted && activeSource === 'module'

          return (
            <article
              key={title || index}
              // Added onClick for touch devices, reduced padding on mobile
              className={`cursor-pointer lg:cursor-default group rounded-[1.5rem] sm:rounded-[1.75rem] border bg-background/95 p-5 sm:p-6 shadow-sm transition-all duration-300 ${getCardClasses(isHighlighted, isScrolling)}`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onClick={() => onRelationChange({ relation, source: 'module' })}
            >
              <div
                // Scaled down icon background on mobile
                className={`flex size-10 sm:size-12 items-center justify-center rounded-xl sm:rounded-2xl transition-transform duration-300 ${
                  isHighlighted ? 'bg-primary text-primary-foreground scale-110' : 'bg-primary/10 text-primary group-hover:scale-110'
                }`}
              >
                {createElement(IconComponent, { className: "size-5 sm:size-6" })}
              </div>

              <h3 className="mt-5 sm:mt-6 scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight">
                {title}
              </h3>

              <p className="mt-2 sm:mt-3 text-sm leading-relaxed sm:leading-7 text-muted-foreground">
                {body}
              </p>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/60 pt-3 sm:pt-4 text-sm leading-6 text-muted-foreground">
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