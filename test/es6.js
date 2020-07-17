/*
 * $Id: es6.js,v 0.1 2017/11/29 21:43:17 ufolux Exp ufolux $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
// import {Base64} from '../base64.mjs'
import { extendString } from '../base64.mjs'

var assert = assert || require("assert");
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

delete String.prototype.fromBase64;
delete String.prototype.toBase64;
delete String.prototype.toBase64URI;
delete String.prototype.toBase64URL;
delete String.prototype.toUint8Array;
extendString();

describe('ES6 String', function () {
    it('.toBase64', is('小飼弾'.toBase64(), '5bCP6aO85by+'));
    it('.toBase64', is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
    it('.toBase64URI', is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
    it('.fromBase64', is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
    it('.fromBase64', is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
});
