const sharp = require("sharp");

async function main() {
  try {
    await sharp("uemadojoindia.jpeg")
      .webp({ lossless: true }) // or .webp({ lossless: true })
      .toFile("uemadojoindia.webp");
  } catch (error) {}
}
main();
