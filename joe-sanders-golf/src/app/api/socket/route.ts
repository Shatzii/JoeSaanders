// Socket.IO server for real-time communication between phone controller and game
import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { createAdapter } from '@socket.io/redis-adapter'
import { getRedisClients } from '@/lib/redis'

let io: SocketIOServer | undefined

export async function GET(req: NextRequest) {
  // @ts-ignore - Next.js internal server access
  const server = req.socket?.server as HTTPServer & { io?: SocketIOServer }
  
  if (!server) {
    return new Response('Server not available', { status: 500 })
  }

  if (!server.io) {
    console.log('🔌 Initializing Socket.IO server with optimizations')
    
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      // Performance optimizations
      transports: ['websocket', 'polling'],
      perMessageDeflate: {
        threshold: 1024, // Only compress messages > 1KB
        zlibDeflateOptions: {
          chunkSize: 8 * 1024,
          level: 6 // Balanced compression
        }
      },
      httpCompression: {
        threshold: 1024
      },
      pingTimeout: 20000,
      pingInterval: 25000,
      upgradeTimeout: 10000,
      maxHttpBufferSize: 1e6 // 1MB max message size
    })

    // Try to use Redis adapter for horizontal scaling
    try {
      const { pubClient, subClient } = getRedisClients()
      if (pubClient && subClient) {
        io.adapter(createAdapter(pubClient, subClient))
        console.log('✅ Redis adapter enabled for Socket.IO')
      }
    } catch {
      console.warn('⚠️  Redis adapter not available, using in-memory adapter')
    }

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id)

      // Latency tracking
      let avgLatency = 0
      let lastPing = Date.now()
      socket.on('ping', () => {
        const latency = Date.now() - lastPing
        avgLatency = avgLatency ? (avgLatency + latency) / 2 : latency
        lastPing = Date.now()
        socket.emit('pong', { latency: Math.round(avgLatency) })
      })

      // Join a room for paired controller/game
      socket.on('join-room', (room: string) => {
        socket.join(room)
        Object.assign(socket, { room })
        console.log(`📱 Socket ${socket.id} joined room: ${room}`)
        socket.emit('room-joined', room)
      })

      // IMU data from mobile controller - broadcast to game in same room
      socket.on('imu', (payload: unknown) => {
        const data = payload as { room?: string; sample?: unknown }
        const room = data.room || (socket as unknown as { room?: string }).room
        if (room) {
          const sample = data.sample || payload
          socket.to(room).emit('imu', sample)
        }
      })

      // Calibration event from controller
      socket.on('calibrate', (payload: unknown) => {
        const data = payload as { room?: string; neutral?: number }
        const room = data.room || (socket as unknown as { room?: string }).room
        if (room) {
          socket.to(room).emit('calibrate', payload)
          console.log(`🎯 Calibration set in room ${room}:`, data.neutral)
        }
      })

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id)
      })
    })

    server.io = io
  }

  return new Response('Socket.IO server initialized', { status: 200 })
}
