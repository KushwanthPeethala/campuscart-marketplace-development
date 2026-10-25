import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-mint text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(buttonVariants(), 'mt-2 h-11 rounded-full px-5')}
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
