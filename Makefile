TS=base64.ts
JS=base64.js
MJS=base64.mjs
DTS=base64.d.ts

all: $(MJS) $(JS)

$(MJS): $(TS)
	tsc -d --target es6 $(TS) && mv $(JS) $(MJS)

$(JS): $(TS)
	util/makecjs $(MJS) > $(JS)

test: $(MJS) $(JS)
	mocha --require esm
clean:
	-rm $(DTS) $(MJS) $(JS)
