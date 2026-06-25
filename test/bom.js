/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 *
 * Decode must preserve a leading U+FEFF (BOM) on the TextDecoder path,
 * matching the Buffer and atob-polyfill paths.
 */
var assert = assert || require("assert");

// Load Base64 in a browser-faithful environment: no Buffer, no atob/btoa,
// but TextDecoder/TextEncoder present, so the TextDecoder decode path is taken.
var Base64 = (function () {
    var savedBuffer = global.Buffer;
    var savedAtob = global.atob;
    var savedBtoa = global.btoa;
    global.Buffer = undefined;
    global.atob = undefined;
    global.btoa = undefined;
    delete require.cache[require.resolve('../base64.js')];
    var B64 = require('../base64.js').Base64;
    delete require.cache[require.resolve('../base64.js')];
    global.Buffer = savedBuffer;
    global.atob = savedAtob;
    global.btoa = savedBtoa;
    return B64;
})();

var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

describe('BOM (TextDecoder path)', function () {
    var bom = '﻿';
    it('decode keeps a leading BOM', is(Base64.decode('77u/aGVsbG8='), bom + 'hello'));
    it('round-trips a leading BOM', is(Base64.decode(Base64.encode(bom + 'hello')), bom + 'hello'));
    it('round-trips a lone BOM', is(Base64.decode(Base64.encode(bom)), bom));
});
