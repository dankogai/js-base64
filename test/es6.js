/*
 * $Id: es6.js,v 0.1 2017/11/28 23:33:19 ufolux Exp ufolux $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */

import {Base64} from 'base64.js'
const assert = assert || require("assert")

const is = (a, e, m) => {
    return () => {
        assert.equal(a, e, m)
    }
}

if ('extendString' in Base64){
    Base64.extendString();
    describe('String', () => {
        it('.toBase64', is('小飼弾'.toBase64(), '5bCP6aO85by+'));
        it('.toBase64', is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
        it('.toBase64URI', is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
        it('.fromBase64', is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
        it('.fromBase64', is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
    });
}