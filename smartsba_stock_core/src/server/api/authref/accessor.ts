import https from 'https';
import axios from 'axios';
import xml2js from 'xml-parser';
import { GenericObject } from '~/Types/type';

interface AccessorObject {
  [key: string]: string;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    console.log('# useRuntimeConfig: ', useRuntimeConfig());
    console.log('FSKEY' + query.fskey);

    const agentOptions = new https.Agent({
      rejectUnauthorized: false, // (NOTE: this will disable client verification)
    });

    const acessorUrl = useRuntimeConfig().accessorUrl
      ? useRuntimeConfig().authrefUrl + useRuntimeConfig().accessorUrl
      : `${useRuntimeConfig().public.baseApiStock}/getaccessor`;

    console.log('# Get Accessor from: ', `${acessorUrl}`);
    console.log('# Get Accessor by: ', {
      type: 'xml',
      key: query.fskey,
    });

    const response = await axios.request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      url: acessorUrl,
      method: 'POST',
      data: {
        type: 'xml',
        key: query.fskey,
      },
      httpsAgent: agentOptions,
    });

    console.log('# response: ', response?.data);
    const responseData = xml2js(response.data);

    const prog: GenericObject<string>[] = [];

    const accessor: AccessorObject = {};
    let treeXML: xml2js.Node;
    responseData.root.children.forEach((child) => {
      const key = child.name;
      const value = child.content;
      if (value !== undefined) {
        accessor[key] = value;
      }

      if (key === 'tree') {
        treeXML = child;
        prog.push(...getProgTree(treeXML));
      }
    });

    return { accessor, prog };
  } catch (error) {
    console.log('# Get Failed!!: ', error);
  }

  function getProgTree(item: xml2js.Node): GenericObject<string>[] {
    const prog: GenericObject<string>[] = [];
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        prog.push(...getProgTree(child));
      });
    } else {
      prog.push(item.attributes);
    }
    return prog;
  }
});
