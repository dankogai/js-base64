[![build status](https://secure.travis-ci.org/dankogai/js-base64.png)](http://travis-ci.org/dankogai/js-base64)

# base64.js

Yet another Base64 transcoder

## Usage

### In Browser
````html
<script src="base64.js"></script>
````
### node.js
````javascript
var Base64 = require('js-base64').Base64;
````


## SYNOPSIS

````javascript
Base64.encode('dankogai');  // ZGFua29nYWk=
Base64.encode('小飼弾');    // 5bCP6aO85by+
Base64.encodeURI('小飼弾'); // 5bCP6aO85by-

Base64.decode('ZGFua29nYWk=');  // dankogai
Base64.decode('5bCP6aO85by+');  // 小飼弾
// note .decodeURI() is unnecessary since it accepts both flavors
Base64.decode('5bCP6aO85by-');  // 小飼弾
````

### String Extension for ES5

````javascript
if (Base64.extendString) {
    // you have to explicitly extend String.prototype
    Base64.extendString();
    // once extended, you can do the following
    'dankogai'.toBase64();       // ZGFua29nYWk=
    '小飼弾'.toBase64();         // 5bCP6aO85by+
    '小飼弾'.toBase64(true);     // 5bCP6aO85by-
    '小飼弾'.toBase64URI();      // 5bCP6aO85by-
    'ZGFua29nYWk='.fromBase64(); // dankogai
    '5bCP6aO85by+'.fromBase64(); // 小飼弾
    '5bCP6aO85by-'.fromBase64(); // 小飼弾
}
````

### TypeScript

A basic TypeScript implementation was added to the [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/88fca07022ae6549a09965bf1316a1f5e34e471b/js-base64/js-base64.d.ts).

**Install definition**

```bash
$ typings install --save --global dt~js-base64
```

## SEE ALSO

+ http://en.wikipedia.org/wiki/Base64
