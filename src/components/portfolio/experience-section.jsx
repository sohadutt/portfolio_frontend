import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'
import { getExperience, getFeaturedModules } from '@/helper/portfolio-data'

function getCardClasses(isActive, isScrolling) {
  return isActive
    ? 'border-primary/30 bg-primary/6 shadow-sm'
    : `border-border/60 bg-background ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
}

export function ExperienceSection({ data, activeHover, onRelationChange, isScrolling }) {
  const resolvedRelation = activeHover?.relation ?? null
  const activeSource = activeHover?.source ?? null
  const experience = getExperience(data)
  const featuredModules = getFeaturedModules(data)

  return (
    <section id="experience" className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm">
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
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{item.period}</p>

                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1 font-medium"
                  >
                    {item.company}
                  </Badge>
                </div>

                <h3 className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.summary}
                </p>

                <div
                  className={`grid transition-all duration-500 ${
                    isExpanded ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-70'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="rounded-[1.35rem] border border-border/60 bg-muted/35 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                        Expanded focus
                      </p>

                      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                        {item.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.relatedComponents.map((component) => (
                          <Badge
                            key={component}
                            variant="outline"
                            className="rounded-full border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary hover:bg-primary/8"
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
              className={`rounded-[1.75rem] border bg-background/95 p-6 shadow-sm transition-all duration-300 ${getCardClasses(isHighlighted, isScrolling)}`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'module' })}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  isHighlighted ? 'bg-primary/12 text-primary' : 'bg-muted text-primary'
                }`}
              >
                <Icon className="size-5" />
              </div>

              <h3 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {body}
              </p>

              <div
                className={`grid transition-all duration-500 ${
                  isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/60 pt-4 text-sm leading-6 text-muted-foreground">
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
