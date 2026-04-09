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
    <footer className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/50 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
      
      <p className="text-center sm:text-left tracking-wide">
        © {new Date().getFullYear()} {infoString}
      </p>
      
      {footerLinks.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
          {footerLinks.map((link, index) => (
            <a
              key={`${link.label || 'link'}-${index}`}
              href={link.href || '#'}
              target={link.href?.startsWith('http') ? '_blank' : '_self'}
              rel={link.href?.startsWith('http') ? 'noopener noreferrer' : ''}
              className={`transition-all font-medium hover:underline underline-offset-4 ${
                isScrolling ? '' : 'hover:text-foreground'
              }`}
            >
              {link.label || "Link"}
            </a>
          ))}
        </div>
      )}
      
    </footer>
  )
}