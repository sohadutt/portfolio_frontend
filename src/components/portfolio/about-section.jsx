import { useState } from 'react'
import { SectionHeader } from '@/components/portfolio/section-header'
import { Badge } from '@/components/ui/badge'
import { getAboutContent, getSkillGroups } from '@/helper/portfolio-data'

export function AboutSection({ data, isScrolling }) {
  const [activeGroup, setActiveGroup] = useState(null)
  const resolvedGroup = activeGroup
  const aboutContent = getAboutContent(data)
  const skillGroups = getSkillGroups(data)

  return (
    <section id="about" className="grid gap-8 rounded-[2rem] border border-border/60 bg-background/95 p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
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
              className={`rounded-[1.75rem] border p-5 transition-all duration-300 ${
                isActive
                  ? 'border-primary/30 bg-primary/6'
                  : `border-border/60 bg-background ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveGroup(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {group.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <Badge 
                  variant="secondary" 
                  className="rounded-full uppercase tracking-[0.14em]"
                >
                  Module
                </Badge>
              </div>
              
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge
                    key={item}
                    variant={isActive ? "secondary" : "outline"}
                    className={`rounded-full px-3 py-1 font-medium ${
                      isActive 
                        ? "bg-primary/10 text-primary hover:bg-primary/15" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
