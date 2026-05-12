import { createElement } from 'react'
import { resolveIcon } from '@/helper/functions'

export function Footer({ data = {}, isScrolling }) {
  const personalInfo = data.personalInfo || data.personal_info || {}
  
  const rawLinks = data.footerLinks || data.footer_links || []
  const footerLinks = Array.isArray(rawLinks) ? rawLinks : []

  const infoParts = [
    personalInfo.name,
    personalInfo.title,
    personalInfo.location
  ].filter(Boolean)
  
  const infoString = infoParts.length > 0 ? infoParts.join(" • ") : "Portfolio"

  return (
    <footer className="relative z-10 mx-auto mt-12 flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t border-border/30 px-4 py-10 sm:mt-16 sm:flex-row sm:px-6 lg:px-8">
      
      <p className="text-center text-sm font-light tracking-wide text-muted-foreground sm:text-left">
        © {new Date().getFullYear()} {infoString}
      </p>
      
      {footerLinks.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
          {footerLinks.map((link, index) => {
            const IconComponent = link.icon || link.icon_name ? resolveIcon(link.icon || link.icon_name) : null

            return (
              <a
                key={`${link.label || 'link'}-${index}`}
                href={link.href || '#'}
                target={link.href?.startsWith('http') ? '_blank' : '_self'}
                rel={link.href?.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`group flex items-center gap-2 text-sm font-light tracking-wide transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolling ? 'text-muted-foreground' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {IconComponent && createElement(IconComponent, { className: "size-4 opacity-70 transition-opacity duration-500 group-hover:opacity-100" })}
                {link.label || "Link"}
              </a>
            )
          })}
        </div>
      )}
      
    </footer>
  )
}