export default {
  needkey: true,
  fetch: ({ key, from, to, text }) => {
    const suffix = /:fx$/.test(key) ? "-free" : "";
    text = encodeURIComponent(text);
    let url = `https://api${suffix}.deepl.com/v2/translate?auth_key=${key}`;

    if (from !== null) {
        url += `&source_lang=${from}`;
    }

    url += `&target_lang=${to}&text=${text}`;

    return [
        url,
      { method: "POST", body: "" },
    ];
  },
  parse: async (res) => {
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error("Auth Error, please review the key for DeepL");
      }
      throw new Error(`Error ${res.status}`);
    }
    return res.json().then((body) => body.translations[0].text);
  },
};
