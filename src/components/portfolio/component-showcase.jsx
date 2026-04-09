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
      className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm"
    >
      <SectionHeader
        eyebrow={componentsCopy.eyebrow || "UI System"}
        title={componentsCopy.title || "Related components now respond to the same hover story."}
        description={componentsCopy.description || "The orange spotlight moves between engineering tracks and the UI patterns they influence, so the page feels connected instead of sectioned off."}
      />
      
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {showcaseCategories.map(({ title, items, icon, icon_name, relation, preview }, index) => {
          // Dynamically resolve the icon from the backend string
          const IconComponent = resolveIcon(icon || icon_name || "Component")
          const isHighlighted = resolvedRelation === relation
          const isExpanded = isHighlighted && activeSource === 'showcase'
          const safeItems = Array.isArray(items) ? items : []

          return (
            <article
              key={title || index}
              className={`group rounded-[1.75rem] border p-5 transition-all duration-300 ${
                isHighlighted
                  ? 'border-primary/30 bg-primary/6 shadow-sm'
                  : `border-border/60 bg-background ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
              }`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`mb-4 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 ${
                      isHighlighted 
                        ? 'bg-primary text-primary-foreground scale-110' 
                        : 'bg-primary/10 text-primary group-hover:scale-110'
                    }`}
                  >
                    {createElement(IconComponent, { className: "size-6" })}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{safeItems.length} planned patterns</p>
                </div>
              </div>
              
              {/* Smoothly expand the description on hover */}
              <div
                className={`grid text-sm leading-6 text-muted-foreground transition-all duration-500 ease-in-out ${
                  isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-2">{preview}</p>
                </div>
              </div>
              
              <div className="mt-5 flex flex-wrap gap-2">
                {safeItems.map((item, itemIdx) => (
                  <span
                    key={`${item}-${itemIdx}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isHighlighted
                        ? 'border-transparent bg-primary/10 text-primary'
                        : 'border-border/60 bg-transparent text-muted-foreground'
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
    </section>
  )
}