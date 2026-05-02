import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const color = ref<'success' | 'error'>('success');

export function useSnackbar() {
  const show = (msg: string, type: 'success' | 'error') => {
    message.value = msg;
    color.value = type;
    visible.value = true;
  };

  return { visible, message, color, show };
}
