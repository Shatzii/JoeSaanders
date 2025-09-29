import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

  it('renders the simulator with voice coaching enabled by default', () => {
    render(<GolfSimulator />)

    expect(screen.getByText("ProSwing Simulator")).toBeInTheDocument()
    expect(screen.getByText("Professional Golf Simulation with Uncle Joe's Voice Coaching")).toBeInTheDocument()
    expect(screen.getByText('Voice On')).toBeInTheDocument()
  })

  it('toggles voice coaching on and off', () => {
    render(<GolfSimulator />)

    const voiceButton = screen.getByText('Voice On')
    fireEvent.click(voiceButton)

    expect(screen.getByText('Voice Off')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Voice Off'))
    expect(screen.getByText('Voice On')).toBeInTheDocument()
  })

  it('simulates a swing and shows coaching tip', async () => {
    render(<GolfSimulator />)

    const swingButton = screen.getByText('TAKE SWING')
    fireEvent.click(swingButton)

    await waitFor(() => {
      expect(screen.getByText("Uncle Joe's Coaching")).toBeInTheDocument()
    })

    expect(screen.getByText('Great shot! Keep that swing tempo.')).toBeInTheDocument()
  })

  it('allows replaying coaching tip when voice is enabled', async () => {
    const { generateCoachingTip, speakCoachingTip } = require('../../lib/elevenlabs')

    render(<GolfSimulator />)

    // Take a swing
    const swingButton = screen.getByText('TAKE SWING')
    fireEvent.click(swingButton)

    await waitFor(() => {
      expect(screen.getByText("Uncle Joe's Coaching")).toBeInTheDocument()
    })

    // Click replay button
    const replayButton = screen.getByText('Replay Coaching')
    fireEvent.click(replayButton)

    expect(speakCoachingTip).toHaveBeenCalled()
  })

  it('resets simulator and clears coaching tip', async () => {
    render(<GolfSimulator />)

    // Take a swing first
    const swingButton = screen.getByText('TAKE SWING')
    fireEvent.click(swingButton)

    await waitFor(() => {
      expect(screen.getByText("Uncle Joe's Coaching")).toBeInTheDocument()
    })

    // Reset simulator
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.queryByText("Uncle Joe's Coaching")).not.toBeInTheDocument()
    })
  })
})