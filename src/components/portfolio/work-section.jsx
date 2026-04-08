import { useState } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/portfolio/section-header'
import { getProjects } from '@/helper/portfolio-data'

const portfolioBuilderProject = {
  title: 'Portfolio Builder',
  eyebrow: 'Launch your own',
  description:
    'This portfolio is powered by the builder behind it, with a dashboard for editing projects, experience, links, themes, and public portfolio variations.',
  stack: ['React', 'Vite', 'Dashboard CMS'],
  stat: 'Live builder',
  href: '/login?mode=signup&source=portfolio-builder',
  ctaLabel: 'Make yours now',
}

export function WorkSection({ data, isScrolling, isDefaultPortfolio = false }) {
  const [activeProject, setActiveProject] = useState(null)
  const resolvedProject = activeProject
  const projects = isDefaultPortfolio
    ? [...getProjects(data), portfolioBuilderProject]
    : getProjects(data)

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
              className={`group rounded-[2rem] border p-6 transition-all duration-300 ${
                isActive || isFeatured
                  ? 'border-primary/30 bg-primary/6 shadow-sm'
                  : `border-border/60 bg-background/95 ${isScrolling ? '' : 'hover:border-primary/20 hover:bg-muted/40'}`
              }`}
              onMouseEnter={() => !isScrolling && setActiveProject(index)}
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive || isFeatured ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {project.eyebrow}
                </p>

                <Badge
                  variant="secondary"
                  className={`rounded-full px-3 py-1 font-medium transition-colors duration-300 ${
                    isActive || isFeatured
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'text-muted-foreground'
                  }`}
                >
                  {project.stat}
                </Badge>
              </div>

              <h3 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
                {project.title}
              </h3>

              <p
                className={`mt-4 text-sm leading-7 transition-colors duration-300 ${
                  isActive || isFeatured ? 'text-foreground/85' : 'text-muted-foreground'
                }`}
              >
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className={`rounded-full px-3 py-1 font-medium transition-colors duration-300 ${
                      isActive || isFeatured
                        ? 'border-primary/20 bg-background text-foreground'
                        : 'border-border/60 bg-background text-muted-foreground'
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  asChild
                  variant={isActive || isFeatured ? 'secondary' : 'outline'}
                  className="rounded-full font-medium shadow-none transition-all duration-300"
                >
                  <a href={project.href || '#contact'}>
                    {project.ctaLabel || 'Explore'}
                    <ChevronRight className="ml-1 size-4" />
                  </a>
                </Button>
                <a href={project.href || '#contact'} aria-label={`Open ${project.title}`}>
                  <ArrowUpRight 
                    className={`transition-all duration-300 ${
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
