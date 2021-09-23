import translate from "../../src";
import "dotenv/config";

translate.keys.deepl = process.env.DEEPL_KEY || "xxx";

describe("deepl full requests", () => {
  it("has an engine", () => {
    expect(translate.engines.deepl).toBeDefined();
  });

  if (!process.env.DEEPL_KEY || process.env.DEEPL_KEY === "xxx") {
    return console.log("DeepL [PAID] tests skipped");
  }

  it("calls DeepL to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "deepl" };
    expect(await translate("Hello world", opts)).toBe("ハローワールド");
  });

  it("calls DeepL to translate to Spanish", async () => {
    const opts = { to: "es", engine: "deepl" };
    expect(await translate("Hello world", opts)).toBe("Hola, mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "deepl", key: "abc" };
    await expect(translate("Hello world", opts)).rejects.toThrow();
  });
});
