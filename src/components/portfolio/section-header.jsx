export function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary/85">
          {eyebrow}
        </p>
      )}

      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-balance sm:text-[2.45rem]">
        {title}
      </h2>

      {description && (
        <p className="text-[15px] leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
