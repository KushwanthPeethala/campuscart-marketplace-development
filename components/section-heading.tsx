import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  action?: { href: string; label: string }
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center'
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('flex max-w-2xl flex-col gap-2', align === 'center' && 'items-center')}>
        {eyebrow && (
          <p className="text-sm font-semibold text-brand">{eyebrow}</p>
        )}
        <h2
          id={id}
          className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl"
        >
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-pretty">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg text-sm font-semibold text-primary hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
