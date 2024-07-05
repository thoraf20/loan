import winston from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),

  winston.format.printf(({ level, message, timestamp, ...body }) => {
  let log = `${timestamp} [${level}] ${message} ${JSON.stringify(body)}\n`
  log += "-".repeat(156)
  return log;
  })
)

const transports = [
  new winston.transports.Console(),
]

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format,
  transports,
})
