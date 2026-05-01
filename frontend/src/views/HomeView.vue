<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../services/api'
import UploadView from './UploadView.vue'

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
  <v-progress-circular v-if="loading" indeterminate color="primary" />
  <v-alert v-else-if="error" type="error">{{ error }}</v-alert>
  <h1 v-else class="text-h5 mb-4">{{ message }}</h1>

  <UploadView />
</template>
