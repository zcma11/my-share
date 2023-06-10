<script setup lang="ts">
import { getMessage, postMessage } from 'api'
import { onMounted, ref } from 'vue'
const msg = ref('')
const loadingStatus = ref(false)
const get = () => {
  if (loadingStatus.value) return
  loadingStatus.value = true
  getMessage().then(m => {
    msg.value = m
    loadingStatus.value = false
  })
}

const post = () => {
  if (loadingStatus.value) return

  loadingStatus.value = true

  postMessage({ message: msg.value }).then(() => {
    loadingStatus.value = false
  })
}

onMounted(() => {
  get()
})
</script>

<template>
  <textarea v-model="msg"></textarea>
  <div class="btn-group">
    <button @click="post">send</button>
    <button @click="get">receive latest message</button>
  </div>
  <div class="loading" v-show="loadingStatus">loading...</div>
</template>

<style scoped>
textarea {
  min-height: 50vh;
  font-size: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-color: rgba(187, 255, 170, 0.6);
  border-radius: 10px;
  color: rgb(252, 115, 197);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 50px;
}

.btn-group {
  display: flex;
  align-items: center;
  width: 100%;
  /* height: 50px; */
  margin-top: 15px;
  flex-wrap: wrap;
}

.btn-group button {
  margin-bottom: 10px;
}

.btn-group button:nth-child(1) {
  margin-right: 30px;
}
</style>
