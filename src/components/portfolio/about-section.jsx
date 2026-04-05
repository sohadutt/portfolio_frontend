import { useState } from 'react'
import { aboutContent, skillGroups } from '@/helper/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function AboutSection({ isScrolling }) {
  const [activeGroup, setActiveGroup] = useState(null)
  const resolvedGroup = activeGroup

  return (
    <section id="about" className="grid gap-8 rounded-[2rem] border border-border/60 bg-card/65 p-8 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
      <SectionHeader
        eyebrow="About"
        title={aboutContent.title}
        description={aboutContent.description}
      />
      <div className="grid gap-4">
        {skillGroups.map((group, index) => {
          const isActive = resolvedGroup === index

          return (
          <article
            key={group.title}
            className={`rounded-[1.75rem] border p-5 ${
              isActive
                ? 'border-primary/70 bg-primary/10 shadow-[0_24px_70px_-42px_rgba(225,98,54,0.9)]'
                : `border-border/60 bg-background/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/6'}`
            }`}
            onMouseEnter={() => !isScrolling && setActiveGroup(index)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl">{group.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">{group.description}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
              }`}>
                Module
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${
                    isActive
                      ? 'border-primary/25 bg-primary/12 text-primary'
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
