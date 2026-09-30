const fs = require('fs');

const files = [
  'src/data/mockProducts.ts',
  'src/pages/HomePage.tsx',
  'src/components/PromoSlider.tsx'
];

let allUrls = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.match(/https:\/\/images\.unsplash\.com\/[^\s\"\'\`,]+/g) || [];
  allUrls.push(...matches);
});

allUrls = Array.from(new Set(allUrls));
console.log('Testing', allUrls.length, 'URLs...');

Promise.all(allUrls.map(u => 
  fetch(u)
    .then(r => ({ u, status: r.status }))
    .catch(e => ({ u, status: 'ERR: ' + e.message }))
)).then(results => {
  const bad = results.filter(r => r.status !== 200);
  console.log('RESULTS:');
  console.log('Bad count:', bad.length);
  bad.forEach(b => console.log(b.status, b.u));
  if (bad.length === 0) console.log('ALL URLs VALID!');
});
