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
declare const version = "3.2.4";
/**
 * converts a Uint8Array to a Base64 string
 * @param {Uint8Array} src
 * @param {Boolean} [rfc4648] URL-and-filename-safe a la RFC4648
 * @returns {String} Base64 string
 */
declare const fromUint8Array: (src: Uint8Array, rfc4648?: boolean) => string;
/**
 * 100% compatible with `window.btoa` of web browsers
 * @param {String} src binary string
 * @returns {String} Base64-encoded string
 */
declare const _btoa: (s: string) => string;
/**
 * @deprecated since 3.0.0
 * @param {string} src UTF-8 string
 * @returns {string} UTF-16 string
 */
declare const utob: (src: any) => string;
/**
 * converts a UTF-8-encoded string to a Base64 string
 * @param {String} src the string to convert
 * @param {Boolean} [rfc4648] if `true` make the result URL-safe
 * @returns {String} Base64 string
 */
declare const encode: (src: any, rfc4648?: boolean) => string;
/**
 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648
 * @param {String} src the string to convert
 * @returns {String} Base64 string
 */
declare const encodeURI: (src: any) => string;
/**
 * @deprecated since 3.0.0
 * @param {string} src UTF-16 string
 * @returns {string} UTF-8 string
 */
declare const btou: (src: any) => string;
/**
 * 100% compatible with `window.atob` of web browsers
 * @param {String} src Base64-encoded string
 * @returns {String} binary string
 */
declare const _atob: (a: any) => string;
/**
 * converts a Base64 string to a UTF-8 string
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {String} UTF-8 string
 */
declare const decode: (src: any) => string;
/**
 * converts a Base64 string to a Uint8Array
 * @param {String} src Base64 string.  Both normal and URL-safe are supported
 * @returns {Uint8Array} UTF-8 string
 */
declare const toUint8Array: (a: any) => Uint8Array;
declare const extendString: () => void;
declare const extendUint8Array: () => void;
declare const extendBuiltins: () => void;
declare const gBase64: {
    VERSION: string;
    atob: (a: any) => string;
    btoa: (s: string) => string;
    fromBase64: (src: any) => string;
    toBase64: (src: any, rfc4648?: boolean) => string;
    encode: (src: any, rfc4648?: boolean) => string;
    encodeURI: (src: any) => string;
    encodeURL: (src: any) => string;
    utob: (src: any) => string;
    btou: (src: any) => string;
    decode: (src: any) => string;
    fromUint8Array: (src: Uint8Array, rfc4648?: boolean) => string;
    toUint8Array: (a: any) => Uint8Array;
    extendString: () => void;
    extendUint8Array: () => void;
    extendBuiltins: () => void;
};
export { version as VERSION };
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
export { gBase64 as Base64 };
