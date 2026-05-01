<script setup lang="ts">
import { useAuth } from './auth/useAuth'

const { isAuthenticated, user, logout } = useAuth()
</script>

<template>
  <header v-if="isAuthenticated">
    <span>{{ user }}</span>
    <button @click="logout">Logout</button>
  </header>
  <router-view />
</template>

