// Copyright © 2022-2026 PM2MD. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

export type PostmanDescription =
  | string
  | {
      content?: string;
      type?: string;
    };

export type PostmanKeyValue = {
  key?: string;
  value?: unknown;
  type?: string;
  description?: PostmanDescription;
  disabled?: boolean;
};

export type PostmanAuth = {
  type: string;
  bearer?: PostmanKeyValue[];
  apikey?: PostmanKeyValue[];
  basic?: PostmanKeyValue[];
  oauth2?: PostmanKeyValue[];
  oauth1?: PostmanKeyValue[];
  awsv4?: PostmanKeyValue[];
  digest?: PostmanKeyValue[];
  [key: string]: unknown;
};

export type PostmanUrl =
  | string
  | {
      raw?: string;
      host?: string | string[];
      path?: string | string[];
      query?: PostmanKeyValue[];
      variable?: PostmanKeyValue[];
    };

export type PostmanBody = {
  mode?: string;
  raw?: string;
  formdata?: PostmanKeyValue[];
  urlencoded?: PostmanKeyValue[];
  graphql?: {
    query?: string;
    variables?: string;
  };
  file?: {
    src?: string;
  };
  options?: {
    raw?: {
      language?: string;
    };
  };
};

export type PostmanResponse = {
  name?: string;
  status?: string;
  code?: number | string;
  body?: string;
  header?: PostmanKeyValue[];
};

export type PostmanRequest = {
  description?: PostmanDescription;
  method?: string;
  url?: PostmanUrl;
  body?: PostmanBody;
  auth?: PostmanAuth;
  header?: PostmanKeyValue[];
};

export type PostmanItem = {
  name: string;
  description?: PostmanDescription;
  item?: PostmanItem[];
  request?: PostmanRequest;
  response?: PostmanResponse[];
};

export type PostmanCollection = {
  info: {
    name: string;
    description?: PostmanDescription;
    schema?: string;
    version?: string;
  };
  item: PostmanItem[];
  auth?: PostmanAuth;
};

// Backwards-compatible type aliases
export type jsonDocument = PostmanCollection;
export type jsonAuth = PostmanAuth;
export type jsonRequest = {
  header?: PostmanKeyValue[];
  key?: string;
  value?: string;
  description?: PostmanDescription;
};
export type jsonReadMethods = PostmanItem;
export type jsonQuery = {
  query?: PostmanKeyValue[];
};
export type jsonBody = PostmanBody;
export type jsonResponse = PostmanResponse;
export type jsonMethod = PostmanItem;
