export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="text-base font-light leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
    </div>
  )
}