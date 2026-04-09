export function Footer({ data = {}, isScrolling }) {
  // Safely extract data from the API payload
  const personalInfo = data.personalInfo || {}
  
  const rawLinks = data.footerLinks || data.footer_links || []
  const footerLinks = Array.isArray(rawLinks) ? rawLinks : []

  return (
    <footer className="mx-auto mt-8 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/60 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
      <p>
        {personalInfo.name || "Your Name"} | {personalInfo.title || "Your Title"} | {personalInfo.location || "Your Location"}
      </p>
      
      <div className="flex flex-wrap items-center gap-4">
        {footerLinks.map((link, index) => (
          <a
            key={`${link.label || 'link'}-${index}`}
            href={link.href || '#'}
            target={link.href?.startsWith('http') ? '_blank' : '_self'}
            rel={link.href?.startsWith('http') ? 'noreferrer' : ''}
            className={`transition-colors font-medium ${isScrolling ? '' : 'hover:text-foreground'}`}
          >
            {link.label || "Link"}
          </a>
        ))}
      </div>
    </footer>
  )
}