import { useState } from 'react'
import { contactMethods, personalInfo } from '@/data/portfolio'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/portfolio/section-header'

export function ContactSection({ isScrolling }) {
  const [activeMethod, setActiveMethod] = useState(null)
  const resolvedMethod = activeMethod

  return (
    <section id="contact" className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[2rem] border border-border/60 bg-primary p-8 text-primary-foreground shadow-[0_30px_80px_-40px_rgba(225,98,54,0.9)]">
        <SectionHeader
          eyebrow="Contact"
          title="Open to roles and collaborations where backend reliability meets strong product thinking."
          description="Reach out for backend automation, Django and API work, or frontend implementation with React and Tailwind CSS."
        />
        <div className="mt-8 space-y-3">
          {contactMethods.map(({ label, value, href, icon }) => {
            const Icon = icon
            const isActive = resolvedMethod === label

            return (
              <a
                key={label}
                href={href}
                className={`flex items-center justify-between rounded-[1.4rem] border px-5 py-4 ${
                  isActive
                    ? 'border-primary-foreground/35 bg-primary-foreground/18 shadow-[0_18px_55px_-35px_rgba(255,255,255,0.55)]'
                    : `border-primary-foreground/15 bg-primary-foreground/8 ${isScrolling ? '' : 'hover:-translate-y-0.5 hover:bg-primary-foreground/12'}`
                }`}
                onMouseEnter={() => !isScrolling && setActiveMethod(label)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary-foreground/12">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
      <div className={`rounded-[2rem] border border-border/60 bg-card/75 p-8 backdrop-blur ${isScrolling ? '' : 'hover:border-primary/35 hover:bg-primary/5'}`}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Name</span>
            <input
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder={personalInfo.name}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder={personalInfo.email}
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Project type</span>
            <select className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20">
              <option>Backend automation</option>
              <option>Django or API development</option>
              <option>Frontend implementation</option>
            </select>
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium">Project notes</span>
            <textarea
              rows="6"
              className="w-full rounded-[1.5rem] border border-border bg-background px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Share the role, product, or workflow problem you want help with."
            />
          </label>
        </div>
        <div className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border/60 bg-background/70 px-4 py-4 ${isScrolling ? '' : 'hover:border-primary/35 hover:bg-primary/6'}`}>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-muted p-1">
              <span className="size-5 rounded-full bg-primary transition-transform duration-300" />
            </span>
            Available for backend and frontend work
          </label>
          <Button asChild className="rounded-full px-6">
            <a href={`mailto:${personalInfo.email}`}>Start a conversation</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
