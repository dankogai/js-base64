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

// round trips of inputs long enough to matter to an optimized decoder
describe('toUint8Array on long inputs', function () {
    var subjects = [['', Base64]];
    // test the fallback even if Uint8Array.fromBase64 is available
    if (typeof require === 'function' && typeof Uint8Array.fromBase64 === 'function') {
        var path = require.resolve('../base64.js');
        var cached = require.cache[path];
        var fromBase64 = Uint8Array.fromBase64;
        try {
            Uint8Array.fromBase64 = undefined;
            delete require.cache[path];
            subjects.push([' (fallback)', require(path).Base64]);
        } finally {
            Uint8Array.fromBase64 = fromBase64;
            require.cache[path] = cached;
        }
    }
    var fill = function (l, fn) {
        var u8a = new Uint8Array(l);
        for (var i = 0; i < l; i++) u8a[i] = fn(i);
        return u8a;
    };
    var ascii = function (i) { return 0x20 + i % 0x5f; };
    var binary = function (i) { return i * 131 + (i >> 8) * 17 & 0xff; };
    var roundtrip = function (B64, want) {
        var got = B64.toUint8Array(B64.fromUint8Array(want));
        assert.equal(got.length, want.length);
        assert.equal(got.buffer.byteLength, want.length);
        for (var i = 0; i < want.length; i++) {
            if (got[i] !== want[i]) assert.fail('differs at ' + i);
        }
    };
    subjects.forEach(function (subject) {
        var B64 = subject[1];
        [511, 512, 513, 1024, 1025, 4096, 70001].forEach(function (l) {
            var name = l + ' bytes' + subject[0];
            it('ASCII, ' + name, function () {
                roundtrip(B64, fill(l, ascii));
            });
            it('binary, ' + name, function () {
                roundtrip(B64, fill(l, binary));
            });
            it('ASCII but one byte, ' + name, function () {
                [0, 63, 64, 65, 127, 128, 129, l >> 1, l - 2, l - 1].forEach(function (p) {
                    [0x80, 0xBF, 0xC2, 0xC3, 0xFF].forEach(function (b) {
                        var u8a = fill(l, ascii);
                        u8a[p] = b;
                        roundtrip(B64, u8a);
                    });
                });
            });
            it('ASCII then binary, ' + name, function () {
                roundtrip(B64, fill(l, function (i) {
                    return i < l / 3 ? ascii(i) : binary(i);
                }));
            });
        });
        it('decode' + subject[0], function () {
            ['dankogai', '小飼弾', 'dankogai 小飼弾 '].forEach(function (s) {
                var str = new Array(1000).join(s);
                assert.equal(B64.decode(B64.encode(str)), str);
                assert.equal(B64.decode(B64.encode(str + '弾')), str + '弾');
            });
        });
    });
});
