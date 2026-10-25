'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Heart, Menu, Plus, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/layout/logo'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/sell', label: 'Sell an Item' },
]

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const { count } = useWishlist()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                      active
                        ? 'bg-mint text-primary'
                        : 'text-muted-foreground hover:bg-mint hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-lg' }),
              'relative rounded-full',
            )}
            aria-label={`Wishlist, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <Heart className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] leading-5 font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'hidden h-10 rounded-full px-4 sm:inline-flex',
            )}
          >
            Login
          </Link>
          <Link
            href="/sell"
            className={cn(
              buttonVariants(),
              'hidden h-10 rounded-full px-4 shadow-sm hover:bg-primary/90 sm:inline-flex',
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            Sell Item
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-lg' }),
              'rounded-full lg:hidden',
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="animate-in fade-in slide-in-from-top-2 border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-3 py-3 text-base font-medium focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                      active ? 'bg-mint text-primary' : 'text-foreground hover:bg-mint',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <li className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: 'outline' }), 'h-11 rounded-full')}
              >
                Login
              </Link>
              <Link href="/sell" className={cn(buttonVariants(), 'h-11 rounded-full')}>
                <Plus className="size-4" aria-hidden="true" />
                Sell Item
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
