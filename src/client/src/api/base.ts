import axios from 'axios'
const BASE_URL = __BASE_URL__ + '/api'

export const apiAxios = axios.create({
  baseURL: BASE_URL
})