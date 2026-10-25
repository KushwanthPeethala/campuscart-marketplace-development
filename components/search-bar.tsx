'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  defaultValue?: string
  size?: 'default' | 'lg'
  className?: string
  /** Called instead of navigating when provided (e.g. on the explore page). */
  onSearch?: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  defaultValue = '',
  size = 'default',
  className,
  onSearch,
  placeholder = 'Search textbooks, calculators, lab coats…',
}: SearchBarProps) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)

  function submit(next: string) {
    const term = next.trim()
    if (onSearch) {
      onSearch(term)
      return
    }
    router.push(term ? `/explore?q=${encodeURIComponent(term)}` : '/explore')
  }

  const lg = size === 'lg'

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        submit(value)
      }}
      className={cn(
        'flex items-center gap-2 rounded-full border border-border bg-card shadow-sm transition-shadow focus-within:border-brand focus-within:ring-3 focus-within:ring-ring/25',
        lg ? 'p-1.5 pl-5' : 'p-1 pl-4',
        className,
      )}
    >
      <Search
        className={cn('shrink-0 text-muted-foreground', lg ? 'size-5' : 'size-4')}
        aria-hidden="true"
      />
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden',
          lg ? 'h-11 text-base' : 'h-9 text-sm',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('')
            if (onSearch) onSearch('')
          }}
          aria-label="Clear search"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-mint hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          'shrink-0 rounded-full bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
          lg ? 'h-11 px-6 text-sm' : 'h-9 px-4 text-sm',
        )}
      >
        Search
      </button>
    </form>
  )
}
