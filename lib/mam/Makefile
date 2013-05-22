OUT=out/mam.html
PRODJS = mam-pre1-min.js

all: $(OUT) $(PRODJS)

$(OUT): README.md out/pandoc.css
	pandoc -s -t html5 -S -c pandoc.css --toc -o $(OUT) README.md

$(PRODJS): mam.js
	uglifyjs mam.js -m -c -o $(PRODJS)

mam.js: mam.coffee
	coffee -c mam.coffee

.PHONY: all
