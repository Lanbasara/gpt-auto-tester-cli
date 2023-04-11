var unescapeJs = require("unescape-js");

function getCodeFromText(str) {
  let res = "";
  const reg = /\{"type":"success","completion":"(.*)"\}/g
  while ((match = reg.exec(str))) {
    let temp = JSON.parse(match[0])
    let tempStr = unescapeJs(temp.completion)
    res += tempStr
  }
  return res;
}

function getPlantCode(str){
  const tempStrWithMarkdown = getCodeFromText(str)
  return tempStrWithMarkdown.replace(/```(\w+)?/g,'')
}


module.exports = {
  getCodeFromText,
  getPlantCode
};
