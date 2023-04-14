import translate from "../";

// Don't even need to run it to test the types!
function tests() {
  translate("hello world", "es");
  // translate("hello world", { abc: "def" });
  translate("hello world", { from: "en" });
  translate("hello world", { to: "es" });
  translate("hello world", { key: "abc" }); // <= not a real key
  translate("hello world", { engine: "google" });

  translate("hello world", { keys: { google: "abc" } }); // <= not a real key
  translate("hello world", { cache: undefined });
  translate("hello world", { cache: 1000 });
  translate("hello world", {
    engines: {
      google: {
        needkey: false,
        fetch: () => ["abc", {}],
        parse: (req) => "hello",
      },
    },
  });
}

// To make TS happy that we "use" the function
console.log(tests);
