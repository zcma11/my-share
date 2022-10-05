// const { IP, PORT } = require('../shared/const')
import { IP, PORT } from '../shared/const.mjs'

export default function () {
  return {
    name: 'inject-env',
    config: config => {
      return {
        ...config,
        define: {
          __BASE_URL__: `'http://${IP}:${PORT}'`
        }
      }
    }
  }
}
