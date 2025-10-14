const fs = require("fs");
const woff2 = require("woff2");

const inputPath = "./app/fonts/Amanojaku.otf";
const outputPath = "./app/fonts/Amanojaku.woff2";

const input = fs.readFileSync(inputPath);
const output = woff2.encode(input);
fs.writeFileSync(outputPath, output);

console.log("Font converted successfully to:", outputPath);
