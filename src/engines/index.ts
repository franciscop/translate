// Translation engines
// Handle different translations differently to allow for extra flexibility

type FetchParamType = {
  url?: string,
  key?: any,
  from: string,
  to: string,
  text: string,
}

type ReturnParamsType = {
  method: string,
  body: any,
  headers?: any,
}

export type EngineType = {
  fetch: (params: FetchParamType) => [string, ReturnParamsType?],
  parse: any,
  needkey?: boolean,
}

import google from "./google";
import yandex from "./yandex";
import libre from "./libre";
import deepl from "./deepl";

export default { google, yandex, libre, deepl };
