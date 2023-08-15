import 'dotenv/config'
import { EOL } from 'os'
import { appendFileSync } from 'fs'
import * as pgMonitor from 'pg-monitor'
import { IInitOptions } from 'pg-promise'

pgMonitor.setTheme('monochrome')
const $DEV = process.env.NODE_ENV === 'development'

// log file for database related errors

const logFile = './db/errors.log'

pgMonitor.setLog((msg, info) => {
  if (info.event === 'error') {
    let logText = EOL + msg
    if (info.time) {
      // If it is a new error being reported,
      logText = EOL + logText
    }
    appendFileSync(logFile, logText)
  }
  // We absolutely must not let the monitor write anything into the console
  // while in a PROD environment, and not just because nobody will be able
  // to see it there, but mainly because the console is incredibly slow and
  // hugely resource-consuming, suitable only for debugging.
  if (!$DEV) {
    // If it is not a DEV environment:
    info.display = false // display nothing;
  }
})

export class Diagnostic {
  static init<Ext = {}>(options: IInitOptions<Ext>) {
    if (!$DEV) {
      pgMonitor.attach(options)
    } else {
      // In a PROD environment we should only attach to the type of events
      // that we intend to log. And we are only logging event 'error' here:

      pgMonitor.attach(options, ['error'])
    }
  }
}
