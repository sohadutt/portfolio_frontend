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
              className={`rounded-[1.75rem] border p-5 transition-all duration-300 ${
                isActive
                  ? 'border-primary/70 bg-primary/10 shadow-[0_24px_70px_-42px_var(--color-primary)]'
                  : `border-border/60 bg-background/75 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/5'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveGroup(index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* shadcn Typography: H3 */}
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {group.title}
                  </h3>
                  
                  {/* shadcn Typography: Muted text with standard paragraph leading */}
                  <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                
                {/* shadcn Component: Badge for the "Module" label */}
                <Badge 
                  variant={isActive ? "default" : "secondary"} 
                  className="uppercase tracking-[0.18em]"
                >
                  Module
                </Badge>
              </div>
              
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  /* shadcn Component: Badge for the individual skill items */
                  <Badge
                    key={item}
                    variant={isActive ? "secondary" : "outline"}
                    className={`px-3 py-1 uppercase tracking-[0.16em] ${
                      isActive 
                        ? "bg-primary/15 text-primary hover:bg-primary/20" 
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
