import logger from 'pino'
import dayjs from 'dayjs'

const levels = {
  emerg: 80,
  alert: 70,
  crit: 60,
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
}
const log = logger({
  transport: { target: 'pino-pretty', options: { colorize: true } },
  base: {
    pid: false,
  },
  customLevels: levels,
  useOnlyCustomLevels: true,
  timestamp: () => `,"time":"${dayjs().format()}"`,
})

export default log
