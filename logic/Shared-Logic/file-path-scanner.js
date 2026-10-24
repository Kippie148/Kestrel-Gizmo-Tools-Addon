const fs = require('fs').promises;
const path = require('path');

//==============
// GIZ Scanning
//==============

async function scanForGiz(dirPath) {
    const results = [];

    async function run(currentDir) {
        let entries;

        try {
            entries = await fs.readdir(currentDir, { withFileTypes: true });
        } catch (err) {
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                await run(fullPath);
            } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.giz')) {
                try {
                    const stats = await fs.stat(fullPath);

                    results.push({
                        path: fullPath,
                        name: entry.name
                    });
                } catch {
                    console.log('Failed to get file information.');
                }
            }
        }
    }

    await run(dirPath);
    return results;
}


//=========================
// Scan modal message push
//=========================

// async function pushScanFileName () {
    // Might be a option to make a small cool menu
// }

module.exports = {
    scanGizDir: scanForGiz
}