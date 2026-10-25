import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FileText } from 'lucide-react'
import { ComingSoon } from '@/components/coming-soon'

const pages: Record<string, string> = {
  about: 'About CampusCart',
  contact: 'Contact us',
  help: 'Help Center',
  safety: 'Safety Guidelines',
  terms: 'Terms of Use',
  privacy: 'Privacy Policy',
}

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: pages[slug] ?? 'Not found' }
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params
  const title = pages[slug]
  if (!title) notFound()

  return (
    <ComingSoon
      icon={FileText}
      title={title}
      description="This page is being written and will be published alongside the next release of CampusCart."
    />
  )
}
