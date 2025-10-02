// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import Header from '@/components/Header'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

describe('Header Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    expect(() => render(<Header />)).not.toThrow()
  })
})
