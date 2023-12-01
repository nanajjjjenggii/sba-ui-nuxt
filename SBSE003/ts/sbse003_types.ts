export interface FormTypes {
  taskname: string;
  actionmode: string;
  action: string;
  actiontype: string;
  comment: string;
  applicationid: string;
  refapplicationid: string;
  reftype: string;
  sharecode: string /* field Symbol */;
  purpose: string /* field To Purpose */;
  /* ข้อมูลจากฝั่ง Transferee */
  custtype: string;
  custacct: string;
  custcode: string;
  account: string;
  dpaccount: string;
  title: string;
  /* ข้อมูลจากฝั่ง Transferer */
  sharecode2: string /* field= Symbol */;
  purpose2: string /* field= From Purpose */;
  custtype2: string;
  custacct2: string;
  custcode2: string;
  account2: string /* Transferer's Account */;
  dpaccount2: string /* Transferer's Depository Account */;
  titlecode2: string /* ไม่ต้องส่งค่า */;
  title2: string /* Transferer's Prefix */;
  firstname2: string /* ไม่ต้องส่งค่า */;
  lastname2: string /* ไม่ต้องส่งค่า */;
  cardid2: string /* ไม่ต้องส่งค่า */;
  /* ข้อมูล Transaction Details */
  // unit: number /* field unit */;
  // avgprice: number /* avg price */;
  unit: string /* field unit */;
  avgprice: string /* avg price */;
  xdate: string /* X Date */;
  tradeflag: string /* Trade flag */;
  corptxndt: string /* corpdate from 'Choose CA Information' */;
  corptxntype: string /* corptype from 'Choose CA Information' */;
  corptxnno: string /* corpno from 'Choose CA Information' */;
  objective: string /* ค่าจาก field Objective */;
  remark: string /* ค่าจาก field Remarks */;
  shortrefer: string /* ไม่ต้องส่งค่า */;
  userid: string /* Userid */;
  progname: string /* Accessor */;
  channel: string;
  otherperson: string /* ไม่ต้องส่งค่า */;
  foreignflag: string /* ไม่ต้องส่งค่า */;
  xchgmkt: string /* ไม่ต้องส่งค่า */;
  board: string /* ไม่ต้องส่งค่า */;
  custodianflag: string /* ไม่ต้องส่งค่า */;
  creatorreqid: string /* ไม่ต้องส่งค่า */;
  cancelreason: string /* ไม่ต้องส่งค่า */;
  // Update
  refdate: string;
  refno: string;
}

// NewTransactionTypes
export interface EditTransDetailTypes {
  account: string;
  sharecode: string;
  mktcode: string;
  regisflag: boolean;
  fpurpose: string;
  corprefer: string;
  xdate: string;
  avgprice: string;
  tradeflag: string;
  tpurpose: string;
  objective: string;
  remark: string;
  unit: string;

  availableunit?: string;
  transunit?: string;
}

export interface GridFormTypes extends EditTransDetailTypes {
  id: string;
  rowid: string;
}

export interface ListItem {
  actiondate: string;
  taskname: string;
  faccount: string;
  fsharecode: string;
  fpurpose: string;
  unit: string;
  reason?: string;
  taccount?: string;
  avgprice?: string;
  canresend?: string;
  tpurpose?: string;
  result?: string;
  titleresult?: string;
  currentdatetime?: string;
  actionmode?: string;
  resultcode?: string;
  applicationid?: string;
  msgtype?: string;
  reftype?: string;
}

export interface TransactionInfoItem {
  iconname: string;
  inputlabel: string;
  inputname: string;
  inputvalue: string;
  visible: boolean;
}

export interface TransInfoValue {
  applicationid: string;
  createdate: string;
  createuser: string;
  channel: string;
  statusname: string;
  referno: string;
}

// EditTransDetailTypes
export interface TransDetailTypes {
  actionmode: string;
  fsharecode: string;
  fpurpose: string;
  fpurposedesc: string;
  tradeflag: string;
  corprefer: string;
  xdate: string;
  tpurpose: string;
  tpurposedesc: string;
  unit: string;
  avgprice: string;
  objective: string;
  remark: string;
}
