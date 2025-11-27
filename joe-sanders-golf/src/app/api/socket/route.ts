// Socket.IO server for real-time communication between phone controller and game
import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

let io: SocketIOServer | undefined

export async function GET(req: NextRequest) {
  // @ts-ignore - Next.js internal server access
  const server = req.socket?.server as HTTPServer & { io?: SocketIOServer }
  
  if (!server) {
    return new Response('Server not available', { status: 500 })
  }

  if (!server.io) {
    console.log('🔌 Initializing Socket.IO server')
    
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket) => {
      console.log('✅ Client connected:', socket.id)

      // Join a room for paired controller/game
      socket.on('join-room', (room: string) => {
        socket.join(room)
        // @ts-ignore
        socket.room = room
        console.log(`📱 Socket ${socket.id} joined room: ${room}`)
        socket.emit('room-joined', room)
      })

      // IMU data from mobile controller - broadcast to game in same room
      socket.on('imu', (payload: { room?: string; sample?: any } | any) => {
        // @ts-ignore
        const room = payload.room || socket.room
        if (room) {
          const sample = payload.sample || payload
          socket.to(room).emit('imu', sample)
        }
      })

      // Calibration event from controller
      socket.on('calibrate', (payload: { room?: string; neutral?: number } | any) => {
        // @ts-ignore
        const room = payload.room || socket.room
        if (room) {
          socket.to(room).emit('calibrate', payload)
          console.log(`🎯 Calibration set in room ${room}:`, payload.neutral)
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
