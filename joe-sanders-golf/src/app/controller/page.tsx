'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Smartphone, Wifi, WifiOff, Crosshair, Info } from 'lucide-react'

let socket: Socket

export default function ControllerPage() {
  const [connected, setConnected] = useState(false)
  const [room, setRoom] = useState('stones-default')
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)
  const neutralRef = useRef(0)
  const lastSampleRef = useRef<any>(null)
  const [debug, setDebug] = useState({ alpha: 0, accel: 0, streaming: false })

  useEffect(() => {
    // Check if we need permission (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsPermission(true)
    } else {
      setPermissionGranted(true)
    }

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
        console.log('📱 Joined room:', roomName)
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
    if (!permissionGranted) return

    let orientationHandler: any
    let motionHandler: any

    const setupSensors = () => {
      orientationHandler = (e: DeviceOrientationEvent) => {
        const alpha = e.alpha ?? 0 // yaw (0-360)
        const beta = e.beta ?? 0   // pitch (-180 to 180)
        const gamma = e.gamma ?? 0  // roll (-90 to 90)

        lastSampleRef.current = lastSampleRef.current || {}
        lastSampleRef.current.alpha = alpha
        lastSampleRef.current.beta = beta
        lastSampleRef.current.gamma = gamma

        setDebug((d) => ({ ...d, alpha: Math.round(alpha), streaming: true }))
        emitSample()
      }

      motionHandler = (e: DeviceMotionEvent) => {
        const a = e.accelerationIncludingGravity || e.acceleration || { x: 0, y: 0, z: 0 }
        lastSampleRef.current = lastSampleRef.current || {}
        lastSampleRef.current.ax = a.x || 0
        lastSampleRef.current.ay = a.y || 0
        lastSampleRef.current.az = a.z || 0

        const accel = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
        setDebug((d) => ({ ...d, accel: Math.round(accel * 10) / 10 }))
        emitSample()
      }

      window.addEventListener('deviceorientation', orientationHandler)
      window.addEventListener('devicemotion', motionHandler)
    }

    setupSensors()

    return () => {
      if (orientationHandler) window.removeEventListener('deviceorientation', orientationHandler)
      if (motionHandler) window.removeEventListener('devicemotion', motionHandler)
    }
  }, [permissionGranted, room])

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission()
        if (response === 'granted') {
          setPermissionGranted(true)
          setNeedsPermission(false)
        } else {
          alert('Permission denied. Please allow motion & orientation access in your browser settings.')
        }
      } catch (error) {
        console.error('Permission request failed:', error)
        alert('Failed to request permission. Please check your browser settings.')
      }
    }
  }

  const emitSample = () => {
    if (!socket || !socket.connected || !lastSampleRef.current) return

    const payload = {
      room,
      sample: {
        t: Date.now(),
        alpha: lastSampleRef.current.alpha || 0,
        beta: lastSampleRef.current.beta || 0,
        gamma: lastSampleRef.current.gamma || 0,
        ax: lastSampleRef.current.ax || 0,
        ay: lastSampleRef.current.ay || 0,
        az: lastSampleRef.current.az || 0,
      },
    }

    socket.emit('imu', payload)
  }

  const calibrate = () => {
    const alpha = lastSampleRef.current?.alpha ?? 0
    neutralRef.current = alpha

    if (socket && socket.connected) {
      socket.emit('calibrate', {
        room,
        neutral: alpha,
        timestamp: Date.now(),
      })
    }

    alert(`✅ Calibrated!\nNeutral yaw: ${Math.round(alpha)}°\n\nNow make your putting stroke on the game page.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-joe-black via-joe-stone to-joe-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="w-12 h-12 text-joe-gold" />
            <h1 className="text-4xl font-joe-heading font-bold text-joe-gold">
              Phone Controller
            </h1>
          </div>
          <p className="text-joe-white font-joe-body">
            Turn your phone into a golf putter controller
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-joe-stone font-joe-accent">Connection Status:</span>
            <div className="flex items-center gap-2">
              {connected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-joe-accent font-semibold">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-joe-accent font-semibold">Disconnected</span>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-joe-stone font-joe-accent mb-2">Room ID:</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-3 bg-joe-stone/10 border border-joe-gold/30 rounded-lg text-joe-white font-joe-body focus:outline-none focus:border-joe-gold"
              placeholder="stones-default"
            />
            <p className="text-sm text-joe-stone/70 mt-2 font-joe-body">
              Use the same room ID on both controller and game page
            </p>
          </div>
        </div>

        {/* Permission Request (iOS) */}
        {needsPermission && !permissionGranted && (
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-amber-400 font-joe-heading font-semibold mb-2">
                  Permission Required
                </h3>
                <p className="text-joe-white/90 font-joe-body mb-4">
                  iOS requires permission to access motion sensors. Tap below to grant access.
                </p>
                <button
                  onClick={requestPermission}
                  className="bg-amber-500 hover:bg-amber-600 text-joe-black px-6 py-3 rounded-lg font-joe-accent font-bold transition-colors"
                >
                  Enable Motion Sensors
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Calibration */}
        <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20 mb-6">
          <div className="text-center">
            <Crosshair className="w-16 h-16 text-joe-gold mx-auto mb-4" />
            <h2 className="text-2xl font-joe-heading font-semibold text-joe-gold mb-3">
              Calibrate Putter
            </h2>
            <p className="text-joe-stone font-joe-body mb-6">
              Hold your phone like a putter grip, point it at your target, then tap Calibrate.
            </p>
            <button
              onClick={calibrate}
              disabled={!permissionGranted || !connected}
              className="bg-gradient-to-r from-joe-gold to-amber-400 hover:from-amber-400 hover:to-joe-gold disabled:opacity-50 disabled:cursor-not-allowed text-joe-black px-8 py-4 rounded-lg font-joe-heading font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Calibrate Neutral Position
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-joe-black/50 rounded-lg p-6 border border-joe-gold/20">
          <h3 className="text-xl font-joe-heading font-semibold text-joe-gold mb-4">
            Sensor Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-joe-stone font-joe-accent mb-1">Yaw (Alpha)</div>
              <div className="text-2xl font-joe-heading font-bold text-joe-white">
                {debug.alpha}°
              </div>
            </div>
            <div>
              <div className="text-sm text-joe-stone font-joe-accent mb-1">Acceleration</div>
              <div className="text-2xl font-joe-heading font-bold text-joe-white">
                {debug.accel} m/s²
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${debug.streaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm text-joe-stone font-joe-accent">
              {debug.streaming ? 'Streaming data...' : 'Waiting for sensor data...'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-joe-gold/10 border border-joe-gold/30 rounded-lg p-6">
          <h3 className="text-lg font-joe-heading font-semibold text-joe-gold mb-3">
            📱 Quick Setup
          </h3>
          <ol className="space-y-2 text-joe-white/90 font-joe-body">
            <li className="flex gap-2">
              <span className="font-bold text-joe-gold">1.</span>
              <span>Open the game page on your desktop/laptop</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-joe-gold">2.</span>
              <span>Use the same Room ID on both devices</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-joe-gold">3.</span>
              <span>Hold phone like a putter and calibrate</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-joe-gold">4.</span>
              <span>Make your putting stroke!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
