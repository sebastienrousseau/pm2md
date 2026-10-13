// Copyright © 2022-2023 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

export type jsonDocument = {
  info: {
    description?: string;
    name: string;
  };
  item: any[];
};

export type jsonAuth = {
  type: any;
  bearer?: any[];
};

export type jsonRequest = {
  header?: any[];
  key?: string;
  value?: string;
  description?: string;
};

export type jsonReadMethods = {
  name: any;
  response: any;
  request: {
    description?: any;
    method?: any;
    url?: any;
    body?: any;
    auth?: any;
    header?: any[];
    key?: string;
    value?: string;
  };
};

export type jsonQuery = {
  query?: any[];
};

export type jsonBody = {
  key?: string;
  value?: string;
  type?: string;
  mode?: string;
  raw?: any;
  formdata?: any[];
};

export type jsonResponse = {
  code?: number | string;
  body?: string;
  length?: number;
  responses?: any[];
};

export type jsonMethod = {
  name: any;
  request: {
    description?: any;
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
