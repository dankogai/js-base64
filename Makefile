PJ=package.json
TS=base64.ts
JS=base64.js
ES5=base64.es5.js
ES6=base64.es6.js
MJS=base64.mjs
DTS=base64.d.ts
MDTS=base64.d.mts

all: $(MJS) $(JS)

$(MJS): $(PJ) $(TS)
	-tsc -d --target es6 $(TS) > /dev/null; mv $(JS) $(MJS); cp $(DTS) $(MDTS)

$(ES6): $(MJS)
	util/makecjs $(MJS) > $(ES6)

$(ES5): $(ES6)
	tsc --allowJS --outFile $(ES5) $(ES6)

$(JS): $(ES5)
	rm $(ES6) && mv $(ES5) $(JS)

test: $(PJ) $(MJS) $(JS)
	mocha

clean:
	-rm $(DTS) $(MDTS) $(MJS) $(JS) $(ES5) $(ES6)
