# Changelog

Notable changes to js-base64, newest first.  The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  Releases that only
touched documentation, tests or CI are omitted.

## [Unreleased]

## [3.9.8] - 2026-11-28

### Changed

- `decode()` and `toUint8Array()` are faster on platforms with `atob` but
  without `Uint8Array.fromBase64`: the input is cleaned once, not twice.

### Fixed

- `atobPolyfill()` no longer fails on large input.  Its validating regexp
  overflowed the stack on V8 from about 5,000,000 characters ([#200]).

## [3.9.7] - 2026-11-18

### Changed

- `toUint8Array()` is faster on platforms without `Uint8Array.fromBase64`:
  the bytes are written straight into the resulting `Uint8Array` ([#198]).
  See `benchmark/` in the repository for the numbers.

## [3.9.6] - 2026-11-01

### Fixed

- `isValid()` now returns `false` for data lengths of 4n+1 such as `'Z'`,
  which cannot encode a whole number of bytes ([#197]).

## [3.9.5] - 2026-10-27

### Fixed

- `extendUint8Array()` and `extendBuiltins()` no longer cause infinite
  recursion on platforms with native `Uint8Array.prototype.toBase64` ([#194]).

## [3.9.4] - 2026-09-19

### Fixed

- The return type of `toUint8Array()` is narrowed to an `ArrayBuffer`-backed
  `Uint8Array`, so the result is accepted where a `BufferSource` is expected,
  such as Web Crypto and `Blob` ([#189], [#193]).

## [3.9.3] - 2026-08-17

### Fixed

- A typo in the low-surrogate range of the UTF-8 encoder ([#181], [#192]).

## [3.9.2] - 2026-07-27

### Changed

- `base64.js` and `base64.mjs` are now built from `base64.ts` with Rollup,
  and the version is taken from `package.json`.  No API changes.

## [3.9.1] - 2026-07-15

### Changed

- Native `Uint8Array.prototype.toBase64` and `Uint8Array.fromBase64` are used
  where available.

## [3.9.0] - 2026-07-14

### Changed

- node's `Buffer` is no longer used.  `TextEncoder`, `TextDecoder`, `atob`
  and `btoa` are available on node as well, so every platform now takes the
  same code path.
- Internal variables and functions are strictly typed, not just exported ones.

## [3.8.1] - 2026-07-09

### Fixed

- `btoa()` throws on non-Latin1 input on the `Buffer` code path as well
  ([#191]).

## [3.8.0] - 2026-06-26

### Fixed

- `decode()` preserves a leading BOM (U+FEFF) on the `TextDecoder` code path
  ([#190]).

## [3.7.8] - 2025-08-10

### Changed

- `atobPolyfill()` allocates less and is faster ([#186], [#187]).
- `isValid()` takes `unknown` instead of `any` ([#179]).

## [3.7.7] - 2024-02-21

### Fixed

- The presence of `atob` and `btoa` is no longer cached at load time, which
  crashed in Web Workers ([#174]).

## [3.7.6] - 2024-01-20

### Fixed

- `base64.d.mts` is added so that the type declarations of the ES module no
  longer masquerade as CommonJS ([#172]).

## [3.7.5] - 2023-02-08

### Changed

- `toUint8Array()` is faster ([#166], [#167]).

## [3.7.4] - 2023-01-08

### Added

- `"sideEffects": false` in `package.json`, for better tree shaking ([#163]).

## [3.7.2] - 2021-09-22

### Fixed

- Handling of the padding `=` in URL-safe encoding and in `isValid()`.

## [3.7.0] - 2021-09-08

### Changed

- `base64.js` is ES5-compatible again, hence it runs on IE11 ([#146], [#147]).

## [3.6.1] - 2021-05-23

### Added

- `exports` map in `package.json` ([#140]).

## [3.6.0] - 2020-11-04

### Added

- `isValid()`.

## [3.5.2] - 2020-09-12

### Changed

- `toUint8Array()` has an explicit return type.

## [3.5.1] - 2020-09-12

### Changed

- `TextEncoder` and `TextDecoder` are used where available.

## [3.5.0] - 2020-09-12

### Fixed

- `encode()` and `decode()` no longer rely on `encodeURIComponent()` and
  `decodeURIComponent()`, which raised `URIError` on some inputs ([#130]).

## [3.4.5] - 2020-08-09

### Fixed

- `fromUint8Array()` failed on platforms without a global `btoa` ([#124]).

## [3.4.4] - 2020-08-05

### Added

- `atobPolyfill()` and `btoaPolyfill()` are exported, so the pure-JS versions
  can be used even where native ones exist.

### Changed

- The polyfills use lookup tables and are faster.

## [3.4.2] - 2020-08-03

### Changed

- Pure-JS `atob()` and `btoa()` are back as the last resort.

## [3.4.1] - 2020-07-31

### Changed

- `Object.assign()` is avoided to make transpiling to ES5 easier.

## [3.4.0] - 2020-07-31

### Changed

- Native `Buffer` is used on node again (until 3.9.0).
- The source can be transpiled to ES5 that runs on IE11.

## [3.3.3] - 2020-07-29

### Added

- Lowercase `version`.

### Changed

- `atob()` no longer coerces its argument to a string.

### Deprecated

- Uppercase `VERSION`.  Use `version` instead.

## [3.3.2] - 2020-07-27

### Fixed

- `base64.ts` is excluded from the npm package ([#122]).

## [3.3.0] - 2020-07-27

### Changed

- Rewritten in TypeScript.  Type declarations are bundled, so
  `@types/js-base64` is no longer needed.

## [3.2.4] - 2020-07-18

### Fixed

- UMD wrapper of `base64.js` ([#120]).

## [3.2.3] - 2020-07-17

### Changed

- The global object is no longer modified unless needed.

## [3.2.2] - 2020-07-17

### Fixed

- `atob()` and `btoa()` on browsers.

## [3.2.1] - 2020-07-17

### Fixed

- `noConflict()`.

## [3.2.0] - 2020-07-17

### Added

- Named exports such as `import { encode, decode } from 'js-base64'`, which
  makes the ES module tree-shakable ([#117]).

## [3.1.2] - 2020-07-17

### Added

- `module` field in `package.json` ([#115]).

## [3.1.0] - 2020-07-16

### Added

- `base64.mjs`, a native ES module.

## [3.0.3] - 2020-07-16

### Changed

- `TextEncoder` and `TextDecoder` are no longer required.

## [3.0.1] - 2020-07-16

### Fixed

- Workaround for legacy (pre-Chromium) Microsoft Edge.

## [3.0.0] - 2020-07-16

### Changed

- Rewritten with ES2015 features, so legacy browsers like IE are no longer
  supported out of the box.  `base64.js` became ES5-compatible again in 3.7.0.

### Added

- `encodeURL()`, an alias of `encodeURI()`.

## [2.6.4] - 2020-08-03

### Added

- `base64.min.js` is back in the package.

## [2.6.3] - 2020-07-09

### Fixed

- `toUint8Array()` could not decode URL-safe input ([#112]).

## [2.6.1] - 2020-06-20

### Added

- `fromUint8Array()` and `toUint8Array()`.

## [2.6.0] - 2020-06-20

### Removed

- The use of node's `Buffer`, and with it `eval()` ([#109]).
- `base64.min.js` (restored in 2.6.4).

## Before 2.6.0

See the [commit history](https://github.com/dankogai/js-base64/commits/main).

[Unreleased]: https://github.com/dankogai/js-base64/compare/v3.9.8...HEAD
[3.9.8]: https://github.com/dankogai/js-base64/releases/tag/v3.9.8
[3.9.7]: https://github.com/dankogai/js-base64/releases/tag/v3.9.7
[3.9.6]: https://github.com/dankogai/js-base64/releases/tag/v3.9.6
[3.9.5]: https://github.com/dankogai/js-base64/releases/tag/v3.9.5
[3.9.4]: https://github.com/dankogai/js-base64/releases/tag/v3.9.4
[3.9.3]: https://github.com/dankogai/js-base64/releases/tag/v3.9.3
[3.9.2]: https://github.com/dankogai/js-base64/releases/tag/3.9.2
[3.9.1]: https://github.com/dankogai/js-base64/releases/tag/3.9.1
[3.9.0]: https://github.com/dankogai/js-base64/releases/tag/3.9.0
[3.8.1]: https://github.com/dankogai/js-base64/releases/tag/3.8.1
[3.8.0]: https://github.com/dankogai/js-base64/releases/tag/3.8.0
[3.7.8]: https://github.com/dankogai/js-base64/releases/tag/3.7.8
[3.7.7]: https://github.com/dankogai/js-base64/releases/tag/3.7.7
[3.7.6]: https://github.com/dankogai/js-base64/releases/tag/3.7.6
[3.7.5]: https://github.com/dankogai/js-base64/releases/tag/3.7.5
[3.7.4]: https://github.com/dankogai/js-base64/releases/tag/3.7.4
[3.7.2]: https://github.com/dankogai/js-base64/releases/tag/3.7.2
[3.7.0]: https://github.com/dankogai/js-base64/releases/tag/3.7.0
[3.6.1]: https://github.com/dankogai/js-base64/releases/tag/3.6.1
[3.6.0]: https://github.com/dankogai/js-base64/releases/tag/3.6.0
[3.5.2]: https://github.com/dankogai/js-base64/releases/tag/3.5.2
[3.5.1]: https://github.com/dankogai/js-base64/releases/tag/3.5.1
[3.5.0]: https://github.com/dankogai/js-base64/releases/tag/3.5.0
[3.4.5]: https://github.com/dankogai/js-base64/releases/tag/3.4.5
[3.4.4]: https://github.com/dankogai/js-base64/releases/tag/3.4.4
[3.4.2]: https://github.com/dankogai/js-base64/releases/tag/3.4.2
[3.4.1]: https://github.com/dankogai/js-base64/releases/tag/3.4.1
[3.4.0]: https://github.com/dankogai/js-base64/releases/tag/3.4.0
[3.3.3]: https://github.com/dankogai/js-base64/releases/tag/3.3.3
[3.3.2]: https://github.com/dankogai/js-base64/releases/tag/3.3.2
[3.3.0]: https://github.com/dankogai/js-base64/releases/tag/3.3.0
[3.2.4]: https://github.com/dankogai/js-base64/releases/tag/3.2.4
[3.2.3]: https://github.com/dankogai/js-base64/releases/tag/3.2.3
[3.2.2]: https://github.com/dankogai/js-base64/releases/tag/3.2.2
[3.2.1]: https://github.com/dankogai/js-base64/releases/tag/3.2.1
[3.2.0]: https://github.com/dankogai/js-base64/releases/tag/3.2.0
[3.1.2]: https://github.com/dankogai/js-base64/releases/tag/3.1.2
[3.1.0]: https://github.com/dankogai/js-base64/releases/tag/3.1.0
[3.0.3]: https://github.com/dankogai/js-base64/releases/tag/3.0.3
[3.0.1]: https://github.com/dankogai/js-base64/releases/tag/3.0.1
[3.0.0]: https://github.com/dankogai/js-base64/releases/tag/3.0.0
[2.6.4]: https://github.com/dankogai/js-base64/releases/tag/2.6.4
[2.6.3]: https://github.com/dankogai/js-base64/releases/tag/2.6.3
[2.6.1]: https://github.com/dankogai/js-base64/releases/tag/2.6.1
[2.6.0]: https://github.com/dankogai/js-base64/releases/tag/2.6.0

[#200]: https://github.com/dankogai/js-base64/issues/200
[#198]: https://github.com/dankogai/js-base64/issues/198
[#197]: https://github.com/dankogai/js-base64/issues/197
[#194]: https://github.com/dankogai/js-base64/issues/194
[#193]: https://github.com/dankogai/js-base64/issues/193
[#192]: https://github.com/dankogai/js-base64/issues/192
[#191]: https://github.com/dankogai/js-base64/issues/191
[#190]: https://github.com/dankogai/js-base64/issues/190
[#189]: https://github.com/dankogai/js-base64/issues/189
[#187]: https://github.com/dankogai/js-base64/issues/187
[#186]: https://github.com/dankogai/js-base64/issues/186
[#181]: https://github.com/dankogai/js-base64/issues/181
[#179]: https://github.com/dankogai/js-base64/issues/179
[#174]: https://github.com/dankogai/js-base64/issues/174
[#172]: https://github.com/dankogai/js-base64/issues/172
[#167]: https://github.com/dankogai/js-base64/issues/167
[#166]: https://github.com/dankogai/js-base64/issues/166
[#163]: https://github.com/dankogai/js-base64/issues/163
[#147]: https://github.com/dankogai/js-base64/issues/147
[#146]: https://github.com/dankogai/js-base64/issues/146
[#140]: https://github.com/dankogai/js-base64/issues/140
[#130]: https://github.com/dankogai/js-base64/issues/130
[#124]: https://github.com/dankogai/js-base64/issues/124
[#122]: https://github.com/dankogai/js-base64/issues/122
[#120]: https://github.com/dankogai/js-base64/issues/120
[#117]: https://github.com/dankogai/js-base64/issues/117
[#115]: https://github.com/dankogai/js-base64/issues/115
[#112]: https://github.com/dankogai/js-base64/issues/112
[#109]: https://github.com/dankogai/js-base64/issues/109
