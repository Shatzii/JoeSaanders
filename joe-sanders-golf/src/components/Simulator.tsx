'use client'

import { useEffect, useRef, useState } from 'react'
import { Target, TrendingUp, Settings, RotateCcw, Share2 } from 'lucide-react'

interface SwingMetrics {
  clubSpeed: number
  ballSpeed: number
  launchAngle: number
  carryDistance: number
  shotShape: string
}

interface ShotHistory {
  id: string
  club: string
  distance: number
  shape: string
  timestamp: Date
}

export default function GolfSimulator() {
  const [selectedClub, setSelectedClub] = useState('driver')
  const [selectedView, setSelectedView] = useState('overhead')
  const [selectedCourse, setSelectedCourse] = useState('pebble-beach')
  const [metrics, setMetrics] = useState<SwingMetrics>({
    clubSpeed: 103.5,
    ballSpeed: 152.8,
    launchAngle: 12.4,
    carryDistance: 278,
    shotShape: 'Straight'
  })
  const [shotHistory, setShotHistory] = useState<ShotHistory[]>([
    { id: '1', club: 'Driver', distance: 278, shape: 'Draw', timestamp: new Date() },
    { id: '2', club: '7-Iron', distance: 162, shape: 'Straight', timestamp: new Date() },
    { id: '3', club: 'Wedge', distance: 98, shape: 'Fade', timestamp: new Date() },
    { id: '4', club: 'Putter', distance: 12, shape: 'Straight', timestamp: new Date() }
  ])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const courseRef = useRef<HTMLDivElement>(null)

  const clubs = [
    { id: 'driver', name: 'Driver', icon: '🏌️‍♂️' },
    { id: 'iron', name: '7-Iron', icon: '⛳' },
    { id: 'wedge', name: 'Wedge', icon: '🎯' },
    { id: 'putter', name: 'Putter', icon: '🥍' }
  ]

  const courses = [
    { id: 'pebble-beach', name: 'Pebble Beach', color: 'from-green-600 to-green-800' },
    { id: 'st-andrews', name: 'St. Andrews', color: 'from-green-500 to-green-700' },
    { id: 'augusta', name: 'Augusta', color: 'from-green-400 to-green-600' }
  ]

  const views = [
    { id: 'overhead', name: 'Overhead' },
    { id: 'player', name: 'Player' },
    { id: 'green', name: 'Green' }
  ]

  const simulateSwing = () => {
    if (isAnimating) return

    setIsAnimating(true)

    // Generate random metrics based on club selection
    let clubSpeed: number, ballSpeed: number, launchAngle: number, carryDistance: number
    let shotShape = "Straight"

    switch (selectedClub) {
      case 'driver':
        clubSpeed = 103 + Math.random() * 8
        ballSpeed = 150 + Math.random() * 10
        launchAngle = 11 + Math.random() * 4
        carryDistance = 270 + Math.random() * 25
        break
      case 'iron':
        clubSpeed = 82 + Math.random() * 6
        ballSpeed = 115 + Math.random() * 8
        launchAngle = 19 + Math.random() * 3
        carryDistance = 160 + Math.random() * 15
        break
      case 'wedge':
        clubSpeed = 72 + Math.random() * 5
        ballSpeed = 90 + Math.random() * 7
        launchAngle = 32 + Math.random() * 4
        carryDistance = 95 + Math.random() * 12
        break
      case 'putter':
        clubSpeed = 5 + Math.random() * 2
        ballSpeed = 6 + Math.random() * 2
        launchAngle = 2 + Math.random() * 1
        carryDistance = 20 + Math.random() * 5
        break
      default:
        clubSpeed = 100
        ballSpeed = 150
        launchAngle = 12
        carryDistance = 250
    }

    // Randomly assign shot shape
    const shapeRand = Math.random()
    if (shapeRand > 0.7) shotShape = "Draw"
    else if (shapeRand > 0.4) shotShape = "Fade"
    else if (shapeRand > 0.2) shotShape = "Hook"
    else shotShape = "Slice"

    // Update metrics
    setMetrics({
      clubSpeed: Math.round(clubSpeed * 10) / 10,
      ballSpeed: Math.round(ballSpeed * 10) / 10,
      launchAngle: Math.round(launchAngle * 10) / 10,
      carryDistance: Math.round(carryDistance),
      shotShape
    })

    // Animate shot trajectory
    animateShot(carryDistance, shotShape)

    // Add to history
    const clubName = clubs.find(c => c.id === selectedClub)?.name || 'Unknown'
    const newShot: ShotHistory = {
      id: Date.now().toString(),
      club: clubName,
      distance: Math.round(carryDistance),
      shape: shotShape,
      timestamp: new Date()
    }

    setShotHistory(prev => [newShot, ...prev.slice(0, 9)]) // Keep only last 10 shots

    // Show analytics after animation
    setTimeout(() => {
      setShowAnalytics(true)
      setIsAnimating(false)
    }, 2000)
  }

  const animateShot = (distance: number, shape: string) => {
    if (!courseRef.current) return

    const course = courseRef.current
    const maxWidth = course.clientWidth
    const maxHeight = course.clientHeight

    // Scale distance to fit display
    const displayDistance = Math.min(distance / 300 * maxWidth, maxWidth * 0.85)

    // Calculate curve based on shot shape
    let curveFactor = 0
    if (shape === "Draw" || shape === "Hook") curveFactor = 0.3
    if (shape === "Fade" || shape === "Slice") curveFactor = -0.3

    // Create trajectory points
    const points = 25
    for (let i = 0; i < points; i++) {
      setTimeout(() => {
        const ball = document.createElement('div')
        ball.className = 'absolute rounded-full bg-yellow-300 shadow-lg'
        ball.style.width = `${12 - i * 0.3}px`
        ball.style.height = `${12 - i * 0.3}px`
        ball.style.boxShadow = '0 0 10px #fbbf24'

        const t = i / points
        const x = t * displayDistance
        const y = 4 * t * (1 - t) * (maxHeight * 0.7)
        const curve = curveFactor * x * (1 - t)

        ball.style.left = `${maxWidth * 0.1 + x + curve}px`
        ball.style.bottom = `${y}px`

        course.appendChild(ball)

        // Remove ball after animation
        setTimeout(() => {
          if (ball.parentNode) {
            ball.style.opacity = '0'
            ball.style.transition = 'opacity 0.5s'
            setTimeout(() => course.removeChild(ball), 500)
          }
        }, 1000)
      }, i * 80)
    }
  }

  const resetSimulator = () => {
    setShotHistory([])
    setMetrics({
      clubSpeed: 103.5,
      ballSpeed: 152.8,
      launchAngle: 12.4,
      carryDistance: 278,
      shotShape: 'Straight'
    })
    setShowAnalytics(false)
  }

  const shareResults = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return
    
    const text = `Just hit a ${metrics.carryDistance} yard ${metrics.shotShape.toLowerCase()} with my ${clubs.find(c => c.id === selectedClub)?.name}! 🏌️‍♂️ #GolfSimulator`
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Golf Simulator Results',
        text: text,
        url: typeof window !== 'undefined' ? window.location.href : ''
      }).catch(() => {
        // Fallback to clipboard if share fails
        fallbackToClipboard(text)
      })
    } else {
      fallbackToClipboard(text)
    }
  }

  const fallbackToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!')
      }).catch(() => {
        alert('Could not copy to clipboard')
      })
    } else {
      alert('Sharing not supported in this browser')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">ProSwing Simulator</h1>
          </div>
          <p className="text-green-200">Professional Golf Simulation Experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Course Selection */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Course Selection
              </h3>
              <div className="space-y-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`w-full h-16 rounded-lg bg-gradient-to-r ${course.color} text-white font-medium transition-all ${
                      selectedCourse === course.id ? 'ring-2 ring-yellow-400 scale-105' : 'hover:scale-105'
                    }`}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Club Selection */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Club Selection</h3>
              <div className="grid grid-cols-2 gap-2">
                {clubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub(club.id)}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      selectedClub === club.id
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{club.icon}</div>
                    <div className="text-sm">{club.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* View Options */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">View Options</h3>
              <div className="flex gap-2">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setSelectedView(view.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      selectedView === view.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {view.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={simulateSwing}
                disabled={isAnimating}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isAnimating ? 'Swinging...' : 'TAKE SWING'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={resetSimulator}
                  className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button
                  onClick={shareResults}
                  className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Golf Course */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <div
                ref={courseRef}
                className="relative w-full h-96 bg-gradient-to-b from-green-600 to-green-800 rounded-lg overflow-hidden shadow-2xl"
              >
                {/* Sky */}
                <div className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-blue-400 to-blue-600">
                  {/* Clouds */}
                  <div className="absolute top-8 left-12 w-20 h-8 bg-white rounded-full opacity-80"></div>
                  <div className="absolute top-12 right-24 w-24 h-10 bg-white rounded-full opacity-80"></div>
                  <div className="absolute top-6 left-1/2 w-16 h-6 bg-white rounded-full opacity-80"></div>
                </div>

                {/* Course Features */}
                <div className="absolute bottom-16 left-1/3 w-32 h-20 bg-green-500 rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-1/4 w-24 h-16 bg-blue-500 rounded-full opacity-60"></div>
                <div className="absolute bottom-24 left-1/4 w-28 h-12 bg-yellow-600 rounded-lg opacity-70"></div>

                {/* Green and Hole */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-24 bg-green-400 rounded-t-full">
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full border-2 border-white"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-gray-600"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-red-600 rounded-t-lg"></div>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.clubSpeed}</div>
                <div className="text-sm text-green-200">Club Speed (MPH)</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.ballSpeed}</div>
                <div className="text-sm text-green-200">Ball Speed (MPH)</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.launchAngle}°</div>
                <div className="text-sm text-green-200">Launch Angle</div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{metrics.carryDistance}</div>
                <div className="text-sm text-green-200">Carry Distance (YDS)</div>
              </div>
            </div>

            {/* Shot History */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Shot History
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {shotHistory.map((shot) => (
                  <div key={shot.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400 font-medium">{shot.club}</div>
                      <div className="text-green-200 text-sm">{shot.distance} yds</div>
                    </div>
                    <div className="text-white/70 text-sm">{shot.shape}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Swing Analytics
                  </h3>
                  <button
                    onClick={() => setShowAnalytics(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Distance', value: 85 },
                    { label: 'Accuracy', value: 72 },
                    { label: 'Consistency', value: 68 },
                    { label: 'Control', value: 90 },
                    { label: 'Power', value: 95 }
                  ].map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">{metric.value}%</div>
                      <div className="text-sm text-green-200">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}