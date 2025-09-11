'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, TrendingUp, Calendar, Target, Star, MessageCircle, Heart } from 'lucide-react'

interface TournamentPrediction {
  id: string
  tournamentId: string
  tournamentName: string
  userPrediction: {
    position: number
    score: number
  }
  actualResult?: {
    position: number
    score: number
  }
  points: number
  submittedAt: string
}

interface FanEngagementData {
  activeUsers: number
  totalPredictions: number
  averageAccuracy: number
  upcomingTournaments: Array<{
    id: string
    name: string
    date: string
    location: string
    predictionDeadline: string
  }>
  leaderboard: Array<{
    userId: string
    username: string
    points: number
    predictions: number
    accuracy: number
  }>
  recentActivity: Array<{
    id: string
    type: 'prediction' | 'achievement' | 'comment'
    user: string
    description: string
    timestamp: string
  }>
}

export default function FanEngagement() {
  const [engagementData, setEngagementData] = useState<FanEngagementData | null>(null)
  const [userPredictions, setUserPredictions] = useState<TournamentPrediction[]>([])
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const [predictionForm, setPredictionForm] = useState({
    position: '',
    score: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEngagementData()
    loadUserPredictions()
  }, [])

  const loadEngagementData = async () => {
    try {
      // Simulate loading engagement data
      const mockData: FanEngagementData = {
        activeUsers: 1247,
        totalPredictions: 3456,
        averageAccuracy: 68.5,
        upcomingTournaments: [
          {
            id: '1',
            name: 'PGA Championship 2025',
            date: '2025-05-15',
            location: 'Valhalla Golf Club',
            predictionDeadline: '2025-05-14T18:00:00Z'
          },
          {
            id: '2',
            name: 'Masters Tournament 2025',
            date: '2025-04-10',
            location: 'Augusta National',
            predictionDeadline: '2025-04-09T18:00:00Z'
          },
          {
            id: '3',
            name: 'US Open 2025',
            date: '2025-06-12',
            location: 'Pinehurst Resort',
            predictionDeadline: '2025-06-11T18:00:00Z'
          }
        ],
        leaderboard: [
          { userId: '1', username: 'GolfMaster2025', points: 1250, predictions: 45, accuracy: 78.5 },
          { userId: '2', username: 'UncleJoeFan', points: 1180, predictions: 42, accuracy: 82.1 },
          { userId: '3', username: 'PGAProdigy', points: 1050, predictions: 38, accuracy: 75.3 },
          { userId: '4', username: 'FairwayKing', points: 980, predictions: 35, accuracy: 71.8 },
          { userId: '5', username: 'BirdieHunter', points: 920, predictions: 41, accuracy: 69.2 }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'prediction',
            user: 'GolfMaster2025',
            description: 'Predicted 2nd place finish at PGA Championship',
            timestamp: '2025-01-15T10:30:00Z'
          },
          {
            id: '2',
            type: 'achievement',
            user: 'UncleJoeFan',
            description: 'Earned "Prediction Master" badge with 80% accuracy',
            timestamp: '2025-01-14T16:45:00Z'
          },
          {
            id: '3',
            type: 'comment',
            user: 'PGAProdigy',
            description: 'Commented on Uncle Joe\'s recent tournament performance',
            timestamp: '2025-01-14T14:20:00Z'
          }
        ]
      }

      setEngagementData(mockData)
    } catch (error) {
      console.error('Failed to load engagement data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserPredictions = async () => {
    try {
      // Simulate loading user predictions
      const mockPredictions: TournamentPrediction[] = [
        {
          id: '1',
          tournamentId: '1',
          tournamentName: 'PGA Championship 2024',
          userPrediction: { position: 5, score: -12 },
          actualResult: { position: 3, score: -15 },
          points: 75,
          submittedAt: '2024-05-14T16:00:00Z'
        },
        {
          id: '2',
          tournamentId: '2',
          tournamentName: 'Masters Tournament 2024',
          userPrediction: { position: 8, score: -8 },
          actualResult: { position: 12, score: -6 },
          points: 45,
          submittedAt: '2024-04-09T14:30:00Z'
        }
      ]

      setUserPredictions(mockPredictions)
    } catch (error) {
      console.error('Failed to load user predictions:', error)
    }
  }

  const submitPrediction = async () => {
    if (!selectedTournament || !predictionForm.position || !predictionForm.score) {
      alert('Please fill in all prediction fields')
      return
    }

    try {
      // Simulate submitting prediction
      const newPrediction: TournamentPrediction = {
        id: Date.now().toString(),
        tournamentId: selectedTournament,
        tournamentName: engagementData?.upcomingTournaments.find(t => t.id === selectedTournament)?.name || 'Unknown Tournament',
        userPrediction: {
          position: parseInt(predictionForm.position),
          score: parseInt(predictionForm.score)
        },
        points: 0,
        submittedAt: new Date().toISOString()
      }

      setUserPredictions([newPrediction, ...userPredictions])
      setPredictionForm({ position: '', score: '' })
      setSelectedTournament(null)

      alert('Prediction submitted successfully!')
    } catch (error) {
      console.error('Failed to submit prediction:', error)
      alert('Failed to submit prediction. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-joe-stone/20 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-joe-stone/20 rounded w-full"></div>
            <div className="h-3 bg-joe-stone/20 rounded w-3/4"></div>
            <div className="h-3 bg-joe-stone/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!engagementData) {
    return (
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <p className="text-joe-stone">Fan engagement data not available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Active Fans</p>
              <p className="text-2xl font-bold text-joe-gold">{engagementData.activeUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Total Predictions</p>
              <p className="text-2xl font-bold text-joe-gold">{engagementData.totalPredictions.toLocaleString()}</p>
            </div>
            <Target className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Avg Accuracy</p>
              <p className="text-2xl font-bold text-joe-gold">{engagementData.averageAccuracy}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Your Points</p>
              <p className="text-2xl font-bold text-joe-gold">
                {userPredictions.reduce((sum, p) => sum + p.points, 0)}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-joe-gold" />
          </div>
        </div>
      </div>

      {/* Prediction Contest */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Tournament Predictions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Tournaments */}
          <div>
            <h4 className="text-joe-white font-medium mb-3">Upcoming Tournaments</h4>
            <div className="space-y-3">
              {engagementData.upcomingTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTournament === tournament.id
                      ? 'border-joe-gold bg-joe-gold/10'
                      : 'border-joe-stone/50 hover:border-joe-gold/50'
                  }`}
                  onClick={() => setSelectedTournament(tournament.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-joe-white font-medium">{tournament.name}</h5>
                      <p className="text-joe-stone text-sm">{tournament.location}</p>
                      <p className="text-joe-stone text-sm">
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-joe-gold" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Form */}
          <div>
            <h4 className="text-joe-white font-medium mb-3">Make Your Prediction</h4>
            {selectedTournament ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-joe-stone text-sm mb-1">Predicted Position</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={predictionForm.position}
                    onChange={(e) => setPredictionForm({...predictionForm, position: e.target.value})}
                    className="w-full p-2 bg-joe-stone text-joe-white rounded border border-joe-gold/20 focus:border-joe-gold focus:outline-none"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-joe-stone text-sm mb-1">Predicted Score</label>
                  <input
                    type="number"
                    value={predictionForm.score}
                    onChange={(e) => setPredictionForm({...predictionForm, score: e.target.value})}
                    className="w-full p-2 bg-joe-stone text-joe-white rounded border border-joe-gold/20 focus:border-joe-gold focus:outline-none"
                    placeholder="e.g., -12"
                  />
                </div>
                <button
                  onClick={submitPrediction}
                  className="w-full bg-joe-gold text-joe-black px-4 py-2 rounded font-medium hover:bg-joe-gold/90 transition-colors"
                >
                  Submit Prediction
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-joe-stone">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a tournament to make your prediction</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Prediction Leaderboard
        </h3>
        <div className="space-y-3">
          {engagementData.leaderboard.map((user, index) => (
            <div key={user.userId} className="flex items-center justify-between p-3 bg-joe-stone/20 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-joe-stone text-joe-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-joe-white font-medium">{user.username}</h4>
                  <p className="text-joe-stone text-sm">{user.predictions} predictions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-joe-gold font-bold">{user.points} pts</p>
                <p className="text-joe-stone text-sm">{user.accuracy}% accuracy</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {engagementData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-joe-stone/10 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'prediction' ? 'bg-blue-600' :
                activity.type === 'achievement' ? 'bg-yellow-600' :
                'bg-green-600'
              }`}>
                {activity.type === 'prediction' ? <Target className="h-4 w-4 text-white" /> :
                 activity.type === 'achievement' ? <Star className="h-4 w-4 text-white" /> :
                 <MessageCircle className="h-4 w-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-joe-white text-sm">
                  <span className="font-medium text-joe-gold">{activity.user}</span> {activity.description}
                </p>
                <p className="text-joe-stone text-xs">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Predictions */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Your Predictions
        </h3>
        {userPredictions.length > 0 ? (
          <div className="space-y-3">
            {userPredictions.map((prediction) => (
              <div key={prediction.id} className="p-3 bg-joe-stone/20 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-joe-white font-medium">{prediction.tournamentName}</h4>
                    <p className="text-joe-stone text-sm">
                      Predicted: {prediction.userPrediction.position}st place ({prediction.userPrediction.score > 0 ? '+' : ''}{prediction.userPrediction.score})
                    </p>
                    {prediction.actualResult && (
                      <p className="text-joe-stone text-sm">
                        Actual: {prediction.actualResult.position}st place ({prediction.actualResult.score > 0 ? '+' : ''}{prediction.actualResult.score})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-joe-gold font-bold">+{prediction.points} pts</p>
                    <p className="text-joe-stone text-xs">
                      {new Date(prediction.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-joe-stone">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>You haven&apos;t made any predictions yet</p>
            <p className="text-sm">Select an upcoming tournament to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
