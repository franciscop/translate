// Small manual test to see that it all works
const translate = require("../");
require("dotenv").load();

translate("Hello world", "es").then(res => {
  console.log(res);
});
