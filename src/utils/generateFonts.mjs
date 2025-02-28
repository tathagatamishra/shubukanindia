import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory and project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');  // Go up two levels from src/utils to reach project root

// Function to clean the font name and create a valid CSS identifier
function cleanFontName(name) {
  // Remove the _otf or _ttf suffix if present
  if (name.endsWith('_otf') || name.endsWith('_ttf')) {
    name = name.slice(0, -4);
  }
  
  // Convert spaces and special characters to camelCase
  return name.replace(/[-_ ][a-z]/gi, (str) => str.substring(1).toUpperCase());
}

// Function to generate a valid CSS variable name
function createVariableName(fontFamily) {
  // Remove spaces and convert to lowercase for the variable name
  return fontFamily.replace(/\s+/g, '').toLowerCase();
}

// Function to generate the SCSS content
function generateFontScss() {
  const fontsRootDir = join(projectRoot, 'public', 'Fonts');
  const ttfDir = join(fontsRootDir, 'ttf');
  const otfDir = join(fontsRootDir, 'otf');
  
  let scssContent = '';
  const fontFamilies = new Map(); // Using Map to store font family name and variable name pairs

  // Process TTF files
  try {
    const ttfFiles = readdirSync(ttfDir);
    ttfFiles.forEach(file => {
      if (file.endsWith('.ttf')) {
        const fontName = parse(file).name;
        const fontFamily = cleanFontName(fontName);
        const variableName = createVariableName(fontFamily);
        
        fontFamilies.set(fontFamily, variableName);
        
        scssContent += `@font-face {
  font-family: '${fontFamily}';
  src: url('/Fonts/ttf/${file}') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}\n\n`;
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('TTF directory not found. Skipping TTF fonts.');
    } else {
      console.error('Error processing TTF files:', error);
    }
  }

  // Process OTF files
  try {
    const otfFiles = readdirSync(otfDir);
    otfFiles.forEach(file => {
      if (file.endsWith('.otf')) {
        const fontName = parse(file).name;
        const fontFamily = cleanFontName(fontName);
        const variableName = createVariableName(fontFamily);
        
        fontFamilies.set(fontFamily, variableName);
        
        scssContent += `@font-face {
  font-family: '${fontFamily}';
  src: url('/Fonts/otf/${file}') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}\n\n`;
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('OTF directory not found. Skipping OTF fonts.');
    } else {
      console.error('Error processing OTF files:', error);
    }
  }

  // Add variables for each font family
  fontFamilies.forEach((variableName, fontFamily) => {
    scssContent += `$font-${variableName}: '${fontFamily}', sans-serif;\n`;
  });

  // Write to Font.scss (inside src/styles)
  const scssDir = join(projectRoot, 'src', 'styles');
  
  try {
    writeFileSync(
      join(scssDir, '_Fonts.scss'),
      scssContent,
      'utf8'
    );
    console.log('_Fonts.scss has been generated successfully!');
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
  console.error('Error generating font SCSS:', error);
}