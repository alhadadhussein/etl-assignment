<script setup lang="ts">
import { useAuth } from './auth/useAuth';

const { userName, logout } = useAuth();
</script>

<template>
  <v-app>
    <v-app-bar color="blue-darken-4" density="comfortable">
      <v-app-bar-title>IKEA</v-app-bar-title>
      <v-spacer />
      <span class="text-body-2 mr-3">{{ userName }}</span>
      <v-btn
        variant="outlined"
        size="small"
        prepend-icon="mdi-logout"
        @click="logout"
        >Sign out</v-btn
      >
    </v-app-bar>
    <v-main class="app-main">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-main {
  background-color: #f3f4f6;
}
</style>
