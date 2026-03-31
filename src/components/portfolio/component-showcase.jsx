import { showcaseCategories } from '@/data/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function ComponentShowcase({ activeHover, onRelationChange, isScrolling }) {
  const resolvedRelation = activeHover?.relation ?? null
  const activeSource = activeHover?.source ?? null

  return (
    <section
      id="components"
      className="rounded-[2rem] border border-border/60 bg-card/70 p-8 backdrop-blur"
    >
      <SectionHeader
        eyebrow="UI System"
        title="Related components now respond to the same hover story."
        description="The orange spotlight moves between engineering tracks and the UI patterns they influence, so the page feels connected instead of sectioned off."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {showcaseCategories.map(({ title, items, icon, relation, preview }) => {
          const Icon = icon
          const isHighlighted = resolvedRelation === relation
          const isExpanded = isHighlighted && activeSource === 'showcase'

          return (
            <article
              key={title}
              className={`rounded-[1.75rem] border p-5 ${
                isHighlighted
                  ? 'border-primary/70 bg-primary/10 shadow-[0_24px_70px_-42px_rgba(225,98,54,0.9)]'
                  : `border-border/60 bg-background/80 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/6'}`
              }`}
              onMouseEnter={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
              onFocus={() => !isScrolling && onRelationChange({ relation, source: 'showcase' })}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl ${
                    isHighlighted ? 'bg-primary text-primary-foreground' : 'bg-primary/12 text-primary'
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="text-sm text-muted-foreground">{items.length} planned patterns</p>
                </div>
              </div>
              <p
                className={`grid text-sm leading-6 text-muted-foreground transition-all duration-500 ${
                  isExpanded ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <span className="overflow-hidden">{preview}</span>
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${
                      isHighlighted
                        ? 'border-primary/30 bg-primary/12 text-primary'
                        : 'border-border/60 bg-card text-muted-foreground'
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
