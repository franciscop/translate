// Utility method to mock responses from fetch()
const fetchMock = require("fetch-mock");

module.exports = (url, content, throws) => {
  return fetchMock.post(
    url,
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          throws ? reject(content) : resolve(content);
        }, 500);
      })
  );
};

const replyOnce = data => {
  jest.spyOn(global, "fetch");
  if (data instanceof Error) {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusCode: 401,
      json: async () => data
    });
  } else {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      statusCode: 200,
      json: async () => data
    });
  }
};

module.exports.google = translatedText => {
  replyOnce({ data: { translations: [{ translatedText }] } });
};

module.exports.yandex = text => {
  replyOnce({ code: 200, text: [text] });
};

module.exports.libre = translatedText => {
  replyOnce({ translatedText });
};

module.exports.end = () => {
  fetchMock.restore();
};
