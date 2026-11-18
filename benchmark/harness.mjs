/*
 * benchmark/harness.mjs
 *
 * A tiny dependency-free benchmark harness that runs on node, bun and deno.
 */
export const runtime =
    typeof Bun !== 'undefined' ? `bun ${Bun.version}`
        : typeof Deno !== 'undefined' ? `deno ${Deno.version.deno}`
            : typeof process !== 'undefined' ? `node ${process.versions.node}`
                : 'unknown';
export const argv = typeof Deno !== 'undefined' ? Deno.args
    : typeof process !== 'undefined' ? process.argv.slice(2) : [];

const KINDS = {
    // every byte < 0x80
    'ASCII text': 'The quick brown fox jumps over the lazy dog. ',
    // mostly < 0x80 with a few multibyte sequences
    'Latin text': 'Le cœur a ses raisons que la raison ne connaît point — Pascal. ',
    // every byte >= 0x80
    'CJK text': '吾輩は猫である。名前はまだ無い。',
    // every byte < 0x80 but the last two
    'ASCII + é': 'The quick brown fox jumps over the lazy dog. ',
    // the first half < 0x80, the second half >= 0x80
    'ASCII, then CJK': 'The quick brown fox jumps over the lazy dog. ',
    // uniformly random bytes
    'binary': null,
};
export const kinds = Object.keys(KINDS);

/** @returns {Uint8Array} about `size` bytes of `kind`, deterministic */
export const payload = (kind, size) => {
    const unit = KINDS[kind];
    if (unit === null) {
        const u8a = new Uint8Array(size);
        let x = 0x2545F491; // xorshift32
        for (let i = 0; i < size; i++) {
            x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
            u8a[i] = x & 0xff;
        }
        return u8a;
    }
    const u8a = new TextEncoder().encode(
        unit.repeat(Math.ceil(size / unit.length))
    );
    let l = size;
    while ((u8a[l] & 0xC0) === 0x80) l--; // do not cut a character in half
    const result = u8a.slice(0, l);
    if (/é$/.test(kind) && l >= 2) result.set([0xC3, 0xA9], l - 2);
    if (/, then CJK$/.test(kind)) {
        const h = l >> 1;
        result.set(payload('CJK text', l - h), h);
    }
    return result;
};

/** Uint8Array to Base64 without depending on the library under test */
export const toBase64 = (u8a) => {
    let bin = '';
    for (let i = 0; i < u8a.length; i += 0x1000) {
        bin += String.fromCharCode.apply(null, u8a.subarray(i, i + 0x1000));
    }
    return btoa(bin);
};

export const fmtSize = (n) =>
    n >= 1 << 20 ? `${n >> 20} MiB` : n >= 1 << 10 ? `${n >> 10} KiB` : `${n} B`;
const fmtTime = (ns) =>
    ns >= 1e6 ? `${(ns / 1e6).toFixed(2)} ms`
        : ns >= 1e3 ? `${(ns / 1e3).toFixed(2)} µs` : `${ns.toFixed(1)} ns`;
const median = (a) => {
    const s = a.slice().sort((x, y) => x - y), m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

let sink = 0; // uses every result so that no call is optimized away
const sample = (fn, arg, n) => {
    const t0 = performance.now();
    for (let i = 0; i < n; i++) {
        const r = fn(arg);
        sink ^= r.length;
    }
    return (performance.now() - t0) * 1e6 / n; // ns per call
};
const calibrate = (fn, arg, ms) => {
    for (let n = 1; ; n *= 2) {
        const t0 = performance.now();
        sample(fn, arg, n);
        const t = performance.now() - t0;
        if (t >= ms) return n;
        if (t > ms / 16) return Math.ceil(n * ms / t);
    }
};

/**
 * Times every function of `fns` on `arg`.  Samples are interleaved and
 * the starting function rotates so that drift hits all of them alike.
 * @param {{[name: string]: (arg: any) => {length: number}}} fns
 * @returns {{[name: string]: number}} median ns per call
 */
export const measure = (fns, arg, { rounds = 15, ms = 20 } = {}) => {
    const names = Object.keys(fns);
    const iters = names.map((k) => calibrate(fns[k], arg, ms));
    const samples = names.map(() => []);
    for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < names.length; i++) {
            const j = (i + r) % names.length;
            samples[j].push(sample(fns[names[j]], arg, iters[j]));
        }
    }
    const result = {};
    names.forEach((k, i) => result[k] = median(samples[i]));
    return result;
};

/**
 * Prints a markdown table.  Each cell shows the median time per call and
 * the speed relative to the `base` column (higher is faster).
 * @param {string[]} head labels of the leading columns
 * @param {{labels: string[], result: {[name: string]: number}}[]} rows
 */
export const report = (head, rows, base) => {
    const names = Object.keys(rows[0].result);
    const table = [
        head.concat(names),
        ...rows.map(({ labels, result }) => labels.concat(names.map((k) =>
            `${fmtTime(result[k])} (${(result[base] / result[k]).toFixed(2)}x)`
        ))),
    ];
    const width = table[0].map((_, i) =>
        Math.max(...table.map((row) => row[i].length)));
    const line = (row) => '| ' + row.map((c, i) => i < head.length
        ? c.padEnd(width[i]) : c.padStart(width[i])).join(' | ') + ' |';
    console.log(line(table[0]));
    console.log('|' + width.map((w, i) => i < head.length
        ? '-'.repeat(w + 2) : '-'.repeat(w + 1) + ':').join('|') + '|');
    table.slice(1).forEach((row) => console.log(line(row)));
};
