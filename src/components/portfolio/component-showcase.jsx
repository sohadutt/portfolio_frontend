import { createElement } from 'react'
import { SectionHeader } from '@/components/portfolio/section-header'
import { resolveIcon } from '@/helper/functions' // Use the new icon resolver

export function ComponentShowcase({ data = {}, activeHover, onRelationChange, isScrolling }) {
  const resolvedRelation = activeHover?.relation ?? null
  const activeSource = activeHover?.source ?? null
  
  // Safely extract data from the API payload
  const sectionCopy = data.sectionCopy || data.section_copy || {}
  const componentsCopy = sectionCopy.components || {}
  
  const rawCategories = data.showcaseCategories || data.showcase_categories || []
  // Handle potential Django pagination wrappers
  const showcaseCategories = Array.isArray(rawCategories) 
    ? rawCategories 
    : (Array.isArray(rawCategories.results) ? rawCategories.results : [])

  return (
    <section
      id="components"
      className="cinematic-panel relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 shadow-lg"
      onMouseLeave={() => !isScrolling && onRelationChange(null)}
    >
      {/* Subtle Background Glow for the Section */}
      <div className="absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <SectionHeader
          eyebrow={componentsCopy.eyebrow || "UI System"}
          title={componentsCopy.title || "Related components now respond to the same hover story."}
          description={componentsCopy.description || "The spotlight moves between engineering tracks and the UI patterns they influence, so the page feels connected instead of sectioned off."}
        />

        <div className="mt-8 grid gap-5 sm:mt-12 lg:grid-cols-3">
          {showcaseCategories.map(({ title, items, icon, icon_name, relation, preview }, index) => {
            const IconComponent = resolveIcon(icon || icon_name || "Component")
            const isHighlighted = resolvedRelation === relation
            const isExpanded = isHighlighted && activeSource === 'showcase'
            const safeItems = Array.isArray(items) ? items : []

            return (
              <article
                key={title || index}
                className={`cinematic-panel-hover group relative rounded-[2rem] border p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isHighlighted
                    ? 'border-primary/40 bg-primary/10 shadow-lg'
                    : `border-border/30 bg-card/20 backdrop-blur-md ${isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'}`
                }`}
                onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
                onFocus={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className={`mb-5 flex size-12 items-center justify-center rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHighlighted
                          ? 'scale-110 border border-primary bg-primary text-primary-foreground shadow-lg'
                          : 'border border-primary/20 bg-primary/10 text-primary group-hover:scale-110'
                      }`}
                    >
                      {createElement(IconComponent, { className: "size-6" })}
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
                    <p className="mt-1.5 text-sm font-light text-muted-foreground">{safeItems.length} planned patterns</p>
                  </div>
                </div>

                {/* Smoothly expand the description on hover */}
                <div
                  className={`grid text-sm font-light leading-relaxed text-muted-foreground transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-2">{preview}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {safeItems.map((item, itemIdx) => (
                    <span
                      key={`${item}-${itemIdx}`}
                      className={`rounded-md border px-3 py-1.5 text-xs font-light transition-colors duration-500 ${
                        isHighlighted
                          ? 'border-primary/30 bg-primary/5 text-primary'
                          : 'border-border/40 bg-card/30 text-muted-foreground'
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}