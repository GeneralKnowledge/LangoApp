import fs from 'node:fs';
import path from 'node:path';

const uiDir = path.join(process.cwd(), 'data', 'ui');
const files = fs.readdirSync(uiDir).filter((f) => f.endsWith('.json'));
const en = JSON.parse(fs.readFileSync(path.join(uiDir, 'en.json'), 'utf8'));
const keys = Object.keys(en);
let hasError = false;

for (const file of files) {
  const full = path.join(uiDir, file);
  const dictionary = JSON.parse(fs.readFileSync(full, 'utf8'));

  for (const key of keys) {
    if (!dictionary[key]) {
      console.error(`${file}: missing key ${key}`);
      hasError = true;
    }
  }
}

if (hasError) process.exit(1);
console.log(`Validated ${files.length} UI dictionaries with ${keys.length} keys each.`);
