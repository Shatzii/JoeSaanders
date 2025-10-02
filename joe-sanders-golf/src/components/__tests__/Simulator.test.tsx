// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import GolfSimulator from '../Simulator'

// Mock the elevenlabs module
jest.mock('../../lib/elevenlabs', () => ({
  generateCoachingTip: jest.fn((metrics) => ({
    text: 'Great shot! Keep that swing tempo.',
    category: 'swing' as const
  })),
  speakCoachingTip: jest.fn()
}))

// Mock window.speechSynthesis for fallback
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: jest.fn(),
    getVoices: jest.fn(() => [])
  },
  writable: true
})

// Mock navigator.share
Object.defineProperty(window.navigator, 'share', {
  value: jest.fn(),
  writable: true
})

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-audio-url')
global.URL.revokeObjectURL = jest.fn()

describe('GolfSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<GolfSimulator />)).not.toThrow()
  })
})