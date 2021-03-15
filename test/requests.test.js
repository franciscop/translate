import translate from "../src";
import mock from "./mock";

translate.keys.google = "fakekey";
translate.keys.yandex = "fakekey";

describe("google full requests", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("calls Google to translate to Japanese", async () => {
    mock.google("こんにちは世界");

    // The output result is correct
    expect(await translate("Hello world", { to: "ja" })).toBe("こんにちは世界");

    // The fetch() request is correct
    const outUrl =
      "https://translation.googleapis.com/language/translate/v2?key=fakekey&format=text&source=en&target=ja&q=Hello%20world";
    expect(fetch).toHaveBeenCalledWith(outUrl, { method: "POST" });
  });

  it("calls Google to translate to Spanish", async () => {
    mock.google("Hola mundo");

    // The output result is correct
    expect(await translate("Hello world", { to: "es" })).toBe("Hola mundo");

    // The fetch() request is correct
    const outUrl =
      "https://translation.googleapis.com/language/translate/v2?key=fakekey&format=text&source=en&target=es&q=Hello%20world";
    expect(fetch).toHaveBeenCalledWith(outUrl, { method: "POST" });
  });

  it("requires a key without mocking", async () => {
    await expect(translate("Hello world", { to: "ru" })).rejects.toThrow();
  });
});

describe("yandex full requests", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("calls Yandex to translate to Japanese", async () => {
    mock.yandex("こんにちは世界");

    // The output result is correct
    const opts = { to: "ja", engine: "yandex" };
    expect(await translate("Hello world", opts)).toBe("こんにちは世界");

    // The fetch() request is correct
    const outUrl =
      "https://translate.yandex.net/api/v1.5/tr.json/translate?key=fakekey&lang=en-ja&text=Hello%20world";
    expect(fetch).toHaveBeenCalledWith(outUrl, { method: "POST", body: "" });
  });

  it("calls Yandex to translate to Spanish", async () => {
    mock.yandex("Hola mundo");

    // The output result is correct
    const opts = { to: "es", engine: "yandex" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");

    // The fetch() request is correct
    const outUrl =
      "https://translate.yandex.net/api/v1.5/tr.json/translate?key=fakekey&lang=en-es&text=Hello%20world";
    expect(fetch).toHaveBeenCalledWith(outUrl, { method: "POST", body: "" });
  });

  it("requires a key without mocking", async () => {
    await expect(translate("Hello world", { to: "ru" })).rejects.toThrow();
  });
});

describe("libre full requests", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("calls Libre to translate to Japanese", async () => {
    // The output result is correct
    const opts = { to: "ja", engine: "libre" };
    expect(await translate("Hello world", opts)).toBe("ハローワールド");
  });

  it("calls Libre to translate to Spanish", async () => {
    // The output result is correct
    const opts = { to: "es", engine: "libre" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");
  });

  it("can set a custom URL", async () => {
    mock.libre("Heeey");
    translate.url = "https://example.com/";
    const opts = { to: "es", engine: "libre" };
    const text = await translate("libre custom url", opts);
    delete translate.url;
    expect(text).toBe("Heeey");
    const outUrl = "https://example.com/";
    expect(fetch).toHaveBeenCalledWith(outUrl, {
      body: '{"q":"libre custom url","source":"en","target":"es"}',
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
  });
});
