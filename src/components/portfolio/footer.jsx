import { getFooterLinks, getPortfolioPersonalInfo } from '@/helper/portfolio-data'

export function Footer({ data, isScrolling }) {
  const personalInfo = getPortfolioPersonalInfo(data)
  const footerLinks = getFooterLinks(data)

  return (
    <footer className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/60 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
      <p>{personalInfo.name} | {personalInfo.title} | {personalInfo.location}</p>
      <div className="flex flex-wrap items-center gap-4">
        {footerLinks.map((link) => (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href || '#'}
            className={`transition-colors ${isScrolling ? '' : 'hover:text-foreground'}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
