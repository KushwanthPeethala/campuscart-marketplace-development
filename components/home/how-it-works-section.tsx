import { Camera, Handshake, MessageCircle, Search } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const steps = [
  {
    icon: Camera,
    title: 'List your item',
    body: 'Snap a few photos, set a fair price and pick the condition. It takes under two minutes.',
  },
  {
    icon: Search,
    title: 'Students discover it',
    body: 'Buyers on your campus find it by searching or browsing categories.',
  },
  {
    icon: MessageCircle,
    title: 'Connect and agree',
    body: 'Chat with the seller, ask questions and agree on a price that works for both.',
  },
  {
    icon: Handshake,
    title: 'Meet and exchange',
    body: 'Meet in a public spot on campus, check the item and complete the exchange.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
    >
      <SectionHeading
        id="how-title"
        eyebrow="How it works"
        title="From listing to handover in four steps"
        align="center"
      />
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-mint text-primary">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-brand/50" aria-hidden="true">
                0{i + 1}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
