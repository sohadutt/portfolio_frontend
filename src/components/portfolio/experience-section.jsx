import { experience, featuredModules } from '@/helper/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'

function getCardClasses(isActive, isScrolling) {
  return isActive
    ? 'border-primary/70 bg-primary/10 shadow-[0_24px_70px_-42px_var(--color-primary)]'
    : `border-border/60 bg-background/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/6'}`
}

export function ExperienceSection({ activeHover, onRelationChange, isScrolling }) {
  const resolvedRelation = activeHover?.relation ?? null
  const activeSource = activeHover?.source ?? null

  return (
    <section id="experience" className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-border/60 bg-card/70 p-8 backdrop-blur">
        <SectionHeader
          eyebrow="Experience"
          title="Experience across backend automation, frontend delivery, and production workflows."
          description="Hover a role to expand the story, pull its orange spotlight forward, and surface the component direction connected to that work."
        />
        <div className="mt-8 space-y-5">
          {experience.map((item) => {
            const isHighlighted = resolvedRelation === item.relation
            const isExpanded = isHighlighted && activeSource === 'experience'

            return (
              <article
                key={item.title}
                className={`rounded-[1.6rem] border p-5 transition-all duration-300 ${getCardClasses(isHighlighted, isScrolling)}`}
                onMouseEnter={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
                onFocus={() => !isScrolling && onRelationChange({ relation: item.relation, source: 'experience' })}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{item.period}</p>
                  
                  {/* shadcn Component: Badge for the company */}
                  <Badge
                    variant={isHighlighted ? "default" : "secondary"}
                    className="px-3 py-1 uppercase tracking-[0.16em]"
                  >
                    {item.company}
                  </Badge>
                </div>
                
                {/* shadcn Typography: H3 */}
                <h3 className="mt-4 scroll-m-20 text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                
                {/* shadcn Typography: Muted */}
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.summary}
                </p>
                
                <div
                  className={`grid transition-all duration-500 ${
                    isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-70'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-[1.35rem] border border-primary/20 bg-background/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        Expanded focus
                      </p>
                      
                      {/* shadcn Typography: Muted List */}
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.relatedComponents.map((component) => (
                          /* shadcn Component: Badge for related skills/components */
                          <Badge
                            key={component}
                            variant="outline"
                            className="border-primary/25 bg-primary/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary hover:bg-primary/20"
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
        {featuredModules.map(({ title, body, icon, relation, details }) => {
          const Icon = icon
          const isHighlighted = resolvedRelation === relation
          const isExpanded = isHighlighted && activeSource === 'module'

          return (
            <article
              key={title}
              className={`rounded-[1.75rem] border bg-card/70 p-6 backdrop-blur transition-all duration-300 ${getCardClasses(isHighlighted, isScrolling)}`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  isHighlighted ? 'bg-primary text-primary-foreground' : 'bg-primary/12 text-primary'
                }`}
              >
                <Icon className="size-5" />
              </div>
              
              {/* shadcn Typography: H3 */}
              <h3 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
                {title}
              </h3>
              
              {/* shadcn Typography: Muted */}
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {body}
              </p>
              
              <div
                className={`grid transition-all duration-500 ${
                  isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-primary/20 pt-4 text-sm leading-6 text-muted-foreground">
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