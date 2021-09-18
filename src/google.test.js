import translate from "../src";
import "dotenv/config";

translate.keys.google = process.env.GOOGLE_KEY;

describe("google full requests", () => {
  it("has an engine", () => {
    expect(translate.engines.google).toBeDefined();
  });

  if (!process.env.GOOGLE_KEY) {
    return console.warn("Google [PAID] tests skipped");
  }

  it("calls Google to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "google" };
    expect(await translate("Hello world", opts)).toBe("こんにちは世界");
  });

  it("calls Google to translate to Spanish", async () => {
    const opts = { to: "es", engine: "google" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "google", key: "abc" };
    await expect(translate("Hello world", opts)).rejects.toThrow();
  });
});
