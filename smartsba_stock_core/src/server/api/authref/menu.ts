import https from 'https';
import axios from 'axios';

export default defineEventHandler(async (event) => {
  try {
    console.log('🤣 freshflowUrl: ', useRuntimeConfig().freshflowUrl);
    console.log('🤣 microserviceUrl: ', useRuntimeConfig().microserviceUrl);
    const query = getQuery(event);
    const subGroup = query.subGroup;
    const agentOptions = new https.Agent({
      rejectUnauthorized: false, // (NOTE: this will disable client verification)
    });
    const { request, data } = await axios.get(`${useRuntimeConfig().menuUrl}`, {
      params: {
        programgroupname: subGroup,
      },
      httpsAgent: agentOptions,
    });
    console.log('# ☀️ Get Menues from path: ', request.path);
    console.log('# ☀️ Response: ', data);
    return data;
  } catch (error) {
    console.log('# ☀️ Get Failed!!: ', error);
  }
});
