const fs = require("fs")
const path = require('path')
function mkdirsSync(dirpath) {
  if (!fs.existsSync(dirpath)) {
    mkdirsSync(path.dirname(dirpath));
    fs.mkdirSync(dirpath);
  }
}

module.exports = mkdirsSync