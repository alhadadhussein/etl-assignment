import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const color = ref<'success' | 'error'>('success');

export const useSnackbar = () => {
  const show = (msg: string, type: 'success' | 'error') => {
    message.value = msg;
    color.value = type;
    visible.value = true;
  };

  const hide = () => {
    visible.value = false;
  };

  return { visible, message, color, show, hide };
}
