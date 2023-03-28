<template>
  <label for="upload" class="upload-window">+</label>
  <input
    :style="{ display: 'none' }"
    id="upload"
    ref="input"
    type="file"
    multiple
    @change="onChange"
  />
  <div class="list">
    <span v-for="fi in uploadingList"
      ><a
        :key="fi.name"
        :href="fi.src + `&timestamp=${Date.now()}`"
        :download="fi.name"
        >{{ fi.name }}</a
      >
      / {{ formatSize(fi.size) }} / {{ fi.type }}&nbsp;&nbsp;&nbsp;{{
        fi.status
      }}&nbsp;&nbsp;<button @click="remove(fi.name)">删除</button></span
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  BufferItem,
  deleteFile,
  fileListType,
  getFileList,
  postFile,
  postFileItemInfo,
  postSuccess
} from '../api'

const input = ref(null)
const uploadingList = ref<fileListType[]>([])

onMounted(() => {
  getFileList().then(v => {
    uploadingList.value = reactive(v)
  })
})

const onChange = (e: any) => {
  for (const file of e.target.files as File[]) {
    const { name: _name, type, lastModified, size } = file
    const name = encodeURIComponent(_name)
    const fileListItem: fileListType = reactive({
      name: _name,
      id: name,
      type,
      size,
      time: lastModified,
      createAt: Date.now(),
      status: 'uploading',
      src: 'javascript:void(0);'
    })

    postFileItemInfo(fileListItem).then(() => {
      uploadingList.value.push(fileListItem)

      const chunks = slice(file)
      const chunkItemData = chunks.map<BufferItem>((b, index) => {
        return {
          buffer: b,
          index: String(index),
          size: String(b.size),
          name,
          time: String(Date.now())
        }
      })

      Promise.all(chunkItemData.map(v => postFile(v)))
        .then(() => {
          // 上传完成
          return postSuccess(name).then(({ status, src }) => {
            fileListItem.status = status
            fileListItem.src = src
          })
        })
        .catch(e => {
          console.log('上传失败', e)
        })
    })
  }
}

const slice = (file: Blob, size = 2 * 1024 * 1024) => {
  const chunks = []
  let s = 0
  while (s < file.size) {
    chunks.push(file.slice(s, s + size))
    s += size
  }

  return chunks
}

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size.toFixed(2)} B`
  }
  const k = size / 1024
  if (k < 1024) {
    return `${k.toFixed(2)} KB`
  }

  const m = k / 1024
  if (m < 1024) {
    return `${m.toFixed(2)} MB`
  }

  const g = m / 1024
  return `${g.toFixed(2)} GB`
}

const remove = (name: string) => {
  deleteFile({ id: name }).then(v => {
    uploadingList.value = reactive(v)
  })
}
</script>

<style>
.upload-window {
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.list {
  display: flex;
  flex-direction: column;
}

.list > span {
  margin-top: 10px;
}
</style>
