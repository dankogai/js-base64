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
const version = '3.3.2';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _b64chars = [
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
];
const _b64tab = ((chars) => {
    let tab = {};
    _b64chars.forEach((c, i) => tab[c] = i);
    return tab;
})(_b64chars);
const _fromCharCode = String.fromCharCode;
const _mkUriSafe = (src: string) => src
    .replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_')
    .replace(/=+$/m, '');
/**
 * converts a Uint8Array to a Base64 string.
 * @param {Boolean} [rfc4648] URL-and-filename-safe a la RFC4648
 * @returns {String} Base64 string
 */
const fromUint8Array = (src: Uint8Array, rfc4648 = false) => {
    let b64 = '';
    for (let i = 0, l = src.length; i < l; i += 3) {
        const [a0, a1, a2] = [src[i], src[i + 1], src[i + 2]];
        const ord = (a0 << 16) | (a1 << 8) | a2;
        b64 += _b64chars[(ord >>> 18)];
        b64 += _b64chars[(ord >>> 12) & 63];
        b64 += typeof a1 !== 'undefined' ? _b64chars[(ord >>> 6) & 63] : '=';
        b64 += typeof a2 !== 'undefined' ? _b64chars[ord & 63] : '=';
    }
    return rfc4648 ? _mkUriSafe(b64) : b64;
};
/**
 * does what `window.btoa` of web browsers does.
 * @param {String} src binary string
 * @returns {String} Base64-encoded string
 */
const _btoa = typeof btoa === 'function'
    ? (s: string) => btoa(s)
    : (s: string) => {
        if (s.match(/[^\x00-\xFF]/)) throw new RangeError(
            'The string contains invalid characters.'
        );
        return fromUint8Array(
            Uint8Array.from(s, c => c.charCodeAt(0))
        );
    };
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (src: string) => unescape(encodeURIComponent(src));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {Boolean} [rfc4648] if `true` make the result URL-safe
 * @returns {String} Base64 string
 */
const encode = (src: string, rfc4648 = false) => {
    const b64 = _btoa(utob(src));
    return rfc4648 ? _mkUriSafe(b64) : b64;
};
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648.
 * @returns {String} Base64 string
 */
const encodeURI = (src: string) => encode(src, true);
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (src: string) => decodeURIComponent(escape(src));
const _cb_decode = (cccc: string) => {
    let len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? _b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? _b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? _b64tab[cccc.charAt(2)] << 6 : 0)
            | (len > 3 ? _b64tab[cccc.charAt(3)] : 0),
        chars = [
            _fromCharCode(n >>> 16),
            _fromCharCode((n >>> 8) & 0xff),
            _fromCharCode(n & 0xff)
        ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
/**
 * does what `window.atob` of web browsers does.
 * @param {String} src Base64-encoded string
 * @returns {String} binary string
 */
const _atob = typeof atob === 'function'
    ? (a: string) => atob(a)
    : (a: string) => a.replace(/[^A-Za-z0-9\+\/]/g, '')
        .replace(/\S{1,4}/g, _cb_decode);
const _decode = (a: string) => btou(_atob(a));
const _unURI = (a: string) => {
    return a
        .replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/')
        .replace(/[^A-Za-z0-9\+\/]/g, '');
};
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {String} UTF-8 string
 */
const decode = (src: string) => _decode(_unURI(src));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = (a: string) => {
    return Uint8Array.from(_atob(_unURI(a)), c => c.charCodeAt(0));
};
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(
        String.prototype, name, _noEnum(body)
    );
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
const extendUint8Array = function () {
    const _add = (name, body) => Object.defineProperty(
        Uint8Array.prototype, name, _noEnum(body)
    );
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
const extendBuiltins = () => {
    extendString();
    extendUint8Array();
}
const gBase64 = {
    version: version,
    VERSION: VERSION,
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
}
// makecjs:CUT //
export { version };
export { VERSION };
export { _atob as atob };
export { _btoa as btoa };
export { decode as fromBase64 };
export { encode as toBase64 };
export { utob };
export { encode };
export { encodeURI };
export { encodeURI as encodeURL };
export { btou };
export { decode };
export { fromUint8Array };
export { toUint8Array };
export { extendString };
export { extendUint8Array };
export { extendBuiltins };
// and finally,
export { gBase64 as Base64 };
