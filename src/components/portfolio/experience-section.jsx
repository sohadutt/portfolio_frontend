import { experience, featuredModules } from '@/data/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function ExperienceSection() {
  return (
    <section id="experience" className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border border-border/60 bg-card/70 p-8 backdrop-blur">
        <SectionHeader
          eyebrow="Experience"
          title="Experience across backend automation, frontend delivery, and production workflows."
          description="The timeline now follows your actual roles and shows how your work spans safe backend operations, reusable frontend systems, and collaborative delivery."
        />
        <div className="mt-8 space-y-5">
          {experience.map((item) => (
            <article key={item.title} className="rounded-[1.6rem] border border-border/60 bg-background/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{item.period}</p>
                <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {item.company}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {featuredModules.map(({ title, body, icon }) => {
          const Icon = icon

          return (
            <article key={title} className="rounded-[1.75rem] border border-border/60 bg-card/70 p-6 backdrop-blur">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-6 font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
