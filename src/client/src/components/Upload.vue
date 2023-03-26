<template>
  <input ref="input" type="file" multiple @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const input = ref(null)
const onChange = (e: any) => {
  console.log(e.target.files)
}
</script>
<style></style>
