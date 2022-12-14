import mock from "./test/mock";
import TranslateClass from ".";

describe("cache", () => {
  beforeEach(() => {
    mock(/googleapis.*tl=es/, [[["Hola mundo"]]]);
    mock(/googleapis.*tl=ja/, [[["こんにちは世界"]]]);
  });

  afterEach(() => mock.end());

  const delay = time => new Promise(done => setTimeout(done, time));

  // TODO these tests are crappy
  it("caches", async () => {
    const before = new Date();
    await TranslateClass.translate("Is this cached?", { to: "es" });
    const mid = new Date();
    await TranslateClass.translate("Is this cached?", { to: "es" });
    const after = new Date();
    const midBefore = mid.getTime() - before.getTime()
    const afterMid = after.getTime() - mid.getTime()
    expect(midBefore).toBeLessThan(10000);
    expect(midBefore).toBeGreaterThan(100);
    expect(afterMid).toBeLessThan(10);
    expect(afterMid).toBeGreaterThanOrEqual(0);
  });

  it("removes cache after the time is out", async () => {
    const before = new Date();
    await TranslateClass.translate("Is this also cached?", { to: "es", cache: 1000 });
    const mid = new Date();
    await delay(1100);
    mock(/googleapis.*tl=es/, [[["Hola mundo"]]]);
    await TranslateClass.translate("Is this also cached?", { to: "es" });
    const after = new Date();
    const midBefore = mid.getTime() - before.getTime()
    const afterMid = after.getTime() - mid.getTime()
    expect(midBefore).toBeLessThan(10000);
    expect(midBefore).toBeGreaterThan(100);
    expect(afterMid).toBeLessThan(10000);
    expect(afterMid).toBeGreaterThan(100);
  });
});
