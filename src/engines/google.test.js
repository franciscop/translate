import "dotenv/config";
import translate from "../../src";
import mock from "../../test/mock.js";

describe("google mocked responses", () => {
  afterEach(() => mock.end());

  it("can translate a simple string", async () => {
    mock.google("Hola mundo");
    expect(await translate("Hello world", "es")).toMatch(/Hola mundo/i);

    mock.google("Hola mundo");
    const es = await translate("Hello world", { from: "en", to: "es" });
    expect(es).toMatch(/Hola mundo/i);

    mock.google("こんにちは世界");
    const jp = await translate("Hello world", { from: "en", to: "ja" });
    expect(jp).toBe("こんにちは世界");
  });

  it("will throw with a wrong language", async () => {
    await expect(translate("Hello world", "adgdfnj")).rejects.toMatchObject({
      message: `The language "adgdfnj" is not part of the ISO 639-1`
    });
  });

  it("will throw with no response at all", async () => {
    mock.google("");
    // console.log(await translate("What's up?", "es"));
    await expect(translate("What's up?", "es")).rejects.toMatchObject({
      message: "Translation not found"
    });
  });
});

describe("google full requests", () => {
  it("has an engine", () => {
    expect(translate.engines.google).toBeDefined();
  });

  it("calls Google to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "google" };
    expect(await translate("Hello world", opts)).toBe("こんにちは世界");
  });

  it("calls Google to translate to Spanish", async () => {
    const opts = { to: "es", engine: "google" };
    expect(await translate("Hello world", opts)).toMatch(/Hola mundo/i);
  });

  it("works with punctuation", async () => {
    const opts = { to: "pt", engine: "google" };
    const text = await translate(
      "What do you call a pig that knows karate? A pork chop!",
      opts
    );
    expect(text).toBe(
      "Como você chama um porco que sabe caratê? Costeleta de porco!"
    );
  });
});
