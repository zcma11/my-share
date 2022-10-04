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
  <div class="box">
    <textarea v-model="msg" cols="80" rows="10"></textarea>
    <div class="btn-group">
      <button @click="post">send</button>
      <button @click="get">update</button>
    </div>
  </div>
  <div class="loading" v-show="loadingStatus">loading...</div>
</template>

<style scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 50px;
}
</style>
