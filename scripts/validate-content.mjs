import fs from 'node:fs';
import path from 'node:path';

const packDir = path.join(process.cwd(), 'data', 'packs');
const files = fs.readdirSync(packDir).filter((f) => f.endsWith('.json'));
let hasError = false;

for (const file of files) {
  const full = path.join(packDir, file);
  const pack = JSON.parse(fs.readFileSync(full, 'utf8'));
  const ids = new Set();

  for (const phrase of pack.phrases ?? []) {
    if (!phrase.id || ids.has(phrase.id)) {
      console.error(`${file}: duplicate or missing phrase id -> ${phrase.id}`);
      hasError = true;
    }
    ids.add(phrase.id);

    if (!phrase.meaning?.en) {
      console.error(`${file}: phrase ${phrase.id} is missing English meaning`);
      hasError = true;
    }
  }
}

if (hasError) process.exit(1);
console.log(`Validated ${files.length} language packs.`);
