'use client'

import { useEffect, useRef, useState } from 'react'
import { Target, TrendingUp, Settings, RotateCcw, Share2, Crown, Trophy, Lock } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  timestamp: Date
  isPremium?: boolean
}

interface GameState {
  currentHole: number
  totalScore: number
  shotsRemaining: number
  gameComplete: boolean
}

export default function GolfSimulator() {
  const [selectedClub, setSelectedClub] = useState('driver')
  const [selectedView, setSelectedView] = useState('overhead')
  const [selectedCourse, setSelectedCourse] = useState('pebble-beach')
  const [playerName, setPlayerName] = useState('')
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    currentHole: 1,
    totalScore: 0,
    shotsRemaining: 3,
    gameComplete: false
  })
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', playerName: 'Uncle Joe', score: -2, timestamp: new Date(), isPremium: true },
    { id: '2', playerName: 'GolfPro23', score: -1, timestamp: new Date() },
    { id: '3', playerName: 'BirdieKing', score: 0, timestamp: new Date() },
    { id: '4', playerName: 'FairwayFinder', score: 1, timestamp: new Date() },
    { id: '5', playerName: 'ChipMaster', score: 2, timestamp: new Date() }
  ])
  const [metrics, setMetrics] = useState<SwingMetrics>({
    clubSpeed: 103.5,
    ballSpeed: 152.8,
    launchAngle: 12.4,
    carryDistance: 278,
    shotShape: 'Straight'
  })
  const [shotHistory, setShotHistory] = useState<ShotHistory[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const courseRef = useRef<HTMLDivElement>(null)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  
  // Initialize Supabase client (optional)
  const supabase = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL 
    ? createClientComponentClient() 
    : null

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

  const simulateSwing = async () => {
    if (isAnimating || gameState.gameComplete) return

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

    // Calculate score based on distance and accuracy
    let shotScore = 0
    const targetDistance = 150 // Par 3 hole
    const accuracy = Math.max(0, 100 - Math.abs(carryDistance - targetDistance) / 2)
    
    if (accuracy > 90) shotScore = -1 // Eagle/Birdie
    else if (accuracy > 70) shotScore = 0 // Par
    else if (accuracy > 50) shotScore = 1 // Bogey
    else shotScore = 2 // Double bogey+

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

    setShotHistory(prev => [newShot, ...prev.slice(0, 9)])

    // Update game state
    const newGameState = {
      ...gameState,
      totalScore: gameState.totalScore + shotScore,
      shotsRemaining: gameState.shotsRemaining - 1
    }

    if (newGameState.shotsRemaining <= 0) {
      newGameState.gameComplete = true
      // Save score to leaderboard
      await saveScore(newGameState.totalScore)
      // Show premium modal after first game
      if (!isPremium && shotHistory.length === 0) {
        setTimeout(() => setShowPremiumModal(true), 3000)
      }
    }

    setGameState(newGameState)

    // Show analytics after animation
    setTimeout(() => {
      setShowAnalytics(true)
      setIsAnimating(false)
    }, 2000)
  }

  const saveScore = async (score: number) => {
    if (!playerName) return

    try {
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName,
        score,
        timestamp: new Date()
      }

      // Update local leaderboard
      setLeaderboard(prev => [...prev, newEntry].sort((a, b) => a.score - b.score).slice(0, 10))

      // Save to Supabase if available
      if (supabase) {
        await supabase.from('scores').insert({ player_name: playerName, score, hole_id: 1 })
      }
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handlePremiumUnlock = async () => {
    try {
      // In a real implementation, integrate with Stripe
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'premium_unlock', amount: 500 }) // $5.00
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // For demo purposes, just unlock premium
      setIsPremium(true)
      setShowPremiumModal(false)
    }
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
    setGameState({
      currentHole: 1,
      totalScore: 0,
      shotsRemaining: 3,
      gameComplete: false
    })
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
    const text = `Just hit a ${metrics.carryDistance} yard ${metrics.shotShape.toLowerCase()} with my ${clubs.find(c => c.id === selectedClub)?.name}! 🏌️‍♂️ #GolfSimulator`
    
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: 'Golf Simulator Results',
          text: text,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(text)
        alert('Results copied to clipboard!')
      }
    }
  }

  return (
    <div className="simulator-hub min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Target className="h-8 w-8 text-[#d4af37]" />
            <h1 className="text-3xl font-['Cormorant_Garamond'] font-semibold gold-gradient-text">
              The Uncle Joe Challenge
            </h1>
          </div>
          <p className="text-[#e7e3da] font-['Inter']">Beat Uncle Joe&apos;s legendary precision on today&apos;s hole</p>
        </div>

        {/* Player Name Input */}
        {!playerName && (
          <div className="simulator-interface rounded-xl p-6 mb-6 max-w-md mx-auto text-center">
            <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-4">Enter Your Name</h3>
            <input
              type="text"
              placeholder="Your name..."
              className="w-full p-3 bg-[#0a0a0a] border border-[#d4af37] rounded-lg text-[#fafafa] font-['Inter']"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setPlayerName((e.target as HTMLInputElement).value)
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement
                if (input?.value) setPlayerName(input.value)
              }}
              className="simulator-button mt-4 px-6 py-2 rounded-lg"
            >
              Start Challenge
            </button>
          </div>
        )}

        {playerName && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Live Leaderboard */}
              <div className="simulator-interface rounded-xl p-4">
                <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Live Leaderboard
                </h3>
                <div className="leaderboard-table space-y-2">
                  {leaderboard.slice(0, isPremium ? 10 : 5).map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`player-score p-2 rounded flex justify-between items-center ${
                        entry.playerName === 'Uncle Joe' ? 'highlight' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37] font-bold">#{index + 1}</span>
                        <span className="font-['Inter']">{entry.playerName}</span>
                        {entry.isPremium && <Crown className="h-3 w-3 text-[#d4af37]" />}
                      </div>
                      <span className="font-bold">{entry.score > 0 ? '+' : ''}{entry.score}</span>
                    </div>
                  ))}
                  {!isPremium && (
                    <div className="text-center py-2">
                      <Lock className="h-4 w-4 mx-auto text-[#d4af37]" />
                      <p className="text-xs text-[#e7e3da] mt-1">Unlock full leaderboard</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Challenge */}
              <div className="simulator-interface rounded-xl p-4">
                <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-3">Daily Challenge</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">Par 3</div>
                  <div className="text-sm text-[#e7e3da]">150 Yard Target</div>
                  <div className="text-xs text-[#e7e3da] mt-2">Uncle Joe&apos;s Best: -2</div>
                </div>
              </div>

              {/* User Stats */}
              <div className="simulator-interface rounded-xl p-4">
                <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-3">Your Stats</h3>
                <div className="space-y-2 text-sm font-['Inter']">
                  <div className="flex justify-between">
                    <span className="text-[#e7e3da]">Current Score:</span>
                    <span className="text-[#d4af37] font-bold">
                      {gameState.totalScore > 0 ? '+' : ''}{gameState.totalScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#e7e3da]">Shots Left:</span>
                    <span className="text-[#d4af37] font-bold">{gameState.shotsRemaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#e7e3da]">Best Distance:</span>
                    <span className="text-[#d4af37] font-bold">
                      {Math.max(...shotHistory.map(s => s.distance), 0)} yds
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Unlock CTA */}
              {!isPremium && (
                <div className="premium-unlock rounded-xl p-4 text-center">
                  <h3 className="gold-gradient-text font-['Inter'] font-bold mb-2">Unlock Premium</h3>
                  <p className="text-[#e7e3da] text-sm mb-4">
                    Access full leaderboard, historical challenges, and VS Joe mode
                  </p>
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="simulator-button w-full py-2 rounded-lg font-['Inter'] font-bold"
                  >
                    Donate $5 to Unlock
                  </button>
                </div>
              )}

              {/* Club Selection */}
              <div className="simulator-interface rounded-xl p-4">
                <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-3">Club Selection</h3>
                <div className="grid grid-cols-2 gap-2">
                  {clubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => setSelectedClub(club.id)}
                      disabled={gameState.gameComplete}
                      className={`p-3 rounded-lg font-['Inter'] font-medium transition-all ${
                        selectedClub === club.id
                          ? 'bg-[#d4af37] text-[#0a0a0a] shadow-lg'
                          : 'bg-[#1a1a1a] text-[#fafafa] hover:bg-[#2a2a2a] border border-[#d4af37]/20'
                      } ${gameState.gameComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-2xl mb-1">{club.icon}</div>
                      <div className="text-sm">{club.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4">
              {/* Game Controls */}
              <div className="text-center space-y-4">
                {!gameState.gameComplete ? (
                  <button
                    onClick={simulateSwing}
                    disabled={isAnimating}
                    className="simulator-button text-xl font-bold py-6 px-12 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isAnimating ? 'Swinging...' : 'TAKE SWING'}
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-['Cormorant_Garamond'] gold-gradient-text">
                      Challenge Complete!
                    </h2>
                    <p className="text-[#e7e3da] font-['Inter']">
                      Final Score: {gameState.totalScore > 0 ? '+' : ''}{gameState.totalScore}
                    </p>
                    <button
                      onClick={resetSimulator}
                      className="simulator-button py-3 px-8 rounded-xl hover:scale-105 transition-all"
                    >
                      Play Again
                    </button>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetSimulator}
                    className="simulator-interface text-[#fafafa] py-2 px-6 rounded-lg hover:bg-[#2a2a2a] transition-all flex items-center gap-2 border border-[#d4af37]/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                  <button
                    onClick={shareResults}
                    className="simulator-interface text-[#fafafa] py-2 px-6 rounded-lg hover:bg-[#2a2a2a] transition-all flex items-center gap-2 border border-[#d4af37]/20"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Golf Course */}
              <div className="simulator-interface rounded-xl p-4">
                <div
                  ref={courseRef}
                  className="relative w-full h-96 bg-gradient-to-b from-green-600 to-green-800 rounded-lg overflow-hidden shadow-2xl"
                >
                  {/* Game Canvas */}
                  <canvas
                    ref={gameCanvasRef}
                    className="absolute inset-0 w-full h-full"
                    width="800"
                    height="400"
                  />
                  
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
                <div className="simulator-interface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">{metrics.clubSpeed}</div>
                  <div className="text-sm text-[#e7e3da] font-['Inter']">Club Speed (MPH)</div>
                </div>
                <div className="simulator-interface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">{metrics.ballSpeed}</div>
                  <div className="text-sm text-[#e7e3da] font-['Inter']">Ball Speed (MPH)</div>
                </div>
                <div className="simulator-interface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">{metrics.launchAngle}°</div>
                  <div className="text-sm text-[#e7e3da] font-['Inter']">Launch Angle</div>
                </div>
                <div className="simulator-interface rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#d4af37] mb-1">{metrics.carryDistance}</div>
                  <div className="text-sm text-[#e7e3da] font-['Inter']">Carry Distance (YDS)</div>
                </div>
              </div>

              {/* Shot History */}
              <div className="simulator-interface rounded-xl p-4">
                <h3 className="text-[#d4af37] font-['Inter'] font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Shot History
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {shotHistory.length === 0 ? (
                    <p className="text-[#e7e3da] text-center py-4 font-['Inter']">No shots yet. Take your first swing!</p>
                  ) : (
                    shotHistory.map((shot) => (
                      <div key={shot.id} className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-[#d4af37]/20">
                        <div className="flex items-center gap-3">
                          <div className="text-[#d4af37] font-medium font-['Inter']">{shot.club}</div>
                          <div className="text-[#e7e3da] text-sm font-['Inter']">{shot.distance} yds</div>
                        </div>
                        <div className="text-[#fafafa] text-sm font-['Inter']">{shot.shape}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Analytics Panel */}
              {showAnalytics && (
                <div className="simulator-interface rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#d4af37] font-['Inter'] font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Swing Analytics
                    </h3>
                    <button
                      onClick={() => setShowAnalytics(false)}
                      className="text-[#fafafa] hover:text-[#d4af37]"
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
                        <div className="text-2xl font-bold text-[#d4af37] mb-1">{metric.value}%</div>
                        <div className="text-sm text-[#e7e3da] font-['Inter']">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Premium Unlock Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="matte-black-bg border-2 border-[#d4af37] rounded-xl p-8 max-w-md w-full text-center">
              <h2 className="text-2xl font-['Cormorant_Garamond'] gold-gradient-text mb-4">
                Unlock the Full Experience
              </h2>
              <p className="text-[#e7e3da] font-['Inter'] mb-6">
                See how you stack up against Joe&apos;s inner circle. Donate $5 to access the full leaderboard, 
                historical challenges, and exclusive digital merch.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handlePremiumUnlock}
                  className="simulator-button w-full py-3 rounded-lg font-['Inter'] font-bold text-lg"
                >
                  Donate $5 & Unlock Premium
                </button>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full py-3 text-[#e7e3da] border border-[#d4af37]/30 rounded-lg hover:bg-[#1a1a1a] transition-all font-['Inter']"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}