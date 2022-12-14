import { EngineType } from './index';

const yandexEngine: EngineType = {
  needkey: true,
  fetch: ({ key, from, to, text }) => [
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&lang=${from}-${to}&text=${encodeURIComponent(
      text
    )}`,
    { method: "POST", body: "" }
  ],
  parse: res =>
    res.json().then(body => {
      if (body.code !== 200) {
        throw new Error(body.message);
      }
      return body.text[0];
    })
};

export default yandexEngine
