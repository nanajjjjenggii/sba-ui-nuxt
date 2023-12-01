export declare interface InqSBConfigParams {
  section?: string;
  type?: string;
  name?: string;
}

export const inqSBConfig = async (
  dataitem: InqSBConfigParams,
): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/inqsbconfig/collect',
      data: dataitem,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export const setReqReason = async (dataitem: object): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/setreqreason/retrieve',
      data: dataitem,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};

export const inqTcategory = async (dataitem: object): Promise<object> => {
  try {
    return await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/inqtcategory/collect',
      data: dataitem,
    });
  } catch (error: any) {
    console.log('# error, ', error);
    throw new Error(error);
  }
};
