import apiFetch from './apiFetch';

const uploadService = {
  async uploadCsv(file: File): Promise<{ message: string; fileId: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiFetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message ?? `Upload failed: ${response.status}`);
    }

    return response.json();
  },
};

export default uploadService;
