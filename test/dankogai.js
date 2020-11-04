/*
 * $Id: dankogai.js,v 0.4 2012/08/24 05:23:18 dankogai Exp dankogai $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../base64.js').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

describe('basic', function () {
    it('d', is(Base64.encode('d'), 'ZA=='));
    it('da', is(Base64.encode('da'), 'ZGE='));
    it('dan', is(Base64.encode('dan'), 'ZGFu'));
    it('ZA==', is(Base64.decode('ZA=='), 'd'));
    it('ZGE=', is(Base64.decode('ZGE='), 'da'));
    it('ZGFu', is(Base64.decode('ZGFu'), 'dan'));
});

describe('whitespace', function () {
    it('Z A==', is(Base64.decode('Z A=='), 'd'));
    it('ZG E=', is(Base64.decode('ZG E='), 'da'));
    it('ZGF u', is(Base64.decode('ZGF u'), 'dan'));
});

describe('null', function () {
    it('\\0', is(Base64.encode('\0'), 'AA=='));
    it('\\0\\0', is(Base64.encode('\0\0'), 'AAA='));
    it('\\0\\0\\0', is(Base64.encode('\0\0\0'), 'AAAA'));
    it('AA==', is(Base64.decode('AA=='), '\0'));
    it('AAA=', is(Base64.decode('AAA='), '\0\0'));
    it('AAAA', is(Base64.decode('AAAA'), '\0\0\0'));
});

describe('Base64', function () {
    it('.encode', is(Base64.encode('小飼弾'), '5bCP6aO85by+'));
    it('.encodeURI', is(Base64.encodeURI('小飼弾'), '5bCP6aO85by-'));
    it('.decode', is(Base64.decode('5bCP6aO85by+'), '小飼弾'));
    it('.decode', is(Base64.decode('5bCP6aO85by-'), '小飼弾'));
});

describe('isValid', function () {
    it('', is(Base64.isValid(''), true));
    it('0', is(Base64.isValid(0), false));
    it('Z', is(Base64.isValid('Z'), true));
    it('ZA', is(Base64.isValid('ZA'), true));
    it('ZA=', is(Base64.isValid('ZA='), true));
    it('ZA==', is(Base64.isValid('ZA=='), true));
    it('++', is(Base64.isValid('++'), true));
    it('+-', is(Base64.isValid('+-'), false));
    it('--', is(Base64.isValid('--'), true));
    it('//', is(Base64.isValid('//'), true));
    it('__', is(Base64.isValid('__'), true));
    it('/_', is(Base64.isValid('/_'), false));
});

if (typeof Uint8Array === 'function') describe('fromUint8Array', function () {
    it('dankogai', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97, 105])), Base64.encode('dankogai')));
    it('dankoga', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97])), Base64.encode('dankoga')));
    it('dankog', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103])), Base64.encode('dankog')));
    it('danko', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111])), Base64.encode('danko')));
    it('dank', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107])), Base64.encode('dank')));
    it('dan', is(Base64.fromUint8Array(new Uint8Array([100, 97, 110])), Base64.encode('dan')));
    it('da', is(Base64.fromUint8Array(new Uint8Array([100, 97])), Base64.encode('da')));
    it('d', is(Base64.fromUint8Array(new Uint8Array([100])), Base64.encode('d')));
    it('', is(Base64.fromUint8Array(new Uint8Array([])), Base64.encode('')));
});

if (typeof Uint8Array === 'function') describe('toUint8Array', function () {
    var _2str = function (a) {
        return Array.prototype.slice.call(a, 0).toString();
    }
    it('ZGFua29nYWk=', is(_2str(Base64.toUint8Array('ZGFua29nYWk=')), '100,97,110,107,111,103,97,105'));
    it('ZGFua29nYQ==', is(_2str(Base64.toUint8Array('ZGFua29nYQ==')), '100,97,110,107,111,103,97'));
    it('ZGFua29n', is(_2str(Base64.toUint8Array('ZGFua29n')), '100,97,110,107,111,103'));
    it('ZGFua28=', is(_2str(Base64.toUint8Array('ZGFua28=')), '100,97,110,107,111'));
    it('ZGFuaw==', is(_2str(Base64.toUint8Array('ZGFuaw==')), '100,97,110,107'));
    it('ZGFu', is(_2str(Base64.toUint8Array('ZGFu')), '100,97,110'));
    it('ZGE=', is(_2str(Base64.toUint8Array('ZGE=')), '100,97'));
    it('ZA==', is(_2str(Base64.toUint8Array('ZA==')), '100'));
    it('', is(_2str(Base64.toUint8Array('')), ''));
});
