import translate, { Translate } from "..";

// Don't even need to run it to test the types!
async function tests() {
  translate("hello world", "es");
  translate("hello world", { from: "en" });
  translate("hello world", { to: "es" });

  // New stuff
  translate.key = "abc"; // <= not a real key
  translate.engine = "google";

  translate.keys = { google: "abc" }; // <= not a real key
  translate.cache = undefined;
  translate.cache = 1000;
  translate.engines = {
    google: {
      needkey: false,
      fetch: () => ["abc", {}],
      parse: (req) => "hello",
    },
  };

  // Instance
  const t = translate.Translate({
    from: "en",
    to: "es",

    // New stuff
    key: "abc", // <= not a real key
    engine: "google",

    keys: { google: "abc" }, // <= not a real key
    cache: 1000,
    engines: {
      google: {
        needkey: false,
        fetch: () => ["abc", {}],
        parse: (req) => "hello",
      },
    },
  });
  t("hello world", "es");
  t("hello world", { from: "en" });
  t("hello world", { to: "es" });

  // New stuff
  t.key = "abc"; // <= not a real key
  t.engine = "google";

  t.keys = { google: "abc" }; // <= not a real key
  t.cache = undefined;
  t.cache = 1000;
  t.engines = {
    google: {
      needkey: false,
      fetch: () => ["abc", {}],
      parse: (req) => "hello",
    },
  };

  // Another instance
  const t2 = Translate({
    from: "en",
    to: "es",

    // New stuff
    key: "abc", // <= not a real key
    engine: "google",

    keys: { google: "abc" }, // <= not a real key
    cache: 1000,
    engines: {
      google: {
        needkey: false,
        fetch: () => ["abc", {}],
        parse: (req) => "hello",
      },
    },
  });
  t2("hello world", "es");
  t2("hello world", { from: "en" });
  t2("hello world", { to: "es" });

  // New stuff
  t2.key = "abc"; // <= not a real key
  t2.engine = "google";

  t2.keys = { google: "abc" }; // <= not a real key
  t2.cache = undefined;
  t2.cache = 1000;
  t2.engines = {
    google: {
      needkey: false,
      fetch: () => ["abc", {}],
      parse: (req) => "hello",
    },
  };
}

// To make TS happy that we "use" the function
console.log(tests);
