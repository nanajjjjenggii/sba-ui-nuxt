import { FormTypes, ListItem, EditTransDetailTypes } from './sbse003_types';
import { inqSTKTransDetailParams } from '~/utils/api-stock';

const SBSE003 = {
  reftype: 'TC',
  taskname: 'REQSTKMANAGETC' /* From Accessor */,
  progname: 'SBSE003',
  channel: 'SBA Entry',
  product: 'SBA_STOCK',
  MODE_INSERT: 'I',
  MODE_UPDATE: 'U',
  MODE_DELETE: 'D',
};

const SBSE003FormDefault: FormTypes = {
  taskname: SBSE003.taskname,
  actionmode: '',
  action: '',
  actiontype: '',
  comment: '',
  applicationid: '',
  refapplicationid: '',
  reftype: SBSE003.reftype,
  sharecode: '',
  purpose: '',
  /* ข้อมูลจากฝั่ง Transferee */
  custtype: '',
  custacct: '',
  custcode: '',
  account: '',
  dpaccount: '',
  title: '',
  /* ข้อมูลจากฝั่ง Transferer */
  sharecode2: '',
  purpose2: '',
  custtype2: '',
  custacct2: '',
  custcode2: '',
  account2: '',
  dpaccount2: '',
  titlecode2: '',
  title2: '',
  firstname2: '',
  lastname2: '',
  cardid2: '',
  /* ข้อมูล Transaction Details */
  unit: '0',
  avgprice: '0',
  xdate: '',
  tradeflag: '',
  corptxndt: '',
  corptxntype: '',
  corptxnno: '',
  objective: '',
  remark: '',
  shortrefer: '',
  userid: '',
  progname: SBSE003.progname,
  channel: SBSE003.channel,
  otherperson: '',
  foreignflag: '',
  xchgmkt: '',
  board: '',
  custodianflag: '',
  creatorreqid: '',
  cancelreason: '',
  /* Edit Page */
  refdate: '',
  refno: '',
};

const SBSE003Form: FormTypes = { ...SBSE003FormDefault };
const SBSE003NewTransaction: EditTransDetailTypes = {
  account: '',
  sharecode: '',
  mktcode: '',
  regisflag: false,
  fpurpose: '',
  availableunit: '0',
  tradeflag: 'Y',
  corprefer: '',
  xdate: '',
  tpurpose: '',
  unit: '0',
  avgprice: '0.000000',
  objective: '',
  remark: '',
  transunit: '0',
};
const FAccountDetail = {
  account: {
    id: 'faccount',
    name: 'faccount',
    require: true,
  },
  depacc: {
    id: 'fdpaccount',
    name: 'fdpaccount',
    require: true,
  },
  cardid: {
    id: 'fcardid',
    name: 'fcardid',
    require: false,
  },
  prefixcode: {
    id: 'ftitlecode',
    name: 'titlecode',
    require: false,
  },
  prefixdesc: {
    id: 'ftitle',
    name: 'title',
    require: false,
  },
  custname: {
    id: 'fname',
    name: 'fname',
    require: false,
  },
};

const TAccountDetail = {
  account: {
    id: 'taccount',
    name: 'taccount',
    require: true,
  },
  depacc: {
    id: 'tdpaccount',
    name: 'tdpaccount',
    require: true,
  },
  cardid: {
    id: 'tcardid',
    name: 'tcardid',
    require: false,
  },
  prefixcode: {
    id: 'ttitlecode',
    name: 'ttitlecode',
    require: false,
  },
  prefixdesc: {
    id: 'ttitle',
    name: 'ttitle',
    require: false,
  },
  custname: {
    id: 'tname',
    name: 'tname',
    require: false,
  },
};
export interface ResponseTypes {
  lists: ListItem[];
}

const responseToResultPage = async (page: string): Promise<void> => {
  console.log(`# go to Result Page: /sbse003/${page}/result`);
  await navigateTo(`/sbse003/${page}/result`);
};
// const { session } = await useSession();
// const serializeDatas = (datalists, actionmode: string): FormTypes[] => {
//   const newArr: Array<never | FormTypes> = [];
//   datalists.value.forEach((item: { [key: string]: any }) => {
//     newArr.push({
//       ...Form,
//       actionmode /* Strict */,
//       applicationid: '',
//       refapplicationid: '',
//       sharecode: item.sharecode,
//       purpose: item.tpurpose,
//       sharecode2: item.sharecode,
//       purpose2: item.fpurpose,
//       /* ค่าจาก Transferee */
//       custtype: item.custtype,
//       custacct: item.custacct,
//       custcode: item.custcode,
//       account: item.account,
//       dpaccount: item.dpaccount,
//       title: item.prefixcode,
//       /* ค่าจาก Transferer */
//       custtype2: item.custtype2,
//       custacct2: item.custacct2,
//       custcode2: item.custcode2,
//       account2: item.account2,
//       dpaccount2: item.dpaccount2,
//       title2: item.prefixcode2,
//       /* ค่าจาก Transaction Details */
//       unit: item.unit,
//       avgprice: item.avgprice,
//       xdate: item.xdate || '',
//       tradeflag: item.tradeflag,
//       corptxndt: item.corpdate,
//       corptxntype: item.corptype,
//       corptxnno: item.corpno,
//       objective: item.objective,
//       remark: item.remark,
//       userid: session.value?.fsUser,
//       // userid: fsAccessor.getUser,
//     });
//   });
//   return newArr;
// };

