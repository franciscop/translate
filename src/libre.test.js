import translate from "../src";
import "dotenv/config";

translate.keys.libre = process.env.LIBRE_KEY;

describe("libre full requests", () => {
  it("has an engine", () => {
    expect(translate.engines.libre).toBeDefined();
  });

  if (!process.env.LIBRE_KEY) {
    return console.warn("Libre [PAID] tests skipped");
  }

  it("calls Libre to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "libre" };
    expect(await translate("Hello world", opts)).toBe("ハローワールド");
  });

  it("calls Libre to translate to Spanish", async () => {
    const opts = { to: "es", engine: "libre" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "libre", key: "abc" };
    await expect(translate("Hello world", opts)).rejects.toThrow();
  });

  it("can set a custom URL", async () => {
    translate.url = "https://example.com/";
    const opts = { to: "es", engine: "libre" };
    const text = await translate("libre custom url", opts);
    delete translate.url;
    expect(text).toBe("Url personalizada de libre");
  });
});
