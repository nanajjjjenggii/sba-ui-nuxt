import { AccessorStores } from '~/stores/Accessor';

export async function getAccessor(fskey: string) {
  try {
    const session = await useSession();
    const { data: response } = await useFetch(
      () => `/api/authref/accessor?fskey=${fskey}`,
    );
    // set the accessor data
    const datas = response.value?.accessor;
    const prog = response.value?.prog;
    const store = AccessorStores();
    console.log({ datas });
    console.log('# session: ', session);
    session.overwrite({ ...datas });

    store.setData({
      fskey: datas?.fsKey || '',
      fsUser: datas?.fsUser || '',
      fsUserName: datas?.fsUserName || '',
      fsLanguage: datas?.fsLanguage || '',
      fsUserStatus: datas?.fsUserStatus || '',
      fsRoleName: datas?.fsRolename?.split(',') || [],
      fsSystemDate: datas?.fsSystemDate || '',
      fsRoles: datas?.fsRoles?.split(',') || [],
      fsUserProject: datas?.fsUserProjectdatas?.split(',') || [],
    });

    prog?.forEach((program) => {
      store.addPermission(program.group, program.itemname, program);
    });
  } catch (error) {
    console.error(error);
  }
}

export default function () {
  return useState('foo', () => 'bar');
}
