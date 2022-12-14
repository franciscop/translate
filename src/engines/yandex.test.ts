import "dotenv/config";
import TranslateClass from "..";
import mock from "../test/mock";

TranslateClass.keys.yandex = process.env.YANDEX_KEY || "xxx";
TranslateClass.key = 'xxx'

describe("yandex mocked requests", () => {
  beforeEach(() => {
    mock(/yandex.*error/, { code: 500, message: "it fails" });
    mock(
      /yandex.*throw/,
      { code: 500, message: "also fails harder" },
      { throws: true }
    );
  });

  afterEach(() => mock.end());

  it("works with a simple request", async () => {
    mock.yandex("Hola de Yandex");
    const spanish = await TranslateClass.translate("Hello from Yandex", {
      to: "es",
      engine: "yandex"
    });
    expect(spanish).toMatch(/Hola de Yandex/i);
  });

  it("can handle errors from the API", async () => {
    const prom = TranslateClass.translate("error", { to: "es", engine: "yandex" });
    await expect(prom).rejects.toHaveProperty("message", "it fails");
  });

  it("can handle errors thrown by fetch()", async () => {
    const prom = TranslateClass.translate("throw", { to: "es", engine: "yandex" });
    await expect(prom).rejects.toHaveProperty("message", "also fails harder");
  });
});

describe("yandex full requests", () => {
  // TODO engines is private and can't be tested this way
  // it("has an engine", () => {
  //   expect(TranslateClass.engines.yandex).toBeDefined();
  // });

  if (!process.env.YANDEX_KEY || process.env.YANDEX_KEY === "xxx") {
    return console.log("Yandex [PAID] tests skipped");
  }

  it("calls Yandex to translate to Japanese", async () => {
    const opts = { to: "ja", engine: "yandex" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("こんにちは世界");
  });

  it("calls Yandex to translate to Spanish", async () => {
    const opts = { to: "es", engine: "yandex" };
    expect(await TranslateClass.translate("Hello world", opts as any)).toBe("Hola mundo");
  });

  it("requires a valid key", async () => {
    const opts = { to: "ru", engine: "yandex", key: "abc" };
    await expect(await TranslateClass.translate("Hello world", opts as any)).rejects.toThrow();
  });
});
