'use client'

import { useMemo } from 'react'

type BookingWidgetProps = {
  src?: string
  title?: string
}

export default function BookingWidget({ src, title = 'Book a Private Lesson' }: BookingWidgetProps) {
  const embedSrc = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_CAL_EMBED_URL
    return src || fromEnv || 'https://cal.com/joe-sanders/lesson?embed=true&hide_event_type_details=1'
  }, [src])

  return (
    <div className="w-full bg-joe-black/40 border border-joe-gold/20 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-joe-gold/20">
        <h3 className="text-joe-gold font-joe-heading text-xl">{title}</h3>
      </div>
      <div className="relative" style={{ minHeight: 700 }}>
        <iframe
          src={embedSrc}
          title={title}
          className="w-full h-[700px]"
          frameBorder={0}
          allow="camera; microphone; clipboard-read; clipboard-write"
        />
      </div>
    </div>
  )
}
