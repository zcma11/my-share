import axios from 'axios'
const BASE_URL = 'http://localhost:5500'

export const getMessage = () => axios.get(BASE_URL + '/message').then(e => {
  console.log(e)
  return e.data
})
export const postMessage = (data: Record<string, any>) => {
 return axios.post(BASE_URL + '/message', data)
}
