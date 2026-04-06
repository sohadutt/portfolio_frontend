export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-4">
      {/* Eyebrow */}
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">
          {eyebrow}
        </p>
      )}
      
      {/* shadcn Typography: H2 */}
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      
      {/* shadcn Typography: Muted/Lead */}
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}