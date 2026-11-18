/*
 * benchmark/bin2u8a.mjs
 *
 * Compares ways to turn a binary string (what `atob` returns) into a
 * Uint8Array.  That is the fallback of `toUint8Array` and `decode` on
 * platforms without `Uint8Array.fromBase64`.
 *
 *   node benchmark/bin2u8a.mjs [size ...]
 *   bun  benchmark/bin2u8a.mjs [size ...]
 *   deno benchmark/bin2u8a.mjs [size ...]
 */
import {
    runtime, argv, kinds, payload, toBase64, fmtSize, measure, report
} from './harness.mjs';

const _TE = new TextEncoder();

const candidates = {
    // up to 3.9.6
    'split+map': (bin) =>
        Uint8Array.from(bin.split('').map((c) => c.charCodeAt(0))),
    // the idiom seen everywhere
    'from+mapFn': (bin) => Uint8Array.from(bin, (c) => c.charCodeAt(0)),
    // what base64.ts does since https://github.com/dankogai/js-base64/pull/198
    'charCodeAt': (bin) => {
        const l = bin.length, u8a = new Uint8Array(l);
        for (let i = 0; i < l; i++) u8a[i] = bin.charCodeAt(i);
        return u8a;
    },
    // UTF-8 of U+0080-U+00FF is 110000xx 10xxxxxx; fold them back.
    'TE.encode': (bin) => {
        const l = bin.length, utf8 = _TE.encode(bin);
        if (utf8.length === l) return utf8;
        const u8a = new Uint8Array(l);
        for (let i = 0, j = 0; i < l; i++) {
            const b = utf8[j++];
            u8a[i] = b < 0x80 ? b : (b & 3) << 6 | utf8[j++] & 0x3f;
        }
        return u8a;
    },
    // UTF-8 of U+0000-U+007F is the byte itself, so ASCII needs no loop.
    // Otherwise the buffer overflows before the string is fully read.
    'TE.encodeInto': (bin) => {
        const l = bin.length, u8a = new Uint8Array(l);
        if (_TE.encodeInto(bin, u8a).read === l) return u8a;
        for (let i = 0; i < l; i++) u8a[i] = bin.charCodeAt(i);
        return u8a;
    },
};
const base = 'charCodeAt';
const nums = argv.filter((a) => /^\d+$/.test(a)).map(Number);
const sizes = nums.length ? nums : [32, 1 << 10, 1 << 16];

// every candidate must agree with the bytes we started with
const check = (want) => {
    const bin = atob(toBase64(want));
    for (const [name, fn] of Object.entries(candidates)) {
        const got = fn(bin);
        const ok = got instanceof Uint8Array
            && got.length === want.length
            && got.byteOffset === 0
            && got.buffer.byteLength === want.length
            && got.every((b, i) => b === want[i]);
        if (!ok) throw new Error(`${name} is broken`);
    }
};
check(Uint8Array.from({ length: 256 }, (_, i) => i));
for (let l = 0; l < 67; l++) check(payload('binary', l));
for (const kind of kinds) for (const size of sizes) check(payload(kind, size));

console.log(`binary string to Uint8Array on ${runtime}\n`);
const rows = [];
for (const kind of kinds) {
    for (const size of sizes) {
        const bin = atob(toBase64(payload(kind, size)));
        rows.push({
            labels: [kind, fmtSize(size)],
            result: measure(candidates, bin),
        });
    }
}
report(['payload', 'size'], rows, base);
