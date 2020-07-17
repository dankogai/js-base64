[![build status](https://secure.travis-ci.org/dankogai/js-base64.png)](http://travis-ci.org/dankogai/js-base64)

# base64.js

Yet another Base64 transcoder

## HEADS UP: ES2015 support required since version 3

Version 3 is completely rewritten with ES2015 features like arrow functions.  All modern browsers and node 12 or up are directly supported.  Your codes should run unchanged.  IE is no longer supported directly but you can transpile the script to use it (see below).

The hardest part of maintaining this module was not Base64 features, but cross-platform support (eg. nodejs vs web browsers).  By making ES2015 mandatory virtually all codes are common (except `atob()` and `btoa()`).

If you need to support legacy browsers like IE, use version 2 or transpile.

## Usage

### Install

```shell
$ npm install --save js-base64
```

### In Browser

Locally…

```html
<script src="base64.js"></script>
```

… or Directly from CDN.  In which case you don't even need to install.

```html
<script src="https://cdn.jsdelivr.net/npm/js-base64@3.1.3/base64.min.js">
```

### node.js

```javascript
const Base64 = require('js-base64').Base64;
```

## As a ES6 Module

locally…

```javascript
import { Base64 } from 'js-base64';
```

or even remotely.

```html
<script type="module">
// note jsdelivr.net does not automatically minify .mjs
import { Base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.1.3/base64.mjs';
</script>
```

## SYNOPSIS

```javascript
let latin = 'dankogai';
let utf8  = '小飼弾'
let u8s   =  new Uint8Array([100,97,110,107,111,103,97,105]);
Base64.encode(latin);       // ZGFua29nYWk=
Base64.btoa(latin);         // ZGFua29nYWk=
Base64.btoa(utf8);          // raises exception 
Base64.fromUint8Array(u8s); // ZGFua29nYWk=
Base64.fromUint8Array(u8s); // ZGFua29nYW which is URI safe
Base64.encode(utf8);        // 5bCP6aO85by+
Base64.encode(utf8, true)   // 5bCP6aO85by-
Base64.encodeURI(utf8);     // 5bCP6aO85by-
```

```javascript
Base64.decode(      'ZGFua29nYWk=');// dankogai
Base64.atob(        'ZGFua29nYWk=');// dankogai
Base64.atob(        '5bCP6aO85by+');// 'å°é£¼å¼¾' which is nonsense
Base64.toUint8Array('ZGFua29nYWk=');// u8s above
Base64.decode(      '5bCP6aO85by+');// 小飼弾
// note .decodeURI() is unnecessary since it accepts both flavors
Base64.decode(      '5bCP6aO85by-');// 小飼弾
```

### String Extension for ES5

```javascript
// you have to explicitly extend String.prototype
Base64.extendString();
// once extended, you can do the following
'dankogai'.toBase64();        // ZGFua29nYWk=
'小飼弾'.toBase64();           // 5bCP6aO85by+
'小飼弾'.toBase64(true);       // 5bCP6aO85by-
'小飼弾'.toBase64URI();        // 5bCP6aO85by-
'小飼弾'.toBase64URL();        // 5bCP6aO85by- an alias of .toBase64URI()
'ZGFua29nYWk='.fromBase64();  // dankogai
'5bCP6aO85by+'.fromBase64();  // 小飼弾
'5bCP6aO85by-'.fromBase64();  // 小飼弾
'5bCP6aO85by-'.toUint8Array();// new Uint8Array([100,97,110,107,111,103,97,105])
```

```javascript
// you have to explicitly extend String.prototype
Base64.extendString();
// once extended, you can do the following
u8s.toBase64();     // 'ZGFua29nYWk='
u8s.toBase64URI();  // 'ZGFua29nYWk'
u8s.toBase64URL();  // 'ZGFua29nYWk' an alias of .toBase64URI()
```

You can extend both via `Base64.extendBuiltin()`.

### TypeScript

TypeScript 2.0 type definition was added to the [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped).

```bash
$ npm install --save @types/js-base64
```

## `.decode()` vs `.atob` (and `.encode()` vs `btoa()`)

Suppose you have:

```
var pngBase64 = 
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
```

Which is a Base64-encoded 1x1 transparent PNG, **DO NOT USE** `Base64.decode(pngBase64)`.  Use `Base64.atob(pngBase64)` instead.  `Base64.decode()` decodes to UTF-8 string while `Base64.atob()` decodes to bytes, which is compatible to browser built-in `atob()` (Which is absent in node.js).  The same rule applies to the opposite direction.

Or even better, `Base64.toUint8Array(pngBase64)`.

## SEE ALSO

+ http://en.wikipedia.org/wiki/Base64
