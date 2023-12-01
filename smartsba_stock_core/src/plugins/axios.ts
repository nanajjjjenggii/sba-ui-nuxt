import axios from 'axios';

export default defineNuxtPlugin(() => {
  console.log('🧩 Plugin Name: 💜 Axios');
  const instance = axios.create({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Microservice: 'false',
    },
  });
  return {
    provide: {
      Axios: instance,
    },
  };
});
