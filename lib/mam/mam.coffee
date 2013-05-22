root = exports ? this

loadAudio = (data, id, urls) ->
	++data.pending
	html = '<audio>'
	urls = [ urls ] if typeof urls is 'string'
	for url in urls
		type = ''
		ext = url.substr(-4)
		if ext is '.mp3' or ext is '.mpg'
			type = 'audio/mpeg'
		else if ext is '.ogg'
			type = 'audio/ogg'
		else if ext is '.wav'
			type = 'audio/wav'
		else
			console.log "Unknown audio type for #{url}"
			continue
		html += "<source src=\"#{url}\" type=\"#{type}\">"
	html += '</audio>'

	audioElem = $ html
	audioElem.on 'loadeddata', ->
		audio = @
		data.dfd.notify audio
		data.media.audio[id] = audio

		if --data.pending == 0
			data.dfd.resolve data.media

	$('body').append audioElem

loadFonts = (data, families) ->
	familiesNormal = []
	familiesNormal.push(f.replace /\s/g, '+') for f in families
	++data.pending
	root.WebFontConfig =
		google:
			families: familiesNormal
		active: ->
			for font in families
				data.media.fonts.push data.pjs.createFont font
			if --data.pending == 0
				data.dfd.resolve data.media

	url = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
	$.getScript url

loadImage = (data, id, url) ->
	++data.pending
	++data.pendingImg
	img = $ "<img src=\"#{url}\"/>"
	img.on 'load', ->
		pimg = data.pjs.createImage img.width(), img.height(), data.pjs.ARGB
		pimg.sourceImg.getContext('2d').drawImage img[0], 0, 0
		data.media.images[id] = pimg
		data.imgs[id] = img[0]
		data.dfd.notify pimg

		if --data.pendingImg == 0
			data.dfdImg.resolve()
		if --data.pending == 0
			data.dfd.resolve data.media

	$('body').append img

loadSprite = (data, id, spec) ->
	unless data.dfdImg?
		data.dfd.reject 'No images specified'
		return
	++data.pending
	fn = ->
		data.dfdImg.done ->
			unless data.media.images[spec.sheet]?
				data.dfd.reject "No image named #{spec.sheet}"
				return
			src = data.imgs[spec.sheet]
			if spec.frames?
				frames = []
				for i in [0 ... spec.frames]
					x = spec.x + spec.width*i
					pimg = data.pjs.createImage(
						spec.width, spec.height, data.pjs.ARGB)
					pimg.sourceImg.getContext('2d').drawImage(
						src, x, spec.y, spec.width, spec.height,
						0, 0, spec.width, spec.height)
					frames.push pimg
				data.media.sprites[id] = frames	
			else
				pimg = data.pjs.createImage spec.width, spec.height, data.pjs.ARGB
				pimg.sourceImg.getContext('2d').drawImage(
					src, spec.x, spec.y, spec.width, spec.height,
					0, 0, spec.width, spec.height)
				data.media.sprites[id] = pimg

			data.dfd.notify data.media.sprites[id]

			if --data.pending == 0
				data.dfd.resolve data.media

	setTimeout fn, 0

root.MAM = (config, pjs) ->
	data =
		dfd     : $.Deferred()
		media   : {}
		pending : 0
		pjs     : pjs

	if config.images?
		data.media.images = {}
		data.imgs = {}
		data.pendingImg = 0
		data.dfdImg = $.Deferred()
		for id, url of config.images
			loadImage data, id, url

	if config.sprites?
		data.media.sprites = {}
		for id, spec of config.sprites
			loadSprite data, id, spec

	if config.fonts?
		data.media.fonts = []
		loadFonts data, config.fonts

	if config.audio?
		data.media.audio = {}
		for id, urls of config.audio
			loadAudio data, id, urls

	data.dfd.promise()

root.MAM2 = (promise, cb, draw, pjs) ->
	promise.fail (reason) ->
		console.log "Loading of assets failed: #{reason}"
	promise.done (media) ->
		console.log "Loading of assets done"
		cb(media) if cb?
		pjs.draw = draw if draw?
