const sharp = require("sharp");

async function main() {
  try {
    await sharp("pattern-paper.png")
      .toFormat("webp", { quality: 85 }) // or .webp({ lossless: true })
      .toFile("pattern-paper.webp");
  } catch (error) {}
}
main();
