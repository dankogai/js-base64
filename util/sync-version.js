#!/usr/bin/env node
// Rewrites version-pinned js-base64 CDN URLs in README.md to match
// the version in package.json.  Runs from the npm `version` hook.
const fs = require('fs');
const { version } = require('../package.json');
const src = fs.readFileSync('README.md', 'utf8');
const out = src.replace(/js-base64@\d+\.\d+\.\d+/g, `js-base64@${version}`);
if (out !== src) {
    fs.writeFileSync('README.md', out);
    console.log(`README.md: CDN URLs now point at js-base64@${version}`);
}
