// Translation engines
// Handle different translations differently to allow for extra flexibility

const google = {
  needkey: true,
  fetch: ({ key, from, to, text }) => [
    `https://translation.googleapis.com/language/translate/v2?key=${key}&format=text&source=${from}&target=${to}&q=${encodeURIComponent(
      text
    )}`,
    { method: "POST" }
  ],
  parse: res =>
    res.json().then(body => {
      if (body.error) {
        throw new Error(body.error.errors[0].message);
      }
      body = body.data.translations[0];
      if (!body) {
        throw new Error("Translation not found");
      }
      return body.translatedText;
    })
};

const yandex = {
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

const libreUrl = "https://libretranslate.com/translate";

const libre = {
  needkey: false,
  fetch: ({ url = libreUrl, key, from, to, text }) => [
    url,
    {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        api_key: key
      }),
      headers: { "Content-Type": "application/json" }
    }
  ],
  parse: res =>
    res.json().then(body => {
      if (!body) {
        throw new Error("No response found");
      }
      if (body.error) {
        throw new Error(body.error);
      }
      return body.translatedText;
    })
};

export default { google, yandex, libre };
