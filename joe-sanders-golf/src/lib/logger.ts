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
const logger = new SimpleLogger()

export default logger
