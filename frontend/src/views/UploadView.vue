<script setup lang="ts">
import { ref } from 'vue';
import apiClient from '../services/api';

const file = ref<File | null>(null);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const onFileChange = (value: File | File[] | null) => {
  successMessage.value = '';
  errorMessage.value = '';
  if (Array.isArray(value)) {
    file.value = value[0] ?? null;
  } else {
    file.value = value ?? null;
  }
};

const validateFile = (f: File): string | null => {
  if (!f.name.endsWith('.csv')) return 'Only .csv files are allowed.';
  return null;
};

const upload = async () => {
  if (!file.value) {
    errorMessage.value = 'Please select a .csv file.';
    return;
  }

  const validationError = validateFile(file.value);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await apiClient.uploadCsv(file.value);
    successMessage.value = 'File uploaded successfully!';
    file.value = null;
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Upload failed.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-row justify="center" class="mt-6">
    <v-col cols="12" sm="8" md="6" lg="5">
      <v-card elevation="2" rounded="lg">
        <v-card-title class="text-h6">Upload CSV</v-card-title>
        <v-card-text>
          <v-file-upload
            accept=".csv"
            :multiple="false"
            density="default"
            title="Drag and drop file here"
            browse-text="Choose file"
            :disabled="loading"
            @update:model-value="onFileChange"
          />
        </v-card-text>
        <v-card-actions v-if="file?.name" class="justify-center pb-4">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            prepend-icon="mdi-cloud-upload"
            :loading="loading"
            @click="upload"
          >
            Upload
          </v-btn>
        </v-card-actions>

        <v-alert v-if="successMessage" type="success" class="mx-4 mb-4" closable>
          {{ successMessage }}
        </v-alert>
        <v-alert v-if="errorMessage" type="error" class="mx-4 mb-4" closable>
          {{ errorMessage }}
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
</template>
