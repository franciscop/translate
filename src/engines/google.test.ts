import "dotenv/config";
import TranslateClass from "..";
import mock from "../test/mock";

describe("google mocked responses", () => {
  afterEach(() => mock.end());

  it("can translate a simple string", async () => {
    mock.google("Hola mundo");
    expect(await TranslateClass.translate("Hello world", { to: "es" })).toMatch(/Hola mundo/i);

    mock.google("Hola mundo");
    const es = await TranslateClass.translate("Hello world", { from: "en", to: "es" });
    expect(es).toMatch(/Hola mundo/i);

    mock.google("こんにちは世界");
    const jp = await TranslateClass.translate("Hello world", { from: "en", to: "ja" });
    expect(jp).toBe("こんにちは世界");
  });

  it("will throw with a wrong language", async () => {
    await expect(TranslateClass.translate("Hello world", { to: "adgdfnj" })).rejects.toMatchObject({
      message: `The language "adgdfnj" is not part of the ISO 639-1`
    });
  });

  it("will throw with no response at all", async () => {
    mock.google("");
    // TODO figure out why this fails if i await it
    await expect(TranslateClass.translate("What's up?", { to: "es" })).rejects.toMatchObject({
      message: "Translation not found"
    });
  });
});

describe("google full requests", () => {
  // TODO engines is private and can't be tested this way
  // it("has an engine", () => {
  //   expect(TranslateClass.engines.google).toBeDefined();
  // });

  it("calls Google to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "google" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("こんにちは世界");
  });

  it("calls Google to translate to Spanish", async () => {
    const opts = { to: "es", engine: "google" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toMatch(/Hola mundo/i);
  });

  it("works with punctuation", async () => {
    const opts = { to: "pt", engine: "google" };
    const text = await TranslateClass.translate(
      "What do you call a pig that knows karate? A pork chop!",
      opts as any
    );
    expect(text).toBe(
      "Como você chama um porco que sabe caratê? Uma costeleta de porco!"
    );
  });

  it("autodetects language", async () => {
    const opts = { to: "en", engine: "google", autoDetect: true };
    const text = await TranslateClass.translate(
      "Me gusta la casa",
      opts as any
    );
    expect(text).toBe(
      "I like the house"
    );
  });
});
