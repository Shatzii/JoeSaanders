import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient as createRedisClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Simple health-safe logger
const log = (...args) => console.log('[PuttQuest]', ...args);

class PuttQuestServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
        methods: ['GET', 'POST']
      }
    });

    this.redisClient = createRedisClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.activeGames = new Map();
    this.physicsEngine = new AdvancedPhysicsEngine();

    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupCleanup();
  }

  async setupDatabase() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/puttquest';
      await mongoose.connect(mongoUri);
      log('✅ MongoDB connected');

      await this.redisClient.connect();
      log('✅ Redis connected');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());

    // Auth gate except for health and auth endpoints
    this.app.use((req, res, next) => {
      if (['/health', '/api/auth/login', '/api/auth/register'].includes(req.path)) {
        return next();
      }
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'No token provided' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        req.user = decoded;
        next();
      } catch (e) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    });
  }

  setupRoutes() {
    this.app.post('/api/auth/register', this.handleRegister.bind(this));
    this.app.post('/api/auth/login', this.handleLogin.bind(this));

    this.app.get('/api/user/profile', async (req, res) => {
      const user = await User.findById(req.user.userId).lean();
      if (!user) return res.status(404).json({ error: 'Not found' });
      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        stats: user.playerStats,
      });
    });

    this.app.put('/api/user/profile', async (req, res) => {
      const updates = req.body || {};
      const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).lean();
      res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        stats: user.playerStats,
      });
    });

    // Demo endpoints
    this.app.get('/api/game/courses', async (_req, res) => {
      res.json([
        { id: 'starter', name: 'Starter Green', holes: 9 },
        { id: 'pro', name: 'Pro Challenge', holes: 18 },
      ]);
    });

    this.app.post('/api/game/save', async (req, res) => {
      const session = new GameSession({
        sessionId: uuidv4(),
        players: req.body.players || [],
        courseId: req.body.courseId || 'starter',
        startTime: new Date(),
      });
      await session.save();
      res.json({ ok: true, sessionId: session.sessionId });
    });

    this.app.get('/api/game/leaderboard', async (_req, res) => {
      // Placeholder: return top sessions
      const latest = await GameSession.find().sort({ startTime: -1 }).limit(10).lean();
      res.json(latest.map(s => ({ id: s.sessionId, courseId: s.courseId, startTime: s.startTime })));
    });

    this.app.post('/api/payment/purchase', async (_req, res) => {
      // Placeholder purchase
      res.json({ ok: true, receiptId: uuidv4() });
    });

    this.app.get('/health', (_req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
    });
  }

  async handleRegister(req, res) {
    try {
      const { email, password, username } = req.body || {};
      if (!email || !password || !username) return res.status(400).json({ error: 'Missing required fields' });
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(400).json({ error: 'User already exists' });
      const hashed = await bcrypt.hash(password, 12);
      const user = new User({ email, username, password: hashed });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, email: user.email, username: user.username, stats: user.playerStats } });
    } catch (e) {
      console.error('Registration error:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async handleLogin(req, res) {
    try {
      const { email, password } = req.body || {};
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, email: user.email, username: user.username, stats: user.playerStats } });
    } catch (e) {
      console.error('Login error:', e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      log('Player connected:', socket.id);

      socket.on('join_game', (data) => this.handleJoinGame(socket, data));
      socket.on('player_swing', (data) => this.handlePlayerSwing(socket, data));
      socket.on('chat_message', (data) => this.handleChatMessage(socket, data));

      socket.on('disconnect', () => {
        log('Player disconnected:', socket.id);
      });
    });
  }

  async handleJoinGame(socket, data) {
    try {
      const { gameId = 'demo', userId, username = 'Player' } = data || {};
      // basic validation; in production, verify token and load user
      const user = userId ? await User.findById(userId) : null;
      const displayName = user?.username || username;

      let game = this.activeGames.get(gameId);
      if (!game) {
        game = new GolfGame(gameId);
        this.activeGames.set(gameId, game);
      }

      game.addPlayer({ id: socket.id, userId: user?._id?.toString() || 'guest', username: displayName, socket });
      socket.join(gameId);

      socket.emit('game_joined', { gameId, players: game.players.map(p => ({ id: p.id, username: p.username })) });
      socket.to(gameId).emit('player_joined', { playerId: socket.id, username: displayName });
    } catch (e) {
      console.error('Join game error:', e);
      socket.emit('error', { message: 'Failed to join game' });
    }
  }

  handlePlayerSwing(socket, data) {
    const { gameId = 'demo', swing } = data || {};
    const game = this.activeGames.get(gameId);
    if (!game) return;
    game.processSwing(socket.id, swing);
  }

  handleChatMessage(socket, data) {
    const { gameId = 'demo', message } = data || {};
    socket.to(gameId).emit('chat_message', { playerId: socket.id, message });
  }

  setupCleanup() {
    setInterval(() => {
      for (const [id, game] of this.activeGames) {
        if (game.isInactive()) this.activeGames.delete(id);
      }
    }, 60 * 60 * 1000);
  }

  start(port = process.env.PORT || 3000) {
    this.server.listen(port, () => {
      log(`🚀 PuttQuest Server running on port ${port}`);
    });
  }
}

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playerStats: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 100 },
    totalPutts: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    longestPutt: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    holesInOne: { type: Number, default: 0 }
  },
  inventory: {
    putters: { type: [String], default: ['basic'] },
    balls: { type: [String], default: ['standard'] },
    courses: { type: [String], default: ['starter'] }
  },
  achievements: [{ id: String, unlockedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

const gameSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  players: [{
    userId: mongoose.Schema.Types.ObjectId,
    username: String,
    score: { type: Number, default: 0 },
    strokes: { type: Number, default: 0 }
  }],
  courseId: String,
  startTime: Date,
  endTime: Date,
  winner: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);

// Physics
class AdvancedPhysicsEngine {
  calculateShot(swingData, ballPosition, holePosition, environment = {}) {
    const { power = 0, angle = 0, spin = 0 } = swingData || {};
    const { windSpeed = 0, windDirection = 0, slope = 0 } = environment;

    const maxDistance = 500; // px
    const baseDistance = (power / 100) * maxDistance;

    const spinEffect = spin * 0.1;
    const curveAngle = angle + spinEffect;
    const radians = (curveAngle * Math.PI) / 180;

    let distance = baseDistance;
    const windEffect = windSpeed * 0.3;
    const windRadians = (windDirection * Math.PI) / 180;
    distance += Math.cos(windRadians) * windEffect;

    const slopeEffect = slope * 0.2;
    distance *= (1 + slopeEffect);

    const newX = ballPosition.x + Math.cos(radians) * distance;
    const newY = ballPosition.y - Math.sin(radians) * distance;

    const distanceToHole = Math.hypot(newX - holePosition.x, newY - holePosition.y);
    const isInHole = distanceToHole < 25;

    return {
      newPosition: { x: newX, y: newY },
      isInHole,
      distanceToHole,
      trajectory: this.calculateTrajectoryPoints(ballPosition, { x: newX, y: newY })
    };
  }

  calculateTrajectoryPoints(start, end) {
    const points = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t - (50 * t * (1 - t));
      points.push({ x, y });
    }
    return points;
  }
}

