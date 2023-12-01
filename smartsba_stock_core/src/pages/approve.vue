<script setup lang="ts">
import { AccessorStores } from '~/stores/Accessor';
const route = useRoute();
onMounted(async () => {
  console.log('😏 mounted!!');

  const query = route.query;
  if (query.fsKey) {
    await getAccessor(query.fsKey as string);
    delete query.fsKey;
  }

  if (query.fsProggroup) {
    AccessorStores().setFsProggroup(query.fsProggroup as string);
    delete query.fsProggroup;
  }

  navigateTo({ path: '/SBSE198/list', replace: true, query });
});
</script>
