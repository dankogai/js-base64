var assert = assert || require("assert");
var Base64 = Base64 || require("../base64.js");

describe("umd module", () => {
    if (typeof global !== "undefined") {
        it("should not modify `global` variables", () => {
          assert.equal("Base64" in global, false);
        });
    } else if (typeof window !== "undefined") {
        it("should inject `window` namespace", () => {
            assert.equal("Base64" in window, true);
            assert.equal(typeof window.Base64, 'object');
            assert.equal("noConflict" in window.Base64, true);
          });
    }

    it("should work with namespace and non-namespace usage both", () => {
        assert.equal(!Base64.Base64, false);
        assert.notEqual(Base64.Base64, Base64);
        assert.equal(Base64.encode, Base64.Base64.encode);
    });
});
