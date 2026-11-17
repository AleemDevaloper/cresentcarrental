
const fs = require('fs');

const filePath = 'C:/xampp/htdocs/PMS/manage-core-frontend/src/data/translations.js';
const content = fs.readFileSync(filePath, 'utf8');

const languages = ['English', 'Spanish', 'French', 'German', 'Arabic'];
const data = {
    English: {},
    Spanish: {},
    French: {},
    German: {},
    Arabic: {}
};

// 1. Extract all blocks for each language
const blockStarts = [];
const langRegex = /^\s*(English|Spanish|French|German|Arabic):\s*\{/gm;
let match;
while ((match = langRegex.exec(content)) !== null) {
    blockStarts.push({ lang: match[1], index: match.index, bodyStart: match.index + match[0].length });
}

for (let i = 0; i < blockStarts.length; i++) {
    const start = blockStarts[i];
    const nextStart = blockStarts[i + 1] ? blockStarts[i + 1].index : content.lastIndexOf('};');
    
    let bodyEnd = content.lastIndexOf('},', nextStart);
    if (bodyEnd === -1 || bodyEnd < start.bodyStart) {
        bodyEnd = content.lastIndexOf('}', nextStart);
    }
    
    const body = content.substring(start.bodyStart, bodyEnd);
    
    // 2. Extract key-value pairs from the body
    // Improved regex to handle escaped quotes: "((?:\\"|[^"])*)"
    const kvRegex = /^\s*(\w+):\s*"((?:\\"|[^"])*)"/gm;
    let kvMatch;
    while ((kvMatch = kvRegex.exec(body)) !== null) {
        const key = kvMatch[1];
        let value = kvMatch[2];
        
        // Value already has escaped quotes as in the source file.
        // We will unescape them for our internal representation then re-escape on output.
        // Actually, let's keep them as is and just be careful on output.
        
        // Special Handling for English block misplaced French keys
        if (start.lang === 'English' && i === 0) {
            const frenchWords = ["Demandes", "Utilisateurs", "Mes Demandes", "Suppression de Compte", "Type de Demande", "votre demande", "Envoyer la Demande", "permanente et irréversible", "envoyée avec succès", "Statut", "d'Envoi", "En attente", "Approuvée", "Rejetée", "Nouvelle Demande"];
            if (frenchWords.some(w => value.includes(w))) {
                data['French'][key] = value;
                continue;
            }
        }
        
        data[start.lang][key] = value;
    }
}

// 3. Cleanup Arabic
const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
const isGerman = (text) => /[äöüß]/.test(text.toLowerCase());

for (const key in data['Arabic']) {
    const val = data['Arabic'][key];
    if (isGerman(val) && !isArabic(val)) {
        delete data['Arabic'][key];
    }
}

// 4. Generate the consolidated file
let output = 'const translations = {\n';
for (const lang of languages) {
    output += `  ${lang}: {\n`;
    
    // To ensure "requests" keys are not lost even if they were missing in some blocks
    const keys = Object.keys(data[lang]);
    const templateKeys = Object.keys(data['English']);
    const sortedKeys = [...new Set([...templateKeys, ...keys])].filter(k => data[lang][k]);
    
    for (const key of sortedKeys) {
        output += `    ${key}: "${data[lang][key]}",\n`;
    }
    output += `  },\n`;
}
output += '};\n\nexport default translations;\n';

fs.writeFileSync('C:/xampp/htdocs/PMS/manage-core-frontend/src/data/translations.js', output);
console.log("Consolidation complete.");
