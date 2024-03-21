import "dotenv/config";

import fs from "fs";

import mock from "../test/mock";
import translate from "./";

describe("translate.js", () => {
  afterEach(() => mock.end());

  it("loads", () => {
    expect(translate).toBeDefined();
  });

  it("returns a promise", () => {
    const ret = translate("Hello world");
    expect(ret instanceof Promise).toBe(true);
  });

  it("is smaller than 20kb (uncompressed)", () => {
    const details = fs.statSync(process.cwd() + "/index.min.js");
    expect(details.size).toBeLessThan(10000);
  });

  it("accepts full language names", async () => {
    const es = await translate("Hello world", {
      from: "English",
      to: "Spanish",
    });
    expect(es).toMatch(/Hola mundo/i);

    const jp = await translate("Hello world", {
      from: "English",
      to: "Japanese",
    });
    expect(jp).toBe("こんにちは世界");
  });

  it("accepts weird casing for language names", async () => {
    const es = await translate("Hello world", {
      from: "english",
      to: "spaNish",
    });
    expect(es).toMatch(/Hola mundo/i);
    const jp = await translate("Hello world", {
      from: "ENGLISH",
      to: "JapAnesE",
    });
    expect(jp).toBe("こんにちは世界");
  });

  it("does not accept other keys", async () => {
    await expect(() =>
      translate("hello", { to: "es", blabla: "blu" })
    ).rejects.toThrow("Invalid option with the name 'blabla'");
  });

  it("requires the key", async () => {
    const yandex = translate.Translate({ engine: "yandex", key: false });
    await expect(() => yandex("hello", "es")).rejects.toThrow(
      'The engine "yandex" needs a key, please provide it'
    );
  });
});

describe("Independent", () => {
  it("has independent instances", () => {
    const translate2 = new translate.Translate();
    translate.keys.madeup = "a";
    translate2.keys.madeup = "b";
    expect(translate.keys.madeup).toBe("a");
    expect(translate2.keys.madeup).toBe("b");
  });

  it("is auto initialized", () => {
    let inst = translate.Translate();
    expect(inst.from).toBe("en");
    inst = new translate.Translate();
    expect(inst.from).toBe("en");
  });

  it("cannot poison the cache", async () => {
    const options = {
      id: "undefined:en:nl:google:I love you",
      from: "en",
      to: "ja",
    };
    await expect(() => translate("hello", options)).rejects.toThrow(
      "Invalid option with the name 'id'"
    );
  });
});
