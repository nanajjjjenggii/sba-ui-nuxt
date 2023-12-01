import https from 'https';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  console.log('===========================================');
  console.log('[ START ] GET Freshflow Workflow Buttons ');
  try {
    const baseUrl: string = useRuntimeConfig().freshflowUrl;
    const datas = await readBody(event);
    const queryBy: string = datas?.query || '';
    console.log('# datas: ', datas);
    console.log('# queryBy: ', queryBy);
    let basepath = '';
    if (queryBy.trim() === 'appid') {
      basepath = '/rest/app/' + datas.applicationid + '/list/button';
    } else {
      basepath =
        '/rest/flow/list/button/product=' +
        datas.product +
        '&taskname=' +
        datas.taskname;
    }

    console.log(`# Query Button List By: ${baseUrl}${basepath}`);
    const session = event.context.session;
    console.log(`# Fs-Key: ${session.fsKey}`);

    const agentOptions = new https.Agent({
      rejectUnauthorized: false, // (NOTE: this will disable client verification)
    });

    const response = await axios.get(`${baseUrl}${basepath}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Fs-Key': session.fsKey,
      },
      httpsAgent: agentOptions,
    });

    // const result = await response.json();
    const result = await response.data;
    console.log('# Result: ', JSON.stringify(result));
    return result;
  } catch (e) {
    console.error(e);
  } finally {
    console.log('[ END ]');
    console.log('===========================================');
  }
});
