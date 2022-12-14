import "dotenv/config";
import TranslateClass from "../index";
import mock from "../test/mock";

TranslateClass.keys.libre = process.env.LIBRE_KEY || "xxx";
TranslateClass.key = 'xxx'

describe("Libre mocked requests", () => {
  beforeEach(() => mock.end());
  afterEach(() => mock.end());

  it("works with libretranslate", async () => {
    mock.libre("Hola mundo");
    const text = await TranslateClass.translate("Hello world", { to: "es", engine: "libre" });
    expect(text).toMatch(/Hola mundo/i);
  });

  it("will throw with a wrong language", async () => {
    const opts = { to: "adgdfnj", engine: "libre" };
    await expect(TranslateClass.translate("Hello world", opts as any)).rejects.toMatchObject({
      message: `The language "adgdfnj" is not part of the ISO 639-1`
    });
  });

  it("will throw with an empty result", async () => {
    mock.libre("");
    const opts = { to: "es", engine: "libre" };
    await expect(TranslateClass.translate("What's going on?", opts as any)).rejects.toMatchObject({
      message: "No response found"
    });
  });

  it("will throw with an empty result", async () => {
    TranslateClass.key = undefined
    const opts = { to: "es", engine: "libre", key: undefined };
    await expect(TranslateClass.translate("What's going on?", opts as any)).rejects.toThrow('Visit https://portal.libretranslate.com to get an API key');
  });

  it("well the domain is wrong", async () => {
    mock(/example\.*/, new Error("no domain"), { throws: true });

    TranslateClass.url = "https://example.com/";
    const opts = { to: "es", engine: "libre" };
    await expect(TranslateClass.translate("Hello world", opts as any)).rejects.toMatchObject({
      message: "no domain"
    });
  });
});

describe("libre full requests", () => {
  TranslateClass.keys.libre = process.env.LIBRE_KEY;

  // TODO engines is private and can't be tested this way
  // it("has an engine", () => {
  //   expect(TranslateClass.engines.libre).toBeDefined();
  // });

  if (!process.env.LIBRE_KEY || process.env.LIBRE_KEY === "xxx") {
    return console.log("Libre [PAID] tests skipped");
  }

  it("calls Libre to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "libre" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("ハローワールド");
  });

  it("calls Libre to translate to Spanish", async () => {
    const opts = { to: "es", engine: "libre" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "libre", key: "abc" };
    await expect(TranslateClass.translate("Hello world", opts as any)).rejects.toThrow();
  });

  it("can set a custom URL", async () => {
    TranslateClass.url = "https://example.com/";
    const opts = { to: "es", engine: "libre" };
    const text = await TranslateClass.translate("libre custom url", opts as any);
    delete TranslateClass.url;
    expect(text).toBe("Url personalizada de libre");
  });
});
