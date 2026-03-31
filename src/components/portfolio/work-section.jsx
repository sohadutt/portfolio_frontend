import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { projects } from '@/data/portfolio'
import { SectionHeader } from '@/components/portfolio/section-header'

export function WorkSection() {
  return (
    <section id="projects" className="space-y-8">
      <SectionHeader
        eyebrow="Projects"
        title="Selected work from configuration systems to frontend delivery."
        description="These cards now reflect the projects and outcomes from your resume, with emphasis on secure configuration tooling, deployment reliability, and reusable UI work."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((project, index) => (
          <article
            key={project.title}
            className={`rounded-[2rem] border border-border/60 p-6 backdrop-blur ${
              index === 0 ? 'bg-primary text-primary-foreground' : 'bg-card/70'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.26em] ${
                  index === 0 ? 'text-primary-foreground/70' : 'text-primary'
                }`}
              >
                {project.eyebrow}
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                  index === 0
                    ? 'border-primary-foreground/20 bg-primary-foreground/8 text-primary-foreground'
                    : 'border-border/60 bg-background/80 text-muted-foreground'
                }`}
              >
                {project.stat}
              </span>
            </div>
            <h3 className="mt-6 font-serif text-3xl">{project.title}</h3>
            <p
              className={`mt-4 text-sm leading-7 ${
                index === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}
            >
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em] ${
                    index === 0
                      ? 'bg-primary-foreground/10 text-primary-foreground'
                      : 'border border-border/60 bg-background/70 text-muted-foreground'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant={index === 0 ? 'secondary' : 'outline'}
                className="rounded-full"
              >
                Explore
                <ChevronRight className="size-4" />
              </Button>
              <ArrowUpRight className={index === 0 ? 'text-primary-foreground/80' : 'text-primary'} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
