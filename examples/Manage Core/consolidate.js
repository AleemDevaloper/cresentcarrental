
const fs = require('fs');
const path = require('path');

const filePath = 'C:/xampp/htdocs/PMS/manage-core-frontend/src/data/translations.js';
let content = fs.readFileSync(filePath, 'utf8');

// We want to extract the object content. 
// It starts after "const translations = {" and ends before "};" at the end.
const startMarker = 'const translations = {';
const endMarker = '};';

let startIndex = content.indexOf(startMarker);
let endIndex = content.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers");
    process.exit(1);
}

let objectContent = content.substring(startIndex + startMarker.length, endIndex);

// Now we need to parse this. Since it's not JSON (has comments, no quotes on keys, etc.), 
// we'll use a regex to find the top-level language blocks.
const languages = ['English', 'Spanish', 'French', 'German', 'Arabic'];
const consolidated = {
    English: {},
    Spanish: {},
    French: {},
    German: {},
    Arabic: {}
};

// Regex to find: LanguageName: { ... }
// We need to handle nested braces, but luckily these blocks seem to only have one level of nesting.
const langRegex = /^\s*(English|Spanish|French|German|Arabic):\s*\{([\s\S]*?)\n\s*\},/gm;

let match;
while ((match = langRegex.exec(objectContent)) !== null) {
    const lang = match[1];
    const body = match[2];
    
    // Parse the body to extract key-value pairs
    // Key can be word or quoted string
    // Value is a quoted string
    const kvRegex = /^\s*(\w+):\s*"([\s\S]*?)",/gm;
    let kvMatch;
    while ((kvMatch = kvRegex.exec(body)) !== null) {
        const key = kvMatch[1];
        const value = kvMatch[2];
        
        // If key already exists, only overwrite if current value is empty or less descriptive (optional)
        // But for now, let's just merge. If it's English translations in Arabic block, we should be careful.
        
        // Special case: we saw German translations in Arabic block.
        // If we are in Arabic block and the value looks like German or English, we might want to skip it IF we already have a better one.
        // Actually, the prompt says "prefer the most descriptive one if they differ".
        // Also "Ensure NO keys are lost".
        
        if (!consolidated[lang][key] || consolidated[lang][key].length < value.length) {
             consolidated[lang][key] = value;
        }
    }
}

// Special check for English requests keys (they were duplicated inside the English block)
// My langRegex might have missed the second 'requests' keys if they were in the same block.
// Let's re-parse English specifically if needed, but actually the regex above found the WHOLE English block if it ended with },

// Wait, if there are multiple "Spanish: {" blocks, the regex will find them one by one.

// Let's regenerate the file content.
let newContent = 'const translations = {\n';

for (const lang of languages) {
    newContent += `  ${lang}: {\n`;
    // We should probably keep some comments, but it's hard to associate them.
    // Let's just output the keys.
    // To make it look nice, let's sort them or at least group them if we can.
    // For now, simple output.
    for (const key in consolidated[lang]) {
        newContent += `    ${key}: "${consolidated[lang][key]}",\n`;
    }
    newContent += `  },\n`;
}

newContent += '};\n\nexport default translations;\n';

fs.writeFileSync('consolidated_translations.js', newContent);
console.log("Consolidated translations written to consolidated_translations.js");
