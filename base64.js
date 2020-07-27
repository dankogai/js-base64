"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64 = exports.extendBuiltins = exports.extendUint8Array = exports.extendString = exports.toUint8Array = exports.fromUint8Array = exports.decode = exports.btou = exports.encodeURL = exports.encodeURI = exports.encode = exports.utob = exports.toBase64 = exports.fromBase64 = exports.btoa = exports.atob = exports.VERSION = void 0;
/**
 *  base64.ts
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 *
 * @author Dan Kogai (https://github.com/dankogai)
 */
var version = '3.3.0';
exports.VERSION = version;
var _b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var _b64tab = (function (chars) {
    var tab = {}, i = 0;
    for (var _i = 0, chars_1 = chars; _i < chars_1.length; _i++) {
        var c = chars_1[_i];
        tab[c] = i++;
    }
    return tab;
})(_b64chars);
var _fromCharCode = String.fromCharCode;
var _mkUriSafe = function (src) { return src
    .replace(/[+\/]/g, function (m0) { return m0 == '+' ? '-' : '_'; })
    .replace(/=/g, ''); };
/**
 * converts a Uint8Array to a Base64 string
 * @param {Boolean} [rfc4648] URL-and-filename-safe a la RFC4648
 * @returns {String} Base64 string
 */
var fromUint8Array = function (src, rfc4648) {
    if (rfc4648 === void 0) { rfc4648 = false; }
    var b64 = '';
    for (var i = 0, l = src.length; i < l; i += 3) {
        var a0 = src[i], a1 = src[i + 1], a2 = src[i + 2];
        var ord = a0 << 16 | a1 << 8 | a2;
        b64 += _b64chars.charAt(ord >>> 18)
            + _b64chars.charAt((ord >>> 12) & 63)
            + (typeof a1 != 'undefined'
                ? _b64chars.charAt((ord >>> 6) & 63) : '=')
            + (typeof a2 != 'undefined'
                ? _b64chars.charAt(ord & 63) : '=');
    }
    return rfc4648 ? _mkUriSafe(b64) : b64;
};
exports.fromUint8Array = fromUint8Array;
/**
 * 100% compatible with `window.btoa` of web browsers
 * @param {String} src binary string
 * @returns {String} Base64-encoded string
 */
var _btoa = typeof btoa === 'function'
    ? function (s) { return btoa(s); }
    : function (s) {
        if (s.match(/[^\x00-\xFF]/))
            throw new RangeError('The string contains invalid characters.');
        return fromUint8Array(Uint8Array.from(s, function (c) { return c.charCodeAt(0); }));
    };
exports.btoa = _btoa;
/**
 * @deprecated since 3.0.0
 * @returns {string} UTF-16 string
 */
var utob = function (src) { return unescape(encodeURIComponent(src)); };
exports.utob = utob;
/**
 * converts a UTF-8-encoded string to a Base64 string
 * @param {Boolean} [rfc4648] if `true` make the result URL-safe
 * @returns {String} Base64 string
 */
var encode = function (src, rfc4648) {
    if (rfc4648 === void 0) { rfc4648 = false; }
    var b64 = _btoa(utob(src));
    return rfc4648 ? _mkUriSafe(b64) : b64;
};
exports.toBase64 = encode;
exports.encode = encode;
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648
 * @returns {String} Base64 string
 */
var encodeURI = function (src) { return encode(src, true); };
exports.encodeURI = encodeURI;
exports.encodeURL = encodeURI;
/**
 * @deprecated since 3.0.0
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
var btou = function (src) { return decodeURIComponent(escape(src)); };
exports.btou = btou;
var _cb_decode = function (cccc) {
    var len = cccc.length, padlen = len % 4, n = (len > 0 ? _b64tab[cccc.charAt(0)] << 18 : 0)
        | (len > 1 ? _b64tab[cccc.charAt(1)] << 12 : 0)
        | (len > 2 ? _b64tab[cccc.charAt(2)] << 6 : 0)
        | (len > 3 ? _b64tab[cccc.charAt(3)] : 0), chars = [
        _fromCharCode(n >>> 16),
        _fromCharCode((n >>> 8) & 0xff),
        _fromCharCode(n & 0xff)
    ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
/**
 * 100% compatible with `window.atob` of web browsers
 * @param {String} src Base64-encoded string
 * @returns {String} binary string
 */
var _atob = typeof atob === 'function'
    ? function (a) { return atob(a); }
    : function (a) {
        return String(a)
            .replace(/[^A-Za-z0-9\+\/]/g, '')
            .replace(/\S{1,4}/g, _cb_decode);
    };
exports.atob = _atob;
var _decode = function (a) { return btou(_atob(a)); };
var _unURI = function (a) {
    return a
        .replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/'; })
        .replace(/[^A-Za-z0-9\+\/]/g, '');
};
/**
 * converts a Base64 string to a UTF-8 string
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {String} UTF-8 string
 */
var decode = function (src) { return _decode(_unURI(src)); };
exports.fromBase64 = decode;
exports.decode = decode;
/**
 * converts a Base64 string to a Uint8Array
 */
var toUint8Array = function (a) {
    return Uint8Array.from(_atob(_unURI(a)), function (c) { return c.charCodeAt(0); });
};
exports.toUint8Array = toUint8Array;
var _noEnum = function (v) {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
var extendString = function () {
    var _add = function (name, body) { return Object.defineProperty(String.prototype, name, _noEnum(body)); };
    _add('fromBase64', function () {
        return decode(this);
    });
    _add('toBase64', function (rfc4648) {
        return encode(this, rfc4648);
    });
    _add('toBase64URI', function () {
        return encode(this, true);
    });
    _add('toBase64URL', function () {
        return encode(this, true);
    });
    _add('toUint8Array', function () {
        return toUint8Array(this);
    });
};
exports.extendString = extendString;
var extendUint8Array = function () {
    var _add = function (name, body) { return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body)); };
    _add('toBase64', function (rfc4648) {
        return fromUint8Array(this, rfc4648);
    });
    _add('toBase64URI', function () {
        return fromUint8Array(this, true);
    });
    _add('toBase64URL', function () {
        return fromUint8Array(this, true);
    });
};
exports.extendUint8Array = extendUint8Array;
var extendBuiltins = function () {
    extendString();
    extendUint8Array();
};
exports.extendBuiltins = extendBuiltins;
var gBase64 = {
    VERSION: version,
    atob: _atob,
    btoa: _btoa,
    fromBase64: decode,
    toBase64: encode,
    encode: encode,
    encodeURI: encodeURI,
    encodeURL: encodeURI,
    utob: utob,
    btou: btou,
    decode: decode,
    fromUint8Array: fromUint8Array,
    toUint8Array: toUint8Array,
    extendString: extendString,
    extendUint8Array: extendUint8Array,
    extendBuiltins: extendBuiltins
};
exports.Base64 = gBase64;
