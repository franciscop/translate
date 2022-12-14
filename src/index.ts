// translate.js
// Translate text into different languages;

// Load a language parser to allow for more flexibility in the language choice
import languages from "./languages/index";

// Cache the different translations to avoid resending requests
import NodeCache from 'node-cache';

import engines, { EngineType } from './engines/index';

// Will load only for Node.js and use the native function on the browser
if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (error) {
    console.warn("Please make sure node-fetch is available");
  }
}

const myCache = new NodeCache();

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
  cache: 1000,
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
    const config = { ...defaults }

    config.from = opts?.autoDetect ? 'auto' : languages(opts?.from || this.from || defaults.from);
    config.to = languages(opts?.to || this.to || defaults.to);
    config.cache = opts?.cache || this.cache;
    config.engine = opts?.engine || this.engine || defaults.engine;
    this.engine = config.engine
    const url = opts?.url || this.url;
    const engine: EngineType = config.engines[config.engine]

    const fetchOpts = engine.fetch({ ...config, text, url});

    const id = `${fetchOpts[0]}:${config.from}:${config.to}:${config.engine}:${text}`;

    // TODO read keys from .env or whatever and use that if there are no keys provided

    config.key = opts?.key || this.key;
    // TODO: validation for few of those

    // Use the desired engine

    // If it is cached return ASAP
    const cached = myCache.get(id);
    if (cached) {
      return Promise.resolve(cached);
    }

    // Target is the same as origin, just return the string
    if (config.to === config.from) {
      return Promise.resolve(config.text);
    }

    if (engine.needkey && !config.key) {
      throw new Error(
        `The engine "${config.engine}" needs a key, please provide it`
      );
    }

    return fetch(...fetchOpts)
      .then(engine.parse)
      .then(translated => {
        myCache.set(id, translated, config.cache)
        return translated
      });
  };
}

export default TranslateClass
