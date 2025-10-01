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

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
}
