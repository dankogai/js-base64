/*
 * benchmark/lib.mjs
 *
 * Times the public API of one or more builds of js-base64, so that a
 * change can be compared with what it replaces.
 *
 *   node benchmark/lib.mjs                     # ../base64.mjs
 *   git show v3.9.6:base64.mjs > /tmp/3.9.6.mjs
 *   node benchmark/lib.mjs /tmp/3.9.6.mjs base64.mjs
 *
 * The first build is the baseline.  Also runs on bun and deno (run -A).
 */
import {
    runtime, argv, kinds, payload, toBase64, fmtSize, measure, report
} from './harness.mjs';

const paths = argv.filter((a) => /\.m?js$/.test(a));
if (!paths.length) paths.push(new URL('../base64.mjs', import.meta.url).href);
const cwd = () => typeof Deno !== 'undefined' ? Deno.cwd() : process.cwd();
const builds = {};
for (const path of paths) {
    const url = /^\w+:\/\//.test(path) ? path
        : new URL(path, `file://${cwd()}/`).href;
    const name = path.replace(/^.*\//, '');
    builds[name in builds ? path : name] = await import(url);
}
const base = Object.keys(builds)[0];
const nums = argv.filter((a) => /^\d+$/.test(a)).map(Number);
const sizes = nums.length ? nums : [32, 1 << 10, 1 << 16];
const pick = (method) => {
    const fns = {};
    for (const name in builds) fns[name] = builds[name][method];
    return fns;
};

console.log(`js-base64 on ${runtime}\n`);
const rows = [];
for (const method of ['toUint8Array', 'decode']) {
    for (const kind of kinds) {
        if (method === 'decode' && kind === 'binary') continue; // not text
        for (const size of sizes) {
            rows.push({
                labels: [method, kind, fmtSize(size)],
                result: measure(pick(method), toBase64(payload(kind, size))),
            });
        }
    }
}
report(['method', 'payload', 'size'], rows, base);
