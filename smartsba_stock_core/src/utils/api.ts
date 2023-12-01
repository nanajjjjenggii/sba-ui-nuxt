import { v4 as uuid4 } from 'uuid';
import { GenericObject } from '~/Types/type';
declare interface GetResponseParams {
  url: string;
  method?: string;
  headers?: object;
  data?: object;
}
declare interface GetResponseBodyParams extends GetResponseParams {
  url: string;
  method?: string;
  headers?: object;
  data?: object;
}

const getValueFromSession = async (key: string): Promise<string> => {
  const { session } = await useSession();
  return session.value != null ? session.value[key] : '';
};

const getHeaders = async () => {
  const { $Axios } = useNuxtApp();
  const headersDefault = $Axios.defaults.headers;
  if (!headersDefault['Fs-Key']) {
    $Axios.defaults.headers['Fs-Key'] = await getValueFromSession('fsKey');
  }
  if (!headersDefault['Fs-Track']) {
    $Axios.defaults.headers['Fs-Track'] = await getValueFromSession('fsUser');
  }

  return $Axios.defaults.headers;
};

export const getRequestResponse = async (
  options: GetResponseParams,
): Promise<GenericObject<object>> => {
  const { $Axios } = useNuxtApp();
  const setHeaders: object = {
    ...(await getHeaders()),
    ...(options.headers || {}),
  };

  console.log('# options: ', options);
  return await $Axios
    .request({
      method: options.method || 'POST',
      url: options.url,
      headers: setHeaders,
      data: options.data,
    })
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      // Handle Error
      console.log('# Get Failed!!: ', error);
    });
};

export const getResponseBody = async (
  options: GetResponseBodyParams,
): Promise<object> => {
  const { $Axios } = useNuxtApp();
  const setHeaders: object = {
    ...(await getHeaders()),
    ...(options.headers || {}),
  };
  return await $Axios
    .request({
      method: options.method || 'POST',
      url: options.url,
      headers: setHeaders,
      data: options.data,
    })
    .then(({ data: resp }) => {
      if (
        Object.getOwnPropertyDescriptor(resp, 'head') &&
        Object.getOwnPropertyDescriptor(resp, 'body')
      ) {
        return resp.body;
      } else {
        throw new Error('Invalid API response structure');
      }
    })
    .catch((error) => {
      // Handle Error
      console.log('# Get Failed!!: ', error);
    });
};

type MicroserviceHeaders = {
  Id: string;
  Microservice: string;
  'Path-Name': string;
  'Transaction-Record'?: number;
};

export type ObjectParams = {
  progname: string;
  lists: Array<object>;
  multi?: boolean;
};

export const getMicroserviceResponse = async (
  dataitem: ObjectParams,
  pathname: string,
  // ): Promise<{ [key: string]: any }> => {
): Promise<{ [key: string]: any } | null> => {
  const header: MicroserviceHeaders = {
    Id: uuid4(),
    Microservice: 'true',
    'Path-Name': pathname,
  };
  if (dataitem.lists && dataitem.multi)
    header['Transaction-Record'] = dataitem.multi
      ? dataitem.lists && dataitem.lists.length
      : 1;

  const { data: response } = await useFetch(`/api/microservices`, {
    headers: header as unknown as Record<string, string>,
    method: 'POST',
    body: {
      ...dataitem,
    },
  });
  return response.value || null;
};
