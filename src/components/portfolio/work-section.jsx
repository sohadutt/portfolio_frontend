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
    <section id="projects" className="space-y-8 sm:space-y-12">
      <SectionHeader
        eyebrow={projectsCopy.eyebrow || "Projects"}
        title={projectsCopy.title || "Selected technical projects and engineering outcomes."}
        description={projectsCopy.description || "A showcase of recent work focusing on secure configuration tooling, reliable deployments, and scalable UI architectures."}
      />
      
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {projects.map((project, index) => {
          const isFeatured = index === 0 && activeProject === null
          const isActive = activeProject === index
          const safeStack = Array.isArray(project.stack) ? project.stack : []
          
          const IconComponent = resolveIcon(project.icon || project.icon_name || "Globe")
          const ctaText = project.ctaLabel || project.cta_label || 'Explore'

          return (
            <article
              key={project.title || index}
              className={`cinematic-panel-hover group relative flex flex-col rounded-[2rem] border p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive || isFeatured
                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_30px_0_color-mix(in_oklch,var(--primary)_15%,transparent)]'
                  : `border-border/30 bg-card/20 backdrop-blur-md ${isScrolling ? '' : 'hover:border-primary/30 hover:bg-card/40'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveProject(index)}
              onMouseLeave={() => !isScrolling && setActiveProject(null)}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className={`flex items-center gap-2.5 min-w-0 transition-colors duration-500 ${
                    isActive || isFeatured ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {createElement(IconComponent, { className: "size-5 shrink-0" })}
                  <p className="truncate text-xs font-medium uppercase tracking-widest">
                    {project.eyebrow}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-500 border ${
                    isActive || isFeatured
                      ? 'border-primary/30 bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                      : 'border-border/40 bg-card/40 text-muted-foreground'
                  }`}
                >
                  {project.stat}
                </Badge>
              </div>

              <h3 className="mt-6 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                {project.title}
              </h3>

              <p
                className={`mt-4 flex-1 text-sm font-light leading-relaxed transition-colors duration-500 sm:text-base sm:leading-8 ${
                  isActive || isFeatured ? 'text-foreground/90' : 'text-muted-foreground'
                }`}
              >
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8">
                {safeStack.map((item, itemIdx) => (
                  <Badge
                    key={`${item}-${itemIdx}`}
                    variant="outline"
                    className={`rounded-md px-3 py-1 text-xs font-light transition-colors duration-500 border ${
                      isActive || isFeatured
                        ? 'border-primary/30 bg-primary/5 text-primary'
                        : 'border-border/40 bg-card/30 text-muted-foreground'
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border/30 pt-5">
                <Button
                  asChild
                  variant={isActive || isFeatured ? 'default' : 'outline'}
                  size="lg"
                  className={`rounded-full font-medium shadow-none transition-all duration-500 sm:h-11 sm:px-6 ${
                    isActive || isFeatured 
                      ? 'hover:scale-[1.02] hover:shadow-[0_0_20px_0_color-mix(in_oklch,var(--primary)_40%,transparent)]' 
                      : 'border-border/50 bg-card/30 hover:bg-card/60'
                  }`}
                >
                  <a href={project.href || '#contact'} target={project.href?.startsWith('http') ? '_blank' : '_self'}>
                    {ctaText}
                    <ChevronRight className="ml-1.5 size-4" />
                  </a>
                </Button>
                
                <a 
                  href={project.href || '#contact'} 
                  target={project.href?.startsWith('http') ? '_blank' : '_self'}
                  aria-label={`Open ${project.title}`}
                  className="group-hover:scale-110 p-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-0"
                >
                  <ArrowUpRight 
                    className={`size-6 transition-colors duration-500 ${
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