'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSrc?: string
}

export default function SponsorLogo({ src, alt, width, height, className, fallbackSrc }: Props) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      console.log(`[SponsorLogo] Fallback for ${alt}: ${fallbackSrc}`)
      setImgSrc(fallbackSrc)
      setHasError(false)
    } else if (!hasError) {
      console.warn(`[SponsorLogo] Failed to load: ${imgSrc}`)
      setHasError(true)
    }
  }

  // If all images failed, show text fallback
  if (hasError && imgSrc === fallbackSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-joe-stone to-joe-black border border-joe-gold/20 rounded ${className}`}
        style={{ width, height }}
      >
        <span className="text-joe-gold font-joe-accent font-semibold text-sm text-center px-2">
          {alt}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={false}
    />
  )
}
