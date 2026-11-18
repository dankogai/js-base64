#!/usr/bin/env node
// Brings README.md and CHANGELOG.md in line with the version in
// package.json.  Runs from the npm `version` hook.
const fs = require('fs');
const { version } = require('../package.json');
const rewrite = (file, fn) => {
    const src = fs.readFileSync(file, 'utf8');
    const out = fn(src);
    if (out === src) return false;
    fs.writeFileSync(file, out);
    return true;
};
// version-pinned CDN URLs
if (rewrite('README.md', (src) =>
    src.replace(/js-base64@\d+\.\d+\.\d+/g, `js-base64@${version}`))) {
    console.log(`README.md: CDN URLs now point at js-base64@${version}`);
}
// what was [Unreleased] becomes this version, under a fresh [Unreleased]
const repo = 'https://github.com/dankogai/js-base64';
const today = new Date().toLocaleDateString('sv');  // YYYY-MM-DD, local
if (rewrite('CHANGELOG.md', (src) => src.includes(`\n## [${version}]`) ? src : src
    .replace('\n## [Unreleased]\n',
        `\n## [Unreleased]\n\n## [${version}] - ${today}\n`)
    .replace(/^\[Unreleased\]: .*$/m,
        `[Unreleased]: ${repo}/compare/v${version}...HEAD\n`
        + `[${version}]: ${repo}/releases/tag/v${version}`))) {
    console.log(`CHANGELOG.md: [Unreleased] is now [${version}]`);
}
const section = fs.readFileSync('CHANGELOG.md', 'utf8')
    .split(`\n## [${version}]`)[1] || '';
if (!/^.*\n+(?!## )\S/.test(section)) {
    console.warn(`CHANGELOG.md: nothing is listed under ${version}`);
}
