import { apiAxios } from './base'

export const getMessage = () =>
  apiAxios.get('/message').then(e => {
    return e.data
  })

export const postMessage = (data: Record<string, any>) => {
  return apiAxios.post('/message', data)
}

export * from './file'
