import { apiAxios } from './base'

export interface fileListType {
  type: string
  name: string
  time: number
  size: number
  status: 'uploading' | 'success'
  src: string
  createAt: number
  id: string
}

export interface BufferItem {
  buffer: Blob
  index: string
  name: string
  size: string
}

export const getFileList = () => {
  return apiAxios.get('download-lsit').then(e => e.data)
}

export const postFileItemInfo = (data: fileListType) => {
  return apiAxios.post('upload-placeholder', data)
}

export const postFile = (data: BufferItem) => {
  const fromData = new FormData()
  fromData.append('buffer', data.buffer)
  fromData.append('index', data.index)
  fromData.append('name', data.name)
  fromData.append('size', data.size)

  return apiAxios.post('/upload-chunk', fromData)
}

export const postSuccess = (name: string) => {
  return apiAxios.get(`/success?id=${name}`).then(e => e.data)
}

export const deleteFile = (data: { id: string }) => {
  return apiAxios.post(`/delete-file`, data).then(e => e.data)
}

export const deleteFileAll = () => {
  return apiAxios.post('/delete-all')
}
