const fs = require("fs");
const path = require("path");

const text = fs.readFileSync(path.join(__dirname, "../assets/response"), {
  encoding: "utf-8",
});

fs.writeFileSync(
  path.join(__dirname, "../__test__/index.test.js"),
  getPlantCode(getCodeFromText(text)),
  { encoding: "utf-8" }
);
