import { aboutContent, skillGroups } from '@/data/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function AboutSection() {
  return (
    <section id="about" className="grid gap-8 rounded-[2rem] border border-border/60 bg-card/65 p-8 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
      <SectionHeader
        eyebrow="About"
        title={aboutContent.title}
        description={aboutContent.description}
      />
      <div className="grid gap-4">
        {skillGroups.map((group) => (
          <article key={group.title} className="rounded-[1.75rem] border border-border/60 bg-background/75 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl">{group.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{group.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Module
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
