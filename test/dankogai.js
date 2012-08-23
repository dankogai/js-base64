/*
 * $Id: dankogai.js,v 0.2 2012/08/23 19:14:37 dankogai Exp dankogai $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert, Base64;
if (this['window'] !== this) {
    assert = require("assert");
    Base64 = require('../base64.js').Base64;
}
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};
describe('Base64', function () {
    it('.encode', is(Base64.encode('小飼弾'), '5bCP6aO85by+'));
    it('.encodeURI', is(Base64.encodeURI('小飼弾'), '5bCP6aO85by-'));
    it('.decode', is(Base64.decode('5bCP6aO85by+'), '小飼弾'));
    it('.decode', is(Base64.decode('5bCP6aO85by-'), '小飼弾'));
});
