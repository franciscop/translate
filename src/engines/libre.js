const libreUrl = "https://libretranslate.com/translate";

export default {
  needkey: false,
  fetch: ({ url = libreUrl, key, from, to, text }) => {
    const body = JSON.stringify({
      q: text,
      source: from,
      target: to,
      api_key: key
    });
    const headers = { "Content-Type": "application/json" };

    return [url, { method: "POST", body, headers }];
  },
  parse: res =>
    res.json().then(body => {
      if (!body) {
        throw new Error("No response found");
      }
      if (body.error) {
        throw new Error(body.error);
      }
      if (!body.translatedText) {
        throw new Error("No response found");
      }
      return body.translatedText;
    })
};
