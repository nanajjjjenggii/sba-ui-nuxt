<script setup lang="ts">
import { AccessorStores } from '~/stores/Accessor';
const { session, overwrite } = await useSession();

console.log('# session: ', session);
console.log('# session.value: ', session.value);
// session.value;
// await overwrite({ hello: 'session', test: 1234, userLikesCookies: true });

const route = useRoute();
onMounted(async () => {
  console.log('😏 mounted!!');

  const query = route.query;

  const { data: response } = await useFetch(
    () => `/api/authref/accessor?fskey=${query.fsKey}`,
  );

  console.log('# response: ', response.value);
  const rawValue: any = await response.value;
  const accessor: { [key: string]: any } = rawValue?.accessor;
  console.log('# accessor: ', accessor);
  await overwrite({ ...accessor });
  console.log('# session.value: ', session.value);

  if (query.fsKey) {
    await getAccessor(query.fsKey as string);
    delete query.fsKey;
  }

  if (query.fsProggroup) {
    AccessorStores().setFsProggroup(query.fsProggroup as string);
    delete query.fsProggroup;
  }

  if (query.progid) {
    const path: string = '/' + query.progid + '/editdraft';

    delete query.progid;
    delete query.action;

    navigateTo({ path, replace: true, query });
  }
});
</script>
