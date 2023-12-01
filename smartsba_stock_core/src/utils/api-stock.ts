import { ObjectParams, getMicroserviceResponse } from './api';
/* ================================== */
/* Stock Manage Transaction */
/* ================================== */
const pathnameStock = '/api/stock/smartfresh';
const microserviceManage = {
  queuename: 'stkmodule',
  response: 'true',
  key: 'progname',
};
type responseTypes = {
  [key: string]: any;
} | null;

const getMicroserviceSTKResponse = async (
  dataitem: ObjectParams,
  pathname: string,
) => {
  return await getMicroserviceResponse(
    { ...dataitem, ...microserviceManage },
    pathnameStock + pathname,
  );
};

export const stkManageTrans = async (
  dataitem: ObjectParams,
  actionmode: string,
): Promise<object> => {
  try {
    let actionname = '';
    switch (actionmode) {
      case 'U':
        actionname = 'update';
        break;
      case 'D':
        actionname = 'delete';
        break;
      default:
        actionname = 'insert';
    }
    const response: responseTypes = await getMicroserviceSTKResponse(
      dataitem,
      '/stkmanagetrans/' + actionname,
    );
    console.log('# response: ', response);
    return response?.body || null;
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export interface returnSTKTransParams {}

export const returnSTKTrans = async (
  dataitem: ObjectParams,
): Promise<object> => {
  try {
    const response: responseTypes = await getMicroserviceSTKResponse(
      dataitem,
      '/returnstktrans/return',
    );
    console.log('# response: ', response);
    return response?.body || null;
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export const rejectSTKTrans = async (
  dataitem: ObjectParams,
): Promise<object> => {
  try {
    const response: responseTypes = await getMicroserviceSTKResponse(
      dataitem,
      '/rejectstktrans/reject',
    );
    console.log('# response: ', response);
    const multi = dataitem.multi || false;
    return !multi ? response?.body : response || null;
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export const approveSTKTrans = async (
  dataitem: ObjectParams,
): Promise<object> => {
  try {
    const response: responseTypes = await getMicroserviceSTKResponse(
      dataitem,
      '/approvestktrans/approve',
    );
    console.log('# response: ', response);
    const multi = dataitem.multi || false;
    return !multi ? response?.body : response || null;
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export interface inqSTKTransDetailParams {
  reftype: string;
  refdate: string;
  refno: string;
}

export const inqSTKTransDetail = async (
  obj: inqSTKTransDetailParams,
): Promise<object> => {
  try {
    return await getResponseBody({
      url:
        useRuntimeConfig().public.baseApiStock + '/inqstktransdetail/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export const inqJournalSTKDetail = async (obj: object): Promise<object> => {
  try {
    return await getResponseBody({
      url:
        useRuntimeConfig().public.baseApiStock + '/inqjournalstkdetail/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

/* ================================== */
/* Stock Utility */
/* ================================== */
export const inqAvgPrice = async (obj: object): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/inqavgprice/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export declare interface InqMaxXdateParams {
  sharecode?: string;
}
export const inqMaxXdate = async (obj: InqMaxXdateParams): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/inqmaxxdate/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export declare interface InqStockProfileParams {
  account?: string;
  sharecode?: string;
  purpose?: string;
}

export const inqStockProfile = async (
  obj: InqStockProfileParams,
): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/inqstockprofile/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export declare interface InqSTKPortfolioParams {
  account?: string;
  sharecode?: string;
  purpose?: string;
}

export const inqSTKPortfolio = async (
  obj: InqSTKPortfolioParams,
): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/inqstkportfolio/inquiry',
      data: obj,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export const lookupTitlecode = async (obj: object): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/lookuptitlecode/lookup',
      data: obj,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};
