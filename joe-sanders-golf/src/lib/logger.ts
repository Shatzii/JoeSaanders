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

const logger = new SimpleLogger()

export default logger
