<script setup lang="ts">
import { AccessorStores } from '~/stores/Accessor';
import { useAppState } from '~/stores/AppState';
const route = useRoute();
onMounted(async () => {
  console.log('😏 mounted!!');

  const query = route.query;

  if (query.fsKey) {
    const fskey = query.fsKey as string;
    await getAccessor(fskey as string);
  }

  delete query.fsKey;

  if (query.fsProggroup) {
    AccessorStores().setFsProggroup(query.fsProggroup as string);
    delete query.fsProggroup;
  }

  if (query.progid) {
    if (query.progid === 'sbmenu_stock') {
      console.log('sbmenu_stock');
      useAppState().setSubmenu(true);
    } else {
      if (!query.action) query.action = '';
      const path: string = '/' + query.progid + '/' + query.action;

      delete query.progid;
      delete query.action;

      navigateTo({ path, replace: true, query });
    }
  } else {
    const path = '/SBSE602';
    navigateTo({ path, replace: true, query });
  }
});
</script>
