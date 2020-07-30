PJ=package.json
TS=base64.ts
JS=base64.js
ES5=base64.es5.js
ES6=base64.es6.js
MJS=base64.mjs
DTS=base64.d.ts

all: $(MJS) $(JS)

$(MJS): $(PJ) $(TS)
	tsc -d --target es6 $(TS) && mv $(JS) $(MJS)

$(JS): $(PJ) $(MJS)
	util/makecjs $(MJS) > $(JS)

$(ES5): $(PJ) $(JS)
	mv $(JS) $(ES6) && tsc --allowJS --outFile $(ES5) $(ES6)

test: $(PJ) $(MJS) $(JS)
	mocha --require esm

clean:
	-rm $(DTS) $(MJS) $(JS) $(ES5) $(ES6)
