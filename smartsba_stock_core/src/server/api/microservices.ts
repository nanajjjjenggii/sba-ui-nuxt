import https from 'https';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  console.debug('===========================================');
  console.debug('[ START ] Call Microservice');
  try {
    const baseUrl: string = useRuntimeConfig().microserviceUrl;
    const headers = await getHeaders(event);
    const datas = await readBody(event);
    console.debug('# event: ', event);
    console.debug('# baseUrl: ', baseUrl);
    console.debug('# headers: ', headers);
    console.debug('# datas: ', datas);

    // const setHeaders: object = {
    //   ...(await getHeaders()),
    //   ...(options.headers || {}),
    // };

    // console.log('# options: ', options);
    // return await $Axios
    //   .request({
    //     method: options.method || 'POST',
    //     url: options.url,
    //     headers: setHeaders,
    //     data: options.data,
    //   })
    //   .then(({ data }) => {
    //     return data;
    //   })
    //   .catch((error) => {
    //     // Handle Error
    //     console.log('# Get Failed!!: ', error);
    //   });

    // let basepath = '';
    // if (queryBy.trim() === 'appid') {
    //   basepath = '/rest/app/' + datas.applicationid + '/list/button';
    // } else {
    //   basepath =
    //     '/rest/flow/list/button/product=' +
    //     datas.product +
    //     '&taskname=' +
    //     datas.taskname;
    // }

    // console.log(`# Query Button List By: ${baseUrl}${basepath}`);
    const session = event.context.session;
    // console.log(`# Fs-Key: ${session.fsKey}`);

    const agentOptions = new https.Agent({
      rejectUnauthorized: false, // (NOTE: this will disable client verification)
    });
    const request = await axios.request({
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Fs-Key': session.fsKey,
        Id: headers.id,
        Microservice: headers.microservice,
      },
      httpsAgent: agentOptions,
      url: baseUrl,
      data: JSON.stringify(datas),
    });
    console.debug('# Request: ', request);

    // const result = await response.json();
    const result = await request.data;
    console.log('# Result: ', JSON.stringify(result));
    return result;
  } catch (e) {
    console.error(e);
  } finally {
    console.debug('[ END ] Call Microservice');
    console.debug('===========================================');
  }
});
