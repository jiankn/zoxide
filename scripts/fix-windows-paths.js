/**
 * Post-build fix: Replace Windows backslash paths with forward slashes
 * in OpenNext build output files.
 *
 * Problem: When building on Windows, OpenNext generates cache manifests
 * with Windows-style backslash paths (e.g., "en\\blog\\post-slug").
 * At runtime on Cloudflare Workers (Linux), path lookups use forward
 * slashes, so the cache is never found. This forces the Worker to
 * re-render every page (SSR), exceeding CPU time limits and causing 503.
 *
 * Fix: Replace all double-backslash path separators with forward slashes
 * in the cache manifest SQL and DynamoDB cache JSON.
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  '.open-next/cloudflare/cache-assets-manifest.sql',
  '.open-next/dynamodb-provider/dynamodb-cache.json',
];

let totalFixed = 0;

for (const relPath of filesToFix) {
  const fullPath = path.join(__dirname, '..', relPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  ${relPath} not found, skipping.`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  // Count occurrences of \\ that are path separators (between alphanumeric/bracket chars)
  const matches = content.match(/\\\\/g);
  if (matches && matches.length > 0) {
    content = content.replace(/\\\\/g, '/');
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed ${relPath}: replaced ${matches.length} backslash path separators`);
    totalFixed += matches.length;
  } else {
    console.log(`ℹ️  ${relPath}: no backslash paths found, no fix needed.`);
  }
}

if (totalFixed > 0) {
  console.log(`\n✅ Total: fixed ${totalFixed} Windows backslash paths across ${filesToFix.length} files.`);
} else {
  console.log('\nℹ️  No Windows path issues found (probably not building on Windows).');
}
