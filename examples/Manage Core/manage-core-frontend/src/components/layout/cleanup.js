const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ModuleContentRenderer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Split content by lines
const lines = content.split(/\r?\n/);
const seenImports = new Set();
const cleanLines = [];

for (const line of lines) {
  if (line.trim().startsWith('import ')) {
    if (seenImports.has(line.trim())) {
      // Duplicate, skip it
      continue;
    }
    seenImports.add(line.trim());
  }
  cleanLines.push(line);
}

fs.writeFileSync(filePath, cleanLines.join('\n'), 'utf8');
console.log('Successfully cleaned duplicate imports from ModuleContentRenderer.jsx');
