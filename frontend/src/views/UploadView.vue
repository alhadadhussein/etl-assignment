<script setup lang="ts">
import { ref } from 'vue';
import uploadService from '../services/uploadService';
import { useSnackbar } from '../composables/useSnackbar';

const file = ref<File | undefined>();
const loading = ref(false);
const { show: showSnackbar } = useSnackbar();

const onFileChange = (value: File | File[] | undefined) => {
  if (Array.isArray(value)) {
    file.value = value[0] ?? undefined;
  } else {
    file.value = value ?? undefined;
  }
};

const validateFile = (f: File): string | null => {
  if (!f.name.endsWith('.csv')) return 'Only .csv files are allowed.';
  return null;
};

const upload = async () => {
  if (!file.value) {
    showSnackbar('Please select a .csv file.', 'error');
    return;
  }

  const validationError = validateFile(file.value);
  if (validationError) {
    showSnackbar(validationError, 'error');
    return;
  }

  loading.value = true;

  try {
    const { message } = await uploadService.uploadCsv(file.value);
    showSnackbar(message, 'success');
    file.value = undefined;
  } catch (e) {
    showSnackbar(e instanceof Error ? e.message : 'Upload failed.', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-row justify="center" class="mt-8">
    <v-col cols="12" sm="8" md="6" lg="5">
      <v-card elevation="2" rounded="lg">
        <v-card-title class="text-h6">Upload CSV</v-card-title>
        <v-card-text>
          <v-file-upload
            :model-value="file"
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
      </v-card>
    </v-col>
  </v-row>
</template>
