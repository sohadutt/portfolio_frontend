import { useState, createElement } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/portfolio/section-header'
import { resolveIcon } from '@/helper/functions'

const portfolioBuilderProject = {
  title: 'Portfolio Builder',
  eyebrow: 'Launch your own',
  description:
    'This portfolio is powered by the builder behind it, with a dashboard for editing projects, experience, links, themes, and public portfolio variations.',
  stack: ['React', 'Vite', 'Dashboard CMS'],
  stat: 'Live builder',
  href: '/home',
  ctaLabel: 'Make yours now',
  icon: 'Blocks'
}

export function WorkSection({ data = {}, isScrolling, isDefaultPortfolio = false }) {
  const [activeProject, setActiveProject] = useState(null)
  
  const sectionCopy = data.sectionCopy || data.section_copy || {}
  const projectsCopy = sectionCopy.projects || {}
  
  const rawProjects = data.projects || []
  const apiProjects = Array.isArray(rawProjects) 
    ? rawProjects 
    : (Array.isArray(rawProjects.results) ? rawProjects.results : [])

  const projects = isDefaultPortfolio
    ? [...apiProjects, portfolioBuilderProject]
    : apiProjects

  return (
    <section id="projects" className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow={projectsCopy.eyebrow || "Projects"}
        title={projectsCopy.title || "Selected technical projects and engineering outcomes."}
        description={projectsCopy.description || "A showcase of recent work focusing on secure configuration tooling, reliable deployments, and scalable UI architectures."}
      />
      
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {projects.map((project, index) => {
          const isFeatured = index === 0 && activeProject === null
          const isActive = activeProject === index
          const safeStack = Array.isArray(project.stack) ? project.stack : []
          
          const IconComponent = resolveIcon(project.icon || project.icon_name || "Globe")
          const ctaText = project.ctaLabel || project.cta_label || 'Explore'

          return (
            <article
              key={project.title || index}
              className={`apple-panel-hover group rounded-[1.5rem] sm:rounded-[2rem] border p-5 sm:p-6 transition-all duration-300 flex flex-col ${
                isActive || isFeatured
                  ? 'border-primary/30 bg-primary/6 shadow-sm'
                  : `border-border/60 bg-card/75 ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-foreground/5'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveProject(index)}
              onMouseLeave={() => !isScrolling && setActiveProject(null)}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className={`flex items-center gap-2 transition-colors duration-300 min-w-0 ${
                    isActive || isFeatured ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {createElement(IconComponent, { className: "size-4 shrink-0" })}
                  <p className="truncate text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em]">
                    {project.eyebrow}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className={`rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
                    isActive || isFeatured
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'text-muted-foreground'
                  }`}
                >
                  {project.stat}
                </Badge>
              </div>

              <h3 className="mt-5 sm:mt-6 text-xl sm:text-2xl font-semibold tracking-tight">
                {project.title}
              </h3>

              <p
                className={`mt-3 sm:mt-4 text-sm leading-relaxed sm:leading-7 flex-1 transition-colors duration-300 ${
                  isActive || isFeatured ? 'text-foreground/85' : 'text-muted-foreground'
                }`}
              >
                {project.description}
              </p>

              <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
                {safeStack.map((item, itemIdx) => (
                  <Badge
                    key={`${item}-${itemIdx}`}
                    variant="outline"
                    className={`rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                      isActive || isFeatured
                        ? 'border-primary/20 bg-background text-foreground'
                        : 'border-border/60 bg-background text-muted-foreground'
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-border/40">
                <Button
                  asChild
                  variant={isActive || isFeatured ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-full font-medium shadow-none transition-all duration-300 sm:h-10 sm:px-4"
                >
                  <a href={project.href || '#contact'} target={project.href?.startsWith('http') ? '_blank' : '_self'}>
                    {ctaText}
                    <ChevronRight className="ml-1 size-3 sm:size-4" />
                  </a>
                </Button>
                <a 
                  href={project.href || '#contact'} 
                  target={project.href?.startsWith('http') ? '_blank' : '_self'}
                  aria-label={`Open ${project.title}`}
                  className="p-2 sm:p-0"
                >
                  <ArrowUpRight 
                    className={`size-5 sm:size-6 transition-all duration-300 hover:scale-110 ${
                      isActive || isFeatured ? 'text-primary' : 'text-muted-foreground'
                    }`} 
                  />
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
