import type { Metadata } from 'next'
import { LogIn } from 'lucide-react'
import { ComingSoon } from '@/components/coming-soon'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <ComingSoon
      icon={LogIn}
      title="Student login"
      description="Sign-in, seller profiles and messaging will be enabled once the CampusCart backend is connected."
    />
  )
}
