import translate from "../src";
import "dotenv/config";

translate.keys.yandex = process.env.YANDEX_KEY;

describe("yandex full requests", () => {
  it("has an engine", () => {
    expect(translate.engines.yandex).toBeDefined();
  });

  if (!process.env.YANDEX_KEY) {
    return console.warn("Yandex [PAID] tests skipped");
  }

  it("calls Yandex to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "yandex" };
    expect(await translate("Hello world", opts)).toBe("こんにちは世界");
  });

  it("calls Yandex to translate to Spanish", async () => {
    const opts = { to: "es", engine: "yandex" };
    expect(await translate("Hello world", opts)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "yandex", key: "abc" };
    await expect(translate("Hello world", opts)).rejects.toThrow();
  });
});
