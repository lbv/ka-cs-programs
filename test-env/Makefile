prg=$(realpath ../programs/$(PRG)/out/$(PRG).js)

run:
	coffee app.coffee

setprg:
	echo "prg is $(prg)"
	[ -f "$(prg)" ] || false
	cd public; rm -f prg.js && ln -s $(prg) prg.js
	
.PHONY: run setprg
