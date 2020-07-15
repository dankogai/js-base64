/**
 *  textencoding.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  Forked from:
 *    https://gitlab.com/PseudoPsycho/text-encoding-shim
 * 
 * @author Dan Kogai (https://github.com/dankogai)
 */
;(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        var textEncoding = factory();
        root.TextEncoder = textEncoding.TextEncoder;
        root.TextDecoder = textEncoding.TextDecoder;
    }
}(this, function() {
    "use strict";
    // return native implementation if available
    var g = typeof global !== 'undefined' ? global : self;
    if (typeof g.TextEncoder !== 'undefined' && typeof g.TextDecoder !== 'undefined') {
        return {
            'TextEncoder': g.TextEncoder,
            'TextDecoder': g.TextDecoder
        };
    }
    // allowed encoding strings for utf-8
    var utf8Encodings = {
        'utf8':true,
        'utf-8':true,
        'unicode-1-1-utf-8':true
    };
    var TextEncoder = function(encoding) {
        if (!encoding) encoding = 'utf-8';
        if (!utf8Encodings[encoding.toLowerCase()]) {
            throw new RangeError('Invalid encoding type. Only utf-8 is supported');
        } else {
            this.encoding = 'utf-8';
            this.encode = function(str) {
                if (typeof str !== 'string') {
                    throw new TypeError('passed argument must be of type string');
                }
                return Uint8Array.from(
                    unescape(encodeURIComponent(str)), c=>c.charCodeAt(0)
                );
            };
        }
    };
    var TextDecoder = function(encoding, options) {
        if (!encoding) encoding = 'utf-8';
        if (!utf8Encodings[encoding.toLowerCase()]) {
            throw new RangeError('Invalid encoding type. Only utf-8 is supported');
        }
        this.encoding = 'utf-8';
        this.ignoreBOM = false;
        this.fatal = (typeof options !== 'undefined' && 'fatal' in options) ? options.fatal : false;
        if (typeof this.fatal !== 'boolean') {
            throw new TypeError('fatal flag must be boolean');
        }
        this.decode = function(view, options) {
            if (typeof view === 'undefined') {
                return '';
            }
            var stream = (typeof options !== 'undefined' && 'stream' in options) ? options.stream : false;
            if (typeof stream !== 'boolean') {
                throw new TypeError('stream option must be boolean');
            }
            if (!ArrayBuffer.isView(view)) {
                throw new TypeError('passed argument must be an array buffer view');
            } else {
                var str = '';
                new Uint8Array(
                    view.buffer, view.byteOffset, view.byteLength
                ).forEach(function(u8) {
                    str += String.fromCharCode(u8)
                });
                return decodeURIComponent(escape(str));
            }
        };
    };
    return {
        'TextEncoder': TextEncoder,
        'TextDecoder': TextDecoder
    };
}));
