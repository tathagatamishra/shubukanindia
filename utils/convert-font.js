const fs = require("fs");
const wawoff2 = require("wawoff2");

// `woff2` (the original package here) ships a prebuilt native binary that
// npm has to download during install — that download is what was failing.
// wawoff2 is a WebAssembly build of the same Google woff2 encoder bundled
// directly in the package, so there's nothing extra to fetch at install
// time. Its compress() is async (returns a Buffer via Promise), unlike the
// old package's sync woff2.encode().

const inputPath = "../app/fonts/KouzanBrushFontGyousyo.ttf";
const outputPath = "../app/fonts/KouzanBrushFontGyousyo.woff2";

async function main() {
  const input = fs.readFileSync(inputPath);
  const output = await wawoff2.compress(input);
  fs.writeFileSync(outputPath, output);
  console.log("Font converted successfully to:", outputPath);
}

main().catch((err) => {
  console.error("Font conversion failed:", err);
  process.exit(1);
});
