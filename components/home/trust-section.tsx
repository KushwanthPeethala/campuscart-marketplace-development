import Link from 'next/link'
import { BadgeCheck, Flag, MapPin, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const points = [
  {
    icon: BadgeCheck,
    title: 'Students-only community',
    body: 'Listings come from students, so you deal with people on your own or nearby campuses.',
  },
  {
    icon: MapPin,
    title: 'Meet on campus',
    body: 'Exchange items in well-lit public spaces like the library, canteen or main gate.',
  },
  {
    icon: ShieldCheck,
    title: 'Check before you pay',
    body: 'Inspect the item in person and pay only when you are happy with its condition.',
  },
  {
    icon: Flag,
    title: 'Report anything suspicious',
    body: 'Flag a listing or user and our team will review it promptly.',
  },
]

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:p-14">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-mint/80">Trust &amp; safety</p>
          <h2
            id="trust-title"
            className="text-2xl font-bold tracking-tight text-balance sm:text-3xl"
          >
            Safe, simple trades between students
          </h2>
          <p className="leading-relaxed text-white/75 text-pretty">
            CampusCart keeps things local and transparent, so every exchange
            feels like trading with a classmate.
          </p>
          <Link
            href="/info/safety"
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'mt-2 h-11 w-fit rounded-full bg-white px-5 text-primary hover:bg-mint',
            )}
          >
            Read safety guidelines
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p.title} className="flex flex-col gap-3 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
              <p.icon className="size-6 text-mint" aria-hidden="true" />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
