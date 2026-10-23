# Translate [![npm install translate](https://img.shields.io/badge/npm%20install-translate-blue.svg "install badge")](https://www.npmjs.com/package/translate) [![test badge](https://github.com/franciscop/translate/workflows/tests/badge.svg "test badge")](https://github.com/franciscop/translate/blob/master/.github/workflows/tests.yml) [![gzip size](https://img.badgesize.io/franciscop/translate/master/index.min.js.svg?compression=gzip "gzip badge")](https://github.com/franciscop/translate/blob/master/index.min.js)

Convert text to different languages on Node.js and the browser. Flexible package that allows you to use Google (default), [Yandex](https://translate.yandex.com/), [Libre](https://libretranslate.com/) or [DeepL](https://www.deepl.com/en/translator):

```js
import translate from "translate";

translate.engine = "deepl";
translate.key = process.env.DEEPL_KEY;

const text = await translate("Hello world", "es");
console.log(text);
// "Hola mundo"
```

## Getting started

This package can be used in Node.js and on the browser. First thing install the library:

```bash
npm install translate
```

Then import it to use it:

```js
import translate from "translate";
```

Alternatively for the browser you can use [Jsdelivr **CDN**](https://www.jsdelivr.com/package/npm/translate) with the UMD export:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/translate/index.min.js"
></script>
```

After including translate the usage is similar for both Node.js and the browser. Now you have to set which engine you want to use (default is 'google'), and the key for it if needed:

```js
translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
translate.key = process.env.DEEPL_KEY;
```

Then you can use it. Putting it all together:

```js
// Omit this line if loading from a CDN
import translate from "translate";

translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
translate.key = process.env.DEEPL_KEY;

const text = await translate("Hello world", "es");
console.log(text);
// "Hola mundo"
```

## Options

Here is a list of all the options. They all can be set on the root instance like `translate[key] = value` and when creating a new instance `const t = Translate({ ... })`. The function has this signature:

```js
translate(text: string, to: string): Promise<string>
translate(text: string, { to: string, from: string }): Promise<string>
```

These are all of the options:

- **`to`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Defaults to **en**.
- **`from`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Also defaults to **en**.
- **`cache`** \*: a `Number` with the milliseconds that each translation should be cached. Leave it undefined to cache it indefinitely (until a server/browser restart).
- **`engine`** \* (& `engines`): a `String` containing the name of the engine to use for translation. Right now it defaults to `google`. Read more [in the engine section](#engines).
- **`key`** \* (& `keys`): the API Key for the engine of your choice. Read more [in the engine section](#engines).
- **`url`** \*: only available for those engines that you can install on your own server (like Libretranslate), allows you to specify a custom endpoint for the translations. [See this issue](https://github.com/franciscop/translate/issues/26#issuecomment-845038821) for more info.

> \* The options marked as can only be set to the root `translate.cache = 1000` or when creating a new instance `const myDeepL = translate.Translate()`, but not as the second parameter.

Examples:

```js
// Translate from English (default) to Spanish (specified)
const foo = await translate("Hello world", "es");

// Same as this:
const bar = await translate("Hello world", { to: "es" });
```

### Default options

You can change the options in 3 ways. First, for the simple `from` and `to` options, set them as the second argument:

```js
import translate from "translate";

translate("Hello world", "es");
translate("Hola mundo", { from: "en", to: "es" });
```

You can also change the default options straight on the base instance, which should be common for the shared options such as the API key, engine, etc:

```js
import translate from "translate";

// Configure it, setting the "from" to "Spanish" as default!
translate.from = "es";
translate.engine = "deepl";
translate.key = process.env.DEEPL_KEY;

// Use it
await translate("Hola mundo", "ja");
```

Finally, you can combine multiple instances of Translate, which is useful to have different caches, or use different engines at the same time:

```js
// Import the constructor
import { Translate } from 'translate';

// Create an instance
const myLib = Translate({ engine: 'deepl', from: 'es', ... });

// Use it
await myLib("Hola mundo", "ja" );
```

## Engines

Several translating engines are available to translate your text:

- **`google`**: ([demo](https://translate.google.com/) | [docs](https://cloud.google.com/translate/docs/)): Google Translate.
- **`yandex`**: ([demo](https://translate.yandex.com/) | [docs](https://tech.yandex.com/translate/) | [API Key](https://translate.yandex.com/developers/keys)): Yandex Translate
- **`libre`**: ([demo](https://libretranslate.com/)): An independent translation engine. You can use the official website or install it on your own server.
- **`deepl`**: ([demo](https://www.deepl.com/en/translator)): A rapidly growing popular translation engine built with Machine Learning.

> To get the API Key you will be signing some contract with these services; it's your responsibility to follow these and we are not liable if you don't as explained in our MIT License.

Once you get the API key and if you are only going to be using one engine (very likely), we recommend setting this globally for your whole project:

```js
import translate from "translate";

translate.engine = "deepl";
translate.key = "YOUR-KEY-HERE";

// ... use translate()
```

If you are in Node.js, this likely comes from an environment variable:

```js
import translate from "translate";

translate.engine = "deepl";
translate.key = process.env.TRANSLATE_KEY;

// ... use translate()
```

You can create different instances if you want to combine different engines:

```js
import { Translate } from "translate";

const gTranslate = Translate({ engine: "google", key: "..." });
const dTranslate = Translate({ engine: "deepl", key: "..." });
const lTranslate = Translate({ engine: "libre", key: "..." });
```

Specifically in Libretranslate, you can also add a `url` parameter if you install it on your own server:

```js
translate.url = "https://example.com/";
translate.key = process.env.TRANSLATE_KEY;

// or

const lTranslate = Translate({
  engine: "libre",
  url: "...",
  key: "YOUR-KEY-HERE",
});
```

## Promises

This library uses promises which need to be awaited for the translated result:

```js
// Browser; jQuery for demonstration purposes
$("#translate").submit(async (e) => {
  e.preventDefault();
  const text = $(".text").text();
  const spanish = await translate(text, { to: "es" });
  alert(spanish);
});

// Node.js; serverjs.io example for demonstration purposes
const route = async (ctx) => {
  const spanish = await translate(ctx.body, { to: "es" });
  return send(spanish);
};
```

## Authors and thanks

Current package and development: [Francisco Presencia](https://francisco.io/)

Original package and idea: Andrew Lunny (alunny), Marak Squires, Google

Testing in Internet Explorer supported by BrowserStack:

[![BrowserStack logo](https://i.imgur.com/CuCuOkL.png)](https://browserstack.com/)
