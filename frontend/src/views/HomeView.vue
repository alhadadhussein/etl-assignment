<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../services/api'

const message = ref('')
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    message.value = await apiClient.getHello()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error">{{ error }}</p>
  <h1 v-else>{{ message }}</h1>
</template>
