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
  src="https://cdn.jsdelivr.net/npm/translate@2/index.min.js"
></script>
```

After including translate the usage is similar for both Node.js and the browser. Now you have to set which engine you want to use (default is 'google'), and the key for it if needed:

```js
translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
translate.key = process.env.DEEPL_KEY;
```

Then you can finally use it. Putting it all together:

```js
// Omit this line if loading form a CDN
import translate from "translate";

translate.engine = "deepl"; // "google", "yandex", "libre", "deepl"
translate.key = process.env.DEEPL_KEY;

const text = await translate("Hello world", "es");
console.log(text);
// "Hola mundo"
```

## Options

The first parameter is the **string** that you want to translate. Right now only a single string of text is accepted.

The second parameter is the options. It accepts either a `String` of the language to translate **to** or a simple `Object` with these options:

- **`to`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Defaults to **en**.
- **`from`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Also defaults to **en**.
- **`cache`**: a `Number` with the milliseconds that each translation should be cached. Leave it undefined to cache it indefinitely (until a server/browser restart).
- **`engine`**: a `String` containing the name of the engine to use for translation. Right now it defaults to `google`. Read more [in the engine section](#engines).
- **`key`**: the API Key for the engine of your choice. Read more [in the engine section](#engines).
- **`url`**: only available for those engines that you can install on your own server (like Libretranslate), allows you to specify a custom endpoint for the translations. [See this issue](https://github.com/franciscop/translate/issues/26#issuecomment-845038821) for more info.

Examples:

```js
// Translate from English (default) to Spanish (specified)
const foo = await translate("Hello world", "es");

// Same as this:
const bar = await translate("Hello world", { to: "es" });
```

> On both `to` and `from` defaulting to `en`: while I _am_ Spanish and was quite tempted to set this as one of those, English is the main language of the Internet and the main secondary language for those who have a different native language. This is why most of the translations will happen either to or from English.

### Default options

You can change the default options for anything by calling the root library and the option name:

```js
translate.from = "es";
translate.engine = "deepl";
```

This can be applied to any of the options enumerated above.

## Engines

Several translating engines are available to translate your text:

- **`google`**: ([demo](https://translate.google.com/) | [docs](https://cloud.google.com/translate/docs/)): Google Translate.
- **`yandex`**: ([demo](https://translate.yandex.com/) | [docs](https://tech.yandex.com/translate/) | [API Key](https://translate.yandex.com/developers/keys)): Yandex Translate
- **`libre`**: ([demo](https://libretranslate.com/)): An independent translation engine. You can use the official website or install it on your own server.
- **`deepl`**: ([demo](https://www.deepl.com/en/translator)): A rapidly growing popular translation engine built with Machine Learning.

> To get the API Key you will be signing some contract with these services; it's your responsibility to follow these and we are not liable if you don't as explained in our MIT License.

Once you get the API key and if you are only going to be using one engine (very likely), we recommend setting this globally for your whole project:

```js
// ... include translate

translate.engine = "deepl";
translate.key = "YOUR-KEY-HERE";

// ... use translate()
```

If you are in Node.js, this likely comes from an environment variable:

```js
// ... include translate

translate.engine = "deepl";
translate.key = process.env.TRANSLATE_KEY;

// ... use translate()
```

To pass it per-translation, you can add it to your arguments:

```js
translate("Hello world", { to: "en", engine: "deepl", key: "YOUR-KEY-HERE" });
```

Specifically in Libretranslate, you can also add a `url` parameter if you install it on your own server:

```js
translate.url = "https://example.com/";
translate.key = process.env.TRANSLATE_KEY;
```

## Promises

Working with Promises and specially with [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) reduces [Callback Hell](http://callbackhell.com/). To see it in action, first you'll need an `async` function. Then put your `await` calls inside:

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
