import os from 'os'
const ip = os
  .networkInterfaces()
  .WLAN.find(({ family }) => family === 'IPv4').address

export const PORT = 5500
export const IP = ip
export const DIR_ROOT = 'E'
