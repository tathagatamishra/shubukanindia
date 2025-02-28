import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory and project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');  // Go up two levels from src/utils to reach project root

// Function to generate the SCSS content
function generateFontScss() {
  const fontDir = join(projectRoot, 'public', 'Fonts');
  const files = readdirSync(fontDir);
  
  let scssContent = '';
  const fontFamilies = new Set();

  files.forEach(file => {
    if (file.endsWith('.ttf') || file.endsWith('.otf')) {
      const fontName = parse(file).name;
      const fontExtension = parse(file).ext.substring(1); // Remove the dot
      const fontFamily = fontName.replace(/[-_][a-z]/gi, (str) => str.substring(1).toUpperCase());
      
      fontFamilies.add(fontFamily);
      
      scssContent += `@font-face {
  font-family: '${fontFamily}';
  src: url('/Fonts/${file}') format('${fontExtension === 'ttf' ? 'truetype' : 'opentype'}');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}\n\n`;
    }
  });

  // Add variables for each font family
  fontFamilies.forEach(fontFamily => {
    scssContent += `$font-${fontFamily.toLowerCase()}: '${fontFamily}', sans-serif;\n`;
  });

  // Write to Font.scss (inside src/styles)
  const scssDir = join(projectRoot, 'src', 'styles');
  
  try {
    writeFileSync(
      join(scssDir, '_Fonts.scss'),
      scssContent,
      'utf8'
    );
    console.log('Font.scss has been generated successfully!');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Error: The styles directory does not exist. Please create src/styles directory first.');
    } else {
      console.error('Error writing file:', error);
    }
  }
}

// Add error handling for the main function
try {
  generateFontScss();
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Error: Could not find the Font directory. Please make sure you have a Font folder in your public directory.');
    console.error('Expected path:', join(projectRoot, 'public', 'Font'));
  } else {
    console.error('Error:', error);
  }
}