const fs = require("fs");
const path = require("path");
var unescapeJs = require("unescape-js");
const text = fs.readFileSync(path.join(__dirname, "../assets/response"), {
  encoding: "utf-8",
});

function getText(str) {
  let res = "";
  const reg = /"completion":"(.*?)"/g;
  while ((match = reg.exec(str))) {
    res += match[1];
  }
  return res;
}

function getCodeFromText(str) {
  let res = unescapeJs(getText(str));
  // const reg = /\n```\w+\n(.*)```\n/g;
  // return reg.exec(res)[1];
  return res;
}

fs.writeFileSync(
  path.join(__dirname, "../__test__/index.test.js"),
  getCodeFromText(text),
  { encoding: "utf-8" }
);

module.exports = getCodeFromText;
