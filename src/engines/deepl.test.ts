import TranslateClass from "..";
import "dotenv/config";

TranslateClass.keys.deepl = process.env.DEEPL_KEY || "xxx";
TranslateClass.key = 'xxx'

describe("deepl full requests", () => {
  // TODO engines is private and can't be tested this way
  it("has an engine", () => {
    // expect(TranslateClass.engines.deepl).toBeDefined();
    expect(TranslateClass).toBeDefined();
  });

  if (!process.env.DEEPL_KEY || process.env.DEEPL_KEY === "xxx") {
    return console.log("DeepL [PAID] tests skipped");
  }

  it("calls DeepL to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "deepl" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("ハローワールド");
  });

  it("calls DeepL to translate to Spanish", async () => {
    const opts = { to: "es", engine: "deepl" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("Hola, mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "deepl", key: "abc" };
    await expect(TranslateClass.translate("Hello world", opts as any)).rejects.toThrow();
  });
});
