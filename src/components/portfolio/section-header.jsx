export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-5 sm:space-y-6">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent animate-gradient">
          {eyebrow}
        </p>
      )}

      <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight text-foreground">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg font-light leading-[1.8] text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}