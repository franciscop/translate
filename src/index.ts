// translate.js
// Translate text into different languages;

// Load a language parser to allow for more flexibility in the language choice
import languages from "./languages/index";

// Cache the different translations to avoid resending requests
import cache from "./cache";

import engines, { EngineType } from './engines/index';

// Will load only for Node.js and use the native function on the browser
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (error) {
    console.warn("Please make sure node-fetch is available");
  }
}

type TranslateParams = {
  from?: string,
  to?: string,
  cache?: number,
  engine?: keyof typeof engines,
  text?: string,
  autoDetect?: boolean,
  url?: string,
  id?: string,
  key?: string, // what does this do?
}

const defaults = {
  from: "en",
  to: "en",
  cache: undefined,
  languages: languages,
  engines: engines,
  engine: "google" as keyof typeof engines,
  text: undefined,
  url: undefined,
  id: undefined,
  key: undefined,
};

// Main function
class TranslateClass {
  Translate: any
  static from?: string = defaults.from
  static to?: string = defaults.to
  static cache?: any
  static engine?: keyof typeof engines = defaults.engine
  static key?: any
  static url?: string
  static keys?: any = {}

  constructor(options?: any) {
    if (!(this instanceof TranslateClass)) {
      // What's this
      const translateObj = new TranslateClass(options)
      return translateObj;
    }
  }

  static translate = async (text: string, opts?: TranslateParams) => {
    // Load all of the appropriate options (verbose but fast)
    // Note: not all of those *should* be documented since some are internal only
    const config = defaults

    config.text = text;
    config.from = opts?.autoDetect ? 'auto' : languages(opts?.from || this.from || defaults.from);
    config.to = languages(opts?.to || this.to || defaults.to);
    config.cache = opts?.cache || this.cache;
    config.engine = opts?.engine || this.engine || defaults.engine;
    this.engine = config.engine
    config.url = opts?.url || this.url;
    config.id =
      opts?.id ||
      `${config.url}:${config.from}:${config.to}:${config.engine}:${config.text}`;

    // TODO read keys from .env or whatever and use that if there are no keys provided

    config.key = opts?.key || this.key;
    // TODO: validation for few of those

    // Use the desired engine
    const engine: EngineType = config.engines[config.engine]

    // If it is cached return ASAP
    const cached = cache.get(config.id);
    if (cached) return Promise.resolve(cached);

    // Target is the same as origin, just return the string
    if (config.to === config.from) {
      return Promise.resolve(config.text);
    }

    console.log(engine.needkey, config.key)
    if (engine.needkey && !config.key) {
      throw new Error(
        `The engine "${opts.engine}" needs a key, please provide it`
      );
    }

    const fetchOpts = engine.fetch(config);
    return fetch(...fetchOpts)
      .then(engine.parse)
      .then(translated => cache.put(opts.id, translated, opts.cache));
  };
}

export default TranslateClass
