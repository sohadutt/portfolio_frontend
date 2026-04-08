import { useState } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/portfolio/section-header'
import { getProjects } from '@/helper/portfolio-data'

export function WorkSection({ data, isScrolling }) {
  const [activeProject, setActiveProject] = useState(null)
  const resolvedProject = activeProject
  const projects = getProjects(data)

  return (
    <section id="projects" className="space-y-8">
      <SectionHeader
        eyebrow="Projects"
        title="Selected work from configuration systems to frontend delivery."
        description="These cards now reflect the projects and outcomes from your resume, with emphasis on secure configuration tooling, deployment reliability, and reusable UI work."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project, index) => {
          const isFeatured = index === 0 && resolvedProject === null
          const isActive = resolvedProject === index

          return (
            <article
              key={project.title}
              className={`group rounded-[2rem] border p-6 backdrop-blur transition-all duration-300 ${
                isActive || isFeatured
                  ? 'border-primary/70 bg-primary text-primary-foreground shadow-[0_30px_80px_-42px_var(--color-primary)'
                  : `border-border/60 bg-card/70 ${isScrolling ? '' : 'hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/6'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveProject(index)}
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.26em] transition-colors duration-300 ${
                    isActive || isFeatured ? 'text-primary-foreground/80' : 'text-primary'
                  }`}
                >
                  {project.eyebrow}
                </p>
                
                {/* shadcn Component: Badge for the Stat */}
                <Badge
                  variant="outline"
                  className={`px-3 py-1 uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isActive || isFeatured
                      ? 'border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20'
                      : 'border-border/60 bg-background/80 text-muted-foreground'
                  }`}
                >
                  {project.stat}
                </Badge>
              </div>
              
              {/* shadcn Typography: H3 style (Removed font-serif) */}
              <h3 className="mt-6 scroll-m-20 text-3xl font-semibold tracking-tight">
                {project.title}
              </h3>
              
              {/* shadcn Typography: standard paragraph leading */}
              <p
                className={`mt-4 text-sm leading-7 transition-colors duration-300 ${
                  isActive || isFeatured ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}
              >
                {project.description}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  /* shadcn Component: Badge for the Tech Stack */
                  <Badge
                    key={item}
                    variant="outline"
                    className={`px-3 py-1 uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive || isFeatured
                        ? 'border-transparent bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25'
                        : 'border-border/60 bg-background/70 text-muted-foreground hover:bg-background/90'
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant={isActive || isFeatured ? 'secondary' : 'outline'}
                  className="rounded-full font-semibold transition-all duration-300"
                >
                  Explore
                  <ChevronRight className="ml-1 size-4" />
                </Button>
                <ArrowUpRight 
                  className={`transition-all duration-300 ${
                    isActive || isFeatured ? 'text-primary-foreground' : 'text-primary'
                  }`} 
                />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
