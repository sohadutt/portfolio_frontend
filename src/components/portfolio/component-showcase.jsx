import { showcaseCategories } from '@/data/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function ComponentShowcase() {
  return (
    <section
      id="components"
      className="rounded-[2rem] border border-border/60 bg-card/70 p-8 backdrop-blur"
    >
      <SectionHeader
        eyebrow="UI System"
        title="The requested component set is mapped into the new portfolio system."
        description="Instead of leaving the site as a single hero, the rebuild now has space for the full component language you listed. These groups show how the page can grow into richer product-style screens."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {showcaseCategories.map(({ title, items, icon }) => {
          const Icon = icon

          return (
            <article key={title} className="rounded-[1.75rem] border border-border/60 bg-background/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="text-sm text-muted-foreground">{items.length} planned patterns</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground"
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
