const fs = require('fs');
const path = require('path');

const directoriesToClean = [
  'node_modules/.cache',
  '.next'
];

directoriesToClean.forEach(dir => {
  fs.rmSync(path.join(__dirname, dir), { recursive: true, force: true });
  console.log(`Cleaned: ${dir}`);
});