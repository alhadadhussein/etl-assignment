<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '../services/api';


const message = ref('')

onMounted(async () => {
  message.value = await apiClient.getHello()
})
</script>

<template>
  <h1>{{ message }}</h1>
</template>
