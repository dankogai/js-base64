var assert = assert || require('assert');
var Base64 = Base64 || require('../base64.js').Base64;

describe('Uint8Array extensions', function () {
    it('keeps encoding after extending Uint8Array.prototype', function () {
        var names = ['toBase64', 'toBase64URI', 'toBase64URL'];
        var descriptors = names.map(function (name) {
            return Object.getOwnPropertyDescriptor(Uint8Array.prototype, name);
        });
        try {
            Base64.extendUint8Array();
            var bytes = new Uint8Array([0, 0, 63]);
            assert.equal(bytes.toBase64(), 'AAA/');
            assert.equal(bytes.toBase64(true), 'AAA_');
            assert.equal(bytes.toBase64URI(), 'AAA_');
            assert.equal(bytes.toBase64URL(), 'AAA_');
            assert.equal(Base64.fromUint8Array(bytes), 'AAA/');
            assert.equal(Base64.encode('a'), 'YQ==');
        } finally {
            names.forEach(function (name, i) {
                if (descriptors[i]) {
                    Object.defineProperty(Uint8Array.prototype, name, descriptors[i]);
                } else {
                    delete Uint8Array.prototype[name];
                }
            });
        }
    });
});
