'use client'

import { useEffect, useRef, useState } from 'react'

export default function SwingCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
  async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setIsReady(true)
        }
      } catch {
        setError('Camera access denied or unavailable.')
      }
    }
    init()
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 640
    const h = video.videoHeight || 360
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0, w, h)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative bg-black rounded-lg overflow-hidden">
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-joe-gold">Initializing camera…</div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400">{error}</div>
        )}
        <video ref={videoRef} className="w-full h-auto opacity-95" playsInline muted />
        {/* Simple center overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-joe-gold/60 rounded-full" />
        </div>
        <div className="p-2">
          <button onClick={captureFrame} className="mt-2 px-3 py-2 rounded bg-joe-gold text-joe-black font-semibold hover:bg-amber-400">
            Capture Frame
          </button>
        </div>
      </div>
      <div className="bg-black/40 border border-joe-gold/20 rounded-lg p-2">
        <canvas ref={canvasRef} className="w-full h-auto" />
        <p className="text-xs text-joe-white/60 mt-2">Captured frame preview</p>
      </div>
    </div>
  )
}
