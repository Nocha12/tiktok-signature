const https = require('https');
const fs = require('fs');
const path = require('path');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetch(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function update() {
  const html = await fetch('https://www.tiktok.com/');
  const bundleMatch = html.match(/src="(https?:\/\/[^"']+acrawler[^"']+\.js)"/);
  if (!bundleMatch) {
    throw new Error('Bundle URL not found');
  }
  const bundleUrl = bundleMatch[1];
  const bundleCode = await fetch(bundleUrl);

  const sigMatch = bundleCode.match(/function\s+generateSignature\([^]*?\}/);
  const bogusMatch = bundleCode.match(/function\s+generateBogus\([^]*?\}/);
  if (!sigMatch || !bogusMatch) {
    throw new Error('Required functions not found');
  }
  const content = `(function(){\n${sigMatch[0]}\n${bogusMatch[0]}\nreturn this;\n})();`;
  const outPath = path.join(__dirname, 'cmd', 'scripts', 'signature_functions.txt');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Updated', outPath);
}

update().catch(err => {
  console.error(err);
  process.exit(1);
});
