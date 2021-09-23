// Utility method to mock responses from fetch()
const fetchMock = require("fetch-mock");

const delay = time => new Promise(done => setTimeout(done, time));

const mock = (url, body, { throws } = {}) => {
  const callback = async () => {
    await delay(500);
    if (throws) throw body;
    return body;
  };

  fetchMock.getOnce(url, callback, { overwriteRoutes: true });
  fetchMock.postOnce(url, callback, { overwriteRoutes: true });
};

mock.google = (content, opts) => {
  mock(/googleapis\.com\//, [[[content]]], opts);
};

mock.libre = (content, opts) => {
  mock(/libretranslate\.com\//, { code: 200, translatedText: content }, opts);
};

mock.yandex = (content, opts) => {
  mock(/yandex.*&lang=[a-z]*\-es/, { code: 200, text: [content] }, opts);
};

mock.end = () => {
  fetchMock.resetBehavior();
};

module.exports = mock;
