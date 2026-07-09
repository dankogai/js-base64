/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 *
 * Base64.btoa must throw on characters outside Latin-1 (0-255), the same as
 * window.btoa and Base64.btoaPolyfill.  This checks the Buffer fallback path,
 * taken when Buffer exists but global btoa does not (e.g. node.js < 16).
 */
var assert = assert || require("assert");

// Load Base64 with Buffer present but no atob/btoa, so _btoa uses the Buffer path.
var Base64 = (function () {
    var savedAtob = global.atob;
    var savedBtoa = global.btoa;
    global.atob = undefined;
    global.btoa = undefined;
    delete require.cache[require.resolve('../base64.js')];
    var B64 = require('../base64.js').Base64;
    delete require.cache[require.resolve('../base64.js')];
    global.atob = savedAtob;
    global.btoa = savedBtoa;
    return B64;
})();

describe('btoa (Buffer fallback)', function () {
    it('encodes Latin-1 the same as standard Base64', function () {
        assert.equal(Base64.btoa('dankogai'), 'ZGFua29nYWk=');
    });
    it('throws on a character outside Latin-1', function () {
        assert.throws(function () { Base64.btoa('小飼弾'); }, TypeError);
    });
});
