import "dotenv/config";

import t from "../../src";
import mock from "../../test/mock";

const translate = t.Translate({ engine: "libre" });
translate.keys.libre = process.env.LIBRE_KEY || "xxx";

describe("Libre mocked requests", () => {
  beforeEach(() => mock.end());
  afterEach(() => mock.end());

  it("works with libretranslate", async () => {
    mock.libre("Hola mundo");
    const text = await translate("Hello world", { to: "es" });
    expect(text).toMatch(/Hola mundo/i);
  });

  it("will throw with a wrong language", async () => {
    const opts = { to: "adgdfnj" };
    await expect(translate("Hello world", opts)).rejects.toMatchObject({
      message: `The language "adgdfnj" is not part of the ISO 639-1`,
    });
  });

  it("will throw with an empty result", async () => {
    mock.libre("");
    const opts = { to: "es" };
    await expect(translate("What's going on?", opts)).rejects.toMatchObject({
      message: "No response found",
    });
  });

  it("requires an API key", async () => {
    const opts = { to: "es" };
    await expect(translate("What's going on?", opts)).rejects.toMatchObject({
      message: "Visit https://portal.libretranslate.com to get an API key",
    });
  });

  it("well the domain is wrong", async () => {
    mock(/example\.*/, new Error("no domain"), { throws: true });

    translate.url = "https://example.com/";
    const opts = { to: "es" };
    await expect(translate("Hello world", opts)).rejects.toMatchObject({
      message: "no domain",
    });
  });
});

describe("libre full requests", () => {
  translate.keys.libre = process.env.LIBRE_KEY;

  it("has an engine", () => {
    expect(translate.engines.libre).toBeDefined();
  });

  if (!process.env.LIBRE_KEY || process.env.LIBRE_KEY === "xxx") {
    return console.log("Libre [PAID] tests skipped");
  }

  it("calls Libre to translate to Japanese", async () => {
    const opts = { to: "ja" };
    expect(await translate("Hello world", opts)).toBe("ハローワールド");
  });

  it("calls Libre to translate to Spanish", async () => {
    const opts = { to: "es" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", key: "abc" };
    await expect(translate("Hello world", opts)).rejects.toThrow();
  });

  it("can set a custom URL", async () => {
    translate.url = "https://example.com/";
    const opts = { to: "es" };
    const text = await translate("libre custom url", opts);
    delete translate.url;
    expect(text).toBe("Url personalizada de libre");
  });
});
