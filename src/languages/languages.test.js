import languages from "./";

describe("language parsing", () => {
  it("works with a good language name", () => {
    expect(languages("Spanish")).toBe("es");
  });

  it("works with the plain ISO", () => {
    expect(languages("es")).toBe("es");
    expect(languages("ja")).toBe("ja");
    expect(languages("en")).toBe("en");
  });

  it("works with the alternative ISO 639-2", () => {
    expect(languages("spa")).toBe("es");
    expect(languages("jpn")).toBe("ja");
    expect(languages("eng")).toBe("en");
  });

  it("works with diferent casing", () => {
    expect(languages("spanish")).toBe("es");
    expect(languages("SpANisH")).toBe("es");
    expect(languages("SPANISH")).toBe("es");
  });

  it("throws with an invalid language name type", () => {
    expect(() => languages(20)).toThrow();
  });

  it("throws with a language name too long", () => {
    expect(() =>
      languages(
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      )
    ).toThrow();
  });

  it("throws with a wrong language name", () => {
    expect(() => languages("asdfghjddas")).toThrow();
  });
});
