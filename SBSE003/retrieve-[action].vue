<script lang="ts" setup>
const route = useRoute();
console.log('# router: ', route);
console.log('# params: ', route.params);
console.log('# query: ', route.query);
const query = route.query;

async function getInqJornalSTKDetail() {
  console.log('# InqJornalSTKDetail !!');
  try {
    console.log('# InqJornalSTKDetail');
    console.log('# route query: ', route.query);
    const data = {
      applicationid: query.applicationid ?? '',
      showcomment: '1',
    };
    const response: { [key: string]: any } = await inqJournalSTKDetail(data);
    console.log('Editdraft Response', response);
    return response;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}

onBeforeMount(async () => {
  await getInqJornalSTKDetail();
});
</script>
