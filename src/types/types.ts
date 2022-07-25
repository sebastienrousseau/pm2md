type jsonDocument = {
  info: {
    description: string;
    name: string;
  };
  item: any[];
};

type jsonAuth = {
  type: any;
  bearer: any[];
};

type jsonRequest = {
  header: any[];
  key: string;
  value: string;
  description: string;
};

type jsonReadMethods = {
  name: any;
  response: any;
  request: {
    description: any;
    method: any;
    url: any;
    body: any;
    auth: any;
    header: any[];
    key: string;
    value: string;
  };
};

type jsonQuery = {
  query: any[];
};

type jsonBody = {
  key: string;
  value: string;
  type: string;
  mode: string;
  raw: any;
  formdata: any[];
};

type jsonResponse = {
  length: number;
  responses: any[];
};

type jsonMethod = {
  name: any;
  request: {
    description: any;
    method?: any;
    url?: any;
    body?: any;
    auth?: any;
    header?: any[];
    key?: string;
    value?: string;
  };
  response: string | any[];
};
export {
  type jsonAuth,
  type jsonBody,
  type jsonDocument,
  type jsonMethod,
  type jsonQuery,
  type jsonReadMethods,
  type jsonRequest,
  type jsonResponse
};
