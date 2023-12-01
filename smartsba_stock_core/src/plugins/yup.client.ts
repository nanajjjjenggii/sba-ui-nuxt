import * as Yup from 'yup';

export default defineNuxtPlugin(() => {
  console.log('🧩 Plugin Name: ☀️ Yup!');
  return {
    provide: {
      Yup,
    },
  };
});
