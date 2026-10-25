import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { categories } from '@/lib/mock-data/categories'

const companyLinks = [
  { href: '/info/about', label: 'About' },
  { href: '/info/contact', label: 'Contact' },
  { href: '/info/help', label: 'Help Center' },
  { href: '/info/safety', label: 'Safety Guidelines' },
]

const legalLinks = [
  { href: '/info/terms', label: 'Terms' },
  { href: '/info/privacy', label: 'Privacy' },
]

const socialLinks = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { href: 'https://x.com', label: 'X' },
]

const linkClass =
  'rounded text-sm text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo inverted />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              The campus marketplace for students across India. Buy smart,
              sell what you don&apos;t need and keep essentials in use.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Social media">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center rounded-full border border-white/20 px-3.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Categories">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/explore?category=${c.slug}`} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="CampusCart">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} CampusCart. Made for students in India.</p>
          <p>Always meet in public campus spaces when exchanging items.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </div>
  )
}
