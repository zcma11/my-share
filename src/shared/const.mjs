import os from 'os'

const nets = os.networkInterfaces()
const isWLAN = process.argv.includes('-w')
let ip = ''
let netName
if (isWLAN) {
  ip = os
    .networkInterfaces()
    .WLAN.find(({ family }) => family === 'IPv4').address
} else if (
  (netName = process.argv.find(v => {
    return /^\-n\=.*/.test(v)
  }))
) {
  const info = nets[netName]
  ip = info.find(({ family }) => family === 'IPv4').address
} else {
  try {
    Object.keys(nets).forEach(name => {
      const info = nets[name]
      ip = info.find(({ family }) => family === 'IPv4').address
      if (ip) {
        throw Error('break')
      }
    })
  } catch {}
}

if (typeof ip !== 'string') {
  throw Error(`miss correct ip with `, ip)
}

export const PORT = 5500
export const IP = ip
export const DIR_ROOT = 'E'
