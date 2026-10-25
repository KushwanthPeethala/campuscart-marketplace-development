import type { ProductCondition } from '@/lib/types'
import { cn } from '@/lib/utils'

const styles: Record<ProductCondition, string> = {
  'Like New': 'bg-primary text-primary-foreground',
  Good: 'bg-white text-primary ring-1 ring-primary/20',
  Used: 'bg-white text-muted-foreground ring-1 ring-border',
}

export function ConditionBadge({
  condition,
  className,
}: {
  condition: ProductCondition
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        styles[condition],
        className,
      )}
    >
      {condition}
    </span>
  )
}
