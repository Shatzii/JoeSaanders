'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Gamepad2, Wifi, WifiOff, Activity, Target, TrendingUp, Smartphone, QrCode } from 'lucide-react'
import Link from 'next/link'

let socket: Socket

interface StrokeData {
  power: number
  aim: number
  faceAngle: number
  timestamp: number
}

export default function GamePage() {
  const [room, setRoom] = useState('stones-default')
  const [connected, setConnected] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const neutralRef = useRef(0)
  const bufferRef = useRef<any[]>([])
  const [debug, setDebug] = useState({ power: 0, aim: 0, lastStroke: 0, samples: 0 })
  const [strokes, setStrokes] = useState<StrokeData[]>([])
  
  const THRESH_ANG_VEL = 8 // Threshold for stroke detection (deg/s)
  const BUFFER_MS = 300 // Keep recent samples in ms
  const lastStrokeTimeRef = useRef(0)

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io({
        path: '/api/socket',
      })

      socket.on('connect', () => {
        console.log('✅ Connected to server')
        setConnected(true)
        socket.emit('join-room', room)
      })

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server')
        setConnected(false)
      })

      socket.on('room-joined', (roomName: string) => {
        console.log('🎮 Joined game room:', roomName)
      })
    }

    // Warm up the socket server
    fetch('/api/socket').catch(() => {})

    return () => {
      if (socket && socket.connected) {
        socket.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    // Re-join room if room ID changes
    socket.emit('join-room', room)

    // Listen for calibration from controller
    socket.on('calibrate', (payload: { neutral?: number }) => {
      neutralRef.current = payload.neutral ?? 0
      console.log('🎯 Calibrated neutral yaw:', neutralRef.current)
    })

    // Listen for IMU samples from controller
    socket.on('imu', (sample: any) => {
      const now = sample.t ?? Date.now()
      const short = {
        t: now,
        alpha: sample.alpha ?? 0,
        beta: sample.beta ?? 0,
        gamma: sample.gamma ?? 0,
        ax: sample.ax ?? 0,
        ay: sample.ay ?? 0,
        az: sample.az ?? 0,
      }

      bufferRef.current.push(short)

      // Trim buffer to recent samples only
      const cutoff = Date.now() - BUFFER_MS
      bufferRef.current = bufferRef.current.filter((s) => s.t >= cutoff)

      setDebug((d) => ({ ...d, samples: bufferRef.current.length }))

      // Try to detect stroke
      detectStroke()
    })

    return () => {
      socket.off('calibrate')
      socket.off('imu')
    }
  }, [room])

  const detectStroke = () => {
    const buf = bufferRef.current
    if (buf.length < 3) return

    // Prevent double-detection within 500ms
    const now = Date.now()
    if (now - lastStrokeTimeRef.current < 500) return

    // Compute angular velocity on alpha (yaw)
    const last = buf[buf.length - 1]
    const prev = buf[buf.length - 2]
    const dAlpha = smallestAngleDiff(last.alpha, prev.alpha)
    const dt = (last.t - prev.t) / 1000 // seconds
    const angVel = Math.abs(dAlpha / (dt || 0.016)) // deg/sec

    // Map angular velocity to power (0-1)
    const rawPower = Math.min(1, angVel / 500) // Adjust divisor to tune sensitivity
    const aim = normalizeAngle(last.alpha - neutralRef.current)

    // Detect stroke: angular velocity crosses threshold
    const window = buf.slice(-5)
    let maxVel = 0
    const crossed = window.some((s, i) => {
      if (i === 0) return false
      const av = Math.abs(
        smallestAngleDiff(window[i].alpha, window[i - 1].alpha) /
          ((s.t - window[i - 1].t) / 1000 || 0.016)
      )
      maxVel = Math.max(maxVel, av)
      return av >= THRESH_ANG_VEL
    })

    if (crossed && rawPower > 0.1) {
      // Valid stroke detected!
      const stroke: StrokeData = {
        power: clamp(rawPower, 0, 1),
        aim, // degrees relative to neutral
        faceAngle: last.gamma || 0, // roll as face angle
        timestamp: Date.now(),
      }

      announceStroke(stroke)
      bufferRef.current = [] // Clear buffer to prevent double-detection
      lastStrokeTimeRef.current = now

      setDebug({
        power: Math.round(stroke.power * 100) / 100,
        aim: Math.round(stroke.aim),
        lastStroke: now,
        samples: 0,
      })

      setStrokes((prev) => [...prev.slice(-4), stroke])
    }
  }

  const announceStroke = (stroke: StrokeData) => {
    // 1. Dispatch custom event for games to listen to
    window.dispatchEvent(
      new CustomEvent('putter-stroke', {
        detail: stroke,
      })
    )

    // 2. Try to inject mouse events into game canvas
    tryInjectMouse(stroke)

    console.log('⛳ Stroke detected:', stroke)
  }

  const tryInjectMouse = (stroke: StrokeData) => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Simulate mouse drag based on power
    const moveX = centerX + stroke.power * 200 * Math.cos((stroke.aim * Math.PI) / 180)
    const moveY = centerY + stroke.power * 200 * Math.sin((stroke.aim * Math.PI) / 180)

    const down = new MouseEvent('mousedown', { clientX: centerX, clientY: centerY, bubbles: true })
    const move = new MouseEvent('mousemove', { clientX: moveX, clientY: moveY, bubbles: true })
    const up = new MouseEvent('mouseup', { clientX: moveX, clientY: moveY, bubbles: true })

    canvas.dispatchEvent(down)
    setTimeout(() => canvas.dispatchEvent(move), 10)
    setTimeout(() => canvas.dispatchEvent(up), 20)
  }

  const getControllerUrl = () => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/controller`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-joe-gold" />
            <h1 className="text-4xl md:text-5xl font-joe-heading font-bold text-joe-gold">
              Phone-as-Putter Golf
            </h1>
          </div>
          <p className="text-xl text-joe-white font-joe-body mb-4">
            The world's first real putter golf game - powered by your phone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Connection Panel */}
          <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-joe-heading font-semibold text-joe-gold">Connection</h2>
              {connected ? (
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-joe-accent text-sm">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-joe-accent text-sm">Offline</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-joe-stone font-joe-accent mb-2 text-sm">Room ID:</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 bg-joe-stone/10 border border-joe-gold/30 rounded text-joe-white font-joe-body text-sm focus:outline-none focus:border-joe-gold"
              />
            </div>

            <div className="space-y-2">
              <Link
                href="/controller"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-joe-gold/20 hover:bg-joe-gold/30 text-joe-gold border border-joe-gold/40 px-4 py-2 rounded font-joe-accent font-semibold transition-colors text-sm"
              >
                <Smartphone className="w-4 h-4" />
                Open Controller
              </Link>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center gap-2 w-full bg-joe-stone/20 hover:bg-joe-stone/30 text-joe-white border border-joe-stone/40 px-4 py-2 rounded font-joe-accent transition-colors text-sm"
              >
                <QrCode className="w-4 h-4" />
                Show QR Code
              </button>
            </div>

            {showQR && (
              <div className="mt-4 p-3 bg-white rounded text-center">
                <div className="text-xs text-gray-600 mb-2">Scan to open controller:</div>
                <div className="text-xs font-mono break-all text-gray-800">{getControllerUrl()}</div>
              </div>
            )}
          </div>

          {/* Stroke Stats */}
          <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-joe-gold" />
              <h2 className="text-xl font-joe-heading font-semibold text-joe-gold">Last Stroke</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-joe-stone font-joe-accent mb-1">Power</div>
                <div className="text-3xl font-joe-heading font-bold text-joe-white">
                  {(debug.power * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-joe-stone font-joe-accent mb-1">Aim</div>
                <div className="text-3xl font-joe-heading font-bold text-joe-white">
                  {debug.aim}°
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-joe-gold/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-joe-stone font-joe-accent">Samples buffered:</span>
                <span className="text-joe-white font-semibold">{debug.samples}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-joe-stone font-joe-accent">Total strokes:</span>
                <span className="text-joe-white font-semibold">{strokes.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Strokes */}
          <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-joe-gold" />
              <h2 className="text-xl font-joe-heading font-semibold text-joe-gold">Recent Strokes</h2>
            </div>

            <div className="space-y-2">
              {strokes.length === 0 ? (
                <div className="text-center text-joe-stone/70 font-joe-body text-sm py-4">
                  Waiting for strokes...
                </div>
              ) : (
                strokes.slice(-5).reverse().map((stroke, i) => (
                  <div key={i} className="bg-joe-stone/10 rounded p-3 border border-joe-gold/10">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div>
                          <div className="text-xs text-joe-stone font-joe-accent">Power</div>
                          <div className="text-lg font-joe-heading font-bold text-joe-gold">
                            {(stroke.power * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-joe-stone font-joe-accent">Aim</div>
                          <div className="text-lg font-joe-heading font-bold text-joe-white">
                            {stroke.aim.toFixed(0)}°
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-joe-stone/70">
                        {new Date(stroke.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="bg-joe-black/50 rounded-lg p-8 border border-joe-gold/20">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-joe-gold" />
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold">Game Area</h2>
          </div>

          <div
            id="game-canvas"
            className="w-full aspect-video bg-gradient-to-br from-green-900/20 to-green-700/20 rounded-lg border-2 border-joe-gold/30 flex items-center justify-center relative overflow-hidden"
          >
            {/* Placeholder game - replace with actual golf game */}
            <div className="text-center">
              <div className="text-6xl mb-4">⛳</div>
              <div className="text-2xl font-joe-heading font-bold text-joe-gold mb-2">
                Golf Game Coming Soon
              </div>
              <div className="text-joe-white/80 font-joe-body">
                The putter controller is ready - we're building the perfect golf game for it!
              </div>
              <div className="mt-6 text-sm text-joe-stone/70">
                Meanwhile, try making strokes with your phone controller and watch the stats update above
              </div>
            </div>

            {/* Visual feedback for strokes */}
            {strokes.length > 0 && (
              <div className="absolute top-4 right-4 bg-joe-black/80 border border-joe-gold/40 rounded-lg px-4 py-2">
                <div className="text-sm text-joe-gold font-joe-accent">
                  ⛳ Last stroke: {(debug.power * 100).toFixed(0)}% power, {debug.aim}° aim
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-6">
          <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-4">
            🏌️ How to Play
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-joe-accent font-semibold text-joe-white mb-2">Setup:</h4>
              <ol className="space-y-2 text-joe-white/90 font-joe-body text-sm">
                <li className="flex gap-2">
                  <span className="text-joe-gold font-bold">1.</span>
                  <span>Open controller page on your phone (click button above or scan QR)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold font-bold">2.</span>
                  <span>Enter the same Room ID on both devices</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold font-bold">3.</span>
                  <span>Grant motion sensor permissions (iOS will ask)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold font-bold">4.</span>
                  <span>Hold phone like a putter grip and tap Calibrate</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-joe-accent font-semibold text-joe-white mb-2">Playing:</h4>
              <ul className="space-y-2 text-joe-white/90 font-joe-body text-sm">
                <li className="flex gap-2">
                  <span className="text-joe-gold">•</span>
                  <span>Make natural putting strokes with your phone</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold">•</span>
                  <span>Power is controlled by swing speed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold">•</span>
                  <span>Aim is controlled by the angle of your stroke</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-joe-gold">•</span>
                  <span>Watch stats update in real-time above</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Helper functions */
function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

function normalizeAngle(a: number) {
  // Normalize to -180..180
  let x = ((a + 180) % 360 + 360) % 360 - 180
  return x
}

function smallestAngleDiff(a: number, b: number) {
  // Returns difference a-b in degrees (-180..180)
  const diff = normalizeAngle(a - b)
  return diff
}