// const handleSubmitData = (
//   newValue: any,
//   initValue: any,
//   path: string,
// ): void => {
//   console.log('# handleSubmitData!!!');
//   console.log('# newValue: ', newValue);
//   console.log('# initValue: ', initValue);
//   const route = useRoute();
//   console.log('# route: ', route);

//   const newLists = [];
//   const datalist = {
//     ...initValue,
//     ...newValue,
//   };
//   // newLists.push({
//   //   ...initValue,
//   //   ...newValue,
//   // });

//   newArr.push({
//       ...formInsert,
//       actionmode: sbse003.MODE_INSERT /* Strict */,
//       applicationid: '',
//       refapplicationid: '',
//       sharecode: item.sharecode,
//       purpose: item.tpurpose,
//       sharecode2: item.sharecode,
//       purpose2: item.fpurpose,
//       /* ค่าจาก Transferee */
//       custtype: taccount.custtype,
//       custacct: taccount.custacct,
//       custcode: taccount.custcode,
//       account: taccount.account,
//       dpaccount: taccount.dpaccount,
//       title: taccount.prefixcode,
//       /* ค่าจาก Transferer */
//       custtype2: faccountData.value.custtype,
//       custacct2: faccountData.value.custacct,
//       custcode2: faccountData.value.custcode,
//       account2: faccountData.value.account,
//       dpaccount2: faccountData.value.dpaccount,
//       title2: faccountData.value.prefixcode,
//       /* ค่าจาก Transaction Details */
//       unit: item.unit,
//       avgprice: item.avgprice,
//       xdate: item.xdate || '',
//       tradeflag: item.tradeflag,
//       corptxndt: item.corpdate,
//       corptxntype: item.corptype,
//       corptxnno: item.corpno,
//       objective: item.objective,
//       remark: item.remark,
//       userid: fsAccessor.getUser,
//     } as FormTypes);
//   });

//   console.log('# stkManageTrans | data: ', {
//     progname: 'sbse003',
//     lists: newLists,
//   });

//   // popup.confirmActionFlow({
//   //   actiontype: initValue.actiontype,
//   //   confirm: async function () {
//   //     console.log('# flow confirm Action!');
//   //     const newLists = [];
//   //     newLists.push({
//   //       ...initValue,
//   //       ...newValue,
//   //     });

//   //     const resp: { [key: string]: any } = await stkManageTrans(
//   //       {
//   //         progname: 'sbse003',
//   //         lists: newLists,
//   //       },
//   //       initValue.actionmode,
//   //     );

//   //     console.log('# response.lists: ', resp.lists);
//   //     const responseData = reactive<Response>({ lists: [] });
//   //     // responseData.lists = [];
//   //     responseData.lists = resp.lists;

//   //     await responseToResultPage(path);

//   //     /* After stkManageTrans finished */
//   //     /* Keep response data to sbse003.result */
//   //     /* call navigateTo */
//   //     // await navigateTo({
//   //     //   path: `/sbse003/${path}/result`,
//   //     // });
//   //   },
//   //   cancel: function () {
//   //     console.log('# flow cancel Action!');
//   //   },
//   // });
// };

const getInqJornalSTKDetail = async (applicationid: string) => {
  console.log('# InqJornalSTKDetail !!');
  try {
    const data = {
      applicationid: applicationid ?? '',
      showcomment: '1',
    };
    const response: { [key: string]: any } = await inqJournalSTKDetail(data);
    console.log('Editdraft Response', response);
    return response;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const getInqSTKTransDetail = async (dataItem: inqSTKTransDetailParams) => {
  const data = {
    reftype: dataItem.reftype || '',
    refdate: dataItem.refdate || '',
    refno: dataItem.refno || '',
  };
  const response: { [key: string]: any } = await inqSTKTransDetail(data);
  console.log('Editdraft Response', response);
  return response;
};

const response: ResponseTypes = {
  lists: [],
};

export default {
  ...SBSE003,
  FAccountDetail,
  TAccountDetail,
  Form: SBSE003Form,
  Transdetail: SBSE003NewTransaction,
  DefaultTransdetail: SBSE003NewTransaction,
  responseToResultPage,
  // handleSubmitData,
  getInqJornalSTKDetail,
  getInqSTKTransDetail,
  response,
};
