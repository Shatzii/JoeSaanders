/**
 * Putter Adapter - Event listener utility for Phone-as-Putter strokes
 * 
 * This adapter allows games to easily integrate with the Phone-as-Putter
 * system by listening for custom 'putter-stroke' events.
 * 
 * Usage:
 * ```typescript
 * import { installPutterAdapter } from '@/lib/putter-adapter'
 * 
 * const cleanup = installPutterAdapter((stroke) => {
 *   console.log('Stroke detected:', stroke)
 *   // Use stroke.power (0-1) for distance
 *   // Use stroke.aim (degrees) for direction
 *   // Use stroke.faceAngle for spin/hook/slice
 * })
 * 
 * // When component unmounts:
 * cleanup()
 * ```
 */

export interface PutterStroke {
  /** Power of the stroke (0-1 normalized) */
  power: number
  
  /** Aim in degrees relative to neutral (-180 to 180) */
  aim: number
  
  /** Face angle from device roll (affects spin) */
  faceAngle: number
  
  /** Timestamp of the stroke */
  timestamp: number
}

export type PutterStrokeHandler = (stroke: PutterStroke) => void

/**
 * Install the putter adapter to listen for strokes
 * @param onStroke - Callback function when a stroke is detected
 * @returns Cleanup function to remove the listener
 */
export function installPutterAdapter(onStroke: PutterStrokeHandler): () => void {
  const handleStroke = (event: Event) => {
    const customEvent = event as CustomEvent<PutterStroke>
    if (customEvent.detail) {
      onStroke(customEvent.detail)
    }
  }

  window.addEventListener('putter-stroke', handleStroke)

  // Return cleanup function
  return () => {
    window.removeEventListener('putter-stroke', handleStroke)
  }
}

/**
 * Map stroke data to golf shot parameters
 * Provides common conversions for game integration
 */
export const putterMapping = {
  /**
   * Convert power (0-1) to distance in yards
   * @param power - Normalized power (0-1)
   * @param maxDistance - Maximum putter distance in yards (default 50)
   */
  powerToDistance(power: number, maxDistance: number = 50): number {
    // Use quadratic curve for more realistic distance mapping
    return Math.pow(power, 1.5) * maxDistance
  },

  /**
   * Convert aim angle to direction vector
   * @param aim - Aim in degrees (-180 to 180)
   * @returns {x, y} unit vector
   */
  aimToVector(aim: number): { x: number; y: number } {
    const radians = (aim * Math.PI) / 180
    return {
      x: Math.cos(radians),
      y: Math.sin(radians),
    }
  },

  /**
   * Calculate spin amount from face angle
   * @param faceAngle - Face angle from device roll
   * @returns Spin amount (-1 to 1, negative = draw, positive = fade)
   */
  faceAngleToSpin(faceAngle: number): number {
    // Normalize face angle to -1 to 1 range
    // Typical phone roll range is -90 to 90 degrees
    return Math.max(-1, Math.min(1, faceAngle / 45))
  },

  /**
   * Get stroke quality rating
   * @param stroke - The stroke data
   * @returns Quality rating: 'perfect' | 'good' | 'fair' | 'poor'
   */
  getStrokeQuality(stroke: PutterStroke): 'perfect' | 'good' | 'fair' | 'poor' {
    // Perfect: straight aim, controlled power
    if (Math.abs(stroke.aim) < 5 && stroke.power >= 0.3 && stroke.power <= 0.8) {
      return 'perfect'
    }
    // Good: mostly straight, decent power
    if (Math.abs(stroke.aim) < 15 && stroke.power >= 0.2 && stroke.power <= 0.9) {
      return 'good'
    }
    // Fair: some deviation
    if (Math.abs(stroke.aim) < 30 && stroke.power >= 0.1) {
      return 'fair'
    }
    return 'poor'
  },
}

/**
 * React hook for using the putter adapter
 * @param onStroke - Callback when stroke is detected
 */
export function usePutterAdapter(onStroke: PutterStrokeHandler) {
  if (typeof window === 'undefined') return

  // Install on mount, cleanup on unmount
  const cleanup = installPutterAdapter(onStroke)
  
  // For React, you'd use useEffect:
  // useEffect(() => {
  //   return installPutterAdapter(onStroke)
  // }, [onStroke])

  return cleanup
}
