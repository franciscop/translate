// Utility method to mock responses from fetch()
import fetchMock from "fetch-mock-jest";

const delay = time => new Promise(done => setTimeout(done, time));

const mock = (url, body, { throws } = {} as any) => {
  const callback = async () => {
    await delay(500);
    if (throws) throw body;
    return body;
  };

  fetchMock.getOnce(url, callback, { overwriteRoutes: true });
  fetchMock.postOnce(url, callback, { overwriteRoutes: true });
};

mock.google = (content, opts?: any) => {
  mock(/googleapis\.com\//, [[[content]]], opts);
};

mock.libre = (content, opts?: any) => {
  mock(/libretranslate\.com\//, { code: 200, translatedText: content }, opts);
};

mock.yandex = (content, opts?: any) => {
  mock(/yandex.*&lang=[a-z]*\-es/, { code: 200, text: [content] }, opts);
};

mock.end = () => {
  fetchMock.resetBehavior();
};

export default mock
