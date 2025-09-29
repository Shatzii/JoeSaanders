<<<<<<< HEAD
// Simple logger that works in both client and server environments
class SimpleLogger {
  private level: string

  constructor() {
    this.level = process.env.LOG_LEVEL || 'info'
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.level)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex <= currentLevelIndex
  }

  error(message: string, meta?: any) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, meta || '')
    }
  }

  warn(message: string, meta?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, meta || '')
    }
  }

  info(message: string, meta?: any) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, meta || '')
    }
  }

  debug(message: string, meta?: any) {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, meta || '')
    }
  }
}

// Create logger instance
=======
// Simple logger to avoid Winston fs module issues in browser
interface LogEntry {
  level: string
  message: string
  meta?: any
  timestamp: string
}

class SimpleLogger {
  private service = 'joe-sanders-golf'

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage('info', message, meta))
  }

  error(message: string, meta?: any) {
    console.error(this.formatMessage('error', message, meta))
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('warn', message, meta))
  }

  debug(message: string, meta?: any) {
    console.debug(this.formatMessage('debug', message, meta))
  }
}

>>>>>>> origin/copilot/vscode1757631355561
const logger = new SimpleLogger()

export default logger
