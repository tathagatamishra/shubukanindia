import fs from 'fs';
import path from 'path';

// Get the suffix from command line arguments
const args = process.argv.slice(2);

// Check if there are enough arguments
if (args.length < 2) {
    console.error('Usage: node renameFiles.mjs <folderPath> <suffixToAdd>');
    process.exit(1);
}

const folderPath = args[0];
const suffixToAdd = args[1];

// Check if the folder exists
if (!fs.existsSync(folderPath)) {
    console.error(`Error: Folder "${folderPath}" does not exist.`);
    process.exit(1);
}

// Main function to handle the renaming process
async function renameFiles() {
    try {
        // Get all files in the folder
        const files = await fs.promises.readdir(folderPath);
        
        // Filter out directories to get only files
        const filesToRename = [];
        
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            try {
                const stats = await fs.promises.stat(filePath);
                if (!stats.isDirectory()) {
                    filesToRename.push(file);
                } else {
                    console.log(`Skipping directory: ${file}`);
                }
            } catch (error) {
                console.error(`Error checking file "${file}": ${error.message}`);
            }
        }
        
        if (filesToRename.length === 0) {
            console.log("No files found to rename.");
            return;
        }
        
        console.log(`Found ${filesToRename.length} files to rename.`);
        
        // Process renames one by one
        let successCount = 0;
        let errorCount = 0;
        
        for (const file of filesToRename) {
            try {
                const filePath = path.join(folderPath, file);
                const extname = path.extname(file);
                const basename = path.basename(file, extname);
                const newFilename = `${basename}_${suffixToAdd}${extname}`;
                const newFilePath = path.join(folderPath, newFilename);
                
                // Perform the rename
                await fs.promises.rename(filePath, newFilePath);
                console.log(`Renamed: "${file}" to "${newFilename}"`);
                successCount++;
            } catch (error) {
                console.error(`Error renaming file "${file}": ${error.message}`);
                errorCount++;
            }
        }
        
        console.log(`\nRenaming complete: ${successCount} files renamed, ${errorCount} errors`);
        
    } catch (error) {
        console.error(`Error processing files: ${error.message}`);
    }
}

// Run the function
renameFiles();