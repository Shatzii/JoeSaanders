import '@testing-library/jest-dom'

// Mock Next.js Web APIs
global.Request = class Request {
    constructor(input, init) {
        this.url = input
        this.method = init ? .method || 'GET'
        this.headers = new Map(Object.entries(init ? .headers || {}))
        this.body = init ? .body
    }
}

global.Response = class Response {
    constructor(body, init) {
        this.body = body
        this.status = init ? .status || 200
        this.headers = new Map(Object.entries(init ? .headers || {}))
    }
    async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }
    static json(data, init) {
        return new Response(JSON.stringify(data), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(init ? .headers || {})
            }
        })
    }
}

global.Headers = class Headers extends Map {
    get(name) {
        return super.get(name.toLowerCase())
    }
    set(name, value) {
        return super.set(name.toLowerCase(), value)
    }
}

// Mock Next.js router
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

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
process.env.RESEND_API_KEY = 'test-resend-key'