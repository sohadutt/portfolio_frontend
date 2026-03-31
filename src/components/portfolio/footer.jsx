import { footerLinks, personalInfo } from '@/data/portfolio'

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
      <p>{personalInfo.name} | {personalInfo.title} | {personalInfo.location}</p>
      <div className="flex flex-wrap items-center gap-4">
        {footerLinks.map((link) => (
          <a key={link.label} href={link.href} className="transition-colors hover:text-foreground">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
