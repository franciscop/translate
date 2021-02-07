# Translate

Convert text to different languages on Node.js and the browser. Flexible package and powerful back-end using Google (default), Yandex or [Libre](https://libretranslate.com/):

```js
// async/await. Options can be a language name (ISO 639)
const text = await translate("Hello world", "es");
console.log(text); // Hola mundo

// Promises with .then(). Options can also be an object
translate("こんにちは世界", { from: "ja", to: "es" }).then(text => {
  console.log(text); // Hola mundo
});
```

## Getting started

This package can be used in Node.js and on the browser. For the browser we are using `fetch`, so you might want to [polyfill it](https://polyfill.io/v2/docs/) depending on [the browsers you support](https://caniuse.com/#feat=fetch).

To use it in `node.js` first install it:

```bash
npm install translate
```

Then import it to use it:

```js
const translate = require("translate"); // Old school
import translate from "translate"; // New wave
```

To use it in the browser download the main `translate.min.js` file and include it:

```html
<script src="translate.min.js"></script>
```

Or use the awesome [Jsdelivr **CDN**](https://www.jsdelivr.com/package/npm/translate):

```html
<script src="https://cdn.jsdelivr.net/npm/translate@1/translate.min.js"></script>
```

After including translate the usage is similar for both Node.js and the browser.

## Options

The first parameter is the **string** that you want to translate. Right now only a single string of text is accepted.

The second parameter is the options. It accepts either a `String` of the language to translate **to** or a simple `Object` with these options:

- **`to`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Defaults to **en**.
- **`from`**: the string of the language to translate to. It can be in any of the two ISO 639 (1 or 2) or the full name in English like `Spanish`. Also defaults to **en**.
- **`cache`**: a `Number` with the milliseconds that each translation should be cached. Leave it undefined to cache it indefinitely (until a server/browser restart).
- **`engine`**: a `String` containing the name of the engine to use for translation. Right now it defaults to `google`. Read more [in the engine section](#engines).
- **`key`**: the API Key for the engine of your choice. Read more [in the engine section](#engines).

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
```

This can be applied to any of the options enumerated above.

## Engines

Several translating engines are available to translate your text:

- **`google`**: ([demo](https://translate.google.com/) | [docs](https://cloud.google.com/translate/docs/)): Google Translate.
- **`yandex`**: ([demo](https://translate.yandex.com/) | [docs](https://tech.yandex.com/translate/) | [API Key](https://translate.yandex.com/developers/keys)): Yandex Translate
- **`libre`**: ([demo](https://libretranslate.com/)): An independent translation engine. No key needed.

> To get the API Key you will be signing some contract with these services; it's your responsibility to follow these and we are not liable if you don't as explained in our MIT License.

Once you get the API key and if you are only going to be using one engine (very likely), we recommend setting this globally for your whole project:

```js
// ... include translate

translate.engine = "google";
translate.key = "YOUR-KEY-HERE";

// ... use translate()
```

If you are in Node.js, this likely comes from an environment variable:

```js
// ... include translate

translate.engine = "google";
translate.key = process.env.TRANSLATE_KEY;

// ... use translate()
```

To pass it per-translation, you can add it to your arguments:

```js
translate("Hello world", { to: "en", engine: "google", key: "YOUR-KEY-HERE" });
```

## Promises

Working with Promises and specially with [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) reduces [Callback Hell](http://callbackhell.com/). To see it in action, first you'll need an `async` function. Then put your `await` calls inside:

```js
// Browser; jQuery for demonstration purposes
$("#translate").submit(async e => {
  e.preventDefault();
  const text = $(".text").text();
  const spanish = await translate(text, { to: "es" });
  alert(spanish);
});

// Node.js; serverjs.io example for demonstration purposes
const route = async ctx => {
  const spanish = await translate(ctx.body, { to: "es" });
  return send(spanish);
};
```

## Authors and thanks

Current package and development: [Francisco Presencia](https://francisco.io/)

Original package and idea: Andrew Lunny (alunny), Marak Squires, Google

Testing in Internet Explorer supported by BrowserStack:

[![BrowserStack logo](https://i.imgur.com/CuCuOkL.png)](https://browserstack.com/)
