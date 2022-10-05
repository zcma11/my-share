import axios from 'axios'
const BASE_URL = __BASE_URL__ + '/api'

const apiAxios = axios.create({
  baseURL: BASE_URL
})

export const getMessage = () =>
  apiAxios.get('/message').then(e => {
    return e.data
  })

export const postMessage = (data: Record<string, any>) => {
  return apiAxios.post('/message', data)
}
