assets=$(realpath ../programs/$(PRG)/assets/out)
prg=$(realpath ../programs/$(PRG)/out/$(PRG).js)

run:
	coffee app.coffee

setprg:
	echo "prg is $(prg)"
	[ -f "$(prg)" ] || false
	cd public; rm -f prg.js && ln -s $(prg) prg.js
	[ -d "$(assets)" ] || false
	cd public; rm -f assets && ln -s $(assets) assets

.PHONY: run setprg
