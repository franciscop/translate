import TranslateClass from ".";
import mock from "./test/mock";
import fs from "fs";

// Quickly load .env files into the environment
import * as dotenv from 'dotenv'

dotenv.config()

describe("translate.js", () => {
  afterEach(() => mock.end());

  it("loads", () => {
    expect(TranslateClass).toBeDefined();
  });

  it("returns a promise", () => {
    const ret = TranslateClass.translate("Hello world");
    expect(ret instanceof Promise).toBe(true);
  });

  it("is smaller than 20kb (uncompressed)", () => {
    const details = fs.statSync(process.cwd() + "/translate.min.js");
    expect(details.size).toBeLessThan(20000);
  });

  it("accepts full language names", async () => {
    const es = await TranslateClass.translate("Hello world", {
      from: "English",
      to: "Spanish"
    });
    expect(es).toMatch(/Hola mundo/i);

    const jp = await TranslateClass.translate("Hello world", {
      from: "English",
      to: "Japanese"
    });
    expect(jp).toBe("こんにちは世界");
  });

  it("accepts weird casing for language names", async () => {
    const es = await TranslateClass.translate("Hello world", {
      from: "english",
      to: "spaNish"
    });
    expect(es).toMatch(/Hola mundo/i);
    const jp = await TranslateClass.translate("Hello world", {
      from: "ENGLISH",
      to: "JapAnesE"
    });
    expect(jp).toBe("こんにちは世界");
  });
});

describe("Independent", () => {
  it("has independent instances", () => {
    TranslateClass.keys.madeup = "a";
    expect(TranslateClass.keys.madeup).toBe("a");
    TranslateClass.keys.madeup = "b";
    expect(TranslateClass.keys.madeup).toBe("b");
  });

  it("is auto initialized", () => {
    expect(TranslateClass.from).toBe("en");
    expect(TranslateClass.from).toBe("en");
  });

  it.skip("fixed the bug #5", async () => {
    // translate.keys = { google: 'abc' };
    const options = { to: "ja", keys: { yandex: "def" }, engine: "google" };

    // This will wrongly ignore the key for "google"
    expect(await TranslateClass.translate("Hello world", options as any)).toBe("こんにちは世界");
  });
});
