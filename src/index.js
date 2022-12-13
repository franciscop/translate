// translate.js
// Translate text into different languages;

// Load a language parser to allow for more flexibility in the language choice
import languages from "./languages/index.js";

// Cache the different translations to avoid resending requests
import cache from "./cache.js";

import engines from "./engines/index.js";

// Will load only for Node.js and use the native function on the browser
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (error) {
    console.warn("Please make sure node-fetch is available");
  }
}

// Main function
const Translate = function(options = {}) {
  if (!(this instanceof Translate)) {
    return new Translate(options);
  }

  const defaults = {
    from: "en",
    to: "en",
    cache: undefined,
    languages: languages,
    engines: engines,
    engine: "google",
    keys: {}
  };

  const translate = async (text, opts = {}) => {
    // Load all of the appropriate options (verbose but fast)
    // Note: not all of those *should* be documented since some are internal only
    if (typeof opts === "string") opts = { to: opts };
    opts.text = text;
    opts.from = opts.autoDetect ? 'auto' : languages(opts.from || translate.from);
    opts.to = languages(opts.to || translate.to);
    opts.cache = opts.cache || translate.cache;
    opts.engines = opts.engines || {};
    opts.engine = opts.engine || translate.engine;
    opts.url = opts.url || translate.url;
    opts.id =
      opts.id ||
      `${opts.url}:${opts.from}:${opts.to}:${opts.engine}:${opts.text}`;
    opts.keys = opts.keys || translate.keys || {};
    for (let name in translate.keys) {
      // The options has stronger preference than the global value
      opts.keys[name] = opts.keys[name] || translate.keys[name];
    }
    opts.key = opts.key || translate.key || opts.keys[opts.engine];

    // TODO: validation for few of those

    // Use the desired engine
    const engine = opts.engines[opts.engine] || translate.engines[opts.engine];

    // If it is cached return ASAP
    const cached = cache.get(opts.id);
    if (cached) return Promise.resolve(cached);

    // Target is the same as origin, just return the string
    if (opts.to === opts.from) {
      return Promise.resolve(opts.text);
    }

    if (engine.needkey && !opts.key) {
      throw new Error(
        `The engine "${opts.engine}" needs a key, please provide it`
      );
    }

    const fetchOpts = engine.fetch(opts);
    return fetch(...fetchOpts)
      .then(engine.parse)
      .then(translated => cache.put(opts.id, translated, opts.cache));
  };

  for (let key in defaults) {
    translate[key] =
      typeof options[key] === "undefined" ? defaults[key] : options[key];
  }
  return translate;
};

// Small hack needed for Webpack/Babel: https://github.com/webpack/webpack/issues/706
const exp = new Translate();
exp.Translate = Translate;
export default exp;
