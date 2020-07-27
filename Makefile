TS=base64.ts
JS=base64.js
MJS=base64.mjs
DTS=base64.d.ts

all: $(MJS) $(JS)

$(MJS): $(TS)
	tsc --target es6 $(TS) && mv $(JS) $(MJS)

$(JS): $(TS)
	tsc -d --target es5 $(TS)

test: $(MJS) $(JS)
	mocha --require esm
clean:
	-rm $(DTS) $(MJS) $(JS)
