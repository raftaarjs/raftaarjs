const fs = require('fs');
export function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}