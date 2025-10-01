'use client'

import dynamic from 'next/dynamic'

const TutorInteractive = dynamic(() => import('@/components/TutorInteractive'), { ssr: false })

export default function TutorInteractiveWrapper() {
  return <TutorInteractive />
}
