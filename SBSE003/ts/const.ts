export const csbse003 = {
  reftype: 'TC',
  taskname: 'REQSTKMANAGETC',
  progname: 'SBSE003',
  channel: 'SBA Entry',
  product: 'SBA_STOCK',
  INSERT: 'I',
  UPDATE: 'U',
  DELETE: 'D',
  // rolename: 'STOCKCHECKER',
  // resultpath: {
  //   approve: '/SBSE007/approve/result',
  //   delete: '/SBSE007/delete/result',
  //   editdraft: '/SBSE007/editdraft/result',
  //   insert: '/SBSE007/insert/result',
  //   update: '/SBSE007/update/result',
  // },
  // actionmap: {
  //   '40': 'R', // Return
  //   '60': 'J', // Reject
  //   '30': 'P', // Approve
  // },
};

export const gridColumns: object[] = [
  {
    field: 'index',
    editable: false,
    hidden: true,
  },
  {
    field: 'fromport',
    editable: false,
    hidden: true,
  },
  {
    title: 'Seq.',
    width: 70,
    className: 'text-center',
    cell: 'runningRecord',
  },
  {
    field: 'unit',
    editable: false,
    hidden: true,
  },
  { field: 'sharecode', title: 'Symbol', width: 100, className: 'text-center' },
  {
    field: 'fpurpose',
    title: 'From Purpose',
    width: 120,
    className: 'text-center',
  },
  {
    field: 'transunit',
    title: 'Transfer Unit',
    cell: 'numericFormat',
    width: 180,
    className: 'text-end',
  },
  {
    field: 'avgprice',
    title: 'Avg. Cost',
    cell: 'numericFormat',
    width: 180,
    className: 'text-end',
  },
  { field: 'objective', title: 'Objective', width: 200 },
  { title: 'Action', cell: 'actionRecord', width: 230 },
];
