/*
 * regression test for the re_utob low-surrogate range typo (issue #181)
 *
 * use mocha to test me
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;

// The pure-JS UTF-8 path (utob/btou) is used when TextEncoder is absent.
// The buggy range [\uDC00-\uDFFFF] also matched a high surrogate followed
// by the literal 'F', swallowing the 'F' into a bogus 4-byte sequence.
describe('re_utob low surrogate range (#181)', function () {
    it("lone high surrogate + 'F' round-trips", function () {
        var s = '\uD800F';
        assert.equal(Base64.btou(Base64.utob(s)), s);
    });
    it("lone high surrogate DBFF + 'F' round-trips", function () {
        var s = '\uDBFFF';
        assert.equal(Base64.btou(Base64.utob(s)), s);
    });
});
