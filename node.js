// Small manual test to see that it all works
const translate = require("./translate");
require("dotenv").load();

translate.engine = "libre";
translate.key = process.env.YANDEX_KEY;

translate("Hello world", "es").then(res => {
  console.log(res);
});
