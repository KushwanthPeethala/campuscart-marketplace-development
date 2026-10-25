import {
  Backpack,
  BookOpen,
  Cpu,
  FlaskConical,
  PencilRuler,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import type { CategorySlug } from '@/lib/types'

const icons: Record<CategorySlug, LucideIcon> = {
  books: BookOpen,
  electronics: Cpu,
  essentials: Backpack,
  lab: FlaskConical,
  stationery: PencilRuler,
  sports: Trophy,
}

export function CategoryIcon({
  slug,
  className,
}: {
  slug: CategorySlug
  className?: string
}) {
  const Icon = icons[slug]
  return <Icon className={className} aria-hidden="true" />
}
