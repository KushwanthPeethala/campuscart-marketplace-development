export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-b border-border bg-mint">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-2">
          {eyebrow && <p className="text-sm font-semibold text-brand">{eyebrow}</p>}
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-pretty">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
