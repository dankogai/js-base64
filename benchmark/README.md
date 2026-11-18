# benchmark

Dependency-free benchmarks for `js-base64`.  They run on node, bun and deno.

| file          | what it measures                                              |
|---------------|---------------------------------------------------------------|
| `bin2u8a.mjs` | ways to turn a binary string into a `Uint8Array`              |
| `lib.mjs`     | `toUint8Array` and `decode` of one or more builds, end to end |
| `harness.mjs` | payloads, timing and the report shared by the above           |

```shell
node benchmark/bin2u8a.mjs          # or bun, or deno run
node benchmark/bin2u8a.mjs 512 4096 # payload sizes of your choice
node benchmark/lib.mjs              # ../base64.mjs (deno needs run -A)
git show v3.9.6:base64.mjs > /tmp/3.9.6.mjs
node benchmark/lib.mjs /tmp/3.9.6.mjs base64.mjs  # the first one is the baseline
```

Each cell is the median time per call of 15 interleaved rounds, followed
by the speed relative to the baseline column.  Higher is faster.

## Binary string to `Uint8Array`

Where `Uint8Array.fromBase64` is missing (node 24 and older, older
browsers), `toUint8Array` and `decode` call `atob` and then have to
turn its binary string into bytes.  `bin2u8a.mjs` compares the candidates:

