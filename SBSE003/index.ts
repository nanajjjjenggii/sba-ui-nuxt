definePageMeta({
  middleware: [
    async () => {
      return await navigateTo('/sbse003/insert', {
        replace: true,
      });
    },
  ],
});
