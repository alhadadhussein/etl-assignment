<script setup lang="ts">
import { useSnackbar } from '../composables/useSnackbar';

const { visible, message, color } = useSnackbar();
</script>

<template>
  <v-snackbar v-model="visible" :color="color" :timeout="4000">
    <span style="white-space: pre-line">{{ message }}</span>
    <template #actions>
      <v-btn variant="text" @click="visible = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>