| candidate       | how                                                              |
|-----------------|------------------------------------------------------------------|
| `split+map`     | `Uint8Array.from(bin.split('').map(...))`, up to 3.9.6           |
| `from+mapFn`    | `Uint8Array.from(bin, c => c.charCodeAt(0))`                     |
| `charCodeAt`    | a plain loop, what `base64.ts` does since [#198].  The baseline  |
| `TE.encode`     | `TextEncoder#encode`, then fold two-byte sequences back          |
| `TE.encodeInto` | `TextEncoder#encodeInto`, then the loop if that did not fit      |

[#198]: https://github.com/dankogai/js-base64/pull/198

`TextEncoder` only speaks UTF-8.  The UTF-8 of U+0000-U+007F is the byte
itself, so an ASCII string comes out as the very bytes we want.  But
U+0080-U+00FF come out as two bytes each, so `_TE.encode(atob(a))` alone
is wrong for anything but ASCII.  Both `TE.*` candidates therefore have
to detect that and repair or redo the work.

### node 24.22.2 (V8), Apple M1

| payload         | size   |         split+map |       from+mapFn |       charCodeAt |         TE.encode |     TE.encodeInto |
|-----------------|--------|------------------:|-----------------:|-----------------:|------------------:|------------------:|
| ASCII text      | 32 B   |  180.4 ns (0.36x) |  1.55 µs (0.04x) |  65.0 ns (1.00x) |  225.7 ns (0.29x) |  183.6 ns (0.35x) |
| ASCII text      | 1 KiB  |   4.13 µs (0.36x) | 46.11 µs (0.03x) |  1.48 µs (1.00x) |  635.9 ns (2.33x) |  261.1 ns (5.68x) |
| ASCII text      | 64 KiB | 685.00 µs (0.12x) |  3.14 ms (0.03x) | 85.45 µs (1.00x) |  25.39 µs (3.37x) |  4.30 µs (19.89x) |
| Latin text      | 32 B   |  177.2 ns (0.36x) |  1.54 µs (0.04x) |  63.7 ns (1.00x) |  284.5 ns (0.22x) |  226.1 ns (0.28x) |
| Latin text      | 1 KiB  |   4.06 µs (0.37x) | 46.01 µs (0.03x) |  1.49 µs (1.00x) |   2.53 µs (0.59x) |   2.19 µs (0.68x) |
| Latin text      | 64 KiB | 661.71 µs (0.13x) |  3.09 ms (0.03x) | 85.82 µs (1.00x) | 138.43 µs (0.62x) | 128.05 µs (0.67x) |
| CJK text        | 32 B   |  171.8 ns (0.37x) |  1.45 µs (0.04x) |  63.8 ns (1.00x) |  289.0 ns (0.22x) |  212.2 ns (0.30x) |
| CJK text        | 1 KiB  |   4.05 µs (0.37x) | 45.93 µs (0.03x) |  1.49 µs (1.00x) |   2.89 µs (0.52x) |   1.94 µs (0.77x) |
| CJK text        | 64 KiB | 667.82 µs (0.13x) |  3.08 ms (0.03x) | 86.24 µs (1.00x) | 161.08 µs (0.54x) | 111.89 µs (0.77x) |
| ASCII + é       | 32 B   |  177.0 ns (0.36x) |  1.54 µs (0.04x) |  63.6 ns (1.00x) |  282.3 ns (0.23x) |  232.2 ns (0.27x) |
| ASCII + é       | 1 KiB  |   4.03 µs (0.37x) | 45.86 µs (0.03x) |  1.49 µs (1.00x) |   2.44 µs (0.61x) |   2.21 µs (0.68x) |
| ASCII + é       | 64 KiB | 658.06 µs (0.13x) |  3.06 ms (0.03x) | 85.97 µs (1.00x) | 131.55 µs (0.65x) | 128.44 µs (0.67x) |
| ASCII, then CJK | 32 B   |  178.7 ns (0.36x) |  1.54 µs (0.04x) |  63.9 ns (1.00x) |  288.4 ns (0.22x) |  228.6 ns (0.28x) |
| ASCII, then CJK | 1 KiB  |   4.04 µs (0.37x) | 46.16 µs (0.03x) |  1.49 µs (1.00x) |   2.69 µs (0.55x) |   2.09 µs (0.72x) |
| ASCII, then CJK | 64 KiB | 660.32 µs (0.13x) |  3.04 ms (0.03x) | 86.07 µs (1.00x) | 146.60 µs (0.59x) | 120.10 µs (0.72x) |
| binary          | 32 B   |  176.7 ns (0.36x) |  1.55 µs (0.04x) |  63.6 ns (1.00x) |  293.1 ns (0.22x) |  233.5 ns (0.27x) |
| binary          | 1 KiB  |   4.08 µs (0.37x) | 45.88 µs (0.03x) |  1.49 µs (1.00x) |   2.95 µs (0.51x) |   2.18 µs (0.69x) |
| binary          | 64 KiB | 662.19 µs (0.13x) |  3.00 ms (0.03x) | 86.42 µs (1.00x) | 506.87 µs (0.17x) | 238.97 µs (0.36x) |

### bun 1.4.4 (JavaScriptCore), Apple M1

| payload         | size   |       charCodeAt |         TE.encode |     TE.encodeInto |
|-----------------|--------|-----------------:|------------------:|------------------:|
| ASCII text      | 32 B   |  27.2 ns (1.00x) |   35.5 ns (0.77x) |   23.2 ns (1.17x) |
| ASCII text      | 1 KiB  | 812.4 ns (1.00x) |  135.6 ns (5.99x) |  142.9 ns (5.69x) |
| ASCII text      | 64 KiB | 44.26 µs (1.00x) |  2.76 µs (16.02x) |  2.74 µs (16.18x) |
| Latin text      | 32 B   |  27.1 ns (1.00x) |   66.1 ns (0.41x) |   49.1 ns (0.55x) |
| Latin text      | 1 KiB  | 801.7 ns (1.00x) |   1.95 µs (0.41x) |   1.55 µs (0.52x) |
| Latin text      | 64 KiB | 44.77 µs (1.00x) | 113.37 µs (0.39x) |  91.76 µs (0.49x) |
| CJK text        | 32 B   |  26.4 ns (1.00x) |  195.6 ns (0.13x) |   93.6 ns (0.28x) |
| CJK text        | 1 KiB  | 853.3 ns (1.00x) |   9.31 µs (0.09x) |   4.86 µs (0.18x) |
| CJK text        | 64 KiB | 46.18 µs (1.00x) | 594.71 µs (0.08x) | 297.19 µs (0.16x) |
| ASCII + é       | 32 B   |  28.2 ns (1.00x) |   73.9 ns (0.38x) |   46.3 ns (0.61x) |
| ASCII + é       | 1 KiB  | 828.1 ns (1.00x) |   1.21 µs (0.69x) |  853.2 ns (0.97x) |
| ASCII + é       | 64 KiB | 48.34 µs (1.00x) |  63.59 µs (0.76x) |  49.28 µs (0.98x) |
| ASCII, then CJK | 32 B   |  29.1 ns (1.00x) |  118.8 ns (0.24x) |   68.0 ns (0.43x) |
| ASCII, then CJK | 1 KiB  | 847.4 ns (1.00x) |   5.34 µs (0.16x) |   2.82 µs (0.30x) |
| ASCII, then CJK | 64 KiB | 47.32 µs (1.00x) | 336.61 µs (0.14x) | 178.00 µs (0.27x) |
| binary          | 32 B   |  27.8 ns (1.00x) |  106.8 ns (0.26x) |   73.2 ns (0.38x) |
| binary          | 1 KiB  | 808.2 ns (1.00x) |   5.30 µs (0.15x) |   3.42 µs (0.24x) |
| binary          | 64 KiB | 44.86 µs (1.00x) | 643.08 µs (0.07x) | 333.91 µs (0.13x) |

### What the numbers say

* The loop of [#198] is 3 to 8 times faster than what 3.9.6 did.
* `TextEncoder` is 5 to 20 times faster than the loop on ASCII of 1 KiB
  and more, and that is the only case it wins.
* It is slower on short strings, and on anything that is not ASCII: 0.2x
  to 0.8x on V8 and as low as 0.07x on JavaScriptCore.  One non-ASCII
  character is enough to lose.
* So the loop stays.

## End to end

`lib.mjs` on node 24.22.2 with 3.9.6 and the current build.
The rows for `toUint8Array` on text look like those of `decode`.

| method       | payload         | size   |         3.9.6.mjs |        base64.mjs |
|--------------|-----------------|--------|------------------:|------------------:|
| toUint8Array | binary          | 32 B   |  438.4 ns (1.00x) |  325.9 ns (1.35x) |
| toUint8Array | binary          | 1 KiB  |   7.23 µs (1.00x) |   4.77 µs (1.52x) |
| toUint8Array | binary          | 64 KiB |   1.36 ms (1.00x) | 809.70 µs (1.68x) |
| decode       | ASCII text      | 32 B   |  639.2 ns (1.00x) |  522.1 ns (1.22x) |
| decode       | ASCII text      | 1 KiB  |   7.23 µs (1.00x) |   4.83 µs (1.50x) |
| decode       | ASCII text      | 64 KiB | 842.15 µs (1.00x) | 278.74 µs (3.02x) |
| decode       | Latin text      | 32 B   |  678.0 ns (1.00x) |  557.1 ns (1.22x) |
| decode       | Latin text      | 1 KiB  |   8.04 µs (1.00x) |   5.53 µs (1.45x) |
| decode       | Latin text      | 64 KiB | 865.03 µs (1.00x) | 317.37 µs (2.73x) |
| decode       | CJK text        | 32 B   |  726.7 ns (1.00x) |  603.0 ns (1.21x) |
| decode       | CJK text        | 1 KiB  |   8.23 µs (1.00x) |   5.79 µs (1.42x) |
| decode       | CJK text        | 64 KiB | 914.40 µs (1.00x) | 336.80 µs (2.72x) |
| decode       | ASCII + é       | 32 B   |  700.5 ns (1.00x) |  579.3 ns (1.21x) |
| decode       | ASCII + é       | 1 KiB  |   7.36 µs (1.00x) |   4.93 µs (1.49x) |
| decode       | ASCII + é       | 64 KiB | 852.30 µs (1.00x) | 283.65 µs (3.00x) |
| decode       | ASCII, then CJK | 32 B   |  694.2 ns (1.00x) |  561.8 ns (1.24x) |
| decode       | ASCII, then CJK | 1 KiB  |   7.63 µs (1.00x) |   5.22 µs (1.46x) |
| decode       | ASCII, then CJK | 64 KiB | 862.16 µs (1.00x) | 297.42 µs (2.90x) |

bun, deno and node 25 or later have `Uint8Array.fromBase64`, so there
`lib.mjs` measures the native path.
