import type { Metadata } from 'next'
import { Tag } from 'lucide-react'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = { title: 'Sell an Item' }

export default function SellPage() {
  return (
    <ComingSoon
      icon={Tag}
      title="Sell an item"
      description="Listing your textbooks, gadgets and essentials is arriving in the next phase, together with student accounts."
    />
  )
}
