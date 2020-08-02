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
const version = '3.4.1';
/**
 * @deprecated use lowercase `version`.
 */
const VERSION = version;
const _hasatob = typeof atob === 'function';
const _hasbtoa = typeof btoa === 'function';
const _hasBuffer = typeof Buffer === 'function';
if (!(_hasatob && _hasbtoa) && !_hasBuffer) { // !! SHOULD NEVER HAPPEN !!
    throw ReferenceError('neither `{atob,btoa}` nor `Buffer` is available');
}
const _fromCharCode = String.fromCharCode.bind(String);
const _U8Afrom = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (it, fn = (x) => x) => new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
const _mkUriSafe = (src) => src
    .replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_')
    .replace(/=+$/m, '');
const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
/**
 * does what `window.btoa` of web browsers does.
 * @param {String} src binary string
 * @returns {string} Base64-encoded string
 */
const _btoa = _hasbtoa ? (s) => btoa(s)
    : _hasBuffer
        ? (s) => Buffer.from(s, 'binary').toString('base64')
        : (s) => {
            throw ReferenceError('neither `btoa` nor `Buffer` is available');
        };
const _fromUint8Array = _hasBuffer
    ? (u8a) => Buffer.from(u8a).toString('base64')
    : (u8a) => {
        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
        const maxargs = 0x1000;
        let strs = [];
        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
            strs.push(_fromCharCode.apply(null, u8a.subarray(i, i + maxargs)));
        }
        return btoa(strs.join(''));
    };
/**
 * converts a Uint8Array to a Base64 string.
 * @param {boolean} [rfc4648] URL-and-filename-safe a la RFC4648
 * @returns {string} Base64 string
 */
const fromUint8Array = (u8a, rfc4648 = false) => rfc4648 ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
const utob = (src) => unescape(encodeURIComponent(src));
/**
 *
 */
const _encode = _hasBuffer
    ? (s) => Buffer.from(s, 'utf8').toString('base64')
    : (s) => _btoa(utob(s));
/**
 * converts a UTF-8-encoded string to a Base64 string.
 * @param {boolean} [rfc4648] if `true` make the result URL-safe
 * @returns {string} Base64 string
 */
const encode = (src, rfc4648 = false) => rfc4648 ? _mkUriSafe(_encode(src)) : _encode(src);
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648.
 * @returns {string} Base64 string
 */
const encodeURI = (src) => encode(src, true);
/**
 * @deprecated should have been internal use only.
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
const btou = (src) => decodeURIComponent(escape(src));
/**
 * does what `window.atob` of web browsers does.
 * @param {String} src Base64-encoded string
 * @returns {string} binary string
 */
const _atob = _hasatob ? (a) => atob(_tidyB64(a))
    : _hasBuffer ? (a) => Buffer.from(a, 'base64').toString('binary')
        : (a) => {
            throw ReferenceError('neither `atob` nor `Buffer` is available');
        };
const _decode = _hasBuffer
    ? (a) => Buffer.from(a, 'base64').toString('utf8')
    : (a) => btou(_atob(a));
const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
/**
 * converts a Base64 string to a UTF-8 string.
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {string} UTF-8 string
 */
const decode = (src) => _decode(_unURI(src));
/**
 * converts a Base64 string to a Uint8Array.
 */
const toUint8Array = _hasBuffer
    ? (a) => _U8Afrom(Buffer.from(_unURI(a), 'base64'))
    : (a) => _U8Afrom(_atob(_unURI(a)), c => c.charCodeAt(0));
const _noEnum = (v) => {
    return {
        value: v, enumerable: false, writable: true, configurable: true
    };
};
const extendString = function () {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
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
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
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
};
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
};
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
