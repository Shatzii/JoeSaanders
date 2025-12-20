'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
  eager?: boolean
}

/**
 * Optimized image component with:
 * - Automatic WebP/AVIF format selection
 * - Responsive srcsets
 * - Lazy loading by default
 * - Error fallback
 * - Blur placeholder for better UX
 */
export default function OptimizedImage({
  src,
  fallbackSrc,
  alt,
  eager = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  // SVG images should not be optimized
  const isSvg = imgSrc.endsWith('.svg')

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={eager ? 'eager' : 'lazy'}
      unoptimized={isSvg}
      quality={isSvg ? 100 : 85}
      placeholder={!isSvg && props.width && props.height ? 'blur' : 'empty'}
      blurDataURL={
        !isSvg && props.width && props.height
          ? `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWUiLz48L3N2Zz4=`
          : undefined
      }
      {...props}
    />
  )
}
