export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="font-serif text-3xl leading-tight text-balance sm:text-4xl">{title}</h2>
      <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </div>
  )
}
