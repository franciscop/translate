import mock from "../test/mock";
import translate from "./";

describe("cache", () => {
  beforeEach(() => {
    mock(/googleapis.*tl=es/, [[["Hola mundo"]]]);
    mock(/googleapis.*tl=ja/, [[["こんにちは世界"]]]);
  });

  afterEach(() => mock.end());

  const delay = time => new Promise(done => setTimeout(done, time));

  it("caches", async () => {
    const before = new Date();
    await translate("Is this cached?", "es");
    const mid = new Date();
    await translate("Is this cached?", "es");
    const after = new Date();
    expect(mid - before).toBeLessThan(10000);
    expect(mid - before).toBeGreaterThan(100);
    expect(after - mid).toBeLessThan(10);
    expect(after - mid).toBeGreaterThanOrEqual(0);
  });

  it("removes cache after the time is out", async () => {
    const before = new Date();
    await translate("Is this also cached?", { to: "es", cache: 1000 });
    const mid = new Date();
    await delay(1100);
    mock(/googleapis.*tl=es/, [[["Hola mundo"]]]);
    await translate("Is this also cached?", { to: "es" });
    const after = new Date();
    expect(mid - before).toBeLessThan(10000);
    expect(mid - before).toBeGreaterThan(100);
    expect(after - mid).toBeLessThan(10000);
    expect(after - mid).toBeGreaterThan(100);
  });
});