// Game
class GolfGame {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.state = 'waiting';
    this.currentPlayerIndex = 0;
    this.ballPositions = new Map();
    this.lastActivity = Date.now();
  }

  addPlayer(player) {
    this.players.push(player);
    this.ballPositions.set(player.id, { x: 100, y: 500 });
    this.lastActivity = Date.now();

    if (this.players.length >= 2 && this.state === 'waiting') {
      this.startGame();
    }
  }

  startGame() {
    this.state = 'playing';
    this.broadcast('game_started', { currentPlayer: this.players[0]?.id });
  }

  processSwing(playerId, swingData) {
    if (!this.players.length) return;
    const current = this.players[this.currentPlayerIndex];
    if (!current || current.id !== playerId) return; // Not this player's turn

    const currentPosition = this.ballPositions.get(playerId) || { x: 100, y: 500 };
    const holePosition = { x: 700, y: 200 };

    const result = this.physicsEngine.calculateShot(swingData, currentPosition, holePosition);
    this.ballPositions.set(playerId, result.newPosition);

    this.broadcast('ball_moved', {
      playerId,
      newPosition: result.newPosition,
      trajectory: result.trajectory,
      isInHole: result.isInHole
    });

    if (result.isInHole) {
      this.broadcast('hole_complete', { playerId });
    } else {
      this.nextPlayer();
    }

    this.lastActivity = Date.now();
  }

  nextPlayer() {
    if (!this.players.length) return;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.broadcast('player_turn', { playerId: this.players[this.currentPlayerIndex].id });
  }

  broadcast(event, data) {
    this.players.forEach(p => p.socket.emit(event, data));
  }

  isInactive() {
    return Date.now() - this.lastActivity > 5 * 60 * 1000;
  }
}

const server = new PuttQuestServer();
server.start();
